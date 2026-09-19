'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  X,
  Users,
  ExternalLink
} from 'lucide-react';
import { Offer } from '@/lib/types';

export default function OffersManagementPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number | string>(20);
  const [promoCode, setPromoCode] = useState('');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers?salon_id=john_salon_kkd');
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers || []);
      }
    } catch (e) {
      console.warn('Error fetching offers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openAddModal = () => {
    setEditingOffer(null);
    setTitle('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(20);
    setPromoCode('SPRING20');
    setValidUntil('2026-12-31');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setTitle(offer.title);
    setDescription(offer.description);
    setDiscountType(offer.discount_type);
    setDiscountValue(offer.discount_value);
    setPromoCode(offer.promo_code || '');
    setValidUntil(offer.valid_until);
    setIsActive(offer.is_active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingOffer) {
        const res = await fetch('/api/offers', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingOffer.id,
            title,
            description,
            discount_type: discountType,
            discount_value: Number(discountValue),
            promo_code: promoCode,
            valid_until: validUntil,
            is_active: isActive
          })
        });
        const data = await res.json();
        if (data.success) {
          setOffers((prev) => prev.map((o) => (o.id === editingOffer.id ? data.offer : o)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch('/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            salon_id: 'john_salon_kkd',
            title,
            description,
            discount_type: discountType,
            discount_value: Number(discountValue),
            promo_code: promoCode,
            valid_until: validUntil,
            is_active: isActive
          })
        });
        const data = await res.json();
        if (data.success) {
          setOffers((prev) => [...prev, data.offer]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Error saving offer', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const res = await fetch(`/api/offers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOffers((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      console.error('Error deleting offer', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Growth & Incentives
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#F7F4EE]">
              Offers & Promotions
            </h1>
            <p className="text-xs text-[#9E988F]">
              Create seasonal packages, new-client privileges, and promo codes.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)]"
          >
            <Plus className="w-3.5 h-3.5 text-[#0A0A0A]" />
            <span>Create Offer</span>
          </button>
        </div>

        {/* Offers Grid or Empty State */}
        {offers.length === 0 ? (
          <div className="p-16 text-center bg-[#141414] rounded-3xl border border-white/[0.08] space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <Tag className="w-10 h-10 text-white/[0.2] mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                No Offers Created Yet
              </h3>
              <p className="text-xs text-[#9E988F] max-w-sm mx-auto">
                Incentivize new guests by offering first-time booking discounts, complimentary hair masks, or seasonal packages.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)]"
            >
              <Plus className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>Create First Promotion</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C5A880]/15 text-[#E5C590] border border-[#C5A880]/30 uppercase">
                      {offer.discount_type === 'percentage' ? `${offer.discount_value}% Discount` : `₹${offer.discount_value} Off`}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      offer.is_active 
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-white/[0.06] text-[#9E988F] border border-white/[0.08]'
                    }`}>
                      {offer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[#F7F4EE]">
                    {offer.title}
                  </h4>
                  <p className="text-xs text-[#9E988F] leading-relaxed">
                    {offer.description}
                  </p>

                  {offer.promo_code && (
                    <div className="p-2.5 rounded-xl bg-[#1A1A1A] border border-white/[0.06] text-xs flex justify-between items-center text-[11px]">
                      <span className="text-[#9E988F]">Promo Code:</span>
                      <span className="font-mono font-bold text-[#E5C590] tracking-wider">{offer.promo_code}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-[#9E988F] flex items-center gap-1.5 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Expires {offer.valid_until}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  <Link
                    href="/dashboard/crm"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#C5A880] hover:text-[#E5C590] transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Target Clients in CRM</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(offer)}
                      className="p-1.5 text-[#9E988F] hover:text-[#C5A880] rounded-lg hover:bg-white/[0.06] transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/15 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-[#141414] text-[#F7F4EE] rounded-3xl border border-white/[0.12] shadow-2xl p-6 space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  {editingOffer ? 'Edit Promotion' : 'Create New Promotion'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full hover:bg-white/[0.08] text-[#9E988F] hover:text-[#F7F4EE] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#F7F4EE] block mb-1">Offer Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. 20% First Visit Privilege"
                    className="w-full px-3.5 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#F7F4EE] block mb-1">Discount Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="percentage" className="bg-[#141414] text-[#F7F4EE]">Percentage (%)</option>
                      <option value="fixed" className="bg-[#141414] text-[#F7F4EE]">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-[#F7F4EE] block mb-1">Discount Value *</label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      required
                      min={1}
                      className="w-full px-3.5 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#F7F4EE] block mb-1">Promo Code (Optional)</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="e.g. TRIMORVA20"
                      className="w-full px-3.5 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] font-mono uppercase placeholder:text-[#66615B]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#F7F4EE] block mb-1">Expiration Date</label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#F7F4EE] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Offer conditions or eligible treatments..."
                    className="w-full p-3 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded accent-[#C5A880]"
                    />
                    <span className="font-semibold text-[#F7F4EE]">Activate Offer Immediately</span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-full border border-white/[0.1] text-[#9E988F] hover:text-[#F7F4EE] hover:bg-white/[0.05] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] font-semibold hover:brightness-110 transition-colors shadow-sm"
                    >
                      {saving ? 'Saving...' : 'Save Offer'}
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
