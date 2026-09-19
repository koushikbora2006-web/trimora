'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Scissors,
  Mail,
  ShieldCheck,
  ArrowRight,
  User,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Login Mode: 'otp' | 'demo'
  const [authMode, setAuthMode] = useState<'otp' | 'demo'>('otp');

  // Step in OTP flow: 1 = email input, 2 = otp code input
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devOtpPreview, setDevOtpPreview] = useState<string | null>(null);

  // Resend countdown timer
  const [countdown, setCountdown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent, targetEmail?: string) => {
    if (e) e.preventDefault();
    const emailToSend = (targetEmail || email).trim();

    if (!emailToSend || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToSend)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', email: emailToSend })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to dispatch verification email via Brevo.');
        setLoading(false);
        return;
      }

      setEmail(emailToSend);
      setStep(2);
      setCountdown(60); // 60s cooldown for resending
      setOtpDigits(['', '', '', '', '', '']);

      if (data.devMode && data.devOtp) {
        setDevOtpPreview(data.devOtp);
      } else {
        setDevOtpPreview(null);
      }

      setSuccessMessage('A 6-digit verification code has been sent to your email.');

      // Auto-focus first digit input box after render
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit box typing & auto-advance
  const handleOtpDigitChange = (index: number, value: string) => {
    // Keep only the last character entered and ensure digit
    const cleanChar = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanChar;
    setOtpDigits(newDigits);

    // Auto-advance to next input if filled
    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-trigger verification if all 6 filled
    if (cleanChar && index === 5 && newDigits.every((d) => d !== '')) {
      const fullCode = newDigits.join('');
      executeVerifyOtp(fullCode);
    }
  };

  // Handle backspace navigation across digit boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();

    if (pasted.length === 6) {
      executeVerifyOtp(pasted);
    }
  };

  // Execute OTP Verification
  const executeVerifyOtp = async (codeToVerify?: string) => {
    const fullCode = (codeToVerify || otpDigits.join('')).trim();

    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          email: email.trim(),
          otp: fullCode
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid verification code.');
        setLoading(false);
        return;
      }

      // Success -> persist session
      if (typeof window !== 'undefined') {
        if (data.user) localStorage.setItem('trimora_user', JSON.stringify(data.user));
        if (data.salon) localStorage.setItem('trimora_salon', JSON.stringify(data.salon));
      }

      setSuccessMessage('Verification successful! Accessing your session...');

      setTimeout(() => {
        router.push(data.redirectUrl || '/dashboard');
      }, 700);
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setErrorMessage('Verification failed. Please try again.');
      setLoading(false);
    }
  };

  // Demo 1-Click Login handler (preserves instant access for reviewers)
  const handleDemoLogin = async (demoRole: 'salon_owner' | 'customer') => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'demo_login', role: demoRole })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          if (data.user) localStorage.setItem('trimora_user', JSON.stringify(data.user));
          if (data.salon) localStorage.setItem('trimora_salon', JSON.stringify(data.salon));
        }

        if (demoRole === 'customer') {
          router.push('/salon/john_salon_kkd');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (e) {
      console.error('Demo login error', e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#0A0A0A] text-[#F7F4EE]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#141414] border border-white/[0.1] shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-[#C5A880] flex items-center justify-center mx-auto border border-[#C5A880]/40 shadow-[0_0_25px_rgba(197,168,128,0.25)]">
            <Scissors className="w-5 h-5" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[10px] font-mono uppercase tracking-widest text-[#E5C590]">
            Trimorva Portal Access
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            John Salon Atelier
          </h1>
          <p className="text-xs text-[#9E988F]">
            Secure login through Brevo transactional email OTP verification.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-1 rounded-2xl bg-[#181818] border border-white/[0.08] flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'otp'
                ? 'bg-[#C5A880] text-[#0A0A0A] shadow-[0_0_12px_rgba(197,168,128,0.25)]'
                : 'text-[#9E988F] hover:text-[#F7F4EE]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email OTP Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('demo');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'demo'
                ? 'bg-[#C5A880] text-[#0A0A0A] shadow-[0_0_12px_rgba(197,168,128,0.25)]'
                : 'text-[#9E988F] hover:text-[#F7F4EE]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1-Click Demo</span>
          </button>
        </div>

        {/* Status / Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: EMAIL OTP AUTHENTICATION                              */}
        {/* ------------------------------------------------------------- */}
        {authMode === 'otp' && (
          <div className="space-y-4">
            
            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={(e) => handleSendOtp(e)} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#F7F4EE] block mb-1.5">
                    Your Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9E988F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@johnsalonkkd.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.1] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880] transition-colors"
                    />
                  </div>
                </div>

                {/* Quick pre-filled email chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#9E988F] block">Quick fill for testing:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEmail('john@johnsalonkkd.com')}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#C5A880] border border-white/[0.06] transition-colors"
                    >
                      john@johnsalonkkd.com (Owner)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmail('ramesh.kkd@example.com')}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#9E988F] hover:text-[#F7F4EE] border border-white/[0.06] transition-colors"
                    >
                      ramesh.kkd@example.com (Client)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,168,128,0.25)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loading ? 'Sending Code via Brevo...' : 'Send Verification Code'}</span>
                </button>
              </form>
            )}

            {/* STEP 2: Enter 6-Digit OTP */}
            {step === 2 && (
              <div className="space-y-5">
                
                {/* Target email and change button */}
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.06] text-xs">
                  <div>
                    <span className="text-[10px] text-[#9E988F] block">Code dispatched to:</span>
                    <span className="font-semibold text-[#F7F4EE]">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-[#C5A880] hover:underline font-medium"
                  >
                    Change
                  </button>
                </div>

                {/* Dev Mode Notification Alert */}
                {devOtpPreview && (
                  <div className="p-3.5 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/30 text-xs space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Brevo Key Not Configured (Dev Mode)</span>
                    </div>
                    <div className="text-[#F7F4EE]">
                      Your verification OTP is: <strong className="font-mono text-sm tracking-widest text-[#C5A880] bg-black/40 px-2 py-0.5 rounded ml-1">{devOtpPreview}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const chars = devOtpPreview.split('');
                        setOtpDigits(chars);
                        executeVerifyOtp(devOtpPreview);
                      }}
                      className="text-[10px] text-[#C5A880] hover:underline font-semibold block pt-0.5"
                    >
                      Click to auto-fill & verify ⚡
                    </button>
                  </div>
                )}

                {/* 6 Digit Input Boxes */}
                <div>
                  <label className="text-xs font-semibold text-[#F7F4EE] block text-center mb-2.5">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-12 text-center font-mono font-bold text-lg rounded-xl bg-[#1C1C1C] border border-white/[0.1] text-[#C5A880] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={() => executeVerifyOtp()}
                  disabled={loading || otpDigits.some((d) => d === '')}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,168,128,0.25)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Verifying...' : 'Verify & Sign In'}</span>
                </button>

                {/* Resend Code Section */}
                <div className="text-center pt-1 text-xs">
                  {countdown > 0 ? (
                    <span className="text-[#9E988F]">
                      Resend code in <strong className="text-[#F7F4EE]">{countdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp(undefined, email)}
                      disabled={loading}
                      className="text-[#C5A880] hover:underline font-semibold"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 2: 1-CLICK INSTANT DEMO LOGIN ACCESS                     */}
        {/* ------------------------------------------------------------- */}
        {authMode === 'demo' && (
          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#C5A880]/30 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Instant Role Access (Evaluation)</span>
            </div>

            <p className="text-[11px] text-[#9E988F] leading-snug">
              Direct 1-click authentication without entering email or code:
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('salon_owner')}
                disabled={loading}
                className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] hover:brightness-110 text-xs font-semibold flex items-center justify-between transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)] disabled:opacity-50"
              >
                <span>Login as Salon Owner (John - John Salon KKD)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                disabled={loading}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#222222] border border-white/[0.08] hover:border-[#C5A880]/40 text-[#F7F4EE] text-xs font-semibold flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>Login as Guest (Ramesh Kumar - Kakinada)</span>
                <User className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            </div>
          </div>
        )}

        {/* Return to Home link */}
        <div className="pt-2 text-center border-t border-white/[0.06]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#9E988F] hover:text-[#F7F4EE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to John Salon Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
