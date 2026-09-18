import fs from 'fs';
import path from 'path';
import { 
  User, 
  Salon, 
  Service, 
  Offer, 
  Appointment, 
  KnowledgeDocument, 
  KnowledgeChunk, 
  ChatSession, 
  ChatMessage, 
  SalonReview, 
  StyleScanSession 
} from '../types';
import { splitTextIntoChunks } from '../rag';

interface DatabaseSchema {
  users: User[];
  salons: Salon[];
  services: Service[];
  offers: Offer[];
  appointments: Appointment[];
  knowledge_documents: KnowledgeDocument[];
  knowledge_chunks: KnowledgeChunk[];
  chat_sessions: ChatSession[];
  chat_messages: ChatMessage[];
  salon_reviews: SalonReview[];
  stylescan_sessions: StyleScanSession[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'trimora_db.json');

// Initial seed data: John Salon KKD is the single exclusive salon
const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'usr-owner-john',
      name: 'John V.',
      email: 'john@johnsalonkkd.com',
      phone: '+91 98480 12345',
      role: 'salon_owner',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr-cust-1',
      name: 'Ramesh Kumar',
      email: 'ramesh.kkd@example.com',
      phone: '+91 98765 43210',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      created_at: new Date().toISOString()
    }
  ],
  salons: [
    {
      id: 'john_salon_kkd',
      owner_id: 'usr-owner-john',
      name: 'John Salon KKD',
      slug: 'john_salon_kkd',
      tagline: "Kakinada's Premier Luxury Hair & Grooming Lounge",
      description: 'John Salon KKD is Kakinada’s premier sanctuary for elevated hair artistry, precision beard sculpting, rejuvenating hair spas, and AI-guided style discovery. We blend master craft techniques with contemporary aesthetic care for an unforgettable grooming experience.',
      logo_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
      address: 'Cinema Hall Road, opposite CNC Theatre',
      city: 'Kakinada, Andhra Pradesh',
      contact_phone: '6303522044',
      contact_email: 'appointments@johnsalonkkd.com',
      instagram_url: 'https://instagram.com/johnsalon_kkd',
      website_url: 'https://johnsalonkkd.com',
      opening_hours: {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '22:00', closed: false },
        saturday: { open: '09:00', close: '22:00', closed: false },
        sunday: { open: '09:00', close: '22:00', closed: false }
      },
      rating: 4.9,
      review_count: 184,
      created_at: new Date().toISOString()
    }
  ],
  services: [
    {
      id: 'srv-1',
      salon_id: 'john_salon_kkd',
      name: 'Signature Bespoke Haircut & Styling',
      description: 'Comprehensive consultation, invigorating scalp wash, precision shears cut, razor neck trim, and modern blow-dry finish.',
      category: 'Haircut',
      department: 'salon',
      price: 350,
      duration_minutes: 45,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
      benefits: ['Customized facial shape alignment', 'Scalp circulation enhancement', 'Easy daily styling maintenance'],
      preparation: 'Arrive 5 minutes prior to appointment with unwashed hair if possible for cut texture evaluation.',
      aftercare: 'Use sulfate-free shampoo and texturizing matte clay to preserve style shape.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-2',
      salon_id: 'john_salon_kkd',
      name: 'Executive Fade & Beard Sculpting',
      description: 'Seamless low, mid, or taper fade paired with sharp razor beard shaping, hot towel treatment, and nourishing argan beard elixir.',
      category: 'Beard & Grooming',
      department: 'salon',
      price: 300,
      duration_minutes: 40,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
      benefits: ['Sharp masculine contour lines', 'Reduces ingrown hairs', 'Softens coarse beard texture'],
      preparation: 'Allow beard to grow at least 3-4 days before appointment for precision edge lineup.',
      aftercare: 'Apply 3-4 drops of argan beard oil daily and brush with boar-bristle brush.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-3',
      salon_id: 'john_salon_kkd',
      name: 'Royal Moroccan Hair Spa & Scalp Detox',
      description: 'Deep detoxifying scalp massage with micro-mist steam infusion, botanical keratin cream mask, and pressure-point relaxation.',
      category: 'Hair Spa',
      department: 'salon',
      price: 750,
      duration_minutes: 60,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
      benefits: ['Eliminates scalp product residue and dandruff', 'Restores dry damaged strands', 'Deep acupressure stress relief'],
      preparation: 'Wear comfortable collarless clothing for neck and shoulder relaxation massage.',
      aftercare: 'Wait at least 24 hours before your next hair wash to lock in botanical argan oils.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-4',
      salon_id: 'john_salon_kkd',
      name: 'Keratin Smoothing & Hair Botox Treatment',
      description: 'Intense frizz control and deep fiber restoration delivering silky, mirror-shine, manageable hair for months.',
      category: 'Treatment',
      department: 'salon',
      price: 2499,
      duration_minutes: 120,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      benefits: ['100% frizz reduction in high humidity', 'Restores damaged hair protein', 'Cuts morning blow-dry time in half'],
      preparation: 'Expect approximately 2 to 2.5 hours in the salon chair for deep thermal infusion.',
      aftercare: 'Do not wash, tie, or pin hair for 48 hours following treatment. Use salt-free shampoo.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-5',
      salon_id: 'john_salon_kkd',
      name: 'D-Tan Glow Facial & Skin Rejuvenation',
      description: 'Instant tan removal scrub, brightening enzymatic masque, botanical antioxidant serum, and cooling ice-roller massage.',
      category: 'Treatment',
      department: 'salon',
      price: 650,
      duration_minutes: 45,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      benefits: ['Instantly reverses coastal sun tan', 'Gently exfoliates dead skin layers', 'Soothes inflammation with ice globes'],
      preparation: 'Avoid shaving right before treatment if you have easily irritated skin.',
      aftercare: 'Apply broad-spectrum sunscreen and avoid direct sun exposure for 12 hours.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-6',
      salon_id: 'john_salon_kkd',
      name: 'Global Hair Color & Balayage Highlights',
      description: 'Hand-painted dimensional highlights or rich global shade using ammonia-free salon formulations for luminous gloss.',
      category: 'Coloring',
      department: 'salon',
      price: 1800,
      duration_minutes: 90,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      benefits: ['Seamless dimensional blending', 'Zero scalp irritation or ammonia odor', 'Long-lasting radiant shine'],
      preparation: 'Bring reference inspiration photos. Hair should be clean and product-free.',
      aftercare: 'Wash with color-protect shampoo in lukewarm or cool water.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-7',
      salon_id: 'john_salon_kkd',
      name: 'Charcoal Beard Detox & Hot Towel Shave',
      description: 'Classic barber straight-razor shave with warm lather, activated charcoal exfoliation, and chilled mint aftershave splash.',
      category: 'Beard & Grooming',
      department: 'salon',
      price: 250,
      duration_minutes: 30,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=600&q=80',
      benefits: ['Unrivaled silky close shave', 'Unclogs facial pores', 'Prevents razor burn and razor bumps'],
      preparation: 'Inform your barber of skin sensitivities, moles, or scar tissue.',
      aftercare: 'Moisturize skin with non-comedogenic aloe balm.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-8',
      salon_id: 'john_salon_kkd',
      name: 'Groom / Special Occasion Luxury Makeover',
      description: 'Complete elite package: Master haircut, beard sculpting, gold facial, hair spa, and bespoke party hair styling.',
      category: 'Styling',
      department: 'salon',
      price: 3500,
      duration_minutes: 150,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      benefits: ['Complete wedding-ready head-to-toe makeover', 'High-definition camera ready finish', 'Includes personalized styling consultation'],
      preparation: 'Book at least 1-2 days before wedding event or festive occasion.',
      aftercare: 'Keep hair dry and styled with flexible-hold setting spray provided.',
      created_at: new Date().toISOString()
    },

    // ==========================================
    // BEAUTY SPA DEPARTMENT SERVICES
    // ==========================================
    {
      id: 'srv-spa-1',
      salon_id: 'john_salon_kkd',
      name: 'Hydra-Dew Botanical Radiance Facial',
      description: 'Multi-step skin hydration therapy featuring gentle botanical enzymatic peel, micro-mist botanical steam, hyaluronic acid infusion, and chilled jade-roller lymphatic drainage.',
      category: 'Facial & Skin Care',
      department: 'spa',
      price: 950,
      duration_minutes: 60,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      benefits: ['Deep cellular moisture lock', 'De-puffs under-eye contours', 'Enhances natural radiant skin tone', 'Calms facial redness and sensitivity'],
      preparation: 'Arrive 10 minutes early to unwind in our relaxation lounge. Avoid abrasive home scrubs 24 hours prior.',
      aftercare: 'Refrain from heavy makeup for 6-8 hours. Apply sunscreen daily and drink ample herbal water.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-2',
      salon_id: 'john_salon_kkd',
      name: '24K Gold Peptide Anti-Aging Rejuvenation',
      description: 'Luxurious anti-aging treatment combining bio-active marine collagen ampoules, 24-karat gold peptide foil mask, and micro-current skin contouring for firmer skin.',
      category: 'Facial & Skin Care',
      department: 'spa',
      price: 1450,
      duration_minutes: 75,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1512290900672-1f02e090f42b?auto=format&fit=crop&w=800&q=80',
      benefits: ['Stimulates natural collagen synthesis', 'Visible contour firming & tightening', 'Softens fine expression lines', 'Leaves luminous golden glow'],
      preparation: 'Inform your esthetician of any sensitive skin conditions or allergies beforehand.',
      aftercare: 'Leave the nourishing peptide veil on skin overnight. Avoid steam rooms or saunas for 24 hours.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-3',
      salon_id: 'john_salon_kkd',
      name: 'Vitamin C Cellular Brightening Facial',
      description: 'Concentrated antioxidant therapy utilizing stabilized L-ascorbic acid, citrus botanical peel, and cooling cryo-globe massage to reverse UV pigmentation and sun damage.',
      category: 'Facial & Skin Care',
      department: 'spa',
      price: 1100,
      duration_minutes: 60,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
      benefits: ['Fades sun spots and hyperpigmentation', 'Evens patchy skin tone', 'Boosts cellular skin renewal', 'Restores vibrant youthfulness'],
      preparation: 'Discontinue retinol or strong AHA/BHA chemical peels 48 hours prior to treatment.',
      aftercare: 'Mandatory broad-spectrum SPF 50 application. Avoid harsh direct sunlight for 48 hours.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-4',
      salon_id: 'john_salon_kkd',
      name: 'Aromatherapy Swedish Body Relaxation',
      description: 'Full-body restorative massage using warm pure essential oils (lavender, bergamot, sandalwood) with long rhythmic effleurage strokes to melt tension and improve sleep.',
      category: 'Massage & Relaxation',
      department: 'spa',
      price: 1600,
      duration_minutes: 60,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      benefits: ['Deeply relieves muscular tension', 'Reduces stress and cortisol levels', 'Stimulates lymphatic drainage', 'Promotes deep restorative sleep'],
      preparation: 'Avoid heavy meals 1 hour before massage. A warm shower before therapy is recommended.',
      aftercare: 'Drink warm water or herbal infusion. Allow botanical oils to absorb for 2 hours before showering.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-5',
      salon_id: 'john_salon_kkd',
      name: 'Deep Tissue Therapeutic Muscle Release',
      description: 'Targeted deep myofascial release focusing on chronic neck tightness, shoulder strain, and lumbar fatigue utilizing warm botanical wintergreen balm.',
      category: 'Massage & Relaxation',
      department: 'spa',
      price: 1900,
      duration_minutes: 75,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
      benefits: ['Breaks down stubborn muscle knots', 'Increases mobility and joint range', 'Relieves desk and driving posture strain', 'Accelerates active lifestyle recovery'],
      preparation: 'Communicate pressure preferences and specific areas of discomfort clearly to your therapist.',
      aftercare: 'Mild muscle sensitivity is normal. Hydrate generously to flush out released toxins.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-6',
      salon_id: 'john_salon_kkd',
      name: 'Ayurvedic Herbal Head & Shoulder Massage',
      description: 'Traditional Indian head massage utilizing warm brahmi and bhringraj herb-infused oils to relieve digital eye fatigue, tension headaches, and nourish roots.',
      category: 'Massage & Relaxation',
      department: 'spa',
      price: 600,
      duration_minutes: 35,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      benefits: ['Relieves mental fatigue and headaches', 'Strengthens roots and combats hair thinning', 'Releases upper back and trapezius stiffness'],
      preparation: 'Wear comfortable attire. Warm herbal oil will be massaged through hair and scalp.',
      aftercare: 'Retain oil in hair for at least 2 hours before washing with a gentle clarifying shampoo.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-7',
      salon_id: 'john_salon_kkd',
      name: 'Royal Rose Luxury Spa Manicure',
      description: 'Deluxe hand grooming featuring wild rose petal soak, walnut shell cuticle buffing, warm shea butter hand masque, and precision nail shaping.',
      category: 'Hand & Foot Care',
      department: 'spa',
      price: 550,
      duration_minutes: 45,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      benefits: ['Softens rough cuticles & calluses', 'Deeply hydrates dry hand skin', 'Improves nail contour & health'],
      preparation: 'Remove existing gel or nail lacquer prior to appointment if possible.',
      aftercare: 'Apply cuticle oil daily and moisturize hands frequently with hand cream.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-8',
      salon_id: 'john_salon_kkd',
      name: 'Moroccan Argan Pedicure & Heel Therapy',
      description: 'Intensive foot restoration with mineral sea salt soak, pumice heel buffing, argan sugar exfoliation, warm towel envelopment, and acupressure reflexology.',
      category: 'Hand & Foot Care',
      department: 'spa',
      price: 750,
      duration_minutes: 55,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
      benefits: ['Smooths cracked heels and calluses', 'Relieves tired foot arches and swelling', 'Leaves feet velvety soft and refreshed'],
      preparation: 'Wear open-toed footwear or loose trousers for comfort during the foot soak.',
      aftercare: 'Wear soft cotton socks overnight with moisturizer for maximum softness.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-9',
      salon_id: 'john_salon_kkd',
      name: 'Full Body Botanical Polish & Glow Mask',
      description: 'Invigorating whole-body walnut, raw honey, and brown sugar polish followed by a warm kaolin clay cocoon wrap and soothing botanical body milk application.',
      category: 'Beauty Treatments',
      department: 'spa',
      price: 2200,
      duration_minutes: 90,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      benefits: ['Exfoliates dead surface cells', 'Improves overall body skin texture', 'Instantly brightens sun-damaged skin', 'Intense full-body moisture lock'],
      preparation: 'Do not shave or wax within 24 hours prior to whole-body exfoliation.',
      aftercare: 'Avoid hot baths or swimming in chlorinated pools for 24 hours.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-10',
      salon_id: 'john_salon_kkd',
      name: 'Velvet Waxing & Skin Calming Care',
      description: 'Gentle low-temperature strip wax treatment for arms and legs infused with zinc oxide, followed by chamomile and aloe-vera cooling spray.',
      category: 'Beauty Treatments',
      department: 'spa',
      price: 850,
      duration_minutes: 45,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      benefits: ['Silky hair-free finish for 3-4 weeks', 'Zero sticky residue', 'Calms post-wax redness quickly'],
      preparation: 'Ensure hair length is at least 1/4 inch for optimal wax grip.',
      aftercare: 'Avoid hot showers, friction, and deodorants/perfumes on treated areas for 24 hours.',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-spa-11',
      salon_id: 'john_salon_kkd',
      name: 'Pre-Bridal Radiance & Glow Ceremony',
      description: 'The ultimate 3-hour head-to-toe beauty ritual: 24K Gold Peptide Facial, Full Body Botanical Polish, Royal Rose Manicure & Argan Pedicure, and Ayurvedic Scalp Therapy.',
      category: 'Bridal & Special Care',
      department: 'spa',
      price: 4500,
      duration_minutes: 180,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      benefits: ['Complete bridal head-to-toe transformation', 'Radiant wedding photo finish', 'Supreme relaxation before wedding events'],
      preparation: 'Recommended 2-4 days prior to wedding or special occasion.',
      aftercare: 'Stay rested and hydrated; avoid trying unverified cosmetics before the ceremony.',
      created_at: new Date().toISOString()
    }
  ],
  offers: [
    {
      id: 'off-1',
      salon_id: 'john_salon_kkd',
      title: 'First Visit Privilege',
      description: 'Enjoy 20% off your premier haircut or luxury grooming package at John Salon KKD.',
      discount_type: 'percentage',
      discount_value: 20,
      promo_code: 'KKD20',
      valid_until: '2026-12-31',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'off-2',
      salon_id: 'john_salon_kkd',
      title: 'Weekday Spa & Glow Upgrade',
      description: 'Get a flat ₹200 discount when combining our Royal Moroccan Hair Spa with any D-Tan Facial (Tue–Fri).',
      discount_type: 'fixed',
      discount_value: 200,
      promo_code: 'KKDSPA',
      valid_until: '2026-11-30',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  appointments: [
    {
      id: 'apt-1',
      reference_code: 'JSK-7821',
      salon_id: 'john_salon_kkd',
      customer_id: 'usr-cust-1',
      customer_name: 'Ramesh Kumar',
      customer_phone: '+91 98765 43210',
      customer_email: 'ramesh.kkd@example.com',
      service_id: 'srv-1',
      service_name: 'Signature Bespoke Haircut & Styling',
      service_price: 350,
      preferred_date: '2026-09-24',
      preferred_time: '14:30',
      status: 'confirmed',
      notes: 'StyleScan Recommendation attached: Textured Fade with side taper.',
      stylescan_reference: {
        hairstyle_name: 'Textured Fade with Side Taper',
        analysis_summary: 'Suited for oval face shape with natural density.'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'apt-2',
      reference_code: 'JSK-4910',
      salon_id: 'john_salon_kkd',
      customer_name: 'Suresh Reddy',
      customer_phone: '+91 98491 55678',
      customer_email: 'suresh.reddy@email.com',
      service_id: 'srv-2',
      service_name: 'Executive Fade & Beard Sculpting',
      service_price: 300,
      preferred_date: '2026-09-25',
      preferred_time: '11:00',
      status: 'pending',
      notes: 'First time visiting John Salon KKD. Looking forward to sharp beard lines.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  knowledge_documents: [
    {
      id: 'doc-faq',
      salon_id: 'john_salon_kkd',
      file_name: 'faq.txt',
      file_type: 'txt',
      file_size: 1045,
      content: `FREQUENTLY ASKED QUESTIONS

Question:
Where is John Salon?

Answer:
John Salon is located on Cinema Hall Road, opposite CNC Theatre, Kakinada, Andhra Pradesh.

Question:
What are the timings of John Salon?

Answer:
John Salon is open from 9:00 AM to 2:00 PM and from 4:00 PM to 10:00 PM. The salon has a break from 2:00 PM to 4:00 PM.

Question:
What is the starting price for hair styling?

Answer:
Hair styling starts from ₹250. The final price may vary depending on the selected hairstyle or service.

Question:
How long does hair styling take?

Answer:
Hair styling takes approximately 20–40 minutes depending on the selected hairstyle or service.

Question:
How can I contact John Salon?

Answer:
You can contact John Salon at 6303522044.

Question:
Can I book an appointment?

Answer:
Customers can contact John Salon at 6303522044 for appointment enquiries. Availability must be confirmed directly with the salon.

Question:
Is walk-in service available?

Answer:
Walk-in availability must be confirmed directly with the salon.`,
      chunk_count: 7,
      processing_status: 'indexed',
      created_at: new Date().toISOString()
    },
    {
      id: 'doc-services',
      salon_id: 'john_salon_kkd',
      file_name: 'services.txt',
      file_type: 'txt',
      file_size: 711,
      content: `SERVICES

Hair Styling:
Starting price: ₹250.
Duration: approximately 20–40 minutes depending on the selected hairstyle or service.

Haircut:
Available at John Salon.
Price information has not been provided.
Duration information has not been provided.

Beard Styling:
Available at John Salon.
Price information has not been provided.
Duration information has not been provided.

Hair Grooming:
Available at John Salon.
Price information has not been provided.
Duration information has not been provided.

Other Salon Services:
Other salon services may be available.
Specific details have not been provided.

IMPORTANT:
Do not invent prices or durations for services where information has not been provided.`,
      chunk_count: 5,
      processing_status: 'indexed',
      created_at: new Date().toISOString()
    },
    {
      id: 'doc-policies',
      salon_id: 'john_salon_kkd',
      file_name: 'policies.txt',
      file_type: 'txt',
      file_size: 666,
      content: `BOOKING AND SALON POLICIES

Booking:
Customers can contact John Salon at 6303522044 for appointment enquiries.

Availability:
Appointment availability must be confirmed directly with John Salon.

Walk-in:
Walk-in availability must be confirmed directly with John Salon.

Cancellation:
Cancellation policy has not been provided.

Rescheduling:
Rescheduling policy has not been provided.

Refund:
Refund information has not been provided.

Payment:
Payment information has not been provided.

Discounts:
Discount information has not been provided.

IMPORTANT:
Do not invent cancellation fees, refund rules, payment methods, deposits, discounts, or rescheduling rules.`,
      chunk_count: 3,
      processing_status: 'indexed',
      created_at: new Date().toISOString()
    },
    {
      id: 'doc-spa-1',
      salon_id: 'john_salon_kkd',
      file_name: 'john_salon_beauty_spa_guide.txt',
      file_type: 'txt',
      file_size: 2400,
      content: `John Salon Beauty Spa Official Guide, Treatments & Wellness Protocols:
1. Spa Philosophy & Suites: John Salon Beauty Spa at Bhanugudi Junction offers tranquil private therapy suites equipped with soundproofing, soft chromotherapy lighting, warm memory-foam massage tables, and botanical mist infusion.
2. Spa Facials & Skin Treatments: We provide Hydra-Dew Botanical Radiance Facial (₹950, 60 mins), 24K Gold Peptide Anti-Aging Rejuvenation (₹1,450, 75 mins), and Vitamin C Brightening Facial (₹1,100, 60 mins). All facials use dermatologically tested botanical elixirs, chilled jade or cryo-globes, and gentle enzyme exfoliation.
3. Therapeutic Massages: Our certified wellness therapists specialize in Aromatherapy Swedish Relaxation (₹1,600, 60 mins), Deep Tissue Therapeutic Muscle Release (₹1,900, 75 mins), and traditional Ayurvedic Herbal Head & Shoulder Massage (₹600, 35 mins). All body treatments use cold-pressed organic botanical oils.
4. Hand & Foot Nail Spa: Royal Rose Luxury Manicure (₹550, 45 mins) and Moroccan Argan Pedicure & Heel Therapy (₹750, 55 mins) feature sea salt mineral soaks, botanical scrubs, and pressure-point reflexology.
5. Pre-Bridal & Full Body Ceremonies: Pre-Bridal Radiance Ceremony (₹4,500, 180 mins) is a comprehensive head-to-toe ritual. Full Body Botanical Polish & Glow Mask (₹2,200, 90 mins) revitalizes dry or sun-damaged skin.
6. Preparation & Aftercare: Arrive 10 minutes before your scheduled appointment. Drink warm water after massages and avoid direct sun exposure without sunscreen for 24 hours following skin exfoliation.`,
      chunk_count: 5,
      processing_status: 'indexed',
      created_at: new Date().toISOString()
    }
  ],
  knowledge_chunks: [
    {
      id: 'chk-1',
      document_id: 'doc-faq',
      salon_id: 'john_salon_kkd',
      content: 'Where is John Salon? John Salon is located on Cinema Hall Road, opposite CNC Theatre, Kakinada, Andhra Pradesh.',
      metadata: { source_file: 'faq.txt', section: 'Location' }
    },
    {
      id: 'chk-2',
      document_id: 'doc-faq',
      salon_id: 'john_salon_kkd',
      content: 'What are the timings of John Salon? John Salon is open from 9:00 AM to 2:00 PM and from 4:00 PM to 10:00 PM. The salon has a break from 2:00 PM to 4:00 PM.',
      metadata: { source_file: 'faq.txt', section: 'Operating Hours' }
    },
    {
      id: 'chk-3',
      document_id: 'doc-faq',
      salon_id: 'john_salon_kkd',
      content: 'Hair Styling Starting Price & Duration: Hair styling starts from ₹250. The final price may vary depending on the selected hairstyle or service. Hair styling takes approximately 20–40 minutes depending on the selected hairstyle or service.',
      metadata: { source_file: 'faq.txt', section: 'Hair Styling' }
    },
    {
      id: 'chk-4',
      document_id: 'doc-faq',
      salon_id: 'john_salon_kkd',
      content: 'Contact & Appointments: You can contact John Salon at 6303522044. Customers can contact John Salon at 6303522044 for appointment enquiries. Availability and walk-in availability must be confirmed directly with the salon.',
      metadata: { source_file: 'faq.txt', section: 'Contact & Bookings' }
    },
    {
      id: 'chk-5',
      document_id: 'doc-services',
      salon_id: 'john_salon_kkd',
      content: 'Services and Pricing: Hair Styling starts from ₹250 (approx 20–40 mins). Haircut, Beard Styling, Hair Grooming, and Other Salon Services are available at John Salon, but price and duration information has not been provided. Do not invent prices or durations.',
      metadata: { source_file: 'services.txt', section: 'Services & Missing Info' }
    },
    {
      id: 'chk-6',
      document_id: 'doc-policies',
      salon_id: 'john_salon_kkd',
      content: 'Booking and Salon Policies: Customers can contact John Salon at 6303522044 for appointment enquiries. Appointment and walk-in availability must be confirmed directly with John Salon. Cancellation, rescheduling, refund, payment, and discount policies have not been provided. Do not invent cancellation fees, refund rules, payment methods, deposits, discounts, or rescheduling rules.',
      metadata: { source_file: 'policies.txt', section: 'Salon Policies' }
    },
    {
      id: 'chk-spa-1',
      document_id: 'doc-spa-1',
      salon_id: 'john_salon_kkd',
      content: 'Beauty Spa Facials: John Salon Beauty Spa provides Hydra-Dew Botanical Radiance Facial (₹950, 60 mins), 24K Gold Peptide Anti-Aging Rejuvenation (₹1,450, 75 mins), and Vitamin C Cellular Brightening Facial (₹1,100, 60 mins) in private tranquil suites at Bhanugudi Junction.',
      metadata: { source_file: 'john_salon_beauty_spa_guide.txt', section: 'Spa Facials & Skin Care' }
    },
    {
      id: 'chk-spa-2',
      document_id: 'doc-spa-1',
      salon_id: 'john_salon_kkd',
      content: 'Spa Massages & Relaxation: Certified therapists offer Aromatherapy Swedish Body Relaxation (₹1,600, 60 mins), Deep Tissue Therapeutic Muscle Release (₹1,900, 75 mins), and Ayurvedic Herbal Head & Shoulder Massage (₹600, 35 mins) using organic warm botanical oils.',
      metadata: { source_file: 'john_salon_beauty_spa_guide.txt', section: 'Therapeutic Massages' }
    },
    {
      id: 'chk-spa-3',
      document_id: 'doc-spa-1',
      salon_id: 'john_salon_kkd',
      content: 'Hand & Foot Nail Spa: Royal Rose Luxury Spa Manicure (₹550, 45 mins) and Moroccan Argan Pedicure & Heel Therapy (₹750, 55 mins) with sea salt mineral soaks, callus exfoliation, and soothing foot reflexology.',
      metadata: { source_file: 'john_salon_beauty_spa_guide.txt', section: 'Hand & Foot Care' }
    },
    {
      id: 'chk-spa-4',
      document_id: 'doc-spa-1',
      salon_id: 'john_salon_kkd',
      content: 'Bridal & Body Spa Rituals: Pre-Bridal Radiance & Glow Ceremony (₹4,500, 180 mins) is a 3-hour head-to-toe ritual. Full Body Botanical Polish & Glow Mask is ₹2,200 (90 mins). Velvet Waxing & Skin Calming Care is ₹850 (45 mins).',
      metadata: { source_file: 'john_salon_beauty_spa_guide.txt', section: 'Bridal & Body Care' }
    },
    {
      id: 'chk-spa-5',
      document_id: 'doc-spa-1',
      salon_id: 'john_salon_kkd',
      content: 'Spa Preparation & Aftercare: Arrive 10 minutes prior to unwind. Drink plenty of water after full-body massages. Avoid direct sun exposure and harsh exfoliants for 24-48 hours after facial treatments.',
      metadata: { source_file: 'john_salon_beauty_spa_guide.txt', section: 'Spa Guidelines' }
    }
  ],
  chat_sessions: [],
  chat_messages: [],
  salon_reviews: [
    {
      id: 'rev-1',
      salon_id: 'john_salon_kkd',
      author_name: 'Venkatesh P.',
      rating: 5,
      comment: 'Undoubtedly the best salon experience in Kakinada. The AI StyleScan recommended a textured side taper that looks fantastic. John cuts with world-class skill!',
      date: '2 days ago'
    },
    {
      id: 'rev-2',
      salon_id: 'john_salon_kkd',
      author_name: 'Ananya Rao',
      rating: 5,
      comment: 'The Moroccan Hair Spa and facial left my hair and skin glowing. Very hygienic, polite staff, and the salon ambiance at Bhanugudi Junction is super premium.',
      date: '1 week ago'
    },
    {
      id: 'rev-3',
      salon_id: 'john_salon_kkd',
      author_name: 'Karthik Varma',
      rating: 5,
      comment: 'Sharp beard line and modern fade. Booking through the web app was instant and didn’t have to wait in line at all. 10/10 recommend John Salon KKD.',
      date: '2 weeks ago'
    }
  ],
  stylescan_sessions: []
};

// Database Access Class
class Database {
  private inMemoryDb: DatabaseSchema;

  constructor() {
    this.inMemoryDb = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: DatabaseSchema = JSON.parse(data);
        // Ensure new spa services from INITIAL_DB are merged if not present
        if (!parsed.services.some((s) => s.department === 'spa')) {
          const spaServices = INITIAL_DB.services.filter((s) => s.department === 'spa');
          parsed.services.push(...spaServices);
          // Also sync spa knowledge docs and chunks
          if (!parsed.knowledge_documents.some((d) => d.id === 'doc-spa-1')) {
            const spaDocs = INITIAL_DB.knowledge_documents.filter((d) => d.id === 'doc-spa-1');
            parsed.knowledge_documents.push(...spaDocs);
            const spaChunks = INITIAL_DB.knowledge_chunks.filter((c) => c.document_id === 'doc-spa-1');
            parsed.knowledge_chunks.push(...spaChunks);
          }
          fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
        }
        return parsed;
      } else {
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
        return JSON.parse(JSON.stringify(INITIAL_DB));
      }
    } catch (e) {
      console.error('Error loading database file, using initial data in memory', e);
      return JSON.parse(JSON.stringify(INITIAL_DB));
    }
  }

  private saveDatabase(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.inMemoryDb, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database to file', e);
    }
  }

  // Reset / Reseed helper
  public resetToDefault(): void {
    this.inMemoryDb = JSON.parse(JSON.stringify(INITIAL_DB));
    this.saveDatabase();
  }

  // Salons
  public getSalons(): Salon[] {
    return this.inMemoryDb.salons;
  }

  public getSalonById(id: string): Salon | undefined {
    const found = this.inMemoryDb.salons.find((s) => s.id === id);
    if (found) return found;
    // If id is johnsalon_kkd, john_salon_kkd, default, or legacy salon-luxe-1, return primary salon
    if (
      id === 'john_salon_kkd' ||
      id === 'johnsalon_kkd' ||
      id === 'default' ||
      id === 'salon-luxe-1' ||
      id === 'salon-empty-2'
    ) {
      return this.inMemoryDb.salons[0];
    }
    return this.inMemoryDb.salons[0];
  }

  public getSalonBySlug(slug: string): Salon | undefined {
    const lower = (slug || '').toLowerCase();
    const found = this.inMemoryDb.salons.find((s) => s.slug.toLowerCase() === lower);
    if (found) return found;
    // Check aliases: johnsalon_kkd and john_salon_kkd
    if (
      lower === 'john_salon_kkd' ||
      lower === 'johnsalon_kkd' ||
      lower === 'luxe-studio' ||
      lower === 'atelier-delacroix'
    ) {
      return this.inMemoryDb.salons[0];
    }
    return this.inMemoryDb.salons[0];
  }

  public getSalonByOwnerId(ownerId: string): Salon | undefined {
    const found = this.inMemoryDb.salons.find((s) => s.owner_id === ownerId);
    return found || this.inMemoryDb.salons[0];
  }

  public updateSalon(id: string, updates: Partial<Salon>): Salon | undefined {
    let index = this.inMemoryDb.salons.findIndex((s) => s.id === id);
    if (index === -1 && this.inMemoryDb.salons.length > 0) {
      index = 0; // Update primary salon
    }
    if (index === -1) return undefined;

    this.inMemoryDb.salons[index] = {
      ...this.inMemoryDb.salons[index],
      ...updates
    };
    this.saveDatabase();
    return this.inMemoryDb.salons[index];
  }

  // Services
  public getServicesBySalonId(salonId: string, department?: 'salon' | 'spa'): Service[] {
    let matched = this.inMemoryDb.services.filter((s) => s.salon_id === salonId);
    if (matched.length === 0) matched = this.inMemoryDb.services;
    if (department) {
      return matched.filter((s) => s.department === department || (!s.department && department === 'salon'));
    }
    return matched;
  }

  public getServiceById(id: string): Service | undefined {
    return this.inMemoryDb.services.find((s) => s.id === id);
  }

  public addService(service: Omit<Service, 'id' | 'created_at'>): Service {
    const newService: Service = {
      ...service,
      id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString()
    };
    this.inMemoryDb.services.push(newService);
    this.saveDatabase();
    return newService;
  }

  public updateService(id: string, updates: Partial<Service>): Service | undefined {
    const index = this.inMemoryDb.services.findIndex((s) => s.id === id);
    if (index === -1) return undefined;

    this.inMemoryDb.services[index] = {
      ...this.inMemoryDb.services[index],
      ...updates
    };
    this.saveDatabase();
    return this.inMemoryDb.services[index];
  }

  public deleteService(id: string): boolean {
    const index = this.inMemoryDb.services.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.inMemoryDb.services.splice(index, 1);
    this.saveDatabase();
    return true;
  }

  // Offers
  public getOffersBySalonId(salonId: string): Offer[] {
    const matched = this.inMemoryDb.offers.filter((o) => o.salon_id === salonId);
    return matched.length > 0 ? matched : this.inMemoryDb.offers;
  }

  public addOffer(offer: Omit<Offer, 'id' | 'created_at'>): Offer {
    const newOffer: Offer = {
      ...offer,
      id: `off-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString()
    };
    this.inMemoryDb.offers.push(newOffer);
    this.saveDatabase();
    return newOffer;
  }

  public updateOffer(id: string, updates: Partial<Offer>): Offer | undefined {
    const index = this.inMemoryDb.offers.findIndex((o) => o.id === id);
    if (index === -1) return undefined;

    this.inMemoryDb.offers[index] = {
      ...this.inMemoryDb.offers[index],
      ...updates
    };
    this.saveDatabase();
    return this.inMemoryDb.offers[index];
  }

  public deleteOffer(id: string): boolean {
    const index = this.inMemoryDb.offers.findIndex((o) => o.id === id);
    if (index === -1) return false;

    this.inMemoryDb.offers.splice(index, 1);
    this.saveDatabase();
    return true;
  }

  // Appointments
  public getAppointmentsBySalonId(salonId: string): Appointment[] {
    const matched = this.inMemoryDb.appointments.filter((a) => a.salon_id === salonId);
    return matched.length > 0 ? matched : this.inMemoryDb.appointments;
  }

  public getAppointmentById(id: string): Appointment | undefined {
    return this.inMemoryDb.appointments.find((a) => a.id === id);
  }

  public addAppointment(appointment: Omit<Appointment, 'id' | 'reference_code' | 'created_at' | 'updated_at'>): Appointment {
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      reference_code: `JSK-${codeNumber}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.inMemoryDb.appointments.push(newAppointment);
    this.saveDatabase();
    return newAppointment;
  }

  public updateAppointmentStatus(id: string, status: Appointment['status'], internalNotes?: string): Appointment | undefined {
    const index = this.inMemoryDb.appointments.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    this.inMemoryDb.appointments[index].status = status;
    this.inMemoryDb.appointments[index].updated_at = new Date().toISOString();
    if (internalNotes !== undefined) {
      this.inMemoryDb.appointments[index].internal_notes = internalNotes;
    }
    this.saveDatabase();
    return this.inMemoryDb.appointments[index];
  }

  // Knowledge Documents & Chunks
  public getKnowledgeDocsBySalonId(salonId: string): KnowledgeDocument[] {
    const matched = this.inMemoryDb.knowledge_documents.filter((d) => d.salon_id === salonId);
    return matched.length > 0 ? matched : this.inMemoryDb.knowledge_documents;
  }

  public getKnowledgeChunksBySalonId(salonId: string): KnowledgeChunk[] {
    const matched = this.inMemoryDb.knowledge_chunks.filter((c) => c.salon_id === salonId);
    return matched.length > 0 ? matched : this.inMemoryDb.knowledge_chunks;
  }

  public addKnowledgeDocument(doc: Omit<KnowledgeDocument, 'id' | 'chunk_count' | 'processing_status' | 'created_at'>): KnowledgeDocument {
    const newDocId = `doc-${Date.now()}`;
    const chunks = splitTextIntoChunks(doc.content, { chunkSize: 350, chunkOverlap: 50 });

    const newDoc: KnowledgeDocument = {
      ...doc,
      id: newDocId,
      chunk_count: chunks.length,
      processing_status: 'indexed',
      created_at: new Date().toISOString()
    };

    this.inMemoryDb.knowledge_documents.push(newDoc);

    // Create chunks
    chunks.forEach((chunkText, idx) => {
      this.inMemoryDb.knowledge_chunks.push({
        id: `chk-${newDocId}-${idx}`,
        document_id: newDocId,
        salon_id: doc.salon_id,
        content: chunkText,
        metadata: {
          source_file: doc.file_name,
          section: `Section ${idx + 1}`
        }
      });
    });

    this.saveDatabase();
    return newDoc;
  }

  public deleteKnowledgeDocument(docId: string): boolean {
    const docIndex = this.inMemoryDb.knowledge_documents.findIndex((d) => d.id === docId);
    if (docIndex === -1) return false;

    this.inMemoryDb.knowledge_documents.splice(docIndex, 1);
    this.inMemoryDb.knowledge_chunks = this.inMemoryDb.knowledge_chunks.filter((c) => c.document_id !== docId);

    this.saveDatabase();
    return true;
  }

  // Reviews
  public getReviewsBySalonId(salonId: string): SalonReview[] {
    const matched = this.inMemoryDb.salon_reviews.filter((r) => r.salon_id === salonId);
    return matched.length > 0 ? matched : this.inMemoryDb.salon_reviews;
  }

  // Users
  public getUsers(): User[] {
    return this.inMemoryDb.users;
  }

  public getUserById(id: string): User | undefined {
    return this.inMemoryDb.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.inMemoryDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
}

// Singleton database instance
export const db = new Database();

export const CANONICAL_SALON_ID = 'john_salon_kkd';
export const CANONICAL_SALON_SLUG = 'john_salon_kkd';

