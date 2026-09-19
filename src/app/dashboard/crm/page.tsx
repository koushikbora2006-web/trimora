'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Customer, CustomerStatus } from '@/lib/types';
import {
  Users,
  UserPlus,
  Download,
  BarChart3,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  Clock,
  ChevronRight,
  ShieldAlert,
  Crown,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface CRMAnalyticsSummary {
  total_customers: number;
  active_customers: number;
  vip_customers: number;
  loyal_customers: number;
  at_risk_customers: number;
  retention_rate_pct: number;
  total_revenue_generated: number;
  average_customer_lifetime_value: number;
  status_breakdown: Record<CustomerStatus, number>;
}

export default function CRMHubPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<CRMAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'spent_desc' | 'visits_desc' | 'recent_visit' | 'name'>('newest');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedTag !== 'all') params.set('tag', selectedTag);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (sortBy) params.set('sort', sortBy);
      if (includeArchived) params.set('include_archived', 'true');
      params.set('limit', '100');

      const res = await fetch(`/api/customers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
        if (data.analytics) {
          setAnalytics(data.analytics);
        }
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [selectedStatus, selectedTag, sortBy, includeArchived]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Extract all unique tags for filter dropdown
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    customers.forEach((c) => {
      c.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [customers]);

  const handleExportCsv = () => {
    setExporting(true);
    const params = new URLSearchParams();
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedTag !== 'all') params.set('tag', selectedTag);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (includeArchived) params.set('include_archived', 'true');

    window.location.href = `/api/customers/export?${params.toString()}`;
    setTimeout(() => setExporting(false), 2000);
  };

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'vip':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/40 shadow-[0_0_10px_rgba(197,168,128,0.2)]">
            <Crown className="w-3 h-3 text-[#C5A880]" />
            VIP Elite
          </span>
        );
      case 'loyal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <HeartHandshake className="w-3 h-3 text-purple-400" />
            Loyal
          </span>
        );
      case 'returning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <RefreshCw className="w-3 h-3 text-blue-400" />
            Returning
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Active
          </span>
        );
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            New Client
          </span>
        );
      case 'at_risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            At Risk
          </span>
        );
      case 'inactive':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <ShieldAlert className="w-3 h-3 text-zinc-500" />
            Inactive
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/30">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#F7F4EE] tracking-wide">
                Customer Relationship Management
              </h1>
            </div>
            <p className="text-sm text-[#9E988F] mt-1.5 pl-11">
              Elevated client profiles, formulas, lifetime spend & intelligent salon retention for John Salon KKD.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pl-11 md:pl-0">
            <Link
              href="/dashboard/crm/analytics"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] text-xs font-semibold text-[#F7F4EE] border border-white/[0.1] transition-all hover:border-[#C5A880]/50"
            >
              <BarChart3 className="w-4 h-4 text-[#C5A880]" />
              <span>CRM Analytics</span>
            </Link>

            <button
              onClick={handleExportCsv}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] text-xs font-semibold text-[#F7F4EE] border border-white/[0.1] transition-all hover:border-[#C5A880]/50 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#C5A880]" />
              <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>

            <Link
              href="/dashboard/crm/new"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B39366] text-xs font-bold text-[#0A0A0A] shadow-[0_0_20px_rgba(197,168,128,0.3)] transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>New Client Profile</span>
            </Link>
          </div>
        </div>

        {/* Derived KPI Cards */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-[#C5A880]/40 transition-colors">
              <div className="text-[11px] font-medium text-[#9E988F] uppercase tracking-wider">Total Clients</div>
              <div className="text-2xl font-bold text-[#F7F4EE] mt-1.5">{analytics.total_customers}</div>
              <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <span>● Registered in DB</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="text-[11px] font-medium text-[#9E988F] uppercase tracking-wider">Active Clients</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1.5">{analytics.active_customers}</div>
              <div className="text-[10px] text-[#9E988F] mt-1">Frequent repeat guests</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-[#C5A880]/40 transition-colors">
              <div className="text-[11px] font-medium text-[#9E988F] uppercase tracking-wider">VIP & Loyal</div>
              <div className="text-2xl font-bold text-[#C5A880] mt-1.5">
                {(analytics.vip_customers || 0) + (analytics.loyal_customers || 0)}
              </div>
              <div className="text-[10px] text-[#C5A880] mt-1 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                <span>Highest retention</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-rose-500/40 transition-colors">
              <div className="text-[11px] font-medium text-[#9E988F] uppercase tracking-wider">At Risk Clients</div>
              <div className="text-2xl font-bold text-rose-400 mt-1.5">{analytics.at_risk_customers}</div>
              <div className="text-[10px] text-rose-400/80 mt-1">&gt; 75 days since visit</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-blue-500/40 transition-colors">
              <div className="text-[11px] font-medium text-[#9E988F] uppercase tracking-wider">Retention Rate</div>
              <div className="text-2xl font-bold text-blue-400 mt-1.5">{analytics.retention_rate_pct}%</div>
              <div className="text-[10px] text-blue-300/80 mt-1">Repeat patronage</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-white/[0.08] relative overflow-hidden group hover:border-amber-500/40 transition-colors">
              <div className="text-[11px] font-medium text-[#9E988F] uppercase tracking-wider">Avg Lifetime Value</div>
              <div className="text-2xl font-bold text-[#F7F4EE] mt-1.5">₹{analytics.average_customer_lifetime_value}</div>
              <div className="text-[10px] text-amber-400 mt-1">₹{analytics.total_revenue_generated} total revenue</div>
            </div>
          </div>
        )}

        {/* Segment Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Clients', count: analytics?.total_customers },
            { id: 'vip', label: 'VIP Elite', count: analytics?.vip_customers, icon: Crown },
            { id: 'loyal', label: 'Loyal', count: analytics?.loyal_customers, icon: HeartHandshake },
            { id: 'returning', label: 'Returning', count: analytics?.status_breakdown?.returning },
            { id: 'active', label: 'Active', count: analytics?.status_breakdown?.active },
            { id: 'new', label: 'New', count: analytics?.status_breakdown?.new },
            { id: 'at_risk', label: 'At Risk', count: analytics?.at_risk_customers, icon: AlertTriangle },
            { id: 'inactive', label: 'Inactive / Archived', count: analytics?.status_breakdown?.inactive }
          ].map((seg) => {
            const isSelected = selectedStatus === seg.id;
            const Icon = seg.icon;
            return (
              <button
                key={seg.id}
                onClick={() => setSelectedStatus(seg.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#C5A880] text-[#0A0A0A] shadow-[0_0_12px_rgba(197,168,128,0.3)]'
                    : 'bg-[#181818] text-[#9E988F] hover:text-[#F7F4EE] hover:bg-[#202020] border border-white/[0.06]'
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                <span>{seg.label}</span>
                {seg.count !== undefined && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black/20 text-[#0A0A0A]' : 'bg-white/[0.08] text-[#9E988F]'
                    }`}
                  >
                    {seg.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-white/[0.08] flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#9E988F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, tags..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] placeholder:text-[#9E988F]/60 focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>

          {/* Controls: Tag, Sort, Archive toggle */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#9E988F]" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#9E988F]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#1C1C1C] border border-white/[0.08] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C5A880]"
              >
                <option value="newest">Newest Added</option>
                <option value="spent_desc">Highest Spenders (₹)</option>
                <option value="visits_desc">Most Visits</option>
                <option value="recent_visit">Most Recent Visit</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Include Archived toggle */}
            <label className="flex items-center gap-2 text-xs text-[#9E988F] cursor-pointer pl-2">
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#1C1C1C] border-white/20 text-[#C5A880] focus:ring-0"
              />
              <span>Include Archived</span>
            </label>
          </div>
        </div>

        {/* Client Table / Grid */}
        <div className="rounded-2xl bg-[#141414] border border-white/[0.08] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#9E988F] flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#C5A880]" />
              <span className="text-xs">Loading salon client directory...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-[#9E988F] mx-auto stroke-1" />
              <div className="text-sm font-semibold text-[#F7F4EE]">No client profiles found</div>
              <p className="text-xs text-[#9E988F] max-w-sm mx-auto">
                No customers match the current segment or search filters. Try clearing your search or create a new client profile.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/crm/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C5A880] text-black text-xs font-bold"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add First Client Profile</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#181818]/60 text-[11px] font-semibold text-[#9E988F] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Client Profile</th>
                    <th className="py-3.5 px-4">Segment</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Preferences & Tags</th>
                    <th className="py-3.5 px-4 text-center">Visits</th>
                    <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                    <th className="py-3.5 px-4">Last Visit</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-xs">
                  {customers.map((client) => {
                    const daysAgo = client.stats?.days_since_last_visit;
                    return (
                      <tr
                        key={client.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Avatar & Name */}
                        <td className="py-4 px-4">
                          <Link
                            href={`/dashboard/crm/${client.id}`}
                            className="flex items-center gap-3 group-hover:text-[#C5A880] transition-colors"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#1F1F1F] border border-[#C5A880]/30 flex items-center justify-center font-bold text-xs text-[#C5A880] shrink-0 overflow-hidden">
                              {client.avatar_url ? (
                                <img src={client.avatar_url} alt={client.full_name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{getInitials(client.full_name)}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-[#F7F4EE] group-hover:text-[#C5A880] transition-colors flex items-center gap-1.5">
                                <span>{client.full_name}</span>
                                {client.is_archived && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal">
                                    Archived
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#9E988F]">
                                Client #{client.id.slice(-6).toUpperCase()}
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* Segment Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getStatusBadge(client.status)}
                        </td>

                        {/* Contact details */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <a
                              href={`https://wa.me/${client.normalized_phone?.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#F7F4EE] hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3 h-3 text-[#9E988F]" />
                              <span>{client.phone}</span>
                            </a>
                            {client.email && (
                              <div className="text-[11px] text-[#9E988F] flex items-center gap-1.5">
                                <Mail className="w-3 h-3 text-[#9E988F]/70" />
                                <span className="truncate max-w-[150px]">{client.email}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Preferences & Tags */}
                        <td className="py-4 px-4">
                          <div className="space-y-1.5 max-w-xs">
                            {client.preferences?.preferred_stylist_name && (
                              <div className="text-[11px] text-[#C5A880] font-medium flex items-center gap-1">
                                <span>Stylist: {client.preferences.preferred_stylist_name}</span>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {client.tags?.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] text-[#F7F4EE]/80 border border-white/[0.08]"
                                >
                                  {tag}
                                </span>
                              ))}
                              {client.tags && client.tags.length > 3 && (
                                <span className="text-[10px] text-[#9E988F]">+{client.tags.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Completed Visits */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <span className="font-bold text-sm text-[#F7F4EE]">
                            {client.stats?.completed_appointments || 0}
                          </span>
                          <span className="text-[10px] text-[#9E988F] block">
                            of {client.stats?.total_appointments || 0} total
                          </span>
                        </td>

                        {/* Lifetime Spend */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <span className="font-bold text-sm text-[#C5A880]">
                            ₹{(client.stats?.total_spent || 0).toLocaleString('en-IN')}
                          </span>
                          {client.stats?.average_order_value ? (
                            <span className="text-[10px] text-[#9E988F] block">
                              AOV: ₹{client.stats.average_order_value}
                            </span>
                          ) : null}
                        </td>

                        {/* Last Visit */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {client.stats?.last_visit_at ? (
                            <div>
                              <span className="text-xs text-[#F7F4EE]">
                                {new Date(client.stats.last_visit_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span
                                className={`text-[10px] block ${
                                  daysAgo !== undefined && daysAgo > 75 ? 'text-rose-400 font-semibold' : 'text-[#9E988F]'
                                }`}
                              >
                                {daysAgo !== undefined ? `${daysAgo} days ago` : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#9E988F] italic">No visit completed</span>
                          )}
                        </td>

                        {/* Action Link */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/dashboard/crm/${client.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#C5A880] text-[#F7F4EE] hover:text-[#0A0A0A] text-xs font-semibold transition-all border border-white/[0.08] hover:border-[#C5A880]"
                          >
                            <span>Profile</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
