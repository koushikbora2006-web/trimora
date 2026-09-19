import { NextRequest, NextResponse } from 'next/server';
import { db, CANONICAL_SALON_ID } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notes = db.getCustomerNotes(id);
    return NextResponse.json({ success: true, notes });
  } catch (error: any) {
    console.error('Error fetching customer notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      salon_id = CANONICAL_SALON_ID,
      author_name = 'Staff Member',
      note_type = 'general',
      content,
      is_pinned = false
    } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Note content cannot be blank' },
        { status: 400 }
      );
    }

    const note = db.addCustomerNote({
      customer_id: id,
      salon_id,
      author_name,
      note_type,
      content: content.trim(),
      is_pinned: Boolean(is_pinned)
    });

    return NextResponse.json(
      { success: true, note, message: 'Note added successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding customer note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('note_id');

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: 'note_id is required' },
        { status: 400 }
      );
    }

    const deleted = db.deleteCustomerNote(noteId);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Note deleted successfully' : 'Note not found'
    });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
