'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Scissors, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide public footer on dashboard and admin workspaces
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer id="contact" className="w-full bg-[#070707] text-[#9E988F] border-t border-white/[0.08] relative overflow-hidden">
      
      {/* Decorative top hairline glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Brand & Editorial Manifesto (Col span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] group-hover:border-[#C5A880] transition-colors">
                <Scissors className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-[0.12em] text-[#F7F4EE]">
                  JOHN SALON
                </span>
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold -mt-1">
                  POWERED BY TRIMORVA · KAKINADA
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#9E988F] leading-relaxed max-w-sm">
              John Salon is Kakinada’s bespoke grooming atelier, hosted on the Trimorva digital salon platform. Where timeless salon craftsmanship harmonizes with modern AI style consultation.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#141414] border border-white/[0.1] hover:border-[#C5A880]/50 hover:text-[#F7F4EE] flex items-center justify-center transition-all group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
              </a>
              <Link 
                href="/login" 
                className="w-9 h-9 rounded-full bg-[#141414] border border-white/[0.1] hover:border-[#C5A880]/50 hover:text-[#F7F4EE] flex items-center justify-center transition-all group"
                aria-label="Staff Portal"
                title="Salon Owner & Staff Portal"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Navigation Links (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#F7F4EE]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9E988F]">
              <li>
                <Link href="/" className="hover:text-[#F7F4EE] transition-colors flex items-center gap-1 group">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/salon/john_salon_kkd" className="hover:text-[#F7F4EE] transition-colors flex items-center gap-1 group">
                  <span>Salon Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/stylescan" className="hover:text-[#F7F4EE] transition-colors flex items-center gap-1 group">
                  <span>AI StyleScan</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C5A880]/20 text-[#E5C590] font-mono">AI</span>
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-[#F7F4EE] transition-colors">
                  The Atelier Space
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#F7F4EE] transition-colors">
                  Owner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Signature Services (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#F7F4EE]">
              Signature Services (₹)
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9E988F]">
              <li className="flex justify-between items-center pr-4">
                <Link href="/salon/john_salon_kkd#services" className="hover:text-[#F7F4EE] transition-colors">
                  Signature Bespoke Haircut
                </Link>
                <span className="text-[#C5A880] font-serif">₹350</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <Link href="/salon/john_salon_kkd#services" className="hover:text-[#F7F4EE] transition-colors">
                  Executive Fade & Beard Sculpt
                </Link>
                <span className="text-[#C5A880] font-serif">₹300</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <Link href="/salon/john_salon_kkd#services" className="hover:text-[#F7F4EE] transition-colors">
                  Royal Moroccan Hair Spa
                </Link>
                <span className="text-[#C5A880] font-serif">₹750</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <Link href="/salon/john_salon_kkd#services" className="hover:text-[#F7F4EE] transition-colors">
                  Keratin Smoothing Therapy
                </Link>
                <span className="text-[#C5A880] font-serif">₹2,499</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <Link href="/salon/john_salon_kkd#services" className="hover:text-[#F7F4EE] transition-colors">
                  D-Tan Glow Facial Therapy
                </Link>
                <span className="text-[#C5A880] font-serif">₹650</span>
              </li>
            </ul>
          </div>

          {/* Location, Hours & Direct Contact (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#F7F4EE]">
              Bhanugudi Studio
            </h4>
            
            <div className="space-y-3 text-xs text-[#9E988F]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Bhanugudi Junction, Main Road, Kakinada, Andhra Pradesh 533003
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="tel:6303522044" className="hover:text-[#F7F4EE] transition-colors font-medium">
                  6303522044
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="mailto:appointments@johnsalonkkd.com" className="hover:text-[#F7F4EE] transition-colors">
                  appointments@johnsalonkkd.com
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F7F4EE] font-medium block">Mon – Sun: 09:00 AM – 09:00 PM</span>
                  <span className="text-[11px] text-[#9E988F]">Valet parking & priority reservations</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#66615B]">
          <div>
            © {new Date().getFullYear()} John Salon · Trimorva Application. All rights reserved. Cinema Hall Road, Kakinada.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#9E988F] transition-colors cursor-pointer">Privacy Safeguards</span>
            <span className="hover:text-[#9E988F] transition-colors cursor-pointer">Hygiene Protocols</span>
            <span className="hover:text-[#9E988F] transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
