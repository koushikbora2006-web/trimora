'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Customer, Appointment, CustomerNote, CustomerActivity, CustomerStatus } from '@/lib/types';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  Clock,
  Sparkles,
  Scissors,
  Crown,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Coffee,
  MessageSquare,
  FileText,
  History,
  Bot,
  Copy,
  Check,
  Send,
  Trash2,
  Pin,
  Save,
  ShieldAlert,
  Archive,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [activity, setActivity] = useState<CustomerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'notes' | 'preferences' | 'ai_assistant' | 'activity'>('overview');

  // New Note state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<CustomerNote['note_type']>('general');
  const [newNotePinned, setNewNotePinned] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  // AI Assistant state
  const [aiIntent, setAiIntent] = useState<'summary' | 'reengagement' | 'recommendation'>('summary');
  const [aiResult, setAiResult] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);

  // Edit Preferences state
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState<CustomerStatus>('new');
  const [editPreferredStylist, setEditPreferredStylist] = useState('');
  const [editBeverage, setEditBeverage] = useState('');
  const [editFormulaNotes, setEditFormulaNotes] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const fetchCustomerDetails = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/customers/${customerId}`);
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        setAppointments(data.appointments || []);
        setNotes(data.notes || []);
        setActivity(data.activity || []);

        // Initialize edit states
        setEditFirstName(data.customer.first_name || '');
        setEditLastName(data.customer.last_name || '');
        setEditPhone(data.customer.phone || '');
        setEditEmail(data.customer.email || '');
        setEditStatus(data.customer.status);
        setEditPreferredStylist(data.customer.preferences?.preferred_stylist_name || '');
        setEditBeverage(data.customer.preferences?.beverage_preference || '');
        setEditFormulaNotes(data.customer.preferences?.formula_notes || '');
        setEditTags(data.customer.tags || []);
      }
    } catch (err) {
      console.error('Failed to load customer profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/customers/${customerId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: customer?.salon_id || 'john_salon_kkd',
          author_name: 'John V.',
          note_type: newNoteType,
          content: newNoteContent.trim(),
          is_pinned: newNotePinned
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewNoteContent('');
        setNewNotePinned(false);
        fetchCustomerDetails();
      }
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await fetch(`/api/customers/${customerId}/notes?note_id=${noteId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchCustomerDetails();
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleGenerateAi = async (intent: 'summary' | 'reengagement' | 'recommendation') => {
    setAiIntent(intent);
    setAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch('/api/customers/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          intent
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.result);
      }
    } catch (err) {
      console.error('AI assistant error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    setSaveSuccessMessage(null);
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editFirstName.trim(),
          last_name: editLastName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim() || undefined,
          status: editStatus,
          tags: editTags,
          preferences: {
            ...customer?.preferences,
            preferred_stylist_name: editPreferredStylist,
            beverage_preference: editBeverage,
            formula_notes: editFormulaNotes.trim() || undefined
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMessage('Customer profile successfully saved!');
        setTimeout(() => setSaveSuccessMessage(null), 3500);
        fetchCustomerDetails();
      }
    } catch (err) {
      console.error('Error updating customer:', err);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleToggleArchive = async () => {
    if (!customer) return;
    const isArchived = customer.is_archived;
    const action = isArchived ? 'restore' : 'archive';
    const confirmMsg = isArchived
      ? 'Restore this customer profile from archive?'
      : 'Move this customer profile to archive? Their appointment history will remain safely preserved.';

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/customers/${customerId}?action=${action}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchCustomerDetails();
      }
    } catch (err) {
      console.error('Error toggling archive:', err);
    }
  };

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'vip':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/40 shadow-[0_0_15px_rgba(197,168,128,0.25)]">
            <Crown className="w-3.5 h-3.5 text-[#C5A880]" />
            VIP Elite
          </span>
        );
      case 'loyal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
            Loyal Regular
          </span>
        );
      case 'returning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            Returning Client
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Active Client
          </span>
        );
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            New Client
          </span>
        );
      case 'at_risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            At Risk
          </span>
        );
      case 'inactive':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
            Inactive / Archived
          </span>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-16 text-center text-[#9E988F] flex flex-col items-center gap-3">
          <RotateCcw className="w-7 h-7 animate-spin text-[#C5A880]" />
          <span className="text-xs">Loading client 360° profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center space-y-4">
          <User className="w-10 h-10 text-[#9E988F] mx-auto" />
          <div className="text-base font-semibold text-[#F7F4EE]">Client profile not found</div>
          <Link
            href="/dashboard/crm"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A880] text-black text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CRM Hub</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const cleanPhone = customer.normalized_phone?.replace(/\D/g, '') || customer.phone.replace(/\D/g, '');

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-7">
        
        {/* Top Header Card */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            <div className="flex items-start md:items-center gap-4">
              <Link
                href="/dashboard/crm"
                className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#9E988F] hover:text-[#F7F4EE] border border-white/[0.08] transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] border border-[#C5A880]/40 flex items-center justify-center font-serif font-bold text-xl text-[#C5A880] shrink-0 overflow-hidden shadow-[0_0_20px_rgba(197,168,128,0.15)]">
                {customer.avatar_url ? (
                  <img src={customer.avatar_url} alt={customer.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span>
                    {(customer.first_name?.[0] || 'C') + (customer.last_name?.[0] || '')}
                  </span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-[#F7F4EE]">
                    {customer.full_name}
                  </h1>
                  {getStatusBadge(customer.status)}
                  {customer.is_archived && (
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      Archived
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9E988F] mt-1.5">
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-[#9E988F]" />
                    <span>{customer.phone}</span>
                  </a>
                  {customer.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#9E988F]" />
                      <span>{customer.email}</span>
                    </span>
                  )}
                  <span className="text-white/30">•</span>
                  <span>ID: #{customer.id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pl-12 md:pl-0">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <Link
                href={`/dashboard/appointments?customer_phone=${customer.phone}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C5A880] hover:bg-[#B39366] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(197,168,128,0.25)]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </Link>

              <button
                onClick={handleToggleArchive}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#9E988F] hover:text-[#F7F4EE] border border-white/[0.08] transition-colors"
                title={customer.is_archived ? 'Restore Client' : 'Archive Client'}
              >
                {customer.is_archived ? <RotateCcw className="w-4 h-4 text-emerald-400" /> : <Archive className="w-4 h-4 text-zinc-400" />}
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#9E988F] tracking-wider block">Completed Visits</span>
              <span className="text-lg font-bold text-[#F7F4EE] mt-0.5 block">
                {customer.stats?.completed_appointments || 0}
                <span className="text-xs text-[#9E988F] font-normal ml-1">
                  / {customer.stats?.total_appointments || 0} booked
                </span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#9E988F] tracking-wider block">Total Spent</span>
              <span className="text-lg font-bold text-[#C5A880] mt-0.5 block">
                ₹{(customer.stats?.total_spent || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#9E988F] tracking-wider block">Average Order</span>
              <span className="text-lg font-bold text-[#F7F4EE] mt-0.5 block">
                ₹{customer.stats?.average_order_value || 0}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#9E988F] tracking-wider block">Last Visit</span>
              <span className="text-xs font-semibold text-[#F7F4EE] mt-1 block">
                {customer.stats?.last_visit_at
                  ? new Date(customer.stats.last_visit_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Never'}
              </span>
              {customer.stats?.days_since_last_visit !== undefined && (
                <span className="text-[10px] text-[#9E988F] block">
                  {customer.stats.days_since_last_visit} days ago
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#9E988F] tracking-wider block">Preferred Stylist</span>
              <span className="text-xs font-semibold text-[#C5A880] mt-1 block">
                {customer.preferences?.preferred_stylist_name || 'John V.'}
              </span>
              <span className="text-[10px] text-[#9E988F] block">
                {customer.preferences?.beverage_preference || 'Espresso'}
              </span>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: '360° Overview', icon: User },
            { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: 'notes', label: `Staff Notes & Formulas (${notes.length})`, icon: FileText },
            { id: 'ai_assistant', label: 'AI Concierge Assistant', icon: Bot, isAi: true },
            { id: 'preferences', label: 'Preferences & Edit', icon: Scissors },
            { id: 'activity', label: `Activity (${activity.length})`, icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C5A880] text-[#0A0A0A] shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                    : 'text-[#9E988F] hover:text-[#F7F4EE] hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : tab.isAi ? 'text-[#C5A880]' : 'text-[#9E988F]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Formulas & Technical Care */}
            <div className="space-y-6 md:col-span-2">
              
              {/* Technical Formula Banner */}
              <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-[#C5A880]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">
                      Technical Formulation & Cutting Notes
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className="text-[11px] text-[#C5A880] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#1C1C1C] border border-white/[0.06] text-xs text-[#F7F4EE] leading-relaxed">
                  {customer.preferences?.formula_notes ? (
                    customer.preferences.formula_notes
                  ) : (
                    <span className="text-[#9E988F] italic">
                      No formula notes logged yet. Add scissor guard preference, color shades, or skin sensitivity details in Preferences tab.
                    </span>
                  )}
                </div>
              </div>

              {/* Recent Appointments Preview */}
              <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">
                    Recent Appointment History
                  </h3>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-[11px] text-[#C5A880] hover:underline"
                  >
                    View All ({appointments.length})
                  </button>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-xs text-[#9E988F] py-4 text-center">
                    No appointments booked yet for this client.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {appointments.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3.5 rounded-xl bg-[#1C1C1C] border border-white/[0.06] flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#F7F4EE]">
                            {apt.service_name || 'Salon Treatment'}
                          </div>
                          <div className="text-[11px] text-[#9E988F]">
                            {apt.preferred_date} at {apt.preferred_time} • Ref: {apt.reference_code}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-semibold text-[#C5A880] block">
                            ₹{apt.service_price || 0}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-[#9E988F]">
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Preferences, Tags & Marketing */}
            <div className="space-y-6">
              
              {/* Tags card */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">
                  Client Segments & Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {customer.tags && customer.tags.length > 0 ? (
                    customer.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30"
                      >
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#9E988F] italic">No tags assigned</span>
                  )}
                </div>
              </div>

              {/* Hospitality Preferences */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">
                  VIP Hospitality & Concierge
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                    <span className="text-[#9E988F]">Preferred Beverage:</span>
                    <span className="text-[#F7F4EE] font-medium">{customer.preferences?.beverage_preference || 'Espresso'}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                    <span className="text-[#9E988F]">Preferred Stylist:</span>
                    <span className="text-[#C5A880] font-medium">{customer.preferences?.preferred_stylist_name || 'John V.'}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                    <span className="text-[#9E988F]">Birthday:</span>
                    <span className="text-[#F7F4EE] font-medium">{customer.birthday || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9E988F]">Anniversary:</span>
                    <span className="text-[#F7F4EE] font-medium">{customer.anniversary || 'Not set'}</span>
                  </div>
                </div>
              </div>

              {/* Marketing Consent */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">
                  Marketing & Contact Channels
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9E988F]">WhatsApp Messaging:</span>
                    <span className={`font-semibold ${customer.marketing?.accepts_whatsapp ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {customer.marketing?.accepts_whatsapp ? 'Enabled' : 'Opted-Out'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9E988F]">SMS Reminders:</span>
                    <span className={`font-semibold ${customer.marketing?.accepts_sms ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {customer.marketing?.accepts_sms ? 'Enabled' : 'Opted-Out'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9E988F]">Email Newsletters:</span>
                    <span className={`font-semibold ${customer.marketing?.accepts_email ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {customer.marketing?.accepts_email ? 'Enabled' : 'Opted-Out'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-[#F7F4EE] uppercase tracking-wider">
                All Appointment Records ({appointments.length})
              </h2>
              <Link
                href={`/dashboard/appointments?customer_phone=${customer.phone}`}
                className="text-xs font-bold text-[#C5A880] hover:underline"
              >
                + Book New Appointment
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#9E988F]">
                No appointments logged for this client yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-[#9E988F] uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Date & Time</th>
                      <th className="py-3 px-3">Service</th>
                      <th className="py-3 px-3">Ref Code</th>
                      <th className="py-3 px-3 text-right">Price</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3">Notes / Recommendations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {appointments.map((a) => (
                      <tr key={a.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="font-semibold text-[#F7F4EE] block">{a.preferred_date}</span>
                          <span className="text-[#9E988F] text-[11px]">{a.preferred_time}</span>
                        </td>
                        <td className="py-3.5 px-3 font-medium text-[#F7F4EE]">
                          {a.service_name || 'Bespoke Salon Service'}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[11px] text-[#C5A880]">
                          {a.reference_code}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-[#F7F4EE]">
                          ₹{a.service_price || 0}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                              a.status === 'completed'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : a.status === 'confirmed'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : a.status === 'cancelled'
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-[11px] text-[#9E988F] max-w-xs truncate">
                          {a.notes || a.stylescan_reference?.hairstyle_name || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NOTES & FORMULAS */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            
            {/* Add New Note Card */}
            <form onSubmit={handleAddNote} className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
              <h2 className="text-sm font-semibold text-[#F7F4EE] uppercase tracking-wider">
                Add Technical Formula / Timeline Note
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="general">General Note</option>
                  <option value="formula">Technical Hair/Skin Formula</option>
                  <option value="preference">Client Preference</option>
                  <option value="vip_request">VIP Request</option>
                  <option value="complaint">Service Feedback</option>
                </select>

                <label className="flex items-center gap-1.5 text-xs text-[#9E988F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNotePinned}
                    onChange={(e) => setNewNotePinned(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#C5A880] focus:ring-0"
                  />
                  <span>Pin to top</span>
                </label>
              </div>

              <textarea
                rows={3}
                required
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Log formula, hair clipper guards, color mixing ratios, scalp sensitivity, or personal beverage preferences..."
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] placeholder:text-[#9E988F]/60 focus:outline-none focus:border-[#C5A880]"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingNote}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C5A880] text-black text-xs font-bold hover:bg-[#B39366] transition-colors disabled:opacity-50"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>{addingNote ? 'Saving...' : 'Add Note to Timeline'}</span>
                </button>
              </div>
            </form>

            {/* Notes Timeline */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#9E988F] bg-[#141414] rounded-2xl border border-white/[0.08]">
                  No notes recorded yet for this client profile.
                </div>
              ) : (
                notes.map((n) => (
                  <div
                    key={n.id}
                    className={`p-5 rounded-2xl bg-[#141414] border transition-colors ${
                      n.is_pinned ? 'border-[#C5A880]/50 bg-[#C5A880]/[0.02]' : 'border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                      <div className="flex items-center gap-2">
                        {n.is_pinned && <Pin className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880]" />}
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            n.note_type === 'formula'
                              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                              : n.note_type === 'vip_request'
                              ? 'bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40'
                              : 'bg-white/[0.06] text-[#9E988F]'
                          }`}
                        >
                          {n.note_type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-[#F7F4EE]">{n.author_name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#9E988F]">
                          {new Date(n.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <button
                          onClick={() => handleDeleteNote(n.id)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-[#F7F4EE] pt-3 leading-relaxed">
                      {n.content}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 4: AI CRM ASSISTANT */}
        {activeTab === 'ai_assistant' && (
          <div className="p-6 md:p-8 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
              <div className="p-2 rounded-xl bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm md:text-base font-serif font-bold text-[#F7F4EE]">
                  AI Concierge & Retention Assistant
                </h2>
                <p className="text-xs text-[#9E988F]">
                  Intelligent client briefings, personalized WhatsApp re-engagement copy & targeted service upgrade recommendations.
                </p>
              </div>
            </div>

            {/* Action buttons to trigger AI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleGenerateAi('summary')}
                disabled={aiLoading}
                className={`p-4 rounded-xl border text-left transition-all ${
                  aiIntent === 'summary' && aiResult
                    ? 'bg-[#C5A880]/10 border-[#C5A880] text-[#F7F4EE]'
                    : 'bg-[#1C1C1C] border-white/[0.08] hover:border-white/20 text-[#9E988F] hover:text-[#F7F4EE]'
                }`}
              >
                <div className="font-semibold text-xs text-[#F7F4EE] flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>360° Executive Briefing</span>
                </div>
                <div className="text-[11px] text-[#9E988F]">
                  Quick bulleted summary for the salon manager & stylists before appointment.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateAi('reengagement')}
                disabled={aiLoading}
                className={`p-4 rounded-xl border text-left transition-all ${
                  aiIntent === 'reengagement' && aiResult
                    ? 'bg-[#C5A880]/10 border-[#C5A880] text-[#F7F4EE]'
                    : 'bg-[#1C1C1C] border-white/[0.08] hover:border-white/20 text-[#9E988F] hover:text-[#F7F4EE]'
                }`}
              >
                <div className="font-semibold text-xs text-[#F7F4EE] flex items-center gap-1.5 mb-1">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Re-engagement</span>
                </div>
                <div className="text-[11px] text-[#9E988F]">
                  Polite, high-converting invite tailored to their favorite stylist and visit gap.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateAi('recommendation')}
                disabled={aiLoading}
                className={`p-4 rounded-xl border text-left transition-all ${
                  aiIntent === 'recommendation' && aiResult
                    ? 'bg-[#C5A880]/10 border-[#C5A880] text-[#F7F4EE]'
                    : 'bg-[#1C1C1C] border-white/[0.08] hover:border-white/20 text-[#9E988F] hover:text-[#F7F4EE]'
                }`}
              >
                <div className="font-semibold text-xs text-[#F7F4EE] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Curated Service Upgrades</span>
                </div>
                <div className="text-[11px] text-[#9E988F]">
                  Identify best spa facials, hair treatments or packages for their profile.
                </div>
              </button>
            </div>

            {/* AI Output Area */}
            <div className="p-6 rounded-2xl bg-[#1C1C1C] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-[11px] font-semibold text-[#9E988F] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  Generated AI Intelligence
                </span>

                {aiResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiResult);
                        setCopiedAi(true);
                        setTimeout(() => setCopiedAi(false), 2000);
                      }}
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[#F7F4EE] transition-colors"
                    >
                      {copiedAi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#9E988F]" />}
                      <span>{copiedAi ? 'Copied' : 'Copy Text'}</span>
                    </button>

                    {aiIntent === 'reengagement' && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(aiResult)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Open in WhatsApp</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {aiLoading ? (
                <div className="py-8 text-center text-xs text-[#9E988F] flex flex-col items-center gap-2">
                  <RotateCcw className="w-5 h-5 animate-spin text-[#C5A880]" />
                  <span>Synthesizing client profile & salon knowledge...</span>
                </div>
              ) : aiResult ? (
                <div className="text-xs text-[#F7F4EE] leading-relaxed whitespace-pre-line font-sans">
                  {aiResult}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#9E988F]">
                  Click one of the prompt options above to generate tailored CRM intelligence.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: PREFERENCES & EDIT */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSavePreferences} className="p-6 md:p-8 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-sm font-semibold text-[#F7F4EE] uppercase tracking-wider">
                  Edit Profile & Salon Preferences
                </h2>
                <p className="text-xs text-[#9E988F]">
                  Update contact information, segment status, favorite stylist, formula notes & client tags.
                </p>
              </div>

              {saveSuccessMessage && (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">First Name</label>
                <input
                  type="text"
                  required
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">Status Segment</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="vip">VIP Elite</option>
                  <option value="loyal">Loyal Regular</option>
                  <option value="returning">Returning</option>
                  <option value="active">Active</option>
                  <option value="new">New Client</option>
                  <option value="at_risk">At Risk</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">Preferred Stylist</label>
                <input
                  type="text"
                  value={editPreferredStylist}
                  onChange={(e) => setEditPreferredStylist(e.target.value)}
                  placeholder="e.g. John V."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#9E988F] block mb-1.5">Beverage Preference</label>
                <input
                  type="text"
                  value={editBeverage}
                  onChange={(e) => setEditBeverage(e.target.value)}
                  placeholder="e.g. Green Tea, Espresso, Sparkling Water"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Formula Notes */}
            <div>
              <label className="text-xs font-medium text-[#9E988F] block mb-1.5">
                Technical Formulation & Scissor Guard Notes
              </label>
              <textarea
                rows={3}
                value={editFormulaNotes}
                onChange={(e) => setEditFormulaNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-medium text-[#9E988F] block mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {editTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => setEditTags(editTags.filter((x) => x !== t))}
                      className="font-bold ml-1 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = newTagInput.trim();
                      if (val && !editTags.includes(val)) {
                        setEditTags([...editTags, val]);
                        setNewTagInput('');
                      }
                    }
                  }}
                  placeholder="Type tag and press Enter..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = newTagInput.trim();
                    if (val && !editTags.includes(val)) {
                      setEditTags([...editTags, val]);
                      setNewTagInput('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] text-xs font-semibold text-[#F7F4EE] hover:bg-white/[0.12]"
                >
                  Add Tag
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPrefs}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C5A880] text-black text-xs font-bold hover:bg-[#B39366] transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingPrefs ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>

          </form>
        )}

        {/* TAB 6: ACTIVITY LOG */}
        {activeTab === 'activity' && (
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
            <h2 className="text-sm font-semibold text-[#F7F4EE] uppercase tracking-wider pb-3 border-b border-white/[0.06]">
              Client Profile Activity Stream ({activity.length})
            </h2>

            {activity.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#9E988F]">
                No recorded activity on this client profile yet.
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-[#1C1C1C] border border-white/[0.04] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                      <span className="text-[#F7F4EE]">{act.description}</span>
                    </div>
                    <span className="text-[10px] text-[#9E988F] whitespace-nowrap">
                      {new Date(act.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
