import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointments = db.getCustomerAppointments(id);
    return NextResponse.json({
      success: true,
      appointments,
      total: appointments.length
    });
  } catch (error: any) {
    console.error('Error fetching customer appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer appointments' },
      { status: 500 }
    );
  }
}
