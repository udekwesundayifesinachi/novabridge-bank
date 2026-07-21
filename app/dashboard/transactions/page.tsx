'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpDown, Search, Filter, Download, ArrowUpRight,
  ArrowDownLeft, ChevronLeft, ChevronRight
} from 'lucide-react';

const ALL_TRANSACTIONS = [
  { id: 1, name: 'Whole Foods Market', type: 'debit', amount: 24500, category: 'Shopping', date: '2024-08-15', time: '14:32', ref: 'TXN-001', status: 'completed', icon: '🛒' },
  { id: 2, name: 'Salary — ABC Corp', type: 'credit', amount: 580000, category: 'Income', date: '2024-08-14', time: '09:00', ref: 'TXN-002', status: 'completed', icon: '💼' },
  { id: 3, name: 'Verizon Airtime $5,000', type: 'debit', amount: 5000, category: 'Bills', date: '2024-08-13', time: '18:05', ref: 'TXN-003', status: 'completed', icon: '📱' },
  { id: 4, name: 'Transfer to Sarah Johnson', type: 'debit', amount: 50000, category: 'Transfer', date: '2024-08-12', time: '11:20', ref: 'TXN-004', status: 'completed', icon: '💸' },
  { id: 5, name: 'Loan Repayment', type: 'debit', amount: 35000, category: 'Loan', date: '2024-08-10', time: '08:00', ref: 'TXN-005', status: 'completed', icon: '🏦' },
  { id: 6, name: 'Freelance Payment', type: 'credit', amount: 150000, category: 'Income', date: '2024-08-09', time: '15:40', ref: 'TXN-006', status: 'completed', icon: '💻' },
  { id: 7, name: 'Comcast Subscription', type: 'debit', amount: 29000, category: 'Bills', date: '2024-08-08', time: '10:15', ref: 'TXN-007', status: 'completed', icon: '📺' },
  { id: 8, name: 'Amazon Purchase', type: 'debit', amount: 18750, category: 'Shopping', date: '2024-08-07', time: '20:30', ref: 'TXN-008', status: 'completed', icon: '📦' },
  { id: 9, name: 'Interest Credit', type: 'credit', amount: 8500, category: 'Interest', date: '2024-08-05', time: '00:01', ref: 'TXN-009', status: 'completed', icon: '💰' },
  { id: 10, name: 'Uber Ride', type: 'debit', amount: 4200, category: 'Transport', date: '2024-08-04', time: '19:45', ref: 'TXN-010', status: 'completed', icon: '🚗' },
  { id: 11, name: 'Netflix Subscription', type: 'debit', amount: 6300, category: 'Entertainment', date: '2024-08-03', time: '00:00', ref: 'TXN-011', status: 'completed', icon: '🎬' },
  { id: 12, name: 'Refund — Amazon', type: 'credit', amount: 12000, category: 'Refund', date: '2024-08-02', time: '12:30', ref: 'TXN-012', status: 'completed', icon: '↩️' },
];

const categories = ['All', 'Income', 'Shopping', 'Bills', 'Transfer', 'Loan', 'Transport', 'Entertainment', 'Refund'];

function fmtAmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = ALL_TRANSACTIONS.filter((tx) => {
    const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) || tx.ref.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || tx.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalIn = ALL_TRANSACTIONS.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalOut = ALL_TRANSACTIONS.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">Full history of your account activity</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-white gradient-primary px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Income', value: totalIn, icon: ArrowDownLeft, color: '#00C853', bg: '#E8FFF3' },
          { label: 'Total Expenses', value: totalOut, icon: ArrowUpRight, color: '#E53935', bg: '#FFF0EF' },
          { label: 'Net Balance', value: totalIn - totalOut, icon: ArrowUpDown, color: '#0A5CFF', bg: '#EEF4FF' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-xl font-extrabold text-[#0F172A]">{fmtAmt(s.value)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 card-shadow mb-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or reference..."
              className="input-field pl-10 text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  category === cat
                    ? 'gradient-primary text-white shadow-sm'
                    : 'bg-[#F8FAFC] text-slate-600 hover:bg-slate-100 border border-[#E8EEF7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th className="text-left">Transaction</th>
                <th className="text-left">Category</th>
                <th className="text-left">Date & Time</th>
                <th className="text-left">Reference</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx) => (
                <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${tx.type === 'credit' ? 'bg-[#E8FFF3]' : 'bg-[#F8FAFC]'}`}>
                        {tx.icon}
                      </div>
                      <span className="font-semibold text-[#0F172A] text-sm">{tx.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{tx.category}</span>
                  </td>
                  <td className="text-slate-500 text-sm">{tx.date} <span className="text-slate-400">{tx.time}</span></td>
                  <td className="font-mono text-xs text-slate-400">{tx.ref}</td>
                  <td className="text-right">
                    <span className={`font-bold text-sm ${tx.type === 'credit' ? 'text-[#00C853]' : 'text-[#0F172A]'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{fmtAmt(tx.amount)}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#E8FFF3] text-[#00C853] px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                      Done
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-[#E8EEF7]">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-[#E8EEF7] text-slate-500 hover:border-[#0A5CFF] hover:text-[#0A5CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                  page === i + 1
                    ? 'gradient-primary text-white shadow-sm'
                    : 'border border-[#E8EEF7] text-slate-500 hover:border-[#0A5CFF]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-[#E8EEF7] text-slate-500 hover:border-[#0A5CFF] hover:text-[#0A5CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
