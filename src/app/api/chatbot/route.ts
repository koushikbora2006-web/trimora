import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { retrieveRelevantChunks, generateRAGAnswer } from '@/lib/rag';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salon_id, message } = body;

    if (!salon_id || !message) {
      return NextResponse.json({ success: false, error: 'salon_id and message are required' }, { status: 400 });
    }

    const salon = db.getSalonById(salon_id) || db.getSalonBySlug(salon_id);
    if (!salon) {
      return NextResponse.json({ success: false, error: 'Salon not found' }, { status: 404 });
    }

    // 1. If GROQ_API_KEY is configured, dynamically load Groq RAG with vector embeddings & strict prompt rules
    if (process.env.GROQ_API_KEY) {
      try {
        const { askRAG } = await import('@/lib/rag/askRAG');
        const groqResult = await askRAG(message);
        return NextResponse.json({
          success: true,
          answer: groqResult.answer,
          sources: groqResult.sources.map((s) => s.source),
          suggestedAction: {
            type: 'book_appointment',
            label: 'Book an Appointment'
          }
        });
      } catch (groqErr: any) {
        console.warn('Groq RAG falling back to internal grounded engine:', groqErr?.message || groqErr);
      }
    }

    const services = db.getServicesBySalonId(salon.id);
    const offers = db.getOffersBySalonId(salon.id);
    const knowledgeChunks = db.getKnowledgeChunksBySalonId(salon.id);

    // 2. Retrieve semantically relevant chunks
    const retrieved = retrieveRelevantChunks(message, knowledgeChunks, 3, 0.12);

    // 3. Generate grounded RAG response adhering to strict anti-hallucination rules
    const result = generateRAGAnswer({
      query: message,
      salon,
      services,
      offers,
      retrievedChunks: retrieved
    });

    return NextResponse.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
      suggestedAction: result.suggestedAction,
      retrievedCount: retrieved.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
