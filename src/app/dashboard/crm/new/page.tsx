'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  ArrowLeft,
  UserPlus,
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Tag,
  Coffee,
  Scissors,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CustomerGender, CustomerStatus } from '@/lib/types';

export default function NewCustomerPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<CustomerGender>('prefer_not_to_say');
  const [birthday, setBirthday] = useState('');
  const [anniversary, setAnniversary] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('new');

  // Tags
  const [tags, setTags] = useState<string[]>(['Direct Walk-in']);
  const [tagInput, setTagInput] = useState('');

  // Preferences
  const [preferredStylist, setPreferredStylist] = useState('John V.');
  const [beverage, setBeverage] = useState('South Indian Filter Coffee');
  const [formulaNotes, setFormulaNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Marketing
  const [acceptsSms, setAcceptsSms] = useState(true);
  const [acceptsEmail, setAcceptsEmail] = useState(true);
  const [acceptsWhatsapp, setAcceptsWhatsapp] = useState(true);

  const quickTags = [
    'VIP Lounge',
    'Executive Fade',
    'Hair Spa Regular',
    'Color & Balayage',
    'Beard Sculpting',
    'Facial Glow',
    'Direct Walk-in'
  ];

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim()) {
      setErrorMessage('First name is required.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Phone number is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        salon_id: 'john_salon_kkd',
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        gender,
        birthday: birthday || undefined,
        anniversary: anniversary || undefined,
        status,
        tags,
        preferences: {
          preferred_stylist_name: preferredStylist,
          beverage_preference: beverage,
          formula_notes: formulaNotes.trim() || undefined
        },
        marketing: {
          accepts_sms: acceptsSms,
          accepts_email: acceptsEmail,
          accepts_whatsapp: acceptsWhatsapp
        },
        internal_notes: internalNotes.trim() || undefined
      };

      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.existing_customer) {
          setErrorMessage(
            `A client with phone ${phone} already exists (${data.existing_customer.full_name}).`
          );
        } else {
          setErrorMessage(data.error || 'Failed to create client profile.');
        }
        setSubmitting(false);
        return;
      }

      // Success -> navigate to new customer profile
      router.push(`/dashboard/crm/${data.customer.id}`);
    } catch (err: any) {
      console.error('Error adding client:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/crm"
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#9E988F] hover:text-[#F7F4EE] border border-white/[0.08] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#F7F4EE]">
              Create New Client Profile
            </h1>
            <p className="text-xs text-[#9E988F]">
              Register client contact details, salon preferences, technical formula notes & marketing permissions.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <User className="w-4 h-4 text-[#C5A880]" />
              <h2 className="text-sm font-semibold text-[#F7F4EE] uppercase tracking-wider">
                Basic Client Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  First Name <span className="text-[#C5A880]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Ramesh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Phone Number <span className="text-[#C5A880]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#9E988F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#9E988F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="new">New Client</option>
                  <option value="active">Active</option>
                  <option value="returning">Returning</option>
                  <option value="loyal">Loyal</option>
                  <option value="vip">VIP Elite</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Birthday (for birthday privileges)
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Anniversary
                </label>
                <input
                  type="date"
                  value={anniversary}
                  onChange={(e) => setAnniversary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Salon Preferences & Formula Notes */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <Scissors className="w-4 h-4 text-[#C5A880]" />
              <h2 className="text-sm font-semibold text-[#F7F4EE] uppercase tracking-wider">
                Grooming & Salon Preferences
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Preferred Stylist / Esthetician
                </label>
                <select
                  value={preferredStylist}
                  onChange={(e) => setPreferredStylist(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="John V.">John V. (Master Barber & Director)</option>
                  <option value="Senior Esthetician Lakshmi">Senior Esthetician Lakshmi</option>
                  <option value="Stylist Kiran">Stylist Kiran</option>
                  <option value="No Stylist Preference">No Stylist Preference</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                  Beverage Welcome Preference
                </label>
                <div className="relative">
                  <Coffee className="w-3.5 h-3.5 text-[#9E988F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={beverage}
                    onChange={(e) => setBeverage(e.target.value)}
                    placeholder="e.g. Green Tea, Espresso, Filter Coffee"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>
            </div>

            {/* Formula / Technique Notes */}
            <div>
              <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                Technical Formula / Scissor Guard / Allergy Notes
              </label>
              <textarea
                rows={3}
                value={formulaNotes}
                onChange={(e) => setFormulaNotes(e.target.value)}
                placeholder="e.g. Scissor taper on sides, #2 clipper guard on neckline, sensitive scalp, likes argan oil post-shave..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] placeholder:text-[#9E988F]/60 focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            {/* Tags Management */}
            <div>
              <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                Client Tags & Segments
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-white font-bold ml-1 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  placeholder="Type tag and press Enter..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-[#F7F4EE]"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-[#9E988F]">Suggested:</span>
                {quickTags.map((qt) => (
                  <button
                    key={qt}
                    type="button"
                    onClick={() => handleAddTag(qt)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-[#9E988F] hover:text-[#F7F4EE] border border-white/[0.06]"
                  >
                    + {qt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Internal Private Notes & Marketing */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <h2 className="text-sm font-semibold text-[#F7F4EE] uppercase tracking-wider">
                Internal Notes & Marketing Consent
              </h2>
            </div>

            <div>
              <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                Internal Private Staff Note
              </label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Confidential notes for staff eyes only (e.g. VIP client, prefers private lounge room)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="pt-2">
              <label className="text-xs font-medium text-[#9E988F] block mb-2">
                Notification & Marketing Permissions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#1C1C1C] border border-white/[0.06] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptsWhatsapp}
                    onChange={(e) => setAcceptsWhatsapp(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A880] focus:ring-0"
                  />
                  <span className="text-xs text-[#F7F4EE]">WhatsApp Updates</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#1C1C1C] border border-white/[0.06] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptsSms}
                    onChange={(e) => setAcceptsSms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A880] focus:ring-0"
                  />
                  <span className="text-xs text-[#F7F4EE]">SMS Reminders</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#1C1C1C] border border-white/[0.06] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptsEmail}
                    onChange={(e) => setAcceptsEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A880] focus:ring-0"
                  />
                  <span className="text-xs text-[#F7F4EE]">Email Newsletter</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/dashboard/crm"
              className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-[#F7F4EE] border border-white/[0.08]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B39366] text-xs font-bold text-[#0A0A0A] shadow-[0_0_20px_rgba(197,168,128,0.3)] transition-all disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Creating Profile...' : 'Save Client Profile'}</span>
            </button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}
