'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Calendar as CalendarIcon, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Sparkles, 
  Filter, 
  Save, 
  X, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Appointment } from '@/lib/types';

export default function AppointmentsManagementPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments?salon_id=john_salon_kkd');
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (e) {
      console.warn('Error fetching appointments', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, status: Appointment['status']) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => 
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
        if (selectedApt && selectedApt.id === id) {
          setSelectedApt({ ...selectedApt, status });
        }
      }
    } catch (e) {
      console.error('Error updating appointment status', e);
    }
  };

  const handleSaveInternalNotes = async () => {
    if (!selectedApt) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedApt.id, status: selectedApt.status, internal_notes: internalNotes })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => 
          prev.map((a) => (a.id === selectedApt.id ? { ...a, internal_notes: internalNotes } : a))
        );
        setSelectedApt({ ...selectedApt, internal_notes: internalNotes });
      }
    } catch (e) {
      console.error('Error saving notes', e);
    } finally {
      setSavingNotes(false);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch = 
      a.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      a.reference_code.toLowerCase().includes(search.toLowerCase()) ||
      (a.service_name && a.service_name.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Reservations Dispatch
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#F7F4EE]">
              Appointments Manager
            </h1>
            <p className="text-xs text-[#9E988F]">
              Confirm requests, coordinate stylist schedules, and inspect attached StyleScan consults.
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-white/[0.08] rounded-2xl w-full sm:w-auto overflow-x-auto scrollbar-none">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                  statusFilter === status
                    ? 'bg-[#C5A880] text-[#0A0A0A] shadow-sm'
                    : 'text-[#9E988F] hover:text-[#F7F4EE] hover:bg-white/[0.05]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9E988F] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by client or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#141414] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
            />
          </div>

        </div>

        {/* Appointments Table or Empty State */}
        {filtered.length === 0 ? (
          <div className="p-16 text-center bg-[#141414] rounded-3xl border border-white/[0.08] space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <CalendarIcon className="w-10 h-10 text-white/[0.2] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
              No Appointments Found
            </h3>
            <p className="text-xs text-[#9E988F] max-w-sm mx-auto">
              There are no reservations matching this filter. Newly booked appointments will display here automatically.
            </p>
          </div>
        ) : (
          <div className="bg-[#141414] rounded-3xl border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181818] border-b border-white/[0.08] text-[#C5A880] font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Ref / Client</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">StyleScan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filtered.map((apt) => (
                    <tr 
                      key={apt.id} 
                      onClick={() => {
                        setSelectedApt(apt);
                        setInternalNotes(apt.internal_notes || '');
                      }}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-[10px] font-bold bg-[#222222] px-1.5 py-0.5 rounded text-[#E5C590] border border-white/[0.06] block w-fit mb-0.5">
                          {apt.reference_code}
                        </span>
                        {apt.customer_id ? (
                          <Link
                            href={`/dashboard/crm/${apt.customer_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-semibold text-[#F7F4EE] hover:text-[#C5A880] transition-colors underline decoration-dotted underline-offset-4 block"
                            title="View Customer CRM Profile"
                          >
                            {apt.customer_name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-[#F7F4EE] block">{apt.customer_name}</span>
                        )}
                        <span className="text-[11px] text-[#9E988F] block">{apt.customer_phone}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#F7F4EE] block">{apt.service_name}</span>
                        <span className="font-serif text-[11px] text-[#C5A880]">₹{apt.service_price}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#F7F4EE]">{apt.preferred_date}</div>
                        <div className="text-[11px] text-[#9E988F]">{apt.preferred_time}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {apt.stylescan_reference ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-[#C5A880]/15 text-[#E5C590] border border-[#C5A880]/30 px-2 py-0.5 rounded-full font-semibold">
                            <Sparkles className="w-3 h-3 text-[#C5A880]" />
                            <span>{apt.stylescan_reference.hairstyle_name}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#66615B]">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : apt.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : apt.status === 'completed'
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            : 'bg-white/[0.06] text-[#9E988F] border border-white/[0.08]'
                        }`}>
                          {apt.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors shadow-xs"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] hover:brightness-110 text-[11px] font-semibold transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                            className="px-2 py-1 rounded-lg text-red-400 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 text-[11px] font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointment Details Modal */}
        {selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-[#141414] text-[#F7F4EE] rounded-3xl border border-white/[0.12] shadow-2xl p-6 space-y-5">
              
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="font-mono text-xs font-bold bg-[#222222] px-2 py-0.5 rounded text-[#E5C590] border border-white/[0.08]">
                    {selectedApt.reference_code}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE] mt-1.5">
                    Appointment Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedApt(null)}
                  className="p-1 rounded-full hover:bg-white/[0.08] text-[#9E988F] hover:text-[#F7F4EE] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#1A1A1A] border border-white/[0.06] rounded-2xl">
                  <div>
                    <span className="text-[#9E988F] block text-[10px] uppercase font-medium">Client</span>
                    <span className="font-bold text-[#F7F4EE]">{selectedApt.customer_name}</span>
                    <div className="text-[11px] text-[#9E988F] mt-1 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#C5A880]" />
                      <span>{selectedApt.customer_phone}</span>
                    </div>
                    {selectedApt.customer_email && (
                      <div className="text-[11px] text-[#9E988F] flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-[#C5A880]" />
                        <span>{selectedApt.customer_email}</span>
                      </div>
                    )}
                    {selectedApt.customer_id && (
                      <div className="pt-2">
                        <Link
                          href={`/dashboard/crm/${selectedApt.customer_id}`}
                          className="inline-flex items-center gap-1 text-[11px] text-[#C5A880] hover:text-[#E5C590] font-semibold"
                        >
                          <span>Open 360° CRM Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[#9E988F] block text-[10px] uppercase font-medium">Reservation</span>
                    <span className="font-bold text-[#F7F4EE]">{selectedApt.service_name}</span>
                    <div className="text-[11px] text-[#C5A880] font-serif font-bold mt-0.5">₹{selectedApt.service_price}</div>
                    <div className="text-[11px] text-[#9E988F] mt-1 flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3 text-[#C5A880]" />
                      <span>{selectedApt.preferred_date}</span>
                    </div>
                    <div className="text-[11px] text-[#9E988F] flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#C5A880]" />
                      <span>{selectedApt.preferred_time}</span>
                    </div>
                  </div>
                </div>

                {selectedApt.stylescan_reference && (
                  <div className="p-3.5 bg-[#1A1A1A] rounded-2xl border border-[#C5A880]/30 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#E5C590] text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>StyleScan Consultation: {selectedApt.stylescan_reference.hairstyle_name}</span>
                    </div>
                    <p className="text-[#9E988F] text-[11px]">
                      {selectedApt.stylescan_reference.analysis_summary}
                    </p>
                  </div>
                )}

                {selectedApt.notes && (
                  <div>
                    <span className="font-semibold text-[#F7F4EE] block mb-1">Customer Notes</span>
                    <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/[0.08] text-[#BEB8AE]">
                      {selectedApt.notes}
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-[#F7F4EE] block mb-1">Internal Stylist Notes</label>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add formula details, preferred barber, or styling preferences..."
                    className="w-full p-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                  />
                  <div className="flex justify-end mt-1.5">
                    <button
                      onClick={handleSaveInternalNotes}
                      disabled={savingNotes}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#222222] border border-white/[0.08] text-[#E5C590] font-semibold hover:bg-[#2A2A2A] text-[11px] transition-colors"
                    >
                      <Save className="w-3 h-3 text-[#C5A880]" />
                      <span>{savingNotes ? 'Saving...' : 'Save Stylist Notes'}</span>
                    </button>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="pt-3 border-t border-white/[0.08] flex flex-wrap justify-between items-center gap-2">
                  <div className="flex gap-2">
                    {selectedApt.status !== 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedApt.id, 'confirmed')}
                        className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                      >
                        Set Confirmed
                      </button>
                    )}
                    {selectedApt.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedApt.id, 'completed')}
                        className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] hover:brightness-110 font-semibold text-xs transition-all"
                      >
                        Mark Completed
                      </button>
                    )}
                    {selectedApt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedApt.id, 'cancelled')}
                        className="px-3.5 py-1.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 font-semibold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedApt(null)}
                    className="px-4 py-1.5 rounded-full border border-white/[0.1] text-[#9E988F] hover:text-[#F7F4EE] hover:bg-white/[0.05] transition-colors"
                  >
                    Close
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
