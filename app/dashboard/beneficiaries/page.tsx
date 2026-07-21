'use client';

import { useState } from 'react';
import { Users, Plus, Star, Trash2, Search, Send } from 'lucide-react';
import Link from 'next/link';

const BENEFICIARIES = [
  { id: 1, name: 'Sarah Johnson', bank: 'Chase', account: '012345678901', avatar: 'SJ', color: '#0A5CFF', favorite: true },
  { id: 2, name: 'David Smith', bank: 'Bank of America', account: '098765432109', avatar: 'DS', color: '#00C853', favorite: true },
  { id: 3, name: 'Emily Brown', bank: 'Wells Fargo', account: '123456789012', avatar: 'EB', color: '#F64C9C', favorite: false },
  { id: 4, name: 'Chris Davis', bank: 'Citibank', account: '987654321098', avatar: 'CD', color: '#7C3AED', favorite: false },
  { id: 5, name: 'Brian Wilson', bank: 'Goldman Sachs', account: '567890123456', avatar: 'BW', color: '#FFB300', favorite: true },
  { id: 6, name: 'Ian Moore', bank: 'Capital One', account: '432109876543', avatar: 'IM', color: '#E53935', favorite: false },
];

export default function BeneficiariesPage() {
  const [search, setSearch] = useState('');
  const [beneficiaries, setBeneficiaries] = useState(BENEFICIARIES);

  const filtered = beneficiaries.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.bank.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFav = (id: number) => {
    setBeneficiaries((prev) => prev.map((b) => b.id === id ? { ...b, favorite: !b.favorite } : b));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Beneficiaries</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your saved payment recipients</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-white gradient-primary px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" className="input-field pl-11" placeholder="Search beneficiaries..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Favorites */}
      {beneficiaries.filter((b) => b.favorite).length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Favorites</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {beneficiaries.filter((b) => b.favorite).map((b) => (
              <div key={b.id} className="flex flex-col items-center gap-2 flex-shrink-0">
                <Link href="/dashboard/transfers">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer" style={{ background: b.color }}>
                    {b.avatar}
                  </div>
                </Link>
                <p className="text-xs font-medium text-slate-600 text-center max-w-[56px] truncate">{b.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Beneficiaries */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EEF7]">
          <h2 className="text-sm font-bold text-[#0F172A]">All Beneficiaries ({filtered.length})</h2>
        </div>
        <div className="divide-y divide-[#E8EEF7]">
          {filtered.map((b) => (
            <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors group">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm" style={{ background: b.color }}>
                {b.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0F172A] text-sm">{b.name}</p>
                <p className="text-xs text-slate-400">{b.bank} · {b.account}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href="/dashboard/transfers"
                  className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white shadow-sm hover:shadow-md transition-shadow">
                  <Send className="w-3.5 h-3.5" />
                </Link>
                <button onClick={() => toggleFav(b.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${b.favorite ? 'bg-[#FFF8E1] text-[#FFB300]' : 'bg-slate-100 text-slate-400 hover:text-[#FFB300] hover:bg-[#FFF8E1]'}`}>
                  <Star className={`w-3.5 h-3.5 ${b.favorite ? 'fill-[#FFB300]' : ''}`} />
                </button>
                <button className="w-9 h-9 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
