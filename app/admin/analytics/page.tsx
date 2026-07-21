'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function fmtAmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const monthly = data?.monthlyData || [];
  const breakdown = data?.loanBreakdown || [];
  const summary = data?.summary || {};

  return (
    <div className="p-5 lg:p-7">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Analytics & Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">Platform performance metrics — live data</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Portfolio', value: fmtAmt(summary.totalBalance || 0), color: '#0A5CFF', bg: '#EEF4FF' },
          { label: 'Total Savings', value: fmtAmt(summary.totalSavings || 0), color: '#00C853', bg: '#E8FFF3' },
          { label: 'Loans Disbursed', value: fmtAmt(summary.totalLoanAmount || 0), color: '#F64C9C', bg: '#FFF0F7' },
          { label: 'Total Transactions', value: (summary.totalTransactions || 0).toLocaleString(), color: '#7C3AED', bg: '#F5F0FF' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 card-shadow">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-xl font-extrabold" style={{ color: s.color }}>
              {loading ? <span className="shimmer inline-block w-16 h-6 rounded" /> : s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="font-bold text-[#0F172A] text-sm mb-5">User Growth (Last 8 Months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8EEF7', fontSize: '12px' }} />
              <Line type="monotone" dataKey="users" stroke="#0A5CFF" strokeWidth={2.5} dot={{ fill: '#0A5CFF', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="font-bold text-[#0F172A] text-sm mb-5">Monthly Revenue ($)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={fmtAmt} />
              <Tooltip formatter={(v: any) => [fmtAmt(Number(v)), 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #E8EEF7', fontSize: '12px' }} />
              <Bar dataKey="revenue" fill="#0A5CFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Volume */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="font-bold text-[#0F172A] text-sm mb-5">Loan Applications (Monthly)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8EEF7', fontSize: '12px' }} />
              <Bar dataKey="loans" fill="#00C853" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loan type breakdown */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="font-bold text-[#0F172A] text-sm mb-5">Loan Portfolio Breakdown</h2>
          {breakdown.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-20">No loan data available</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={breakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {breakdown.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v} loans`, '']} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 flex-1">
                {breakdown.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                      <span className="text-slate-600 text-xs">{item.name}</span>
                    </div>
                    <span className="font-bold text-xs text-[#0F172A]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
