'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Scissors, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  X, 
  Search, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Loader2
} from 'lucide-react';
import { Service } from '@/lib/types';

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Haircut');
  const [price, setPrice] = useState<number | string>(85);
  const [duration, setDuration] = useState<number | string>(45);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?salon_id=john_salon_kkd');
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (e) {
      console.warn('Error fetching services', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setCategory('Haircut');
    setPrice(75);
    setDuration(45);
    setDescription('');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setPrice(s.price);
    setDuration(s.duration_minutes);
    setDescription(s.description);
    setIsActive(s.is_active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingService) {
        // Update
        const res = await fetch('/api/services', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingService.id,
            name,
            category,
            price: Number(price),
            duration_minutes: Number(duration),
            description,
            is_active: isActive
          })
        });
        const data = await res.json();
        if (data.success) {
          setServices((prev) => prev.map((s) => (s.id === editingService.id ? data.service : s)));
          setModalOpen(false);
        }
      } else {
        // Create
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            salon_id: 'john_salon_kkd',
            name,
            category,
            price: Number(price),
            duration_minutes: Number(duration),
            description,
            is_active: isActive
          })
        });
        const data = await res.json();
        if (data.success) {
          setServices((prev) => [...prev, data.service]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Error saving service', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this service?')) return;

    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Error deleting service', err);
    }
  };

  const handleToggleActive = async (s: Service) => {
    try {
      const newStatus = !s.is_active;
      const res = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: s.id, is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.map((item) => (item.id === s.id ? { ...item, is_active: newStatus } : item)));
      }
    } catch (err) {
      console.error('Error toggling status', err);
    }
  };

  const filtered = services.filter((s) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-salon-darkgold">
              Service Menu
            </span>
            <h1 className="font-serif text-3xl font-bold text-salon-charcoal">
              Services & Pricing Catalog
            </h1>
            <p className="text-xs text-salon-muted">
              Manage your treatment menu, pricing, durations, and active status.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-salon-bronze" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Search & Counter Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-salon-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search services or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
            />
          </div>

          <span className="text-xs text-salon-muted self-end sm:self-center">
            Showing {filtered.length} of {services.length} services
          </span>
        </div>

        {/* Services Table or Empty State */}
        {filtered.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-salon-sand space-y-4 shadow-sm">
            <Scissors className="w-10 h-10 text-salon-taupe mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-salon-charcoal">
                Add Your First Service
              </h3>
              <p className="text-xs text-salon-muted max-w-sm mx-auto">
                Your menu is currently empty. Add your haircuts, coloring treatments, and styling rituals to showcase on your public page and AI assistant.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-salon-bronze" />
              <span>Create Service</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-salon-sand shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-salon-cream border-b border-salon-sand text-salon-charcoal font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Service Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-salon-sand/50">
                  {filtered.map((service) => (
                    <tr key={service.id} className="hover:bg-salon-ivory/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-salon-charcoal">{service.name}</div>
                        <div className="text-[11px] text-salon-muted line-clamp-1">{service.description}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-salon-sand/60 text-salon-charcoal px-2 py-0.5 rounded-full text-[10px] font-medium">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-salon-charcoal text-sm">
                        ₹{service.price}
                      </td>
                      <td className="py-3.5 px-4 text-salon-muted">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-salon-bronze" />
                          <span>{service.duration_minutes} mins</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(service)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            service.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {service.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-1 text-salon-muted hover:text-salon-charcoal rounded-lg hover:bg-salon-sand transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-1 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-salon-sand shadow-2xl p-6 space-y-5">
              
              <div className="flex justify-between items-center pb-3 border-b border-salon-sand">
                <h3 className="font-serif text-lg font-bold text-salon-charcoal">
                  {editingService ? 'Edit Service' : 'Add New Service'}
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
                  <label className="font-semibold text-salon-charcoal block mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Signature Scissor Haircut"
                    className="w-full px-3.5 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-salon-charcoal block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                    >
                      <option value="Haircut">Haircut</option>
                      <option value="Coloring">Coloring</option>
                      <option value="Styling">Styling</option>
                      <option value="Hair Spa">Hair Spa</option>
                      <option value="Beard & Grooming">Beard & Grooming</option>
                      <option value="Treatment">Treatment</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-salon-charcoal block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min={0}
                      className="w-full px-3.5 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-salon-charcoal block mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min={5}
                      step={5}
                      className="w-full px-3.5 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="rounded text-salon-charcoal accent-salon-charcoal"
                      />
                      <span className="font-semibold text-salon-charcoal">Visible & Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-salon-charcoal block mb-1">Service Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what is included, wash ritual, styling finish..."
                    className="w-full p-3 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-salon-sand">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-salon-sand text-salon-muted hover:bg-salon-cream transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-full bg-salon-charcoal text-white font-semibold hover:bg-black transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
