import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { customer_id, intent = 'summary' } = await request.json();

    if (!customer_id) {
      return NextResponse.json(
        { success: false, error: 'customer_id is required' },
        { status: 400 }
      );
    }

    const customer = db.getCustomerById(customer_id);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    const appointments = db.getCustomerAppointments(customer_id);
    const notes = db.getCustomerNotes(customer_id);
    const services = db.getServicesBySalonId(customer.salon_id);

    const context = `
Customer Profile:
- Name: ${customer.full_name}
- Status: ${customer.status.toUpperCase()}
- Tags: ${(customer.tags || []).join(', ')}
- Phone: ${customer.phone}
- Total Appointments: ${customer.stats?.total_appointments || 0} (Completed: ${customer.stats?.completed_appointments || 0})
- Total Spent: ₹${customer.stats?.total_spent || 0}
- Average Order Value: ₹${customer.stats?.average_order_value || 0}
- Days Since Last Visit: ${customer.stats?.days_since_last_visit !== undefined ? `${customer.stats.days_since_last_visit} days ago` : 'First-time client'}
- Preferred Stylist: ${customer.preferences?.preferred_stylist_name || 'Any'}
- Favorite Services: ${(customer.preferences?.favorite_services || []).join(', ') || 'General Grooming'}
- Beverage: ${customer.preferences?.beverage_preference || 'Standard beverage'}
- Technical / Formula Notes: ${customer.preferences?.formula_notes || 'None recorded'}
- Internal Notes: ${notes.map((n) => `[${n.note_type}] ${n.content}`).join('; ') || 'None'}
- Recent Completed Services: ${appointments.filter((a) => a.status === 'completed').map((a) => a.service_name).slice(0, 3).join(', ') || 'None'}
`;

    let systemPrompt = '';
    let userPrompt = '';

    if (intent === 'reengagement') {
      systemPrompt = 'You are the elite CRM Concierge for John Salon KKD (luxury salon & spa in Kakinada). Draft a warm, high-converting, personalized WhatsApp re-engagement message tailored to this client. Keep it concise (3-4 sentences max), polite, mention their preferred service or stylist, and propose a welcoming privilege or preferred slot.';
      userPrompt = `Based on this client's profile:\n${context}\n\nDraft a luxury WhatsApp re-engagement message with emoji touches.`;
    } else if (intent === 'recommendation') {
      systemPrompt = 'You are a senior hair & spa consultant at John Salon KKD. Recommend 2 to 3 bespoke services or upgrade treatments that this specific client would love based on their past visits, status, and preferences.';
      userPrompt = `Based on client context:\n${context}\n\nAvailable Salon & Spa Services:\n${services.map((s) => `- ${s.name} (₹${s.price}, ${s.category})`).join('\n')}\n\nProvide 2-3 tailored recommendations with a 1-sentence rationale for each.`;
    } else {
      // Default: 360-degree client summary
      systemPrompt = 'You are the VIP Client Director for John Salon KKD. Provide a brief 3-point bulleted executive briefing on this client for the salon manager and stylists before their next appointment.';
      userPrompt = `Summarize client profile:\n${context}\n\nProvide:\n1. Client Archetype & Loyalty Value\n2. Key Personalization & Formula Cautions\n3. Upsell / Service Opportunity`;
    }

    let generatedText = '';
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && apiKey !== 'gsk_placeholder') {
      try {
        const groq = new Groq({ apiKey });
        const response = await groq.chat.completions.create({
          model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 450
        });
        generatedText = response?.choices?.[0]?.message?.content || '';
      } catch (err: any) {
        console.warn('Groq assistant call error, fallback to rule-based briefing:', err?.message);
      }
    }

    if (!generatedText) {
      if (intent === 'reengagement') {
        const days = customer.stats?.days_since_last_visit || 30;
        generatedText = `Namaste ${customer.first_name} ✨\nIt has been ${days} days since your last luxury grooming session with us at John Salon KKD. We'd love to welcome you back for your preferred ${customer.preferences?.favorite_services?.[0] || 'Signature Bespoke Styling'} with ${customer.preferences?.preferred_stylist_name || 'our master stylists'}.\n\nReply to this message or book online to reserve your preferred weekend suite. Have a wonderful day!`;
      } else if (intent === 'recommendation') {
        generatedText = `Recommended Upgrades for ${customer.first_name}:\n1. Royal Moroccan Hair Spa & Scalp Detox (₹750) — Perfect complement to restore hydration and reduce scalp tension.\n2. D-Tan Glow Facial & Skin Rejuvenation (₹650) — Ideal post-summer coastal revitalizer for radiant skin.\n3. 24K Gold Peptide Rejuvenation (₹1,450) — Ultra-luxury anti-aging treatment suited for VIP status.`;
      } else {
        generatedText = `Executive Client Briefing for ${customer.full_name}:\n• Profile: ${customer.status.toUpperCase()} client with ${customer.stats?.completed_appointments || 0} completed visits and ₹${customer.stats?.total_spent || 0} lifetime value.\n• Preferences: Stylist: ${customer.preferences?.preferred_stylist_name || 'Master Barber John'}, Beverage: ${customer.preferences?.beverage_preference || 'Standard'}.\n• Action Item: Ensure formula notes (${customer.preferences?.formula_notes || 'standard taper fade'}) are adhered to. Offer complementary hair spa trial or festival privilege.`;
      }
    }

    return NextResponse.json({
      success: true,
      intent,
      result: generatedText
    });
  } catch (error: any) {
    console.error('Error in CRM AI assistant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI CRM briefing' },
      { status: 500 }
    );
  }
}
