'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { CRMAnalytics } from '@/lib/types';
import {
  ArrowLeft,
  BarChart3,
  Users,
  TrendingUp,
  Crown,
  HeartHandshake,
  AlertTriangle,
  RotateCcw,
  IndianRupee,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function CRMAnalyticsPage() {
  const [analytics, setAnalytics] = useState<CRMAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch((err) => console.error('Error loading CRM analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-16 text-center text-[#9E988F] flex flex-col items-center gap-3">
          <RotateCcw className="w-7 h-7 animate-spin text-[#C5A880]" />
          <span className="text-xs">Calculating CRM retention metrics & lifetime spend...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-xs text-[#9E988F]">
          Unable to compute CRM analytics.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/crm"
              className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#9E988F] hover:text-[#F7F4EE] border border-white/[0.08] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-[#F7F4EE]">
                Client Retention & Lifetime Analytics
              </h1>
              <p className="text-xs text-[#9E988F]">
                Cohort retention curves, customer lifetime value (CLV) & segment distribution for John Salon KKD.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/crm"
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-xs font-semibold text-[#F7F4EE] border border-white/[0.1]"
          >
            Back to Directory
          </Link>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-[#C5A880]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9E988F] uppercase tracking-wider">
                Repeat Retention Rate
              </span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mt-2">
              {analytics.retention_rate_pct}%
            </div>
            <div className="text-[11px] text-[#9E988F] mt-1">
              Returning, loyal & VIP patronage
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-[#C5A880]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9E988F] uppercase tracking-wider">
                Avg Lifetime Value
              </span>
              <IndianRupee className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="text-3xl font-bold text-[#C5A880] mt-2">
              ₹{analytics.average_customer_lifetime_value.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#9E988F] mt-1">
              Across ₹{analytics.total_revenue_generated.toLocaleString('en-IN')} total revenue
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9E988F] uppercase tracking-wider">
                Visit Frequency
              </span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400 mt-2">
              ~{analytics.average_visit_frequency_days} Days
            </div>
            <div className="text-[11px] text-[#9E988F] mt-1">
              Average interval between appointments
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-rose-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9E988F] uppercase tracking-wider">
                Churn / At Risk
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-bold text-rose-400 mt-2">
              {analytics.churn_rate_pct}%
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1">
              {analytics.at_risk_customers} clients overdue for session
            </div>
          </div>

        </div>

        {/* Middle Section: Segment Distribution & Monthly Retention */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Segment Distribution */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">
                Client Segment Distribution
              </h2>
              <span className="text-[11px] text-[#9E988F]">
                {analytics.total_customers} Total
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {[
                { label: 'VIP Elite', key: 'vip', color: 'bg-[#C5A880]', text: 'text-[#C5A880]' },
                { label: 'Loyal Regulars', key: 'loyal', color: 'bg-purple-500', text: 'text-purple-400' },
                { label: 'Returning Clients', key: 'returning', color: 'bg-blue-500', text: 'text-blue-400' },
                { label: 'Active Clients', key: 'active', color: 'bg-emerald-500', text: 'text-emerald-400' },
                { label: 'New Clients', key: 'new', color: 'bg-amber-500', text: 'text-amber-400' },
                { label: 'At Risk', key: 'at_risk', color: 'bg-rose-500', text: 'text-rose-400' },
                { label: 'Inactive / Archived', key: 'inactive', color: 'bg-zinc-600', text: 'text-zinc-400' }
              ].map((seg) => {
                const count = analytics.status_breakdown[seg.key as keyof typeof analytics.status_breakdown] || 0;
                const pct = analytics.total_customers > 0 ? Math.round((count / analytics.total_customers) * 100) : 0;
                return (
                  <div key={seg.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${seg.text}`}>{seg.label}</span>
                      <span className="text-[#9E988F]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${seg.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Retention Curve */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">
                  6-Month Client Retention Trends
                </h2>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  +13% Growth
                </span>
              </div>
              <p className="text-xs text-[#9E988F] mt-1">
                Repeat clients returning within 45 days of their initial haircut or spa experience.
              </p>
            </div>

            {/* Retention Bar Chart Visualizer */}
            <div className="pt-6 flex items-end justify-between gap-3 h-48 border-b border-white/[0.08] pb-2">
              {analytics.monthly_retention.map((item) => {
                const heightPct = Math.round((item.retained / item.total) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-[#C5A880]">{heightPct}%</span>
                    <div className="w-full bg-white/[0.06] rounded-t-lg h-32 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-[#C5A880]/50 to-[#C5A880] rounded-t-lg transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#9E988F]">{item.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-xs text-[#9E988F] flex items-center justify-between">
              <span>Cohort target: 90%+ repeat retention</span>
              <span className="text-[#C5A880] font-semibold">Current: {analytics.retention_rate_pct}%</span>
            </div>
          </div>

        </div>

        {/* Top 5 High-Value Spenders Leaderboard */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#C5A880]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">
                Top Spenders & VIP Client Leaderboard
              </h2>
            </div>
            <Link href="/dashboard/crm?sort=spent_desc" className="text-xs text-[#C5A880] hover:underline">
              View All Spenders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-[#9E988F] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Client Profile</th>
                  <th className="py-3 px-3">Segment</th>
                  <th className="py-3 px-3">Preferred Stylist</th>
                  <th className="py-3 px-3 text-center">Completed Visits</th>
                  <th className="py-3 px-3 text-right">Total Spent (₹)</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {analytics.top_spenders.map((client, idx) => (
                  <tr key={client.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3 font-bold text-[#C5A880]">#{idx + 1}</td>
                    <td className="py-3.5 px-3 font-semibold text-[#F7F4EE]">
                      <Link href={`/dashboard/crm/${client.id}`} className="hover:text-[#C5A880] transition-colors">
                        {client.full_name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30">
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#9E988F]">
                      {client.preferences?.preferred_stylist_name || 'John V.'}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-[#F7F4EE]">
                      {client.stats?.completed_appointments || 0}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#C5A880]">
                      ₹{(client.stats?.total_spent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/dashboard/crm/${client.id}`}
                        className="inline-flex items-center gap-1 text-[11px] text-[#9E988F] hover:text-[#C5A880]"
                      >
                        <span>Profile</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
