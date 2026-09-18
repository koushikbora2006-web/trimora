'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Instagram, 
  Clock, 
  Star, 
  Calendar, 
  Scissors, 
  Tag, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Salon, Service, Offer, SalonReview } from '@/lib/types';
import SalonChatbot from '@/components/chatbot/SalonChatbot';
import AppointmentModal from '@/components/booking/AppointmentModal';

export default function SalonProfilePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<SalonReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active tab in profile
  const [activeTab, setActiveTab] = useState<'services' | 'offers' | 'reviews'>('services');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Booking modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/salons/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSalon(data.salon);
          setServices(data.services || []);
          setOffers(data.offers || []);
          setReviews(data.reviews || []);
        } else {
          setError(data.error || 'Salon not found');
        }
      })
      .catch((err) => {
        setError('Failed to load salon details');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#F7F4EE]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#9E988F] uppercase tracking-[0.2em]">Loading atelier profile...</p>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A] text-[#F7F4EE]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#141414] border border-white/[0.08] text-center space-y-4 shadow-2xl">
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">Salon Not Found</h2>
          <p className="text-xs text-[#9E988F]">
            The salon profile you requested does not exist or has been relocated.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110"
          >
            Return to John Salon Home
          </Link>
        </div>
      </div>
    );
  }

  // Group service categories
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen pb-24 bg-[#0A0A0A] text-[#F7F4EE]">
      
      {/* Cover Image & Hero Banner */}
      <div className="relative w-full h-80 sm:h-[420px] bg-black overflow-hidden">
        <img
          src={salon.cover_image_url}
          alt={salon.name}
          className="w-full h-full object-cover opacity-60 brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-black/40" />
      </div>

      {/* Profile Header Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#141414]/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            
            <div className="flex items-start gap-5">
              {/* Logo Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#C5A880]/40 bg-[#1A1A1A] shadow-xl shrink-0">
                <img
                  src={salon.logo_url}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Bio */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F4EE]">
                    {salon.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/40 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold uppercase">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified Flagship</span>
                  </span>
                </div>

                {salon.tagline && (
                  <p className="text-xs font-medium text-[#C5A880] italic">
                    {salon.tagline}
                  </p>
                )}

                <p className="text-xs text-[#9E988F] max-w-2xl leading-relaxed">
                  {salon.description}
                </p>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex sm:flex-col items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setPreselectedServiceId(services[0]?.id);
                  setBookingOpen(true);
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,168,128,0.25)] flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#0A0A0A]" />
                <span>Book Priority Slot</span>
              </button>

              <Link
                href="/stylescan"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#1F1F1F] text-[#E5C590] text-xs font-semibold hover:bg-[#252525] border border-[#C5A880]/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>StyleScan Face AI</span>
              </Link>
            </div>

          </div>

          {/* Quick Info Strip */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#9E988F]">
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F7F4EE] block">{salon.address}</span>
                <span className="text-[11px] text-[#66615B]">{salon.city}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F7F4EE] block">{salon.contact_phone}</span>
                <span className="text-[11px] text-[#66615B]">{salon.contact_email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F7F4EE] block">Mon – Sun: 09:00 AM – 09:00 PM</span>
                <span className="text-[11px] text-[#66615B]">Valet assistance available</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tab Navigation */}
        <div className="mt-10 flex items-center gap-3 border-b border-white/[0.08] pb-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'services', label: 'Services & Rates', icon: Scissors, count: services.length },
            { id: 'offers', label: 'Exclusive Offers', icon: Tag, count: offers.length },
            { id: 'reviews', label: 'Guest Reviews', icon: Star, count: reviews.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#C5A880] text-[#0A0A0A] shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                    : 'text-[#9E988F] hover:text-[#F7F4EE] hover:bg-[#151515]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.2 rounded-full ${
                  isActive ? 'bg-black/20 text-[#0A0A0A]' : 'bg-[#1E1E1E] text-[#9E988F]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Services Menu */}
        {activeTab === 'services' && (
          <div className="mt-8 space-y-6">
            
            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-[#C5A880] text-[#0A0A0A] font-semibold'
                        : 'bg-[#141414] border border-white/[0.08] text-[#9E988F] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] rounded-3xl border border-white/[0.08] space-y-3">
                <Scissors className="w-8 h-8 text-[#C5A880] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  No Services Listed in this Category
                </h3>
                <p className="text-xs text-[#9E988F] max-w-sm mx-auto">
                  Check our full menu or ask the John Salon Concierge for personalized inquiries.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C5A880]">
                            {service.category}
                          </span>
                          <h4 className="font-serif text-lg font-bold text-[#F7F4EE] group-hover:text-[#E5C590] transition-colors">
                            {service.name}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-xl font-bold text-[#E5C590]">
                            ₹{service.price}
                          </span>
                          <span className="block text-[10px] text-[#66615B]">
                            {service.duration_minutes} mins
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#9E988F] leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex justify-end">
                      <button
                        onClick={() => {
                          setPreselectedServiceId(service.id);
                          setBookingOpen(true);
                        }}
                        className="px-5 py-2 rounded-full bg-[#1E1E1E] hover:bg-[#C5A880] text-[#F7F4EE] hover:text-[#0A0A0A] text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Reserve Service</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: Offers */}
        {activeTab === 'offers' && (
          <div className="mt-8 space-y-4">
            {offers.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] rounded-3xl border border-white/[0.08] space-y-3">
                <Tag className="w-8 h-8 text-[#C5A880] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  No Active Offers Right Now
                </h3>
                <p className="text-xs text-[#9E988F] max-w-sm mx-auto">
                  Check back for seasonal promotions or ask our AI concierge.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-6 rounded-3xl bg-[#141414] border border-[#C5A880]/30 shadow-xl space-y-3"
                  >
                    <div className="inline-block text-[10px] font-bold px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#E5C590] uppercase tracking-wider border border-[#C5A880]/40">
                      {offer.discount_type === 'percentage' ? `${offer.discount_value}% Discount` : `₹${offer.discount_value} Off`}
                    </div>
                    <h4 className="font-serif text-xl font-bold text-[#F7F4EE]">
                      {offer.title}
                    </h4>
                    <p className="text-xs text-[#9E988F] leading-relaxed">
                      {offer.description}
                    </p>
                    {offer.promo_code && (
                      <div className="p-3 rounded-xl bg-[#1A1A1A] border border-white/[0.08] text-xs flex justify-between items-center">
                        <span className="text-[#9E988F]">Promo Code:</span>
                        <span className="font-mono font-bold text-[#E5C590] bg-black px-2.5 py-0.5 rounded border border-[#C5A880]/40">
                          {offer.promo_code}
                        </span>
                      </div>
                    )}
                    <div className="text-[10px] text-[#66615B]">
                      Valid through: {offer.valid_until}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="mt-8 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] rounded-3xl border border-white/[0.08] space-y-3">
                <Star className="w-8 h-8 text-[#C5A880] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  No Client Reviews Yet
                </h3>
                <p className="text-xs text-[#9E988F] max-w-sm mx-auto">
                  Be the first guest to share your transformation experience!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[#C5A880]">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#C5A880]" />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#66615B]">{rev.date}</span>
                      </div>
                      <p className="text-xs text-[#BEB8AE] italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/[0.06] text-xs font-semibold text-[#F7F4EE]">
                      — {rev.author_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Floating Salon AI Concierge Grounded in This Salon's Data */}
      <SalonChatbot
        salon={salon}
        onOpenBooking={() => setBookingOpen(true)}
      />

      {/* Multi-step Appointment Booking Modal */}
      <AppointmentModal
        salon={salon}
        services={services}
        initialServiceId={preselectedServiceId}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

    </div>
  );
}
