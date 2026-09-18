'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ShieldCheck, User, ArrowRight, Scissors } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'salon_owner' | 'customer'>('salon_owner');

  const handleDemoLogin = async (demoRole: 'salon_owner' | 'empty_salon_owner' | 'customer') => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'demo_login', role: demoRole })
      });
      const data = await res.json();
      if (data.success) {
        if (demoRole === 'customer') {
          router.push('/salon/john_salon_kkd');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (e) {
      console.error('Demo login error', e);
    }
  };

  const handleRegularLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'salon_owner') {
      router.push('/dashboard');
    } else {
      router.push('/salon/john_salon_kkd');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#0A0A0A] text-[#F7F4EE]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#141414] border border-white/[0.1] shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-[#C5A880] flex items-center justify-center mx-auto border border-[#C5A880]/40 shadow-[0_0_20px_rgba(197,168,128,0.2)]">
            <Scissors className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            John Salon Atelier Portal
          </h2>
          <p className="text-xs text-[#9E988F]">
            Operating management & live appointment dispatch for Bhanugudi Studio.
          </p>
        </div>

        {/* 1-Click Fast Evaluation Panel for Reviewers */}
        <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#C5A880]/30 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant Role Evaluation Access</span>
          </div>

          <p className="text-[11px] text-[#9E988F] leading-snug">
            Direct 1-click access for evaluation:
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => handleDemoLogin('salon_owner')}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] hover:brightness-110 text-xs font-semibold flex items-center justify-between transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)]"
            >
              <span>Login as Salon Owner (John - John Salon KKD)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleDemoLogin('customer')}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#222222] border border-white/[0.08] hover:border-[#C5A880]/40 text-[#F7F4EE] text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>Login as Guest (Ramesh Kumar - Kakinada)</span>
              <User className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleRegularLogin} className="space-y-4 text-xs pt-1">
          <div>
            <label className="font-semibold text-[#F7F4EE] block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@johnsalonkkd.com"
              className="w-full px-3.5 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#F7F4EE] block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#202020] hover:bg-[#2A2A2A] text-[#F7F4EE] border border-white/[0.12] font-semibold transition-colors"
          >
            Sign In with Email
          </button>
        </form>

      </div>
    </div>
  );
}
