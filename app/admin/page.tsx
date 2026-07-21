'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, FileText, ArrowLeftRight, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock, ChevronRight, RefreshCw,
  Activity, DollarSign
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { StatusBadge } from '@/components/admin/AdminComponents';

function fmtAmt(n: number | null | undefined) {
  if (!n) return '$0';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data.stats || {});
      setRecentUsers(data.recentUsers || []);
      setPendingLoans(data.pendingLoans || []);
      setMonthlyData(data.monthlyData || []);
    } catch (e) {
      // Show empty state if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const kpis = [
    { label: 'Total Users', value: stats.totalUsers?.toLocaleString() || '—', icon: Users, color: '#0A5CFF', bg: '#EEF4FF', change: '+12.4%', up: true },
    { label: 'Total Portfolio', value: fmtAmt(stats.totalBalance), icon: DollarSign, color: '#00C853', bg: '#E8FFF3', change: '+18.7%', up: true },
    { label: 'Pending Loans', value: stats.pendingLoans?.toString() || '0', icon: Clock, color: '#FFB300', bg: '#FFF8E1', change: 'Needs action', up: null },
    { label: 'Active Accounts', value: stats.activeAccounts?.toLocaleString() || '—', icon: Activity, color: '#7C3AED', bg: '#F5F0FF', change: '+8.1%', up: true },
  ];

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time platform overview</p>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8EEF7] text-slate-500 hover:text-[#0A5CFF] hover:border-[#0A5CFF] transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.bg }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              {kpi.up !== null && (
                <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.up ? 'text-[#00C853]' : 'text-[#E53935]'}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </span>
              )}
              {kpi.up === null && (
                <span className="text-xs font-semibold text-[#FFB300] bg-[#FFF8E1] px-2 py-0.5 rounded-full">{kpi.change}</span>
              )}
            </div>
            <p className="text-2xl font-extrabold text-[#0F172A]">{loading ? <span className="shimmer inline-block w-20 h-7 rounded-lg" /> : kpi.value}</p>
            <p className="text-slate-400 text-xs mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-7">
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0F172A] text-sm">Loan Applications 2024</h2>
            <div className="flex gap-3 text-xs">
              {[['Received', '#E8EEF7'], ['Approved', '#0A5CFF'], ['Rejected', '#F64C9C']].map(([l, c]) => (
                <span key={l} className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8EEF7', fontSize: '12px' }} />
              <Bar dataKey="loans" fill="#E8EEF7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="approved" fill="#0A5CFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#F64C9C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0F172A] text-sm">Interest Revenue Trend</h2>
            <span className="text-xs font-bold text-[#00C853]">+26.3% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A5CFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0A5CFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtAmt(v)} />
              <Tooltip formatter={(v: any) => [fmtAmt(Number(v)), 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #E8EEF7', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#0A5CFF" strokeWidth={2.5} fill="url(#revG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EEF7]">
            <h2 className="font-bold text-[#0F172A] text-sm">Recent Registrations</h2>
            <Link href="/admin/users" className="text-xs text-[#0A5CFF] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {recentUsers.length === 0 && !loading ? (
              <p className="text-center py-8 text-slate-400 text-sm">No users yet — <Link href="/admin/users/create" className="text-[#0A5CFF] font-medium">create the first one</Link></p>
            ) : (
              (recentUsers.length ? recentUsers : Array(3).fill(null)).map((user, i) => (
                user ? (
                  <div key={user.user_id} className="flex items-center justify-between px-5 py-3 hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(user.full_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{user.full_name || '—'}</p>
                        <p className="text-xs text-slate-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={user.kyc_status || 'pending'} />
                      <Link href={`/admin/users/${user.user_id}`} className="text-xs text-[#0A5CFF] font-semibold hover:underline">View</Link>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 shimmer flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-slate-100 rounded shimmer w-32" />
                      <div className="h-3 bg-slate-100 rounded shimmer w-20" />
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </div>

        {/* Pending Loans */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EEF7]">
            <h2 className="font-bold text-[#0F172A] text-sm">Pending Approvals</h2>
            <Link href="/admin/loans" className="text-xs text-[#0A5CFF] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {pendingLoans.length === 0 && !loading ? (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 text-[#00C853] mx-auto mb-2 opacity-50" />
                <p className="text-slate-400 text-sm">No pending loans</p>
              </div>
            ) : (
              (pendingLoans.length ? pendingLoans : Array(3).fill(null)).map((loan, i) => (
                loan ? (
                  <div key={loan.id} className="flex items-center justify-between px-5 py-3 hover:bg-blue-50/30 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{loan.profiles?.full_name || '—'}</p>
                      <p className="text-xs text-slate-400 capitalize">{loan.loan_type?.replace('_', ' ')} · {new Date(loan.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0A5CFF]">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(loan.amount)}
                      </span>
                      <Link href="/admin/loans" className="text-xs bg-[#FFF8E1] text-[#FFB300] font-semibold px-2.5 py-1 rounded-full border border-yellow-200 hover:bg-yellow-100 transition-colors">
                        Review
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-slate-100 rounded shimmer w-28" />
                      <div className="h-3 bg-slate-100 rounded shimmer w-20" />
                    </div>
                    <div className="h-6 bg-slate-100 rounded shimmer w-16" />
                  </div>
                )
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
