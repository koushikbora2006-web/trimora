import { NextRequest, NextResponse } from 'next/server';
import { db, CANONICAL_SALON_ID } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salon_id') || CANONICAL_SALON_ID;

    const analytics = db.getCRMAnalytics(salonId);

    return NextResponse.json({
      success: true,
      analytics
    });
  } catch (error: any) {
    console.error('Error fetching CRM analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch CRM analytics' },
      { status: 500 }
    );
  }
}
