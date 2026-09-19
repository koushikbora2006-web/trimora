import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // Check by id or slug
    let salon = db.getSalonById(id);
    if (!salon) {
      salon = db.getSalonBySlug(id);
    }

    if (!salon) {
      return NextResponse.json({ success: false, error: 'Salon not found' }, { status: 404 });
    }

    const services = db.getServicesBySalonId(salon.id);
    const offers = db.getOffersBySalonId(salon.id);
    const reviews = db.getReviewsBySalonId(salon.id);

    return NextResponse.json({
      success: true,
      salon,
      services,
      offers,
      reviews
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const updated = db.updateSalon(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Salon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, salon: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
