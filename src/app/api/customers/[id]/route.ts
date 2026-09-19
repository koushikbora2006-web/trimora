import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = db.getCustomerById(id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    const appointments = db.getCustomerAppointments(id);
    const notes = db.getCustomerNotes(id);
    const activity = db.getCustomerActivity(id);

    return NextResponse.json({
      success: true,
      customer,
      appointments,
      notes,
      activity
    });
  } catch (error: any) {
    console.error('Error fetching customer profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const updated = db.updateCustomer(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Recalculate stats in case status was impacted
    db.recalculateCustomerStats(id);
    const refreshed = db.getCustomerById(id);

    return NextResponse.json({
      success: true,
      customer: refreshed,
      message: 'Customer profile updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'restore' | 'archive' | 'hard'

    if (action === 'restore') {
      const restored = db.restoreCustomer(id);
      if (!restored) {
        return NextResponse.json(
          { success: false, error: 'Customer not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Customer profile restored from archive'
      });
    }

    // Default to soft archive (or safe delete)
    const result = db.deleteCustomer(id);

    return NextResponse.json({
      success: result.success,
      message: result.error || 'Customer profile successfully archived'
    });
  } catch (error: any) {
    console.error('Error archiving customer profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive customer profile' },
      { status: 500 }
    );
  }
}
