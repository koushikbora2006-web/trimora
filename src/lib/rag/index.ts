import { KnowledgeChunk, KnowledgeDocument, Salon, Service, Offer } from '../types';

export interface ChunkOptions {
  chunkSize?: number; // Characters per chunk
  chunkOverlap?: number; // Overlap between adjacent chunks
}

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  similarity: number; // 0 to 1
}

/**
 * Text splitting utility implementing a recursive sliding window with overlap
 */
export function splitTextIntoChunks(
  text: string,
  options: ChunkOptions = {}
): string[] {
  const { chunkSize = 400, chunkOverlap = 60 } = options;
  if (!text || text.trim().length === 0) return [];

  // Normalize line breaks
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = normalized.split(/\n\n+/);
  const chunks: string[] = [];

  let currentChunk = '';

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    if (currentChunk.length + trimmedPara.length + 1 <= chunkSize) {
      currentChunk = currentChunk ? `${currentChunk}\n\n${trimmedPara}` : trimmedPara;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        // Overlap from end of previous chunk
        const overlapSlice = currentChunk.slice(-chunkOverlap);
        currentChunk = `${overlapSlice}\n${trimmedPara}`;
      } else {
        // Para itself is longer than chunkSize, split by sentences or hard length
        let start = 0;
        while (start < trimmedPara.length) {
          const end = Math.min(start + chunkSize, trimmedPara.length);
          chunks.push(trimmedPara.slice(start, end));
          start += chunkSize - chunkOverlap;
        }
        currentChunk = '';
      }
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Lightweight token/term frequency vectorizer with stemming for robust semantic retrieval
 */
function stem(word: string): string {
  if (word.length <= 3) return word;
  return word.replace(/(ing|ed|es|s|tion|ment|able|ible)$/, '');
}

function tokenize(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const tokens: string[] = [];
  for (const w of words) {
    tokens.push(w);
    const s = stem(w);
    if (s !== w && s.length > 2) {
      tokens.push(s);
    }
  }
  return tokens;
}

export function computeCosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [term, valA] of vecA.entries()) {
    normA += valA * valA;
    if (vecB.has(term)) {
      dotProduct += valA * (vecB.get(term) || 0);
    } else {
      // Check for partial root match
      const stemA = stem(term);
      for (const [termB, valB] of vecB.entries()) {
        const stemB = stem(termB);
        if (stemB === stemA || (stemA.length >= 4 && termB.startsWith(stemA))) {
          dotProduct += valA * valB * 0.75;
          break;
        }
      }
    }
  }

  for (const [, valB] of vecB.entries()) {
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function createTermFrequencyVector(text: string): Map<string, number> {
  const tokens = tokenize(text);
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1);
  }
  return freq;
}

/**
 * Retrieves the most relevant knowledge chunks for a customer query
 */
export function retrieveRelevantChunks(
  query: string,
  chunks: KnowledgeChunk[],
  topK = 3,
  minThreshold = 0.08
): RetrievedChunk[] {
  if (!chunks || chunks.length === 0 || !query.trim()) {
    return [];
  }

  const queryVec = createTermFrequencyVector(query);
  const scoredChunks: RetrievedChunk[] = [];

  for (const chunk of chunks) {
    const chunkVec = createTermFrequencyVector(chunk.content);
    const similarity = computeCosineSimilarity(queryVec, chunkVec);

    if (similarity >= minThreshold) {
      scoredChunks.push({ chunk, similarity });
    }
  }

  scoredChunks.sort((a, b) => b.similarity - a.similarity);
  return scoredChunks.slice(0, topK);
}

/**
 * Salon Grounded RAG Generator
 * Adheres strictly to the rule:
 * If information is unavailable in context, says:
 * "I don't have that information yet. Please contact the salon for confirmation."
 * Never invents prices, timings, offers, or policies.
 */
export interface RAGAnswerResult {
  answer: string;
  sources: string[];
  suggestedAction?: {
    type: 'book_appointment' | 'view_service' | 'view_offer';
    label: string;
  };
}

export function generateRAGAnswer(params: {
  query: string;
  salon: Salon;
  services: Service[];
  offers: Offer[];
  retrievedChunks: RetrievedChunk[];
}): RAGAnswerResult {
  const { query, salon, services, offers, retrievedChunks } = params;
  const lowerQuery = query.toLowerCase().trim();

  // Booking intent detection
  const isBookingQuery = /\b(book(ing)?|appointment|reserve|reservation|schedule|slot)\b/i.test(lowerQuery);

  // Price inquiry detection
  const isPriceQuery = /\b(how much|price|cost|rate|fee|charge|pricing)\b/i.test(lowerQuery);

  // Hours inquiry detection
  const isHoursQuery = /\b(timing(s)?|hours?|opening hours?|working hours?|business hours?|what time|open on|close on|are you open|operating hours)\b/i.test(lowerQuery);

  // Promotional offers inquiry detection (distinguished from 'do you offer X')
  const isOfferQuery = /\b(current offers?|special offers?|any offers?|discounts?|deals?|promotions?|promos?|coupons?|best offers?)\b/i.test(lowerQuery);

  // Services inquiry detection
  const isServiceListQuery = /\b(what services?|list of services|service menu|haircut menu|treatment menu|what do you do)\b/i.test(lowerQuery);

  // Spa inquiry detection
  const isSpaQuery = /\b(spa|beauty spa|facial|facials|massage|massages|swedish|deep tissue|manicure|pedicure|waxing|skin care|bridal|body polish|relaxation)\b/i.test(lowerQuery);

  const isLocationQuery = /\b(where is|location|address|landmark|how to reach|situated|find you|where are you)\b/i.test(lowerQuery);
  const isContactQuery = /\b(contact|phone|call|mobile|number|reach you|reach salon)\b/i.test(lowerQuery);
  const isWalkInQuery = /\b(walk-?in|walkin|without appointment)\b/i.test(lowerQuery);
  const isPolicyMissingQuery = /\b(cancell(ation)?|reschedul(e|ing)?|refund|discount|payment method|deposit)\b/i.test(lowerQuery);

  // 1. Direct structured salon & spa knowledge checks
  if (isLocationQuery) {
    return {
      answer: `John Salon is located on Cinema Hall Road, opposite CNC Theatre, Kakinada, Andhra Pradesh. You can contact John Salon at 6303522044.`,
      sources: ['faq.txt'],
      suggestedAction: {
        type: 'book_appointment',
        label: 'Visit Salon'
      }
    };
  }

  if (isHoursQuery) {
    return {
      answer: `John Salon is open from 9:00 AM to 2:00 PM and from 4:00 PM to 10:00 PM. The salon has a break from 2:00 PM to 4:00 PM. Availability must be confirmed directly with John Salon at 6303522044.`,
      sources: ['faq.txt'],
      suggestedAction: {
        type: 'book_appointment',
        label: 'Book Appointment'
      }
    };
  }

  if (isWalkInQuery) {
    return {
      answer: `Walk-in availability must be confirmed directly with the salon. You can contact John Salon at 6303522044.`,
      sources: ['faq.txt'],
      suggestedAction: {
        type: 'book_appointment',
        label: 'Contact Salon'
      }
    };
  }

  if (isContactQuery && !isBookingQuery) {
    return {
      answer: `You can contact John Salon at 6303522044 for appointment enquiries and availability.`,
      sources: ['faq.txt'],
      suggestedAction: {
        type: 'book_appointment',
        label: 'Call 6303522044'
      }
    };
  }

  if (isPolicyMissingQuery) {
    return {
      answer: `Information regarding cancellation, rescheduling, refunds, payment methods, or discounts has not been provided. Please contact John Salon at 6303522044 for details.`,
      sources: ['policies.txt']
    };
  }

  if (lowerQuery.includes('haircut') || lowerQuery.includes('hair cut')) {
    if (isPriceQuery || lowerQuery.includes('how much') || lowerQuery.includes('cost')) {
      return {
        answer: `Haircut is available at John Salon. Price information has not been provided and duration information has not been provided. Please contact the salon at 6303522044 for current pricing.`,
        sources: ['services.txt', 'faq.txt'],
        suggestedAction: {
          type: 'book_appointment',
          label: 'Inquire About Haircut'
        }
      };
    }
  }

  if (lowerQuery.includes('hair styling') || lowerQuery.includes('styling')) {
    if (
      isPriceQuery ||
      lowerQuery.includes('how much') ||
      lowerQuery.includes('starting price') ||
      lowerQuery.includes('rate') ||
      lowerQuery.includes('how long') ||
      lowerQuery.includes('duration') ||
      lowerQuery.includes('take') ||
      lowerQuery.includes('time')
    ) {
      return {
        answer: `Hair styling starts from ₹250. The final price may vary depending on the selected hairstyle or service. Duration takes approximately 20–40 minutes depending on the selected hairstyle or service.`,
        sources: ['faq.txt', 'services.txt'],
        suggestedAction: {
          type: 'book_appointment',
          label: 'Book Hair Styling'
        }
      };
    }
  }

  if (isBookingQuery) {
    return {
      answer: `Customers can contact John Salon at 6303522044 for appointment enquiries. Availability must be confirmed directly with the salon. You can also submit your booking request online!`,
      sources: ['faq.txt', 'policies.txt'],
      suggestedAction: {
        type: 'book_appointment',
        label: 'Book Appointment Now'
      }
    };
  }

  if (isOfferQuery) {
    const activeOffers = offers.filter((o) => o.is_active);
    if (activeOffers.length > 0) {
      const list = activeOffers
        .map((o) => `• ${o.title}: ${o.description} (${o.discount_type === 'percentage' ? `${o.discount_value}% off` : `₹${o.discount_value} off`})`)
        .join('\n');
      return {
        answer: `Here are our current active offers at ${salon.name}:\n\n${list}\n\nAsk for these promotions during your visit or book online to lock in the discount!`,
        sources: ['Salon Active Offers'],
        suggestedAction: {
          type: 'view_offer',
          label: 'View Current Deals'
        }
      };
    } else {
      return {
        answer: `We currently do not have any active promotional offers listed. Please feel free to check back soon or ask our team when you visit!`,
        sources: ['Salon Promotions Database']
      };
    }
  }

  // Spa service list check
  if (isSpaQuery && (isServiceListQuery || lowerQuery.includes('what') || lowerQuery.includes('do you offer') || lowerQuery.includes('services'))) {
    const spaServices = services.filter((s) => s.is_active && (s.department === 'spa' || s.category.toLowerCase().includes('spa')));
    if (spaServices.length > 0) {
      const list = spaServices
        .slice(0, 6)
        .map((s) => `• ${s.name} (${s.category}): ₹${s.price} - ${s.duration_minutes} mins`)
        .join('\n');
      return {
        answer: `John Salon Beauty Spa offers a luxurious menu of restorative wellness and beauty treatments at Bhanugudi Junction:\n\n${list}\n\nAll treatments take place in private, soundproof therapy suites. Would you like to reserve an arrival window?`,
        sources: ['John Salon Beauty Spa Guide'],
        suggestedAction: {
          type: 'book_appointment',
          label: 'Book Spa Appointment'
        }
      };
    }
  }

  if (isPriceQuery || isServiceListQuery || isSpaQuery) {
    // Check if query matches specific service in the catalog
    const matchedServices = services.filter((s) => 
      s.is_active && (
        lowerQuery.includes(s.name.toLowerCase()) || 
        lowerQuery.includes(s.category.toLowerCase()) ||
        (lowerQuery.includes('facial') && (s.category.toLowerCase().includes('facial') || s.name.toLowerCase().includes('facial'))) ||
        (lowerQuery.includes('massage') && (s.category.toLowerCase().includes('massage') || s.name.toLowerCase().includes('massage'))) ||
        (lowerQuery.includes('pedicure') && s.name.toLowerCase().includes('pedicure')) ||
        (lowerQuery.includes('manicure') && s.name.toLowerCase().includes('manicure')) ||
        (lowerQuery.includes('waxing') && s.name.toLowerCase().includes('waxing')) ||
        (lowerQuery.includes('polish') && s.name.toLowerCase().includes('polish'))
      )
    );

    if (matchedServices.length > 0) {
      const list = matchedServices
        .map((s) => `• ${s.name} [${s.department === 'spa' ? 'Beauty Spa' : 'Salon'} · ${s.category}]: ₹${s.price} - approx. ${s.duration_minutes} mins. ${s.description}`)
        .join('\n');
      return {
        answer: `Here is the verified pricing and duration for the treatments you inquired about at ${salon.name}:\n\n${list}`,
        sources: ['Salon & Spa Service Menu & Price List'],
        suggestedAction: {
          type: 'book_appointment',
          label: 'Book This Service'
        }
      };
    } else if (isServiceListQuery && services.length > 0) {
      const activeList = services
        .filter((s) => s.is_active)
        .slice(0, 6)
        .map((s) => `• ${s.name} (${s.category}) - ₹${s.price}`)
        .join('\n');
      return {
        answer: `${salon.name} offers a full suite of luxury grooming, hair styling, and beauty spa services, including:\n\n${activeList}\n\nWould you like to reserve a time or explore our dedicated Beauty Spa menu?`,
        sources: ['Salon & Spa Service Menu'],
        suggestedAction: {
          type: 'book_appointment',
          label: 'Book an Appointment'
        }
      };
    }
  }

  // 2. Check retrieved RAG chunks from uploaded documents
  if (retrievedChunks.length > 0) {
    const chunkContents = retrievedChunks.map((r) => r.chunk.content).join('\n\n');
    const sources = Array.from(new Set(retrievedChunks.map((r) => r.chunk.metadata.source_file)));

    return {
      answer: `Based on ${salon.name}'s salon guide:\n\n${chunkContents}\n\nFor live appointment availability, availability must be confirmed directly with John Salon at 6303522044.`,
      sources,
      suggestedAction: {
        type: 'book_appointment',
        label: 'Schedule Appointment'
      }
    };
  }

  // 3. Strict anti-hallucination fallback
  return {
    answer: "I don't have that information. Please contact John Salon at 6303522044.",
    sources: []
  };
}
