'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tag, Plus, Trash2, Edit3, X, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
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
            <span className="text-xs font-semibold uppercase tracking-wider text-salon-darkgold">
              Growth & Incentives
            </span>
            <h1 className="font-serif text-3xl font-bold text-salon-charcoal">
              Offers & Promotions
            </h1>
            <p className="text-xs text-salon-muted">
              Create seasonal packages, new-client privileges, and promo codes.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-salon-bronze" />
            <span>Create Offer</span>
          </button>
        </div>

        {/* Offers Grid or Empty State */}
        {offers.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-salon-sand space-y-4 shadow-sm">
            <Tag className="w-10 h-10 text-salon-taupe mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-salon-charcoal">
                No Offers Created Yet
              </h3>
              <p className="text-xs text-salon-muted max-w-sm mx-auto">
                Incentivize new guests by offering first-time booking discounts, complimentary hair masks, or seasonal packages.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-salon-bronze" />
              <span>Create First Promotion</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="p-6 rounded-3xl bg-white border border-salon-sand hover:border-salon-bronze/40 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-salon-sand text-salon-charcoal uppercase">
                      {offer.discount_type === 'percentage' ? `${offer.discount_value}% Discount` : `₹${offer.discount_value} Off`}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      offer.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {offer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-salon-charcoal">
                    {offer.title}
                  </h4>
                  <p className="text-xs text-salon-muted leading-relaxed">
                    {offer.description}
                  </p>

                  {offer.promo_code && (
                    <div className="p-2 rounded-xl bg-salon-cream text-xs flex justify-between items-center text-[11px]">
                      <span className="text-salon-muted">Promo Code:</span>
                      <span className="font-mono font-bold text-salon-charcoal">{offer.promo_code}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-salon-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-salon-bronze" />
                    <span>Expires {offer.valid_until}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-salon-sand/50 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(offer)}
                    className="p-1.5 text-salon-muted hover:text-salon-charcoal rounded-lg hover:bg-salon-sand transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-salon-sand shadow-2xl p-6 space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-salon-sand">
                <h3 className="font-serif text-lg font-bold text-salon-charcoal">
                  {editingOffer ? 'Edit Promotion' : 'Create New Promotion'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full hover:bg-salon-sand text-salon-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-salon-charcoal block mb-1">Offer Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. 20% First Visit Privilege"
                    className="w-full px-3.5 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-salon-charcoal block mb-1">Discount Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-salon-charcoal block mb-1">Discount Value *</label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      required
                      min={1}
                      className="w-full px-3.5 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-salon-charcoal block mb-1">Promo Code (Optional)</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="e.g. TRIMORA20"
                      className="w-full px-3.5 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-salon-charcoal block mb-1">Expiration Date</label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full px-3 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-salon-charcoal block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Offer conditions or eligible treatments..."
                    className="w-full p-3 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-salon-charcoal accent-salon-charcoal"
                    />
                    <span className="font-semibold text-salon-charcoal">Activate Offer Immediately</span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-full border border-salon-sand text-salon-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-full bg-salon-charcoal text-white font-semibold hover:bg-black"
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
