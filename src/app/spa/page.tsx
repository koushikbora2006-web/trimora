'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  Star,
  MapPin,
  Phone,
  Droplets,
  Flower2,
  Gem,
  Award
} from 'lucide-react';
import { Salon, Service } from '@/lib/types';
import SpaServiceModal from '@/components/spa/SpaServiceModal';
import AppointmentModal from '@/components/booking/AppointmentModal';
import SalonChatbot from '@/components/chatbot/SalonChatbot';

const SPA_CATEGORIES = [
  'All',
  'Facials & Skin Care',
  'Massage & Relaxation',
  'Hand & Foot Care',
  'Beauty Treatments',
  'Bridal & Special Care'
];

const SPA_SUGGESTED_QUESTIONS = [
  'What facials do you offer at John Salon Spa?',
  'How much is the Swedish Relaxation Massage?',
  'What is included in the Royal Pre-Bridal Glow Ritual?',
  'What are the benefits of the 24K Gold Facial?',
  'Are your spa suites private?',
  'How do I prepare for a body scrub or facial?'
];

export default function BeautySpaPage() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [spaServices, setSpaServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedSpaService, setSelectedSpaService] = useState<Service | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch salon details and spa services
    Promise.all([
      fetch('/api/salons/john_salon_kkd').then((res) => res.json()),
      fetch('/api/services?salon_id=john_salon_kkd&department=spa').then((res) => res.json()),
      fetch('/api/services?salon_id=john_salon_kkd').then((res) => res.json())
    ])
      .then(([salonRes, spaRes, allRes]) => {
        if (salonRes.success && salonRes.salon) {
          setSalon(salonRes.salon);
        }
        if (spaRes.success && spaRes.services) {
          setSpaServices(spaRes.services);
        }
        if (allRes.success && allRes.services) {
          setAllServices(allRes.services);
        }
      })
      .catch((err) => {
        console.error('Failed to load spa data', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDetails = (service: Service) => {
    setSelectedSpaService(service);
    setIsDetailModalOpen(true);
  };

  const handleOpenBooking = (serviceId?: string) => {
    setBookingServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  const filteredServices = selectedCategory === 'All'
    ? spaServices
    : spaServices.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F7F4EE] selection:bg-[#C5A880]/30 selection:text-[#FAF8F5]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Background Image with Cinematic Dark Editorial Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1800"
            alt="John Salon & Beauty Spa Sanctuary"
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/75 to-[#0A0A0A]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Subtle Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-[#C5A880]/30 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#E5C590] uppercase">
              John Salon · Atelier Beauty Spa
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F7F4EE] leading-[1.1] drop-shadow-lg">
              A Ritual of Beauty & <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#C5A880] via-[#E5C590] to-[#FAF8F5]">Relaxation.</span>
            </h1>
            <p className="text-sm sm:text-lg text-[#D8D3C9] font-light max-w-2xl mx-auto leading-relaxed">
              Step into John Salon's dedicated beauty spa sanctuary. Private luxury suites, organic botanical elixirs, and bespoke therapeutic rituals crafted to restore balance and radiant youth.
            </p>
          </div>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#rituals"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_25px_rgba(197,168,128,0.25)] flex items-center justify-center gap-2"
            >
              <span>Explore Spa Rituals</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleOpenBooking(spaServices[0]?.id)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-[#F7F4EE] border border-white/[0.15] text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#C5A880]" />
              <span>Reserve Treatment</span>
            </button>
          </div>

          {/* Trust Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/[0.08] max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <Flower2 className="w-5 h-5 text-[#C5A880] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#F7F4EE]">Pure Botanicals</div>
                <div className="text-[10px] text-[#9E988F]">Organic & Dermatologist Tested</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#F7F4EE]">Private Suites</div>
                <div className="text-[10px] text-[#9E988F]">Climate-Controlled Sanctum</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <Award className="w-5 h-5 text-[#C5A880] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#F7F4EE]">Master Therapists</div>
                <div className="text-[10px] text-[#9E988F]">Certified Skin & Spa Experts</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <Star className="w-5 h-5 text-[#C5A880] shrink-0 fill-[#C5A880]" />
              <div>
                <div className="text-xs font-semibold text-[#F7F4EE]">4.9★ Rated</div>
                <div className="text-[10px] text-[#9E988F]">Bhanugudi Junc., Kakinada</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. RITUALS & SERVICES CATALOG */}
      <section id="rituals" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            Bespoke Treatment Menu
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F4EE]">
            Indulgent Spa Rituals
          </h2>
          <p className="text-xs sm:text-sm text-[#9E988F] max-w-xl mx-auto font-light">
            Every therapy is designed to deliver visible cellular rejuvenation, deep myofascial release, and complete mental serenity.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {SPA_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' 
              ? spaServices.length 
              : spaServices.filter((s) => s.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#C5A880] text-[#0A0A0A] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                    : 'bg-[#151515] text-[#9E988F] border border-white/[0.06] hover:border-[#C5A880]/40 hover:text-[#F7F4EE]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/20 text-[#0A0A0A]' : 'bg-white/[0.06] text-[#9E988F]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Treatment Cards Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#9E988F] uppercase tracking-[0.2em]">Preparing spa menu...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center bg-[#141414] rounded-3xl border border-white/[0.08] text-[#9E988F]">
            <p className="text-sm">No treatments found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/50 transition-all duration-300 overflow-hidden flex flex-col shadow-lg hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
              >
                {/* Image Container */}
                <div className="relative h-56 sm:h-64 w-full bg-[#1A1A1A] overflow-hidden">
                  <img
                    src={service.image_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-[#E5C590] border border-white/10 backdrop-blur-md">
                      {service.category}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/60 text-[#D8D3C9] border border-white/10 backdrop-blur-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C5A880]" />
                      <span>{service.duration_minutes}m</span>
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-right">
                    <span className="text-[10px] text-[#9E988F] block uppercase tracking-wider">Price</span>
                    <span className="font-serif text-lg font-bold text-[#E5C590]">
                      ₹{service.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#F7F4EE] group-hover:text-[#E5C590] transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#9E988F] line-clamp-2 leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>

                  {/* Benefits Preview */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                      {service.benefits.slice(0, 2).map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-[#C5C0B7]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 flex items-center gap-2.5 border-t border-white/[0.06]">
                    <button
                      onClick={() => handleOpenDetails(service)}
                      className="flex-1 py-2.5 rounded-full border border-white/[0.12] hover:border-[#C5A880]/50 text-xs font-medium text-[#D8D3C9] hover:text-[#F7F4EE] hover:bg-white/[0.04] transition-all text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleOpenBooking(service.id)}
                      className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)] text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Book Ritual</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* 3. SENSORY EXPERIENCE SECTION: "Take Time for Yourself." */}
      <section className="py-20 bg-[#0E0E0E] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 text-[10px] font-semibold text-[#E5C590] uppercase tracking-[0.2em]">
                The Sanctuary Philosophy
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F4EE] leading-tight">
                Take Time for <br />
                <span className="italic text-[#C5A880]">Yourself.</span>
              </h2>

              <p className="text-sm text-[#D8D3C9] leading-relaxed font-light">
                In the heart of Kakinada, John Salon has curated a calm escape far removed from urban noise. Designed around holistic sensory therapy, our private treatment suites offer an intimate environment where time slows down.
              </p>

              {/* 4 Pillars */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#141414] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 text-[#C5A880] flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-0.5">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F7F4EE] uppercase tracking-wider">
                      Private Climate-Controlled Cabins
                    </h4>
                    <p className="text-xs text-[#9E988F] mt-0.5 leading-relaxed">
                      Sound-insulated therapy suites equipped with heated ergonomic treatment beds, warm ambient lighting, and bespoke relaxing acoustic soundscapes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#141414] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 text-[#C5A880] flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-0.5">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F7F4EE] uppercase tracking-wider">
                      Cold-Pressed Botanical Elixirs
                    </h4>
                    <p className="text-xs text-[#9E988F] mt-0.5 leading-relaxed">
                      Custom-blended French lavender, Indian sandalwood, sweet almond, and vitamin-rich botanical extracts formulated for high bioavailability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#141414] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 text-[#C5A880] flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-0.5">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F7F4EE] uppercase tracking-wider">
                      Personalized Skin Diagnostics
                    </h4>
                    <p className="text-xs text-[#9E988F] mt-0.5 leading-relaxed">
                      Every facial and therapy begins with an aesthetic assessment to tailor pressure, mask formulations, and aftercare routines to your specific skin needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#141414] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 text-[#C5A880] flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-0.5">
                    04
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F7F4EE] uppercase tracking-wider">
                      Complimentary Artisanal Tea Service
                    </h4>
                    <p className="text-xs text-[#9E988F] mt-0.5 leading-relaxed">
                      Relax after your session in our post-ritual lounge with brewed whole-leaf chamomile or jasmine green tea to gently rehydrate your body.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl h-[460px]">
                  <img
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000"
                    alt="Spa treatment in progress"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Overlay Quote */}
                  <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                    <p className="font-serif italic text-sm text-[#F7F4EE]">
                      "A transformative oasis in Kakinada. The atmosphere, therapists, and 24K Gold facial left me feeling completely renewed."
                    </p>
                    <div className="text-[10px] text-[#C5A880] uppercase tracking-wider mt-2 font-semibold">
                      — Sneha R., Verified Spa Guest
                    </div>
                  </div>
                </div>

                {/* Overlapping Accent Card */}
                <div className="hidden sm:block absolute -top-6 -right-6 p-5 rounded-2xl bg-[#161616] border border-[#C5A880]/30 shadow-2xl max-w-xs backdrop-blur-xl animate-in fade-in duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C5A880]/15 flex items-center justify-center text-[#C5A880]">
                      <Gem className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F7F4EE]">Bhanugudi Flagship</div>
                      <div className="text-[10px] text-[#9E988F]">Daily 09:00 AM – 09:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. AI SPA ADVISOR PROMO BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#181613] via-[#121212] to-[#161412] border border-[#C5A880]/30 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#C5A880] uppercase">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                John Salon AI Spa Concierge
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#F7F4EE]">
                Unsure Which Ritual Suits Your Skin?
              </h3>
              <p className="text-xs sm:text-sm text-[#D8D3C9] leading-relaxed font-light">
                Ask our AI Concierge about sensitive skin recommendations, Swedish vs Deep Tissue pressure levels, pre-bridal packages, or exact pricing. Our system is directly synchronized with John Salon’s official protocols.
              </p>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => {
                  // Trigger chatbot by clicking the chatbot floating button or dispatching
                  const btn = document.querySelector('button[title="Open John Salon Concierge AI"]') as HTMLButtonElement;
                  if (btn) btn.click();
                }}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_25px_rgba(197,168,128,0.25)] flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask AI Spa Advisor</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. GUEST TESTIMONIALS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            Atelier Guest Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F4EE]">
            Words of Serenity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#C5A880]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                ))}
              </div>
              <p className="text-xs text-[#D8D3C9] leading-relaxed font-light italic">
                "The 24K Gold Facial before my sister's reception was incredible. My skin was glowing for 4 days without any redness. The private suite gives you complete privacy."
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#F7F4EE]">Sneha Reddy</span>
              <span className="text-[10px] text-[#9E988F]">Kakinada Main Road</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#C5A880]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                ))}
              </div>
              <p className="text-xs text-[#D8D3C9] leading-relaxed font-light italic">
                "The Deep Tissue massage here is unmatched. The therapist identified the exact tension knots in my shoulders and lower back. Absolutely professional."
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#F7F4EE]">Rajesh Kumar</span>
              <span className="text-[10px] text-[#9E988F]">Bhanugudi Resident</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#C5A880]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                ))}
              </div>
              <p className="text-xs text-[#D8D3C9] leading-relaxed font-light italic">
                "The Luxury Champagne & Rose Pedicure is pure indulgence. Autoclaved tools, soothing rose bath, and heavenly foot massage. Highly recommend John Salon Spa."
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#F7F4EE]">Dr. M. Varma</span>
              <span className="text-[10px] text-[#9E988F]">Suryaraopeta</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA: "Your Moment of Relaxation Awaits." */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <div className="w-16 h-16 rounded-full bg-[#181613] border border-[#C5A880]/30 flex items-center justify-center mx-auto text-[#C5A880] shadow-[0_0_30px_rgba(197,168,128,0.2)]">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            Bespoke Sanctuary Booking
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F4EE]">
            Your Moment of Relaxation Awaits.
          </h2>
          <p className="text-xs sm:text-sm text-[#9E988F] max-w-xl mx-auto leading-relaxed">
            Reserve your private spa ritual at John Salon Bhanugudi Junction. Our concierge will curate your suite, temperature, and aromatic oils ahead of your arrival.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handleOpenBooking()}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_30px_rgba(197,168,128,0.3)] flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Spa Journey</span>
          </button>

          <Link
            href="/salon/john_salon_kkd"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-[#D8D3C9] hover:text-[#F7F4EE] border border-white/[0.1] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>Visit Salon Grooming</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-[11px] text-[#9E988F] pt-4 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#C5A880]" />
            Bhanugudi Junction, Kakinada, AP
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#C5A880]" />
            Open Daily: 09:00 AM – 09:00 PM
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#C5A880]" />
            +91 98480 22338
          </span>
        </div>
      </section>

      {/* Treatment Details Modal */}
      <SpaServiceModal
        service={selectedSpaService}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSpaService(null);
        }}
        onBook={(serviceId) => {
          setIsDetailModalOpen(false);
          handleOpenBooking(serviceId);
        }}
      />

      {/* Unified Appointment Booking Modal */}
      {salon && (
        <AppointmentModal
          salon={salon}
          services={allServices.length > 0 ? allServices : spaServices}
          initialServiceId={bookingServiceId}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setBookingServiceId(undefined);
          }}
        />
      )}

      {/* Unified RAG Chatbot with Spa Context */}
      {salon && (
        <SalonChatbot
          salon={salon}
          onOpenBooking={() => handleOpenBooking()}
          initialMessage="Welcome to John Salon & Beauty Spa. I am your personal wellness and grooming concierge. How may I assist you today with our luxury spa rituals, facial therapies, authentic pricing, or booking your private suite?"
          suggestedQuestions={SPA_SUGGESTED_QUESTIONS}
        />
      )}

    </div>
  );
}
