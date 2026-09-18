'use client';

import React, { useState, useEffect } from 'react';
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
  Loader2
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
            <span className="text-xs font-semibold uppercase tracking-wider text-salon-darkgold">
              Reservations Dispatch
            </span>
            <h1 className="font-serif text-3xl font-bold text-salon-charcoal">
              Appointments Manager
            </h1>
            <p className="text-xs text-salon-muted">
              Confirm requests, coordinate stylist schedules, and inspect attached StyleScan consults.
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-salon-sand rounded-2xl w-full sm:w-auto overflow-x-auto scrollbar-none">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                  statusFilter === status
                    ? 'bg-salon-charcoal text-white shadow-2xs'
                    : 'text-salon-muted hover:text-salon-charcoal'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-salon-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by client or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
            />
          </div>

        </div>

        {/* Appointments Table or Empty State */}
        {filtered.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-salon-sand space-y-3 shadow-sm">
            <CalendarIcon className="w-10 h-10 text-salon-taupe mx-auto" />
            <h3 className="font-serif text-lg font-bold text-salon-charcoal">
              No Appointments Found
            </h3>
            <p className="text-xs text-salon-muted max-w-sm mx-auto">
              There are no reservations matching this filter. Newly booked appointments will display here automatically.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-salon-sand shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-salon-cream border-b border-salon-sand text-salon-charcoal font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Ref / Client</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">StyleScan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-salon-sand/50">
                  {filtered.map((apt) => (
                    <tr 
                      key={apt.id} 
                      onClick={() => {
                        setSelectedApt(apt);
                        setInternalNotes(apt.internal_notes || '');
                      }}
                      className="hover:bg-salon-ivory/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-[10px] font-bold bg-salon-sand/60 px-1.5 py-0.5 rounded text-salon-charcoal block w-fit mb-0.5">
                          {apt.reference_code}
                        </span>
                        <span className="font-semibold text-salon-charcoal block">{apt.customer_name}</span>
                        <span className="text-[11px] text-salon-muted block">{apt.customer_phone}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-salon-charcoal block">{apt.service_name}</span>
                        <span className="font-serif text-[11px] text-salon-darkgold">₹{apt.service_price}</span>
                      </td>

                      <td className="py-3.5 px-4 text-salon-charcoal">
                        <div className="font-semibold">{apt.preferred_date}</div>
                        <div className="text-[11px] text-salon-muted">{apt.preferred_time}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {apt.stylescan_reference ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-salon-cream text-salon-darkgold border border-salon-bronze/30 px-2 py-0.5 rounded-full font-semibold">
                            <Sparkles className="w-3 h-3 text-salon-darkgold" />
                            <span>{apt.stylescan_reference.hairstyle_name}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-salon-muted">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apt.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : apt.status === 'completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {apt.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-salon-charcoal hover:bg-black text-white text-[11px] font-semibold transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                            className="px-2 py-1 rounded-lg text-red-500 hover:bg-red-50 text-[11px] font-medium transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-salon-sand shadow-2xl p-6 space-y-5">
              
              <div className="flex justify-between items-center pb-3 border-b border-salon-sand">
                <div>
                  <span className="font-mono text-xs font-bold bg-salon-sand/70 px-2 py-0.5 rounded text-salon-charcoal">
                    {selectedApt.reference_code}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-salon-charcoal mt-1">
                    Appointment Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedApt(null)}
                  className="p-1 rounded-full hover:bg-salon-sand text-salon-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                
                <div className="grid grid-cols-2 gap-3 p-3 bg-salon-ivory rounded-2xl">
                  <div>
                    <span className="text-salon-muted block text-[10px]">Client</span>
                    <span className="font-bold text-salon-charcoal">{selectedApt.customer_name}</span>
                    <div className="text-[11px] text-salon-muted mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{selectedApt.customer_phone}</span>
                    </div>
                    {selectedApt.customer_email && (
                      <div className="text-[11px] text-salon-muted flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{selectedApt.customer_email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-salon-muted block text-[10px]">Reservation</span>
                    <span className="font-bold text-salon-charcoal">{selectedApt.service_name} (₹{selectedApt.service_price})</span>
                    <div className="text-[11px] text-salon-muted mt-0.5 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{selectedApt.preferred_date}</span>
                    </div>
                    <div className="text-[11px] text-salon-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{selectedApt.preferred_time}</span>
                    </div>
                  </div>
                </div>

                {selectedApt.stylescan_reference && (
                  <div className="p-3 bg-salon-cream rounded-2xl border border-salon-bronze/30 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-salon-charcoal text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-salon-darkgold" />
                      <span>StyleScan Consultation Request: {selectedApt.stylescan_reference.hairstyle_name}</span>
                    </div>
                    <p className="text-salon-muted text-[11px]">
                      {selectedApt.stylescan_reference.analysis_summary}
                    </p>
                  </div>
                )}

                {selectedApt.notes && (
                  <div>
                    <span className="font-semibold text-salon-charcoal block mb-1">Customer Notes</span>
                    <div className="p-3 bg-salon-ivory rounded-xl border border-salon-sand text-salon-charcoal">
                      {selectedApt.notes}
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-salon-charcoal block mb-1">Internal Stylist Notes</label>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add formula details, preferred barber, or styling preferences..."
                    className="w-full p-2.5 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                  />
                  <div className="flex justify-end mt-1.5">
                    <button
                      onClick={handleSaveInternalNotes}
                      disabled={savingNotes}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-salon-sand text-salon-charcoal font-semibold hover:bg-salon-taupe/50 text-[11px]"
                    >
                      <Save className="w-3 h-3 text-salon-darkgold" />
                      <span>{savingNotes ? 'Saving...' : 'Save Stylist Notes'}</span>
                    </button>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="pt-3 border-t border-salon-sand flex justify-between items-center">
                  <div className="flex gap-2">
                    {selectedApt.status !== 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedApt.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                      >
                        Set Confirmed
                      </button>
                    )}
                    {selectedApt.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedApt.id, 'completed')}
                        className="px-3 py-1.5 rounded-full bg-salon-charcoal hover:bg-black text-white font-semibold text-xs"
                      >
                        Mark Completed
                      </button>
                    )}
                    {selectedApt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedApt.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedApt(null)}
                    className="px-4 py-1.5 rounded-full border border-salon-sand text-salon-muted hover:bg-salon-cream"
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
