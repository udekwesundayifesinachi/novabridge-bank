'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard, Plus, Eye, EyeOff, Snowflake, Lock, RefreshCw,
  Settings, Trash2, ArrowUpRight, ShieldCheck, Wifi,
  MoreHorizontal, Globe, Smartphone
} from 'lucide-react';

const cards = [
  {
    id: 1,
    type: 'Virtual',
    brand: 'Visa',
    name: 'JAMES ANDERSON',
    number: '4892 •••• •••• 7234',
    expiry: '12/27',
    balance: 245000,
    status: 'active',
    color: 'from-[#0A5CFF] via-[#0847CC] to-[#06307A]',
    currency: 'USD',
  },
  {
    id: 2,
    type: 'Virtual',
    brand: 'Mastercard',
    name: 'JAMES ANDERSON',
    number: '5412 •••• •••• 9801',
    expiry: '08/26',
    balance: 85000,
    status: 'active',
    color: 'from-[#F64C9C] via-[#d63884] to-[#aa2063]',
    currency: 'USD',
  },
  {
    id: 3,
    type: 'Physical',
    brand: 'Visa',
    name: 'JAMES ANDERSON',
    number: '4751 •••• •••• 3342',
    expiry: '03/28',
    balance: 0,
    status: 'frozen',
    color: 'from-[#1e293b] via-[#334155] to-[#475569]',
    currency: 'USD',
  },
];

const transactions = [
  { name: 'Amazon.com', amount: -12500, date: '2024-08-14', icon: '📦' },
  { name: 'Spotify Premium', amount: -2900, date: '2024-08-12', icon: '🎵' },
  { name: 'Funding', amount: 100000, date: '2024-08-10', icon: '💳' },
  { name: 'Netflix', amount: -6300, date: '2024-08-08', icon: '🎬' },
  { name: 'Uber Eats', amount: -8750, date: '2024-08-06', icon: '🍔' },
];

function fmtAmt(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Math.abs(n));
}

export default function CardsPage() {
  const [selected, setSelected] = useState(0);
  const [showNumber, setShowNumber] = useState(false);
  const [activeCard, setActiveCard] = useState(cards[0]);

  const selectCard = (i: number) => {
    setSelected(i);
    setActiveCard(cards[i]);
    setShowNumber(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">My Cards</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your virtual and physical cards</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-white gradient-primary px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold">
          <Plus className="w-4 h-4" />
          Request New Card
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Card Selector */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {cards.map((card, i) => (
              <button
                key={card.id}
                onClick={() => selectCard(i)}
                className={`flex-shrink-0 text-left transition-all duration-200 rounded-2xl overflow-hidden ${
                  selected === i ? 'ring-2 ring-[#0A5CFF] ring-offset-2' : 'opacity-70 hover:opacity-90'
                }`}
              >
                <div className={`w-64 h-40 bg-gradient-to-br ${card.color} p-5 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/8 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.status === 'active' ? 'bg-[#00C853]/20 text-white' : 'bg-white/20 text-white/70'}`}>
                        {card.status === 'frozen' ? 'FROZEN' : card.type.toUpperCase()}
                      </span>
                      <Wifi className="w-4 h-4 text-white/60 rotate-90" />
                    </div>
                    <div>
                      <p className="text-white/70 font-mono text-xs tracking-widest mb-1">
                        {showNumber && selected === i ? '4892 7234 5678 7234' : card.number}
                      </p>
                      <p className="text-white text-xs font-semibold">{card.name}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Card Details */}
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">{activeCard.brand} {activeCard.type}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Expires: {activeCard.expiry} · {activeCard.currency}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                activeCard.status === 'active'
                  ? 'bg-[#E8FFF3] text-[#00C853]'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {activeCard.status === 'active' ? 'Active' : 'Frozen'}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F8FAFC] rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Card Number</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-semibold text-[#0F172A]">
                    {showNumber ? '4892 7234 5678 7234' : activeCard.number}
                  </p>
                  <button onClick={() => setShowNumber(!showNumber)} className="text-slate-400 hover:text-slate-600">
                    {showNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">CVV</p>
                <p className="text-sm font-mono font-semibold text-[#0F172A]">{showNumber ? '452' : '•••'}</p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Expiry Date</p>
                <p className="text-sm font-semibold text-[#0F172A]">{activeCard.expiry}</p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Balance</p>
                <p className="text-sm font-bold text-[#0A5CFF]">{fmtAmt(activeCard.balance)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Fund Card', icon: Plus, color: '#0A5CFF' },
                { label: activeCard.status === 'frozen' ? 'Unfreeze' : 'Freeze', icon: Lock, color: '#FFB300' },
                { label: 'Replace', icon: RefreshCw, color: '#7C3AED' },
                { label: 'Settings', icon: Settings, color: '#64748b' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
                    style={{ background: `${action.color}15` }}
                  >
                    <action.icon className="w-4 h-4" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Transactions + Security */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card Transactions */}
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Card Transactions</h3>
            <div className="space-y-3">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-base flex-shrink-0">
                    {tx.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{tx.name}</p>
                    <p className="text-xs text-slate-400">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-[#00C853]' : 'text-[#0F172A]'}`}>
                    {tx.amount > 0 ? '+' : '-'}{fmtAmt(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Card Security</h3>
            <div className="space-y-3">
              {[
                { label: 'Online Transactions', enabled: true, icon: Globe },
                { label: 'Contactless Payments', enabled: true, icon: Wifi },
                { label: 'International Use', enabled: false, icon: ShieldCheck },
                { label: 'ATM Withdrawals', enabled: true, icon: Smartphone },
              ].map((feature) => (
                <div key={feature.label} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700 font-medium">{feature.label}</span>
                  </div>
                  <button
                    className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
                      feature.enabled ? 'bg-[#0A5CFF]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        feature.enabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
