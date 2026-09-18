'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Store, 
  Scissors, 
  Calendar, 
  Bot, 
  FileText, 
  Tag, 
  ExternalLink, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Salon } from '@/lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [currentSalonId, setCurrentSalonId] = useState<string>('john_salon_kkd');

  useEffect(() => {
    fetch('/api/salons')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.salons) {
          setSalons(data.salons);
        }
      })
      .catch((err) => console.warn('Could not fetch salons list', err));
  }, []);

  const currentSalon = salons.find((s) => s.id === currentSalonId) || salons[0];

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Salon Profile', icon: Store },
    { href: '/dashboard/services', label: 'Services & Rates', icon: Scissors },
    { href: '/dashboard/appointments', label: 'Live Appointments', icon: Calendar },
    { href: '/dashboard/knowledge', label: 'Knowledge Base (RAG)', icon: FileText },
    { href: '/dashboard/offers', label: 'Offers & Promos', icon: Tag },
    { href: '/dashboard/chatbot', label: 'AI Concierge Settings', icon: Bot },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0A] text-[#F7F4EE]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#121212] text-[#F7F4EE] p-5 flex flex-col justify-between shrink-0 border-r border-white/[0.08]">
        <div className="space-y-6">
          
          {/* Brand header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-wider block text-[#F7F4EE]">JOHN SALON</span>
              <span className="text-[10px] text-[#C5A880] uppercase tracking-widest block">Atelier Portal</span>
            </div>
          </div>

          {/* Active Salon Workspace */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#9E988F] block">
              Active Salon Workspace
            </label>
            <div className="p-3.5 rounded-2xl bg-[#181818] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F7F4EE]">
                  {currentSalon?.name || 'John Salon KKD'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              </div>
              <div className="text-[11px] text-[#9E988F]">
                Bhanugudi Junction, Kakinada
              </div>
              <div className="pt-0.5">
                <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified Flagship
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C5A880] text-[#0A0A0A] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                      : 'text-[#9E988F] hover:text-[#F7F4EE] hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A0A0A]' : 'text-[#C5A880]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom live page link */}
        <div className="pt-6 border-t border-white/[0.08] space-y-2">
          {currentSalon && (
            <Link
              href={`/salon/${currentSalon.slug}`}
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-[#F7F4EE] transition-colors border border-white/[0.06]"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
            </Link>
          )}

          <div className="text-[10px] text-[#66615B] text-center">
            John Salon KKD • Bhanugudi Studio
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>

    </div>
  );
}
