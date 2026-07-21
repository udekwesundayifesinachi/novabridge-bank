'use client';

import { useState } from 'react';
import { TrendingUp, Plus, Target, PiggyBank, Lock, Unlock, ArrowRight } from 'lucide-react';

const savingsPlans = [
  {
    id: 1,
    name: 'Emergency Fund',
    type: 'Flexible',
    balance: 250000,
    target: 400000,
    rate: '18% p.a.',
    color: '#0A5CFF',
    bg: '#EEF4FF',
    started: '2024-01-15',
    locked: false,
  },
  {
    id: 2,
    name: 'House Project',
    type: 'Fixed Deposit',
    balance: 850000,
    target: 2000000,
    rate: '22% p.a.',
    color: '#00C853',
    bg: '#E8FFF3',
    started: '2024-03-01',
    locked: true,
    matures: '2025-03-01',
  },
  {
    id: 3,
    name: 'Vacation 2025',
    type: 'Target Savings',
    balance: 120000,
    target: 500000,
    rate: '18% p.a.',
    color: '#F64C9C',
    bg: '#FFF0F7',
    started: '2024-06-01',
    locked: false,
  },
];

const savingsProducts = [
  { name: 'Flexible Savings', rate: '18% p.a.', minBalance: '$1,000', access: 'Anytime', icon: '💰' },
  { name: 'Fixed Deposit', rate: '22% p.a.', minBalance: '$100,000', access: '30–365 days', icon: '🔒' },
  { name: 'Target Savings', rate: '18% p.a.', minBalance: '$500', access: 'Goal-based', icon: '🎯' },
];

function fmtAmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function SavingsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const totalSavings = savingsPlans.reduce((s, p) => s + p.balance, 0);
  const totalInterestEarned = 42500;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Savings</h1>
          <p className="text-slate-500 text-sm mt-1">Grow your wealth with competitive interest rates</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 text-sm text-white gradient-primary px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold"
        >
          <Plus className="w-4 h-4" />
          New Savings Plan
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Savings', value: fmtAmt(totalSavings), icon: PiggyBank, color: '#0A5CFF', bg: '#EEF4FF' },
          { label: 'Interest Earned', value: fmtAmt(totalInterestEarned), icon: TrendingUp, color: '#00C853', bg: '#E8FFF3' },
          { label: 'Active Plans', value: `${savingsPlans.length} Plans`, icon: Target, color: '#F64C9C', bg: '#FFF0F7' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-xl font-extrabold text-[#0F172A]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Plans */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-base font-bold text-[#0F172A]">My Savings Plans</h2>
          {savingsPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl p-6 card-shadow banking-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: plan.bg }}>
                    {plan.locked ? '🔒' : '💰'}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A]">{plan.name}</h3>
                    <p className="text-xs text-slate-400">{plan.type} · Started {plan.started}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold" style={{ color: plan.color }}>{plan.rate}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${plan.locked ? 'bg-[#FFF8E1] text-[#FFB300]' : 'bg-[#E8FFF3] text-[#00C853]'}`}>
                    {plan.locked ? 'Locked' : 'Flexible'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Current Balance</p>
                  <p className="text-lg font-extrabold" style={{ color: plan.color }}>{fmtAmt(plan.balance)}</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Target Amount</p>
                  <p className="text-lg font-extrabold text-[#0F172A]">{fmtAmt(plan.target)}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>{Math.round((plan.balance / plan.target) * 100)}% of goal</span>
                  <span>{fmtAmt(plan.target - plan.balance)} remaining</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(plan.balance / plan.target) * 100}%`, background: plan.color }} />
                </div>
              </div>

              {plan.matures && (
                <p className="text-xs text-slate-400 mt-2">Matures: {plan.matures}</p>
              )}

              <div className="flex gap-3 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 gradient-primary text-white font-semibold py-2.5 rounded-xl text-xs shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Add Funds
                </button>
                {!plan.locked && (
                  <button className="flex-1 flex items-center justify-center gap-2 border-2 border-[#E8EEF7] text-slate-600 font-semibold py-2.5 rounded-xl text-xs hover:border-red-200 hover:text-red-500 transition-colors">
                    <Unlock className="w-3.5 h-3.5" /> Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Products */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Savings Products</h3>
            <div className="space-y-3">
              {savingsProducts.map((product) => (
                <div key={product.name} className="bg-[#F8FAFC] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{product.icon}</span>
                    <span className="text-sm font-bold text-[#0F172A]">{product.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      ['Rate', product.rate],
                      ['Min Balance', product.minBalance],
                      ['Access', product.access],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span className="text-slate-400">{label}</span>
                        <span className="font-semibold text-[#0F172A]">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 flex items-center justify-center gap-2 gradient-primary text-white font-semibold py-2 rounded-xl text-xs shadow-sm">
                    Open Plan <ArrowRight className="w-3 h-3" />
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
