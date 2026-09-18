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
  Phone
} from 'lucide-react';
import { Appointment, Salon, Service } from '@/lib/types';

export default function DashboardOverviewPage() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [chunksCount, setChunksCount] = useState(0);
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
            <span className="text-xs font-semibold uppercase tracking-wider text-salon-darkgold">
              Salon Workspace
            </span>
            <h1 className="font-serif text-3xl font-bold text-salon-charcoal">
              {salon?.name || 'John Salon KKD'} Overview
            </h1>
            <p className="text-xs text-salon-muted">
              Live salon operations, AI assistant metrics, and customer reservations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-salon-sand text-salon-charcoal text-xs font-semibold hover:bg-salon-taupe/40 border border-salon-bronze/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-salon-darkgold" />
              <span>Add Service</span>
            </Link>

            <Link
              href="/dashboard/knowledge"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-salon-bronze" />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-white border border-salon-sand shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-salon-muted text-xs">
              <span>Total Bookings</span>
              <Calendar className="w-4 h-4 text-salon-bronze" />
            </div>
            <div className="font-serif text-3xl font-bold text-salon-charcoal">
              {appointments.length}
            </div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18% this month</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-salon-sand shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-salon-muted text-xs">
              <span>Pending Requests</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-serif text-3xl font-bold text-salon-charcoal">
              {pendingCount}
            </div>
            <div className="text-[11px] text-amber-600 font-medium">
              Requires owner review
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-salon-sand shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-salon-muted text-xs">
              <span>Active Services</span>
              <Scissors className="w-4 h-4 text-salon-bronze" />
            </div>
            <div className="font-serif text-3xl font-bold text-salon-charcoal">
              {services.filter(s => s.is_active).length}
            </div>
            <div className="text-[11px] text-salon-muted">
              Published on profile & AI
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-salon-sand shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-salon-muted text-xs">
              <span>Knowledge Chunks</span>
              <FileText className="w-4 h-4 text-salon-darkgold" />
            </div>
            <div className="font-serif text-3xl font-bold text-salon-charcoal">
              {chunksCount}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              Grounded AI RAG Active
            </div>
          </div>

        </div>

        {/* Main Grid: Recent Appointments & Popular Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Appointments Table */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-salon-sand shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-salon-sand">
              <div>
                <h3 className="font-serif text-lg font-bold text-salon-charcoal">
                  Recent Appointment Requests
                </h3>
                <p className="text-xs text-salon-muted">
                  Client bookings, status dispatch, and attached StyleScan consultations.
                </p>
              </div>
              <Link
                href="/dashboard/appointments"
                className="text-xs font-semibold text-salon-darkgold hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="p-12 text-center text-xs text-salon-muted space-y-2">
                <Calendar className="w-8 h-8 text-salon-sand mx-auto" />
                <p className="font-medium text-salon-charcoal">No appointments yet.</p>
                <p>New reservation requests will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-salon-ivory/50 border border-salon-sand hover:border-salon-bronze/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-salon-sand text-salon-charcoal">
                          {apt.reference_code}
                        </span>
                        <span className="text-xs font-bold text-salon-charcoal">
                          {apt.customer_name}
                        </span>
                        {apt.stylescan_reference && (
                          <span className="text-[10px] bg-salon-cream text-salon-darkgold border border-salon-bronze/30 px-2 py-0.2 rounded-full font-semibold">
                            StyleScan
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-salon-muted flex flex-wrap items-center gap-3">
                        <span>{apt.service_name}</span>
                        <span>•</span>
                        <span>{apt.preferred_date} at {apt.preferred_time}</span>
                        <span>•</span>
                        <span>{apt.customer_phone}</span>
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-salon-charcoal/80 bg-white/80 p-2 rounded-lg border border-salon-sand/50">
                          {apt.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : apt.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {apt.status}
                      </span>

                      {apt.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          className="px-3 py-1 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black transition-colors"
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

          {/* Right Column: Menu Overview & RAG Quick Test */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Services Snapshot */}
            <div className="p-6 rounded-3xl bg-white border border-salon-sand shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-salon-sand">
                <h3 className="font-serif text-base font-bold text-salon-charcoal">
                  Popular Services
                </h3>
                <Link href="/dashboard/services" className="text-xs text-salon-darkgold font-semibold hover:underline">
                  Edit Menu
                </Link>
              </div>

              <div className="space-y-2.5">
                {services.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-3 rounded-2xl bg-salon-cream/50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-salon-charcoal">{s.name}</div>
                      <div className="text-[10px] text-salon-muted">{s.duration_minutes}m • {s.category}</div>
                    </div>
                    <span className="font-serif font-bold text-salon-charcoal">₹{s.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick RAG Assistant Status */}
            <div className="p-6 rounded-3xl bg-salon-charcoal text-white shadow-md space-y-3">
              <div className="flex items-center gap-2 text-salon-bronze">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI RAG Status</span>
              </div>
              <p className="text-xs text-salon-sand/80 leading-relaxed">
                Your chatbot is grounded in {chunksCount} knowledge chunks from your uploaded policies and menus.
              </p>
              <Link
                href="/dashboard/knowledge"
                className="inline-flex items-center gap-1.5 text-xs text-salon-bronze font-semibold hover:underline pt-1"
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
