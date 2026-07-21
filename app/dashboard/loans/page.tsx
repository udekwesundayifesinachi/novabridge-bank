'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText, Plus, Clock, CheckCircle, XCircle, 
  TrendingUp, AlertCircle, ChevronRight, Download,
  Calculator, Sliders
} from 'lucide-react';

const loans = [
  {
    id: 1,
    type: 'Personal Loan',
    amount: 500000,
    outstanding: 200000,
    repaid: 300000,
    rate: '2.5%',
    tenure: 24,
    remaining: 14,
    nextPayment: '2024-09-01',
    nextAmount: 35000,
    status: 'active',
    disbursed: '2024-03-01',
  },
];

const loanProducts = [
  { name: 'Personal Loan', min: '$50K', max: '$5M', rate: '2.5%/mo', tenure: '24 mo', icon: '👤', color: '#0A5CFF' },
  { name: 'Salary Advance', min: '1x', max: '3x salary', rate: '1.5%/mo', tenure: '6 mo', icon: '💼', color: '#00C853' },
  { name: 'Business Loan', min: '$500K', max: '$50M', rate: '2%/mo', tenure: '36 mo', icon: '🏢', color: '#7C3AED' },
  { name: 'Emergency Loan', min: '$20K', max: '$500K', rate: '3%/mo', tenure: '3 mo', icon: '🚨', color: '#E53935' },
];

function fmtAmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function LoansPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(12);
  const monthlyRate = 0.025;
  const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalRepayable = emi * tenure;
  const totalInterest = totalRepayable - loanAmount;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Loans</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your loans and applications</p>
        </div>
        <Link
          href="/dashboard/loans/apply"
          className="flex items-center gap-2 text-sm text-white gradient-primary px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold"
        >
          <Plus className="w-4 h-4" />
          Apply for Loan
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Active Loans + Calculator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Loan */}
          {loans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-2xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#0A5CFF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A]">{loan.type}</h3>
                    <p className="text-xs text-slate-400">Disbursed {loan.disbursed}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-[#E8FFF3] text-[#00C853] px-3 py-1 rounded-full">Active</span>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-400 mb-1">Total Loan</p>
                  <p className="text-lg font-extrabold text-[#0F172A]">{fmtAmt(loan.amount)}</p>
                </div>
                <div className="bg-[#E8FFF3] rounded-xl p-4 text-center">
                  <p className="text-xs text-[#00C853] mb-1">Repaid</p>
                  <p className="text-lg font-extrabold text-[#00C853]">{fmtAmt(loan.repaid)}</p>
                </div>
                <div className="bg-[#FFF0F7] rounded-xl p-4 text-center">
                  <p className="text-xs text-[#F64C9C] mb-1">Outstanding</p>
                  <p className="text-lg font-extrabold text-[#F64C9C]">{fmtAmt(loan.outstanding)}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>{Math.round((loan.repaid / loan.amount) * 100)}% repaid</span>
                  <span>{loan.remaining} months remaining</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="progress-bar h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(loan.repaid / loan.amount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Next Payment */}
              <div className="flex items-center justify-between bg-[#EEF4FF] rounded-2xl p-4">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Next Payment</p>
                  <p className="text-base font-bold text-[#0A5CFF]">{fmtAmt(loan.nextAmount)}</p>
                  <p className="text-xs text-slate-400">Due: {loan.nextPayment}</p>
                </div>
                <button className="gradient-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Pay Now
                </button>
              </div>
            </div>
          ))}

          {/* EMI Calculator */}
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#0A5CFF]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">EMI Calculator</h3>
                <p className="text-xs text-slate-400">Estimate your monthly payments</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Loan Amount</label>
                  <span className="text-sm font-bold text-[#0A5CFF]">{fmtAmt(loanAmount)}</span>
                </div>
                <input
                  type="range" min={50000} max={5000000} step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#0A5CFF] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>$50K</span><span>$5M</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Loan Duration</label>
                  <span className="text-sm font-bold text-[#0A5CFF]">{tenure} months</span>
                </div>
                <input
                  type="range" min={1} max={24} step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full accent-[#0A5CFF] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1 mo</span><span>24 mo</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-[#F8FAFC] rounded-2xl p-5">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">Monthly EMI</p>
                  <p className="text-base font-extrabold text-[#0A5CFF]">{fmtAmt(emi)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">Total Repay</p>
                  <p className="text-base font-extrabold text-[#0F172A]">{fmtAmt(totalRepayable)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">Total Interest</p>
                  <p className="text-base font-extrabold text-[#F64C9C]">{fmtAmt(totalInterest)}</p>
                </div>
              </div>

              <Link
                href="/dashboard/loans/apply"
                className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Apply for This Loan <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Products */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Loan Products</h3>
            <div className="space-y-3">
              {loanProducts.map((product) => (
                <Link
                  key={product.name}
                  href="/dashboard/loans/apply"
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{ background: `${product.color}15` }}
                  >
                    {product.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A]">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.min} – {product.max}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs font-medium" style={{ color: product.color }}>{product.rate}</span>
                      <span className="text-xs text-slate-400">{product.tenure}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0A5CFF] transition-colors flex-shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>

          {/* Loan Status Tracker (No Active Application) */}
          <div className="bg-gradient-to-br from-[#EEF4FF] to-white rounded-2xl p-5 card-shadow border border-[#E8EEF7]">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Need More Funds?</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Your credit score qualifies you for up to $2,000,000 in additional loans.
            </p>
            <Link
              href="/dashboard/loans/apply"
              className="w-full gradient-primary text-white font-bold py-3 rounded-xl text-sm shadow-md text-center block hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Apply Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
