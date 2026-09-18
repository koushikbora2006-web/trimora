'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Scissors, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Bot, 
  Scan,
  Compass,
  Award,
  ChevronDown
} from 'lucide-react';
import { Salon, Service, SalonReview } from '@/lib/types';
import AppointmentModal from '@/components/booking/AppointmentModal';
import SalonChatbot from '@/components/chatbot/SalonChatbot';

export default function HomePage() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<SalonReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch('/api/salons/john_salon_kkd')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSalon(data.salon);
          setServices(data.services || []);
          setReviews(data.reviews || []);
        }
      })
      .catch((err) => console.warn('Error loading salon data', err))
      .finally(() => setLoading(false));
  }, []);

  const handleBookService = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setBookingOpen(true);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#0A0A0A] text-[#F7F4EE]">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Background Visual Layer: Cinematic Salon Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2000&q=85"
            alt="John Salon Luxury Grooming Experience"
            className="w-full h-full object-cover object-center cinematic-zoom opacity-30 brightness-75 scale-105"
          />
          {/* Multi-layered dark luxury overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C5A880]/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 pt-10">
          
          {/* Label Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#151515]/90 border border-[#C5A880]/30 shadow-[0_0_20px_rgba(197,168,128,0.15)] animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C590] font-semibold">
              JOHN SALON · PREMIUM GROOMING EXPERIENCE
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="space-y-2">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#F7F4EE] leading-[1.05]">
              Your Style. <br />
              <span className="gold-shimmer-text italic font-normal">
                Your Signature.
              </span>
            </h1>
          </div>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base lg:text-lg text-[#9E988F] max-w-2xl mx-auto leading-relaxed font-normal px-4">
            Discover a refined grooming experience where expert craftsmanship meets personalized style. Located at Bhanugudi Junction, Kakinada.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4">
            <button
              onClick={() => handleBookService()}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(197,168,128,0.3)] flex items-center justify-center gap-2.5 group"
            >
              <Calendar className="w-4 h-4 text-[#0A0A0A] group-hover:rotate-12 transition-transform" />
              <span>Book an Appointment</span>
            </button>

            <a
              href="#services"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#151515]/80 hover:bg-[#1E1E1E] text-[#F7F4EE] border border-white/[0.12] hover:border-[#C5A880]/50 font-medium text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Explore Our Services</span>
              <ChevronDown className="w-4 h-4 text-[#C5A880]" />
            </a>

            <Link
              href="/stylescan"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#151515]/50 hover:bg-[#151515] text-[#E5C590] border border-[#C5A880]/30 hover:border-[#C5A880] font-medium text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
              <span>Try AI StyleScan</span>
            </Link>
          </div>

          {/* Minimal Floating Metrics & Fine Badges */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left border-t border-white/[0.08]">
            <div className="p-3.5 rounded-2xl bg-[#141414]/40 border border-white/[0.05]">
              <span className="text-[10px] text-[#9E988F] uppercase tracking-wider block">Location</span>
              <span className="text-xs font-semibold text-[#F7F4EE] mt-0.5 block">Bhanugudi, KKD</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141414]/40 border border-white/[0.05]">
              <span className="text-[10px] text-[#9E988F] uppercase tracking-wider block">Craftsmanship</span>
              <span className="text-xs font-semibold text-[#F7F4EE] mt-0.5 block">Master Barbers</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141414]/40 border border-white/[0.05]">
              <span className="text-[10px] text-[#9E988F] uppercase tracking-wider block">AI Consultation</span>
              <span className="text-xs font-semibold text-[#E5C590] mt-0.5 block">Zero Wait RAG</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141414]/40 border border-white/[0.05]">
              <span className="text-[10px] text-[#9E988F] uppercase tracking-wider block">Operating Hours</span>
              <span className="text-xs font-semibold text-[#F7F4EE] mt-0.5 block">9 AM – 9 PM Daily</span>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="pt-6 flex justify-center">
            <a 
              href="#services" 
              className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#66615B] hover:text-[#C5A880] transition-colors"
            >
              <span>Scroll to Explore</span>
              <div className="w-5 h-8 rounded-full border border-white/[0.15] flex items-start justify-center p-1">
                <div className="w-1 h-2 rounded-full bg-[#C5A880] animate-bounce" />
              </div>
            </a>
          </div>

        </div>

      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#C5A880] uppercase">
            <Scissors className="w-3.5 h-3.5" />
            <span>Curated Service Menu</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F7F4EE]">
            Crafted for Your Signature Look.
          </h2>
          <p className="text-sm sm:text-base text-[#9E988F] leading-relaxed">
            Precision, care, and expertise tailored to your individual style. Every service uses premium professional lines and bespoke scissor techniques.
          </p>
        </div>

        {/* Editorial Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Featured Large Service Card (Span 7) */}
          <div className="md:col-span-7 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 overflow-hidden shadow-2xl transition-all duration-500 group flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1E1E1E]">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80"
                alt="Signature Bespoke Haircut"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#C5A880] border border-white/[0.08]">
                Flagship Service
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex justify-between items-baseline gap-4">
                <h3 className="font-serif text-2xl font-bold text-[#F7F4EE] group-hover:text-[#E5C590] transition-colors">
                  Signature Bespoke Haircut & Styling
                </h3>
                <span className="font-serif text-2xl font-bold text-[#E5C590] shrink-0">
                  ₹350
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-[#9E988F] leading-relaxed">
                Precision consultation, master scissor craft, soothing shampoo wash, and signature blow-dry styling tailored to your facial geometry.
              </p>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-[#66615B] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>45 Minutes Treatment</span>
                </span>
                <button
                  onClick={() => handleBookService('srv-1')}
                  className="px-5 py-2.5 rounded-full bg-[#1F1F1F] hover:bg-[#C5A880] text-[#F7F4EE] hover:text-[#0A0A0A] text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
                >
                  <span>Reserve Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Stacked Service Cards (Span 5) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Card 2: Executive Fade & Beard */}
            <div className="rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 p-6 space-y-3 transition-all duration-300 group">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">Beard & Hair</span>
                <span className="font-serif text-xl font-bold text-[#E5C590]">₹300</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#F7F4EE] group-hover:text-[#E5C590] transition-colors">
                Executive Fade & Beard Sculpting
              </h3>
              <p className="text-xs text-[#9E988F] leading-relaxed">
                Crisp skin taper fade combined with straight-razor cheek line alignment and nourishing hot-towel beard hydration.
              </p>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-[#66615B]">40 Mins</span>
                <button
                  onClick={() => handleBookService('srv-2')}
                  className="text-xs font-semibold text-[#C5A880] hover:text-[#F7F4EE] flex items-center gap-1 transition-colors"
                >
                  <span>Book This</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Moroccan Hair Spa */}
            <div className="rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 p-6 space-y-3 transition-all duration-300 group">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">Restorative Spa</span>
                <span className="font-serif text-xl font-bold text-[#E5C590]">₹750</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#F7F4EE] group-hover:text-[#E5C590] transition-colors">
                Royal Moroccan Hair Spa & Scalp Therapy
              </h3>
              <p className="text-xs text-[#9E988F] leading-relaxed">
                Deep conditioning Moroccanoil infusion with acupressure scalp massage and micro-mist steam rejuvenation.
              </p>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-[#66615B]">60 Mins</span>
                <button
                  onClick={() => handleBookService('srv-3')}
                  className="text-xs font-semibold text-[#C5A880] hover:text-[#F7F4EE] flex items-center gap-1 transition-colors"
                >
                  <span>Book This</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Row Services Cards (3-column layout) */}
          <div className="md:col-span-4 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 p-6 space-y-3 transition-all duration-300 group">
            <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">Keratin Studio</span>
            <div className="flex justify-between items-baseline">
              <h4 className="font-serif text-lg font-bold text-[#F7F4EE]">Keratin Smoothing Therapy</h4>
              <span className="font-serif text-lg font-bold text-[#E5C590]">₹2,499</span>
            </div>
            <p className="text-xs text-[#9E988F] leading-relaxed">
              Formaldehyde-free smoothing treatment that eliminates frizz and repairs humidity damage for up to 12 weeks.
            </p>
            <button
              onClick={() => handleBookService('srv-4')}
              className="pt-2 text-xs font-semibold text-[#C5A880] hover:text-[#F7F4EE] flex items-center gap-1 transition-colors"
            >
              <span>Reserve Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="md:col-span-4 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 p-6 space-y-3 transition-all duration-300 group">
            <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">Skin Aesthetics</span>
            <div className="flex justify-between items-baseline">
              <h4 className="font-serif text-lg font-bold text-[#F7F4EE]">D-Tan Glow Facial Therapy</h4>
              <span className="font-serif text-lg font-bold text-[#E5C590]">₹650</span>
            </div>
            <p className="text-xs text-[#9E988F] leading-relaxed">
              Botanical exfoliating peel and cooling antioxidant mask designed to reverse sun damage and brighten complexion.
            </p>
            <button
              onClick={() => handleBookService('srv-5')}
              className="pt-2 text-xs font-semibold text-[#C5A880] hover:text-[#F7F4EE] flex items-center gap-1 transition-colors"
            >
              <span>Reserve Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="md:col-span-4 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 p-6 space-y-3 transition-all duration-300 group">
            <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">Color Atelier</span>
            <div className="flex justify-between items-baseline">
              <h4 className="font-serif text-lg font-bold text-[#F7F4EE]">Global Color & Balayage</h4>
              <span className="font-serif text-lg font-bold text-[#E5C590]">₹1,800</span>
            </div>
            <p className="text-xs text-[#9E988F] leading-relaxed">
              Customized dimensional highlights, root melt, and toner application using ammonia-free Italian dyes.
            </p>
            <button
              onClick={() => handleBookService('srv-6')}
              className="pt-2 text-xs font-semibold text-[#C5A880] hover:text-[#F7F4EE] flex items-center gap-1 transition-colors"
            >
              <span>Reserve Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* View Full Menu CTA */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/salon/john_salon_kkd#services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A880] hover:text-[#F7F4EE] border-b border-[#C5A880]/40 pb-1 hover:border-[#F7F4EE] transition-all"
          >
            <span>View All Salon Grooming Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-white/20 hidden sm:inline">•</span>
          <Link
            href="/spa"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E5C590] hover:text-[#F7F4EE] border-b border-[#E5C590]/40 pb-1 hover:border-[#F7F4EE] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Explore Beauty Spa Sanctuary (11 Rituals)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

      {/* 3. AI STYLESCAN SECTION */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A] border-y border-white/[0.08] relative">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#C5A880]/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: AI Interface Console Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-[#141414] border border-white/[0.12] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group">
              
              {/* Image Frame with Scanning Laser */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
                <img
                  src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80"
                  alt="AI Face Scan Hairstyle Harmony Preview"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Animated Futuristic Laser Line */}
                <div className="scan-laser" />

                {/* Scanning Reticles */}
                <div className="absolute inset-6 border border-[#C5A880]/30 rounded-xl pointer-events-none" />
                <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-[#C5A880]" />
                <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-[#C5A880]" />
                <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-[#C5A880]" />
                <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-[#C5A880]" />

                {/* Realtime Analysis Markers */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#E5C590] border border-[#C5A880]/40 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>STYLESCAN ACTIVE</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3.5 rounded-xl border border-white/[0.1] text-xs">
                  <div className="flex justify-between items-center pb-1 border-b border-white/[0.1]">
                    <span className="text-[#9E988F] text-[11px]">Recommended Cut:</span>
                    <span className="font-serif font-bold text-[#E5C590]">Textured Taper Crop</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-1.5 text-[#9E988F]">
                    <span>Facial Harmony Match: <strong className="text-emerald-400">96%</strong></span>
                    <span>Oval/Square Proportions</span>
                  </div>
                </div>
              </div>

              {/* Consultation Spec Pills */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-[#1A1A1A] border border-white/[0.05]">
                  <span className="text-[#66615B] block text-[9px] uppercase">Face Shape</span>
                  <span className="font-semibold text-[#F7F4EE]">Square Balance</span>
                </div>
                <div className="p-2 rounded-xl bg-[#1A1A1A] border border-white/[0.05]">
                  <span className="text-[#66615B] block text-[9px] uppercase">Hair Density</span>
                  <span className="font-semibold text-[#F7F4EE]">Medium-Thick</span>
                </div>
                <div className="p-2 rounded-xl bg-[#1A1A1A] border border-white/[0.05]">
                  <span className="text-[#66615B] block text-[9px] uppercase">Styling Effort</span>
                  <span className="font-semibold text-[#C5A880]">5 Mins / Day</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Editorial Copy & Trigger */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181818] border border-[#C5A880]/30 text-xs font-semibold text-[#C5A880] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Digital Consultation</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F7F4EE] leading-[1.15]">
              Meet Your Next <br />
              <span className="gold-shimmer-text">Signature Style.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#9E988F] leading-relaxed">
              Explore personalized hairstyle recommendations designed around your features, preferences, and personality. Before you sit in our chair, know with absolute confidence which cut elevates your natural proportions.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F7F4EE]">Geometric Proportion Balancing</h4>
                  <p className="text-xs text-[#9E988F] mt-0.5">Analyzes jawline angles, forehead width, and cheekbone symmetry without biometric storage.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F7F4EE]">Tailored Lifestyle Alignment</h4>
                  <p className="text-xs text-[#9E988F] mt-0.5">Filter by hair length, aesthetic vibe, daily styling commitment, and beard pairing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F7F4EE]">Seamless 1-Click Booking Bridge</h4>
                  <p className="text-xs text-[#9E988F] mt-0.5">Selected styles and harmony notes transfer directly into your appointment reservation.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/stylescan"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-[0_0_25px_rgba(197,168,128,0.25)] group"
              >
                <Scan className="w-4 h-4 text-[#0A0A0A] group-hover:rotate-90 transition-transform" />
                <span>Try AI StyleScan</span>
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* 4. SALON INFORMATION / EXPERIENCE SECTION */}
      <section id="experience" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Editorial Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#C5A880] uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>The Atelier Experience</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F7F4EE]">
              A Space Designed Around You.
            </h2>

            <p className="text-sm sm:text-base text-[#9E988F] leading-relaxed">
              Step inside John Salon at Bhanugudi Junction. Every detail of our sanctuary is engineered for tranquility, hygiene, and elevated aesthetic transformation.
            </p>

            {/* Split Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#F7F4EE]">Prime Kakinada Studio</h4>
                <p className="text-xs text-[#9E988F] leading-relaxed">
                  Bhanugudi Junction, Main Road, Kakinada, AP 533003. Valet assistance available.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#F7F4EE]">Open 7 Days a Week</h4>
                <p className="text-xs text-[#9E988F] leading-relaxed">
                  Mon – Sun: 09:00 AM – 09:00 PM. Evening slots available by priority reservation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                  <Phone className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#F7F4EE]">Direct Concierge</h4>
                <p className="text-xs text-[#9E988F] leading-relaxed">
                  +91 98480 12345. Grounded AI assistance online 24/7 with zero waiting.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#F7F4EE]">Medical-Grade Hygiene</h4>
                <p className="text-xs text-[#9E988F] leading-relaxed">
                  Single-use disposable capes, UV-sterilized shear sets, and private wash basins.
                </p>
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={() => handleBookService()}
                className="px-8 py-3.5 rounded-full bg-[#F7F4EE] hover:bg-white text-[#0A0A0A] text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#C5A880]" />
                <span>Reserve Chair at Bhanugudi Studio</span>
              </button>
            </div>

          </div>

          {/* Right Column: High Quality Interior Photography */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl aspect-[4/5] bg-[#151515] group">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                alt="John Salon Interior Atmosphere"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 text-[#F7F4EE] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] px-3 py-1 rounded-full bg-[#C5A880] text-[#0A0A0A]">
                  Flagship Sanctuary
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  John Salon KKD — Main Road Studio
                </h3>
                <p className="text-xs text-[#BEB8AE]">
                  Private consultation chairs, acoustic ambient soundscapes, and complimentary espresso service.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0E0E0E] border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Guest Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F7F4EE]">
              The John Salon Experience.
            </h2>
            <p className="text-xs sm:text-sm text-[#9E988F]">
              What distinguished guests in Kakinada say about our master stylists and tailored treatments.
            </p>
          </div>

          {/* Testimonials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/30 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#C5A880]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                  ))}
                </div>
                <p className="font-serif text-base text-[#F7F4EE] italic leading-relaxed">
                  "The best fade and beard trim in Kakinada without question. The AI consultation before my cut helped me find the exact style that fits my jawline."
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#F7F4EE] block">Ramesh Kumar</span>
                  <span className="text-[#66615B] text-[11px]">Bhanugudi Regular Guest</span>
                </div>
                <span className="text-[11px] text-[#C5A880] font-mono">Verified Visit</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#141414] border border-[#C5A880]/30 shadow-[0_0_25px_rgba(197,168,128,0.1)] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#C5A880]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                  ))}
                </div>
                <p className="font-serif text-base text-[#F7F4EE] italic leading-relaxed">
                  "The Royal Moroccan Hair Spa was therapeutic. The salon atmosphere feels like a luxury Mumbai or Bangalore atelier right here on Main Road."
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#F7F4EE] block">Dr. S. K. Murthy</span>
                  <span className="text-[#66615B] text-[11px]">Hair Spa & Grooming</span>
                </div>
                <span className="text-[11px] text-[#C5A880] font-mono">Verified Visit</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/30 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#C5A880]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                  ))}
                </div>
                <p className="font-serif text-base text-[#F7F4EE] italic leading-relaxed">
                  "Booking online with the instant reference code saved me so much time. Walked in and was seated immediately. Exceptional hospitality."
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#F7F4EE] block">P. Teja Varma</span>
                  <span className="text-[#66615B] text-[11px]">Executive Haircut</span>
                </div>
                <span className="text-[11px] text-[#C5A880] font-mono">Verified Visit</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL-TO-ACTION SECTION */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-center">
        
        {/* Cinematic Backdrop with Deep Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1800&q=80"
            alt="John Salon Craftsmanship"
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          
          <div className="w-14 h-14 rounded-full bg-[#141414] border border-[#C5A880]/40 flex items-center justify-center mx-auto text-[#C5A880] shadow-[0_0_20px_rgba(197,168,128,0.2)]">
            <Scissors className="w-6 h-6 text-[#C5A880]" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
              Bespoke Grooming Awaits
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#F7F4EE]">
              Ready to Define Your Signature?
            </h2>
            <p className="text-sm sm:text-base text-[#9E988F] max-w-xl mx-auto leading-relaxed">
              Your next look begins at John Salon. Reserve your priority arrival window or speak with our AI concierge.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleBookService()}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-[0_0_30px_rgba(197,168,128,0.3)] flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#0A0A0A]" />
              <span>Book an Appointment</span>
            </button>

            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#141414]/90 hover:bg-[#202020] text-[#F7F4EE] border border-white/[0.15] font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-4 h-4 text-[#C5A880]" />
            </a>
          </div>

        </div>
      </section>

      {/* Floating John Salon Concierge (RAG AI Chatbot) */}
      {salon && (
        <SalonChatbot
          salon={salon}
          onOpenBooking={() => setBookingOpen(true)}
        />
      )}

      {/* Luxury Multi-Step Appointment Booking Modal */}
      {salon && bookingOpen && (
        <AppointmentModal
          salon={salon}
          services={services}
          initialServiceId={selectedServiceId}
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      )}

    </div>
  );
}
