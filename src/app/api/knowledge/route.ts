import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salon_id');

    if (!salonId) {
      return NextResponse.json({ success: false, error: 'salon_id is required' }, { status: 400 });
    }

    const documents = db.getKnowledgeDocsBySalonId(salonId);
    const chunks = db.getKnowledgeChunksBySalonId(salonId);

    return NextResponse.json({ 
      success: true, 
      documents, 
      chunksCount: chunks.length,
      chunks 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salon_id, file_name, file_type, content } = body;

    if (!salon_id || !file_name || !content) {
      return NextResponse.json({ success: false, error: 'salon_id, file_name, and content are required' }, { status: 400 });
    }

    const doc = db.addKnowledgeDocument({
      salon_id,
      file_name,
      file_type: file_type || 'txt',
      file_size: Buffer.byteLength(content, 'utf8'),
      content
    });

    return NextResponse.json({
      success: true,
      document: doc,
      message: `Document indexed successfully into ${doc.chunk_count} semantic chunks.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    const deleted = db.deleteKnowledgeDocument(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Document and associated chunks deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
