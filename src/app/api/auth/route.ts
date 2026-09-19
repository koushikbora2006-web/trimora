import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendBrevoOtpEmail } from '@/lib/email/brevo';

export const dynamic = 'force-dynamic';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, otp, role } = body;

    // -------------------------------------------------------------
    // 1. FAST 1-CLICK DEMO LOGIN (Preserved for Instant Evaluation)
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // 2. SEND EMAIL OTP (Via Brevo API)
    // -------------------------------------------------------------
    if (action === 'send_otp' || action === 'resend_otp') {
      if (!email || !isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      // Generate 6-digit OTP code with 10-minute expiry
      const { otp: generatedOtp, expires_at } = db.generateEmailOtp(email);

      // Look up user name if known
      const existingUser = db.getUserByEmail(email);

      // Dispatch via Brevo API
      const emailResult = await sendBrevoOtpEmail({
        email: email.trim(),
        otp: generatedOtp,
        name: existingUser?.name
      });

      if (!emailResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: emailResult.error || 'Failed to dispatch verification email via Brevo.'
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'A 6-digit verification code has been dispatched to your email.',
        expires_at,
        devMode: Boolean(emailResult.devMode),
        devOtp: emailResult.devOtp // Only populated in development when Brevo key is absent
      });
    }

    // -------------------------------------------------------------
    // 3. VERIFY EMAIL OTP (Authenticate User Session)
    // -------------------------------------------------------------
    if (action === 'verify_otp') {
      if (!email || !isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: 'Valid email address is required.' },
          { status: 400 }
        );
      }

      if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
        return NextResponse.json(
          { success: false, error: 'Please enter the 6-digit verification code.' },
          { status: 400 }
        );
      }

      const verifyResult = db.verifyEmailOtp(email, otp);

      if (!verifyResult.success) {
        return NextResponse.json(
          { success: false, error: verifyResult.error || 'Verification failed.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Authentication successful.',
        user: verifyResult.user,
        salon: verifyResult.salon,
        redirectUrl: verifyResult.user?.role === 'salon_owner' ? '/dashboard' : '/salon/john_salon_kkd'
      });
    }

    // -------------------------------------------------------------
    // 4. LEGACY LOGIN
    // -------------------------------------------------------------
    if (action === 'login' && email) {
      const user = db.getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      const salon = user.role === 'salon_owner' ? db.getSalonByOwnerId(user.id) : undefined;
      return NextResponse.json({ success: true, user, salon });
    }

    return NextResponse.json({ success: false, error: 'Invalid auth action request' }, { status: 400 });
  } catch (error: any) {
    console.error('Authentication route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
