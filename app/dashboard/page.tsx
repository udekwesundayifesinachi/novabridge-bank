'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, CreditCard,
  Wallet, FileText, Send, Plus, Receipt, Phone, Zap,
  Eye, EyeOff, RefreshCw, Bell, ChevronRight, PiggyBank, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { supabase } from '@/lib/supabase';

const spendingColors = ['#0A5CFF', '#F64C9C', '#FFB300', '#00C853', '#7C3AED'];

const quickActions = [
  { label: 'Send Money', icon: Send, color: '#0A5CFF', href: '/dashboard/transfers' },
  { label: 'Add Money', icon: Plus, color: '#00C853', href: '/dashboard/accounts' },
  { label: 'Pay Bills', icon: Receipt, color: '#FFB300', href: '/dashboard/bills' },
  { label: 'Airtime', icon: Phone, color: '#F64C9C', href: '/dashboard/bills' },
  { label: 'Get Loan', icon: FileText, color: '#7C3AED', href: '/dashboard/loans' },
  { label: 'Cards', icon: CreditCard, color: '#E53935', href: '/dashboard/cards' },
];

function fmtAmt(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export default function DashboardPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [savings, setSavings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      setUser(authUser);

      const [
        { data: profileData },
        { data: accountsData },
        { data: loansData },
        { data: txData },
        { data: savingsData },
        { data: notifData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', authUser.id).maybeSingle(),
        supabase.from('accounts').select('*').eq('user_id', authUser.id).order('created_at'),
        supabase.from('loans').select('*').eq('user_id', authUser.id).eq('status', 'disbursed').limit(3),
        supabase.from('transactions').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }).limit(8),
        supabase.from('savings_plans').select('*').eq('user_id', authUser.id).eq('status', 'active').limit(3),
        supabase.from('notifications').select('*').eq('user_id', authUser.id).eq('read', false).order('created_at', { ascending: false }).limit(5),
      ]);

      setProfile(profileData);
      setAccounts(accountsData || []);
      setLoans(loansData || []);
      setTransactions(txData || []);
      setSavings(savingsData || []);
      setNotifications(notifData || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const mainAccount = accounts.find((a) => a.account_type === 'savings' || a.account_type === 'wallet') || accounts[0];
  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);
  const savingsBalance = accounts.filter((a) => a.account_type === 'savings').reduce((s, a) => s + (a.balance || 0), 0);
  const activeLoanBalance = loans.reduce((s, l) => s + (l.outstanding_balance || 0), 0);
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  // Build spending breakdown from real transactions
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t: any) => {
    if (t.type === 'debit') {
      const cat = t.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (t.amount || 0);
    }
  });
  const spendingData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Build income vs expense by month from real transactions
  const now = new Date();
  const monthlyMap: Record<string, { income: number; expense: number }> = {};
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString('en-US', { month: 'short' });
    monthlyMap[label] = { income: 0, expense: 0 };
  }
  transactions.forEach((t: any) => {
    if (!t.created_at) return;
    const d = new Date(t.created_at);
    const label = d.toLocaleDateString('en-US', { month: 'short' });
    if (monthlyMap[label]) {
      if (t.type === 'credit') monthlyMap[label].income += t.amount || 0;
      else monthlyMap[label].expense += t.amount || 0;
    }
  });
  const areaData = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {displayName.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's your financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <Link href="/dashboard/notifications" className="relative p-2 rounded-xl bg-white border border-[#E8EEF7] text-slate-500 hover:text-[#0A5CFF]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#F64C9C] rounded-full" />
            </Link>
          )}
          <button onClick={fetchDashboardData} className={`flex items-center gap-2 text-sm text-[#0A5CFF] bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors font-medium ${loading ? 'animate-pulse' : ''}`}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {/* Main Balance */}
        <div className="sm:col-span-2 xl:col-span-1 gradient-hero rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70 font-medium">
                {mainAccount?.account_name || 'Total Balance'}
              </span>
            </div>
            <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-white/60 hover:text-white">
              {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-3xl font-extrabold mb-1">
            {loading ? '…' : balanceVisible ? fmtAmt(totalBalance) : '$••••••'}
          </p>
          <p className="text-white/60 text-xs">{mainAccount?.account_number ? `Acct: ••••${mainAccount.account_number.slice(-4)}` : 'Account'}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#00C853]" />
            <span className="text-xs text-white/70">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Savings */}
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#E8FFF3] flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-[#00C853]" />
            </div>
            <span className="text-xs font-medium text-[#00C853] bg-[#E8FFF3] px-2 py-1 rounded-full">
              {savings.length} plan{savings.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {loading ? '…' : balanceVisible ? fmtAmt(savings.reduce((s, p) => s + (p.balance || 0), 0)) : '$••••••'}
          </p>
          <p className="text-slate-500 text-xs mt-1">Savings Balance</p>
        </div>

        {/* Active Loan */}
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F7] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#F64C9C]" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${loans.length ? 'bg-[#FFF0F7] text-[#F64C9C]' : 'bg-[#E8FFF3] text-[#00C853]'}`}>
              {loans.length > 0 ? 'Active' : 'None'}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {loading ? '…' : balanceVisible ? fmtAmt(activeLoanBalance) : '$••••••'}
          </p>
          <p className="text-slate-500 text-xs mt-1">Outstanding Loans</p>
        </div>

        {/* Available Credit */}
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#0A5CFF]" />
            </div>
            <span className="text-xs font-medium text-[#0A5CFF] bg-[#EEF4FF] px-2 py-1 rounded-full">
              {profile?.account_tier || 'Starter'}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {balanceVisible ? (profile?.account_tier === 'premium' ? '$5,000,000' : profile?.account_tier === 'business' ? '$50,000,000' : '$1,500,000') : '$••••••'}
          </p>
          <Link href="/dashboard/loans" className="text-[#0A5CFF] text-xs font-semibold flex items-center gap-1 mt-1 hover:gap-2 transition-all">
            Apply Now <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 card-shadow mb-8">
        <h2 className="text-base font-bold text-[#0F172A] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm" style={{ background: `${action.color}15` }}>
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-xs font-medium text-slate-600 text-center leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Income vs Expenses</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly overview 2024</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#0A5CFF]" /><span className="text-slate-500">Income</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#F64C9C]" /><span className="text-slate-500">Expenses</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A5CFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0A5CFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F64C9C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F64C9C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid #E8EEF7', fontSize: '12px' }} />
              <Area type="monotone" dataKey="income" stroke="#0A5CFF" strokeWidth={2.5} fill="url(#incG)" />
              <Area type="monotone" dataKey="expense" stroke="#F64C9C" strokeWidth={2.5} fill="url(#expG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="text-base font-bold text-[#0F172A] mb-1">Spending Breakdown</h2>
          <p className="text-xs text-slate-400 mb-4">This month</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={spendingData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {spendingData.map((_, i) => <Cell key={i} fill={spendingColors[i % spendingColors.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`, '']} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {spendingData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: spendingColors[i] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#0F172A]">Recent Transactions</h2>
          <Link href="/dashboard/transactions" className="text-xs text-[#0A5CFF] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-slate-100 shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-100 shimmer rounded w-32" />
                  <div className="h-3 bg-slate-100 shimmer rounded w-20" />
                </div>
                <div className="h-4 bg-slate-100 shimmer rounded w-20" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <ArrowLeftRight className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 bg-[#F8FAFC]">
                  {tx.type === 'credit' ? '💰' : tx.category === 'Bills' ? '📱' : tx.category === 'Transfer' ? '💸' : tx.category === 'Loan' ? '🏦' : '🛒'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{tx.description || 'Transaction'}</p>
                  <p className="text-xs text-slate-400">{tx.category || 'Other'} · {new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-[#00C853]' : 'text-[#0F172A]'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{fmtAmt(tx.amount)}
                  </p>
                  <p className={`text-xs ${tx.type === 'credit' ? 'text-[#00C853]' : 'text-slate-400'}`}>
                    {tx.type === 'credit' ? 'Credit' : 'Debit'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
