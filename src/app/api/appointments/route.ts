import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salon_id');

    if (!salonId) {
      return NextResponse.json({ success: false, error: 'salon_id is required' }, { status: 400 });
    }

    const appointments = db.getAppointmentsBySalonId(salonId);
    // Sort by created_at descending
    appointments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      salon_id, 
      customer_name, 
      customer_phone, 
      customer_email, 
      service_id, 
      preferred_date, 
      preferred_time, 
      notes,
      stylescan_reference
    } = body;

    if (!salon_id || !customer_name || !customer_phone || !service_id || !preferred_date || !preferred_time) {
      return NextResponse.json({ success: false, error: 'Missing required appointment fields' }, { status: 400 });
    }

    // Lookup service details
    const services = db.getServicesBySalonId(salon_id);
    const service = services.find((s) => s.id === service_id);

    const appointment = db.addAppointment({
      salon_id,
      customer_name,
      customer_phone,
      customer_email: customer_email || undefined,
      service_id,
      service_name: service?.name || 'Selected Service',
      service_price: service?.price || 0,
      preferred_date,
      preferred_time,
      status: 'pending',
      notes: notes || undefined,
      stylescan_reference: stylescan_reference || undefined
    });

    return NextResponse.json({ 
      success: true, 
      appointment, 
      message: 'Appointment request received! Reference: ' + appointment.reference_code 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, internal_notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Appointment ID and status are required' }, { status: 400 });
    }

    const updated = db.updateAppointmentStatus(id, status, internal_notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
