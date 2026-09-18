import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, role } = body;

    // Fast 1-Click Demo Login
    if (action === 'demo_login') {
      if (role === 'salon_owner' || role === 'empty_salon_owner') {
        const owner = db.getUserById('usr-owner-john') || db.getUsers().find((u) => u.role === 'salon_owner');
        const salon = db.getSalonById('john_salon_kkd') || db.getSalons()[0];
        return NextResponse.json({
          success: true,
          user: owner,
          salon
        });
      } else {
        const customer = db.getUserById('usr-cust-1') || db.getUsers().find((u) => u.role === 'customer');
        return NextResponse.json({
          success: true,
          user: customer
        });
      }
    }

    if (action === 'login' && email) {
      const user = db.getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      const salon = user.role === 'salon_owner' ? db.getSalonByOwnerId(user.id) : undefined;
      return NextResponse.json({ success: true, user, salon });
    }

    return NextResponse.json({ success: false, error: 'Invalid auth request' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
