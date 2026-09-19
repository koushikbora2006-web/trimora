import { NextRequest, NextResponse } from 'next/server';
import { db, CANONICAL_SALON_ID } from '@/lib/db';
import { CustomerStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

function escapeCsvField(field: any): string {
  if (field === null || field === undefined) return '""';
  const stringVal = String(field);
  // If field contains comma, quote, or newline, enclose in double quotes and escape internal quotes
  if (/[",\n\r]/.test(stringVal)) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salon_id') || CANONICAL_SALON_ID;
    const status = (searchParams.get('status') as CustomerStatus | 'all') || 'all';
    const tag = searchParams.get('tag') || undefined;
    const search = searchParams.get('search') || undefined;
    const includeArchived = searchParams.get('include_archived') === 'true';

    const result = db.getCustomersBySalonId(salonId, {
      status,
      tag,
      search,
      includeArchived,
      limit: 10000 // Export all matching
    });

    const headers = [
      'Customer ID',
      'First Name',
      'Last Name',
      'Full Name',
      'Phone',
      'Normalized Phone',
      'Email',
      'Gender',
      'Status',
      'Tags',
      'Total Appointments',
      'Completed Visits',
      'Cancelled Visits',
      'Total Spent (INR)',
      'Average Order Value (INR)',
      'Preferred Stylist',
      'Favorite Services',
      'First Visit Date',
      'Last Visit Date',
      'Days Since Last Visit',
      'Accepts SMS',
      'Accepts Email',
      'Accepts WhatsApp',
      'Created Date'
    ];

    const rows = result.customers.map((c) => [
      escapeCsvField(c.id),
      escapeCsvField(c.first_name),
      escapeCsvField(c.last_name),
      escapeCsvField(c.full_name),
      escapeCsvField(c.phone),
      escapeCsvField(c.normalized_phone),
      escapeCsvField(c.email || ''),
      escapeCsvField(c.gender || ''),
      escapeCsvField(c.status),
      escapeCsvField((c.tags || []).join(', ')),
      escapeCsvField(c.stats?.total_appointments || 0),
      escapeCsvField(c.stats?.completed_appointments || 0),
      escapeCsvField(c.stats?.cancelled_appointments || 0),
      escapeCsvField(c.stats?.total_spent || 0),
      escapeCsvField(c.stats?.average_order_value || 0),
      escapeCsvField(c.preferences?.preferred_stylist_name || ''),
      escapeCsvField((c.preferences?.favorite_services || []).join('; ')),
      escapeCsvField(c.stats?.first_visit_at ? c.stats.first_visit_at.split('T')[0] : ''),
      escapeCsvField(c.stats?.last_visit_at ? c.stats.last_visit_at.split('T')[0] : ''),
      escapeCsvField(c.stats?.days_since_last_visit !== undefined ? c.stats.days_since_last_visit : ''),
      escapeCsvField(c.marketing?.accepts_sms ? 'Yes' : 'No'),
      escapeCsvField(c.marketing?.accepts_email ? 'Yes' : 'No'),
      escapeCsvField(c.marketing?.accepts_whatsapp ? 'Yes' : 'No'),
      escapeCsvField(c.created_at ? c.created_at.split('T')[0] : '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const todayStr = new Date().toISOString().slice(0, 10);
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="trimora_customers_${todayStr}.csv"`,
        'Cache-Control': 'no-store'
      }
    });
  } catch (error: any) {
    console.error('Error exporting customers CSV:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export customer data' },
      { status: 500 }
    );
  }
}
