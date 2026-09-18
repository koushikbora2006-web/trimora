import { NextRequest, NextResponse } from 'next/server';
import { db, CANONICAL_SALON_ID } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const department = searchParams.get('department') as 'salon' | 'spa' | null;
    const salonId = searchParams.get('salon_id') || CANONICAL_SALON_ID;

    // Single service query by id
    if (id) {
      const service = db.getServiceById(id);
      if (!service) {
        return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, service });
    }

    // List services filtered by salon and optionally department
    const services = db.getServicesBySalonId(salonId, department || undefined);
    return NextResponse.json({ success: true, services, count: services.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      salon_id = CANONICAL_SALON_ID, 
      name, 
      description, 
      category, 
      department,
      price, 
      duration_minutes, 
      is_active,
      image_url,
      benefits,
      preparation,
      aftercare
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields (name, price)' }, { status: 400 });
    }

    const newService = db.addService({
      salon_id,
      name,
      description: description || '',
      category: category || 'General',
      department: department || 'salon',
      price: Number(price),
      duration_minutes: Number(duration_minutes) || 30,
      is_active: is_active ?? true,
      image_url,
      benefits,
      preparation,
      aftercare
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Service ID is required' }, { status: 400 });
    }

    const updated = db.updateService(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Service ID is required' }, { status: 400 });
    }

    const deleted = db.deleteService(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
