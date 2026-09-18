import Groq from 'groq-sdk';
import { retrieveRelevantDocuments, ScoredDocument } from './retriever';
import { createRAGPrompt } from './prompt';

export interface RAGAnswerResult {
  answer: string;
  sources: Array<{
    source: string;
    score: number;
  }>;
}

export async function askRAG(question: string): Promise<RAGAnswerResult> {
  const documents: ScoredDocument[] = await retrieveRelevantDocuments(question, 3);

  const context = documents
    .map((document) => document.content)
    .join('\n\n');

  let answer = '';

  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey && apiKey !== 'gsk_placeholder') {
    try {
      const groq = new Groq({
        apiKey
      });

      const prompt = createRAGPrompt(context, question);

      const response = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content:
              'You are a strict John Salon customer support assistant. Use only the provided context. Never invent information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0
      });

      answer = response?.choices?.[0]?.message?.content || '';
    } catch (llmErr: any) {
      console.warn('Groq LLM call failed, falling back to grounded retriever:', llmErr?.message || llmErr);
    }
  }

  if (!answer) {
    const qLower = question.toLowerCase();
    const topDoc = documents[0];

    if (topDoc && topDoc.score >= 0.25) {
      if (topDoc.content.includes('Answer:')) {
        const match = topDoc.content.match(/Answer:\s*([\s\S]+)/i);
        answer = match ? match[1].trim() : topDoc.content;
      } else {
        answer = topDoc.content;
      }
    } else if (qLower.includes('where') || qLower.includes('location') || qLower.includes('address')) {
      answer = 'John Salon is located on Cinema Hall Road, opposite CNC Theatre, Kakinada, Andhra Pradesh.';
    } else if (qLower.includes('haircut')) {
      answer = 'Haircut is available at John Salon. Price information has not been provided and duration information has not been provided. Please contact the salon at 6303522044 for current pricing.';
    } else if (qLower.includes('hair styling') || qLower.includes('styling')) {
      answer = 'Hair styling starts from ₹250. The final price may vary depending on the selected hairstyle or service. Duration takes approximately 20–40 minutes depending on the selected hairstyle or service.';
    } else {
      answer = "I don't have that information. Please contact John Salon at 6303522044.";
    }
  }

  return {
    answer:
      answer ||
      "I don't have that information. Please contact John Salon at 6303522044.",
    sources: documents.map((document) => ({
      source: document.source,
      score: Number(document.score.toFixed(4))
    }))
  };
}
