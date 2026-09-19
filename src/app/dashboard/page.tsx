'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Calendar, 
  Scissors, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Plus,
  Eye,
  User,
  Phone,
  Users,
  Crown
} from 'lucide-react';
import { Appointment, Salon, Service, Customer } from '@/lib/types';

export default function DashboardOverviewPage() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [chunksCount, setChunksCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [retentionRate, setRetentionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const resSalon = await fetch('/api/salons/john_salon_kkd');
      const dataSalon = await resSalon.json();
      if (dataSalon.success) {
        setSalon(dataSalon.salon);
        setServices(dataSalon.services || []);
      }

      const resApts = await fetch('/api/appointments?salon_id=john_salon_kkd');
      const dataApts = await resApts.json();
      if (dataApts.success) {
        setAppointments(dataApts.appointments || []);
      }

      const resDoc = await fetch('/api/knowledge?salon_id=john_salon_kkd');
      const dataDoc = await resDoc.json();
      if (dataDoc.success) {
        setChunksCount(dataDoc.chunksCount || 0);
      }

      const resCust = await fetch('/api/customers?salon_id=john_salon_kkd&limit=4');
      const dataCust = await resCust.json();
      if (dataCust.success) {
        setCustomersCount(dataCust.total || 0);
        setRecentCustomers(dataCust.customers || []);
        if (dataCust.analytics) {
          setRetentionRate(dataCust.analytics.retention_rate_pct || 0);
        }
      }
    } catch (e) {
      console.warn('Error loading dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
      }
    } catch (e) {
      console.error('Error updating appointment status', e);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Header Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Salon Workspace
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#F7F4EE]">
              {salon?.name || 'John Salon KKD'} Overview
            </h1>
            <p className="text-xs text-[#9E988F]">
              Live salon operations, AI assistant metrics, and customer reservations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1F1F1F] text-[#F7F4EE] text-xs font-semibold hover:bg-[#2A2A2A] border border-white/[0.1] transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Add Service</span>
            </Link>

            <Link
              href="/dashboard/knowledge"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)]"
            >
              <FileText className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>

        {/* 5 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="p-5 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-2">
            <div className="flex items-center justify-between text-[#9E988F] text-xs">
              <span>Total Bookings</span>
              <Calendar className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#F7F4EE]">
              {appointments.length}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18% this month</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-2">
            <div className="flex items-center justify-between text-[#9E988F] text-xs">
              <span>Client CRM</span>
              <Users className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#F7F4EE]">
              {customersCount}
            </div>
            <div className="text-[11px] text-blue-400 font-medium">
              {retentionRate}% Repeat Retention
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-2">
            <div className="flex items-center justify-between text-[#9E988F] text-xs">
              <span>Pending Requests</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#F7F4EE]">
              {pendingCount}
            </div>
            <div className="text-[11px] text-amber-400 font-medium">
              Requires owner review
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-2">
            <div className="flex items-center justify-between text-[#9E988F] text-xs">
              <span>Active Services</span>
              <Scissors className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#F7F4EE]">
              {services.filter(s => s.is_active).length}
            </div>
            <div className="text-[11px] text-[#9E988F]">
              Published on profile & AI
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-2">
            <div className="flex items-center justify-between text-[#9E988F] text-xs">
              <span>Knowledge Chunks</span>
              <FileText className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#F7F4EE]">
              {chunksCount}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              Grounded AI RAG Active
            </div>
          </div>

        </div>

        {/* Main Grid: Recent Appointments & Popular Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Appointments Table */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Recent Appointment Requests
                </h3>
                <p className="text-xs text-[#9E988F]">
                  Client bookings, status dispatch, and attached StyleScan consultations.
                </p>
              </div>
              <Link
                href="/dashboard/appointments"
                className="text-xs font-semibold text-[#C5A880] hover:text-[#E5C590] flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#9E988F] space-y-2">
                <Calendar className="w-8 h-8 text-white/[0.2] mx-auto" />
                <p className="font-medium text-[#F7F4EE]">No appointments yet.</p>
                <p>New reservation requests will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-[#181818] border border-white/[0.06] hover:border-[#C5A880]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-[#222222] px-2 py-0.5 rounded border border-white/[0.08] text-[#E5C590]">
                          {apt.reference_code}
                        </span>
                        {apt.customer_id ? (
                          <Link
                            href={`/dashboard/crm/${apt.customer_id}`}
                            className="text-xs font-bold text-[#F7F4EE] hover:text-[#C5A880] transition-colors underline decoration-dotted underline-offset-4"
                            title="View CRM profile"
                          >
                            {apt.customer_name}
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-[#F7F4EE]">
                            {apt.customer_name}
                          </span>
                        )}
                        {apt.stylescan_reference && (
                          <span className="text-[10px] bg-[#C5A880]/15 text-[#E5C590] border border-[#C5A880]/30 px-2 py-0.2 rounded-full font-semibold">
                            StyleScan
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#9E988F] flex flex-wrap items-center gap-3">
                        <span className="text-[#F7F4EE]">{apt.service_name}</span>
                        <span>•</span>
                        <span>{apt.preferred_date} at {apt.preferred_time}</span>
                        <span>•</span>
                        <span>{apt.customer_phone}</span>
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-[#BEB8AE] bg-[#121212] p-2 rounded-lg border border-white/[0.06]">
                          {apt.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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

                      {apt.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-colors shadow-sm"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: VIP Clients, Menu Overview & RAG */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* VIP Clients Snapshot */}
            <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#C5A880]" />
                  <h3 className="font-serif text-base font-bold text-[#F7F4EE]">
                    Recent Clients & VIPs
                  </h3>
                </div>
                <Link href="/dashboard/crm" className="text-xs text-[#C5A880] font-semibold hover:text-[#E5C590] transition-colors">
                  Open CRM
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentCustomers.slice(0, 4).map((c) => (
                  <Link
                    key={c.id}
                    href={`/dashboard/crm/${c.id}`}
                    className="p-3 rounded-2xl bg-[#181818] border border-white/[0.05] hover:border-[#C5A880]/30 flex items-center justify-between text-xs transition-colors block"
                  >
                    <div>
                      <div className="font-semibold text-[#F7F4EE] flex items-center gap-1.5">
                        <span>{c.full_name}</span>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full bg-[#C5A880]/15 text-[#C5A880]">
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#9E988F]">{c.phone}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-[#C5A880]">₹{c.stats?.total_spent || 0}</span>
                      <span className="text-[10px] text-[#9E988F] block">{c.stats?.completed_appointments || 0} visits</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Services Snapshot */}
            <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
                <h3 className="font-serif text-base font-bold text-[#F7F4EE]">
                  Popular Services
                </h3>
                <Link href="/dashboard/services" className="text-xs text-[#C5A880] font-semibold hover:text-[#E5C590] transition-colors">
                  Edit Menu
                </Link>
              </div>

              <div className="space-y-2.5">
                {services.slice(0, 3).map((s) => (
                  <div key={s.id} className="p-3 rounded-2xl bg-[#181818] border border-white/[0.05] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#F7F4EE]">{s.name}</div>
                      <div className="text-[10px] text-[#9E988F]">{s.duration_minutes}m • {s.category}</div>
                    </div>
                    <span className="font-serif font-bold text-[#C5A880]">₹{s.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick RAG Assistant Status */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#181818] via-[#141414] to-[#101010] border border-[#C5A880]/30 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-[#C5A880]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI RAG Status</span>
              </div>
              <p className="text-xs text-[#9E988F] leading-relaxed">
                Your chatbot is grounded in <strong className="text-[#F7F4EE]">{chunksCount} knowledge chunks</strong> from your uploaded policies and menus.
              </p>
              <Link
                href="/dashboard/knowledge"
                className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] font-semibold hover:text-[#E5C590] transition-colors pt-1"
              >
                <span>Open RAG Document Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
