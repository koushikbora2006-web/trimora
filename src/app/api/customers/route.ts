import { NextRequest, NextResponse } from 'next/server';
import { db, CANONICAL_SALON_ID, normalizePhoneNumber } from '@/lib/db';
import { CustomerStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salon_id') || CANONICAL_SALON_ID;
    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') as CustomerStatus | 'all') || 'all';
    const tag = searchParams.get('tag') || undefined;
    const sort = (searchParams.get('sort') as any) || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const includeArchived = searchParams.get('include_archived') === 'true';

    const result = db.getCustomersBySalonId(salonId, {
      search,
      status,
      tag,
      sort,
      page,
      limit,
      includeArchived
    });

    // Provide top-level quick analytics summary for the CRM header
    const analytics = db.getCRMAnalytics(salonId);

    return NextResponse.json({
      success: true,
      customers: result.customers,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      analytics: {
        total_customers: analytics.total_customers,
        active_customers: analytics.active_customers,
        vip_customers: analytics.vip_customers,
        loyal_customers: analytics.loyal_customers,
        at_risk_customers: analytics.at_risk_customers,
        retention_rate_pct: analytics.retention_rate_pct,
        total_revenue_generated: analytics.total_revenue_generated,
        average_customer_lifetime_value: analytics.average_customer_lifetime_value,
        status_breakdown: analytics.status_breakdown
      }
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      salon_id = CANONICAL_SALON_ID,
      first_name,
      last_name = '',
      phone,
      email,
      gender,
      birthday,
      anniversary,
      tags = [],
      preferences,
      marketing,
      internal_notes
    } = body;

    if (!first_name || !first_name.trim()) {
      return NextResponse.json(
        { success: false, error: 'First name is required' },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(phone);

    // Check duplicate phone in same salon
    const existing = db.getCustomerByPhone(salon_id, normalizedPhone);
    if (existing && !existing.is_archived) {
      return NextResponse.json(
        {
          success: false,
          error: 'A customer profile with this phone number already exists.',
          existing_customer: existing
        },
        { status: 409 }
      );
    }

    const newCustomer = db.addCustomer({
      salon_id,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      full_name: `${first_name.trim()} ${last_name.trim()}`.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      gender,
      birthday,
      anniversary,
      status: 'new',
      tags: tags.length > 0 ? tags : ['Direct Walk-in'],
      preferences,
      marketing: {
        accepts_sms: marketing?.accepts_sms ?? true,
        accepts_email: marketing?.accepts_email ?? Boolean(email),
        accepts_whatsapp: marketing?.accepts_whatsapp ?? true,
        subscribed_at: new Date().toISOString()
      },
      internal_notes,
      is_archived: false
    });

    if (internal_notes) {
      db.addCustomerNote({
        customer_id: newCustomer.id,
        salon_id,
        author_name: 'Reception',
        note_type: 'general',
        content: internal_notes,
        is_pinned: false
      });
    }

    return NextResponse.json(
      {
        success: true,
        customer: newCustomer,
        message: 'Customer profile created successfully'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer profile' },
      { status: 500 }
    );
  }
}
