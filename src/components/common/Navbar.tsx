'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Calendar, 
  Scissors, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronRight,
  MapPin
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Salon', href: '/salon/john_salon_kkd' },
    { label: 'Beauty Spa', href: '/spa', badge: 'Spa' },
    { label: 'Services', href: '/#services' },
    { label: 'AI StyleScan', href: '/stylescan', badge: 'AI' },
    { label: 'The Space', href: '/#experience' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0A0A0A]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3.5' 
          : 'bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: John Salon Wordmark & Insignia */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#151515] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] group-hover:border-[#C5A880] group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            <Scissors className="w-4 h-4 text-[#C5A880] transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.12em] text-[#F7F4EE] group-hover:text-[#E5C590] transition-colors">
              JOHN SALON
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold -mt-1 flex items-center gap-1.5">
              <span>KAKINADA</span>
              <span className="w-1 h-1 rounded-full bg-[#C5A880]/60 inline-block" />
              <span>SALON & SPA</span>
            </span>
          </div>
        </Link>

        {/* Center: Editorial Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-wider uppercase text-[#9E988F]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 hover:text-[#F7F4EE] transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive ? 'text-[#F7F4EE] font-semibold' : ''
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#C5A880]/20 text-[#E5C590] border border-[#C5A880]/40 font-mono">
                    {link.badge}
                  </span>
                )}
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C5A880] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3.5">
          <Link
            href="/salon/john_salon_kkd"
            className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(197,168,128,0.25)] flex items-center gap-2 group"
          >
            <Calendar className="w-3.5 h-3.5 text-[#0A0A0A] group-hover:rotate-6 transition-transform" />
            <span>Book Appointment</span>
          </Link>

          <Link
            href="/login"
            className="px-3.5 py-2 rounded-full text-xs font-medium text-[#9E988F] hover:text-[#F7F4EE] border border-white/[0.1] hover:border-[#C5A880]/40 transition-all duration-300 flex items-center gap-1.5 bg-[#141414]/50 hover:bg-[#141414]"
            title="Salon Owner & Staff Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="hidden md:inline">Portal</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-[#F7F4EE] hover:bg-white/[0.08] transition-colors border border-white/[0.1]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-[#C5A880]" /> : <Menu className="w-5 h-5 text-[#C5A880]" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#0A0A0A]/98 backdrop-blur-2xl border-b border-white/[0.1] px-6 py-8 space-y-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-4 text-sm font-medium tracking-wider uppercase text-[#9E988F]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-white/[0.05] hover:text-[#F7F4EE] transition-colors flex items-center justify-between border-b border-white/[0.05]"
              >
                <div className="flex items-center gap-2">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#E5C590] border border-[#C5A880]/40 font-mono">
                      {link.badge}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-[#C5A880]" />
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-3">
            <Link
              href="/salon/john_salon_kkd"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,168,128,0.25)]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book an Appointment</span>
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full text-xs font-medium text-[#F7F4EE] border border-white/[0.12] flex items-center justify-center gap-2 hover:bg-white/[0.05] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Salon Owner & Staff Portal</span>
            </Link>
          </div>

          <div className="text-[11px] text-[#9E988F] flex items-center gap-2 justify-center pt-2">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Bhanugudi Junction, Kakinada</span>
          </div>
        </div>
      )}

    </header>
  );
}
