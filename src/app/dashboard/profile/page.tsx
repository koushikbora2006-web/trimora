'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Store, Save, CheckCircle2, AlertCircle, Clock, MapPin, Phone, Instagram, Loader2 } from 'lucide-react';
import { Salon, SalonOpeningHours } from '@/lib/types';

export default function SalonProfileEditPage() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/salons/john_salon_kkd')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSalon(data.salon);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/salons/${salon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salon)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Salon profile updated successfully!');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const updateOpeningHour = (day: keyof SalonOpeningHours, field: 'open' | 'close' | 'closed', value: any) => {
    if (!salon) return;
    setSalon({
      ...salon,
      opening_hours: {
        ...salon.opening_hours,
        [day]: {
          ...salon.opening_hours[day],
          [field]: value
        }
      }
    });
  };

  if (loading || !salon) {
    return (
      <DashboardLayout>
        <div className="p-16 text-center text-xs text-[#9E988F]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C5A880] mb-2" />
          <span>Loading salon profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  const days: (keyof SalonOpeningHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <DashboardLayout>
      <form onSubmit={handleSave} className="space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Branding & Information
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#F7F4EE]">
              Salon Profile Settings
            </h1>
            <p className="text-xs text-[#9E988F]">
              Update your public presence, location, contact lines, and business hours.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0A0A0A]" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#0A0A0A]" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>

        {message && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* General Details */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#F7F4EE] border-b border-white/[0.08] pb-3">
            Salon Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                Salon Name *
              </label>
              <input
                type="text"
                value={salon.name}
                onChange={(e) => setSalon({ ...salon, name: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={salon.tagline || ''}
                onChange={(e) => setSalon({ ...salon, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
              About / Description
            </label>
            <textarea
              rows={3}
              value={salon.description}
              onChange={(e) => setSalon({ ...salon, description: e.target.value })}
              className="w-full p-3 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                Cover Banner URL
              </label>
              <input
                type="url"
                value={salon.cover_image_url}
                onChange={(e) => setSalon({ ...salon, cover_image_url: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                Logo / Avatar URL
              </label>
              <input
                type="url"
                value={salon.logo_url}
                onChange={(e) => setSalon({ ...salon, logo_url: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
              />
            </div>
          </div>
        </div>

        {/* Location & Social */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#F7F4EE] border-b border-white/[0.08] pb-3">
            Location & Contact Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={salon.address}
                onChange={(e) => setSalon({ ...salon, address: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={salon.city}
                onChange={(e) => setSalon({ ...salon, city: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={salon.contact_phone}
                onChange={(e) => setSalon({ ...salon, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={salon.instagram_url || ''}
                onChange={(e) => setSalon({ ...salon, instagram_url: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#F7F4EE] border-b border-white/[0.08] pb-3">
            Opening Hours Schedule
          </h3>

          <div className="space-y-2.5">
            {days.map((day) => {
              const schedule = salon.opening_hours?.[day] || { open: '09:00', close: '18:00', closed: false };
              return (
                <div
                  key={day}
                  className="p-3 rounded-2xl bg-[#1A1A1A] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <span className="font-semibold text-[#F7F4EE] capitalize w-28">
                    {day}
                  </span>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.closed || false}
                        onChange={(e) => updateOpeningHour(day, 'closed', e.target.checked)}
                        className="rounded accent-[#C5A880]"
                      />
                      <span className="text-[#9E988F] text-[11px]">Closed</span>
                    </label>

                    {!schedule.closed && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={schedule.open}
                          onChange={(e) => updateOpeningHour(day, 'open', e.target.value)}
                          className="px-2.5 py-1 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-lg text-xs focus:border-[#C5A880]"
                        />
                        <span className="text-[#9E988F]">to</span>
                        <input
                          type="time"
                          value={schedule.close}
                          onChange={(e) => updateOpeningHour(day, 'close', e.target.value)}
                          className="px-2.5 py-1 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-lg text-xs focus:border-[#C5A880]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </form>
    </DashboardLayout>
  );
}
