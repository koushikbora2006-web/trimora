'use client';

import React from 'react';
import { 
  X, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { Service } from '@/lib/types';

interface SpaServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (serviceId: string) => void;
}

export default function SpaServiceModal({
  service,
  isOpen,
  onClose,
  onBook
}: SpaServiceModalProps) {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#121212] border border-white/[0.12] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] text-[#F7F4EE] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-service-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-white/10 text-[#9E988F] hover:text-[#F7F4EE] border border-white/10 transition-all backdrop-blur-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Hero Image Section */}
          <div className="relative h-64 sm:h-72 w-full bg-[#1A1A1A] overflow-hidden">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1C1814] to-[#0D0D0D]">
                <Sparkles className="w-12 h-12 text-[#C5A880]/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />

            {/* Badges on Image */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] px-2.5 py-1 rounded-full bg-[#C5A880]/20 text-[#E5C590] border border-[#C5A880]/40 backdrop-blur-md">
                    Beauty Spa Ritual
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/[0.08] text-[#D8D3C9] border border-white/[0.08] backdrop-blur-md">
                    {service.category}
                  </span>
                </div>
                <h3 
                  id="modal-service-title"
                  className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F4EE] drop-shadow-md"
                >
                  {service.name}
                </h3>
              </div>

              {/* Price Tag Pill */}
              <div className="shrink-0 text-right bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/[0.1]">
                <div className="text-[10px] text-[#9E988F] uppercase tracking-wider">Investment</div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#E5C590]">
                  ₹{service.price}
                </div>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#171717] border border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9E988F] uppercase font-medium">Session Duration</div>
                  <div className="text-xs font-semibold text-[#F7F4EE]">{service.duration_minutes} Minutes</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9E988F] uppercase font-medium">Suite Environment</div>
                  <div className="text-xs font-semibold text-[#F7F4EE]">Private Luxury Cabin</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9E988F] uppercase font-medium">Ingredients</div>
                  <div className="text-xs font-semibold text-[#F7F4EE]">Organic & Hypoallergenic</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] mb-2">
                Treatment Overview
              </h4>
              <p className="text-sm text-[#D8D3C9] leading-relaxed font-light">
                {service.description}
              </p>
            </div>

            {/* Key Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  Key Treatment Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {service.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-xl bg-[#161616] border border-white/[0.06] flex items-start gap-2.5 text-xs text-[#E5E1D8]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation & Aftercare Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preparation */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F7F4EE]">
                  <Info className="w-4 h-4 text-[#C5A880]" />
                  <span>Preparation Advice</span>
                </div>
                <p className="text-xs text-[#9E988F] leading-relaxed">
                  {service.preparation || 'Arrive 10 minutes before your scheduled appointment to enjoy a complimentary herbal infusion and settle into our tranquil relaxation suite.'}
                </p>
              </div>

              {/* Aftercare */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F7F4EE]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Aftercare Guidance</span>
                </div>
                <p className="text-xs text-[#9E988F] leading-relaxed">
                  {service.aftercare || 'Keep your skin well hydrated and avoid direct UV exposure or aggressive exfoliants for 24 hours following your ritual to prolong radiance.'}
                </p>
              </div>
            </div>

            {/* Atelier Assurance */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181613] to-[#121212] border border-[#C5A880]/20 text-[11px] text-[#A69F93] leading-relaxed flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#C5A880] shrink-0" />
              <span>
                All spa rituals are administered in private, climate-controlled, sanitized suites by certified aestheticians using pure botanicals and dermatologically verified luxury formulas.
              </span>
            </div>

          </div>
        </div>

        {/* Modal Footer / Booking Action */}
        <div className="p-5 sm:p-6 bg-[#161616] border-t border-white/[0.08] flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-[#9E988F]">Selected Ritual</div>
            <div className="font-serif text-lg font-bold text-[#F7F4EE]">
              ₹{service.price} <span className="text-xs font-sans text-[#9E988F] font-normal">/ {service.duration_minutes}m</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-white/[0.12] text-xs font-medium text-[#D8D3C9] hover:text-[#F7F4EE] hover:bg-white/[0.06] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(service.id);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,168,128,0.25)]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book This Ritual</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
