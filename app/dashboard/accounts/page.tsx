'use client';

import { useState } from 'react';
import { Wallet, Plus, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, CreditCard, ChevronRight, Copy } from 'lucide-react';

const ACCOUNTS = [
  {
    id: 1,
    type: 'Main Wallet',
    accountNumber: '489123456789',
    balance: 2847500,
    currency: 'USD',
    color: 'from-[#0A5CFF] via-[#0847CC] to-[#06307A]',
    bankName: 'NovabridgeBank',
  },
  {
    id: 2,
    type: 'Savings Account',
    accountNumber: '489123456790',
    balance: 540000,
    currency: 'USD',
    color: 'from-[#00C853] via-[#00a844] to-[#007d32]',
    bankName: 'NovabridgeBank',
  },
  {
    id: 3,
    type: 'USD Wallet',
    accountNumber: '489123456791',
    balance: 1250,
    currency: 'USD',
    color: 'from-[#7C3AED] via-[#6d28d9] to-[#4c1d95]',
    bankName: 'NovabridgeBank',
  },
];

function fmtAmt(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}

export default function AccountsPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">My Accounts</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all your NovabridgeBank accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setBalanceVisible(!balanceVisible)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2.5 rounded-xl card-shadow hover:shadow-md transition-shadow">
            {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {balanceVisible ? 'Hide' : 'Show'} Balance
          </button>
          <button className="flex items-center gap-2 text-sm text-white gradient-primary px-4 py-2.5 rounded-xl shadow-md font-semibold">
            <Plus className="w-4 h-4" /> New Account
          </button>
        </div>
      </div>

      {/* Total Balance */}
      <div className="gradient-hero rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-white/60 text-sm font-medium mb-2">Total Portfolio Value</p>
        <p className="text-5xl font-extrabold mb-1">
          {balanceVisible ? '$3,387,500' : '$•••,•••,•••'}
        </p>
        <p className="text-white/50 text-sm">Across {ACCOUNTS.length} accounts</p>
        <div className="flex gap-4 mt-6">
          <button className="flex items-center gap-2 bg-white text-[#0A5CFF] font-bold px-5 py-2.5 rounded-xl text-sm shadow-md hover:-translate-y-0.5 transition-all">
            <ArrowUpRight className="w-4 h-4" /> Send Money
          </button>
          <button className="flex items-center gap-2 bg-white/15 border border-white/25 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/25 transition-colors">
            <ArrowDownLeft className="w-4 h-4" /> Receive
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {ACCOUNTS.map((account) => (
          <div key={account.id} className="bg-white rounded-2xl overflow-hidden card-shadow banking-card">
            {/* Card Header */}
            <div className={`bg-gradient-to-br ${account.color} p-5 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/8 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-white/70 text-xs font-medium">{account.type}</p>
                  <p className="text-2xl font-extrabold mt-1">
                    {balanceVisible ? fmtAmt(account.balance, account.currency) : '•••,•••'}
                  </p>
                </div>
                <Wallet className="w-6 h-6 text-white/60" />
              </div>
              <div className="flex items-center gap-2 mt-3 relative z-10">
                <span className="font-mono text-xs text-white/70">{account.accountNumber}</span>
                <button
                  onClick={() => copyToClipboard(account.accountNumber, String(account.id))}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copied === String(account.id) && <span className="text-xs text-[#00C853]">Copied!</span>}
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-4 grid grid-cols-3 gap-2">
              {[
                { label: 'Add Money', icon: ArrowDownLeft, color: '#00C853' },
                { label: 'Transfer', icon: ArrowUpRight, color: '#0A5CFF' },
                { label: 'History', icon: ChevronRight, color: '#7C3AED' },
              ].map((action) => (
                <button key={action.label} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${action.color}15` }}>
                    <action.icon className="w-4 h-4" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Virtual Account Number */}
      <div className="bg-[#EEF4FF] rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#0A5CFF] flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#0F172A] mb-1">Your Virtual Account Number</h3>
            <p className="text-sm text-slate-600 mb-3">Share this to receive payments from any US bank</p>
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-blue-100 w-fit">
              <div>
                <p className="text-xs text-slate-400">Account Number</p>
                <p className="font-mono font-bold text-[#0A5CFF] text-lg">4891 2345 6789</p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-xs text-slate-400">Bank</p>
                <p className="font-semibold text-slate-700 text-sm">NovabridgeBank</p>
              </div>
              <button
                onClick={() => copyToClipboard('489123456789', 'virtual')}
                className="ml-2 p-2 rounded-lg bg-[#EEF4FF] text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied === 'virtual' && <span className="text-xs text-[#00C853] font-medium">Copied!</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
