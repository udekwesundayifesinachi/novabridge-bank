'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, User, Wallet, FileText, ArrowLeftRight,
  PiggyBank, CreditCard, Bell, Save, Trash2, Plus,
  Edit2, Eye, EyeOff, Camera, CheckCircle2, XCircle,
  UserX, UserCheck, RefreshCw, ChevronDown
} from 'lucide-react';
import {
  ConfirmDialog, StatusBadge, AdminToast, AdminModal,
  AdminInput, AdminSelect, AdminTextarea
} from '@/components/admin/AdminComponents';

const TABS = ['Profile', 'Accounts', 'Transactions', 'Loans', 'Savings', 'Notifications'];

function fmtAmt(n: number | null | undefined, currency = 'USD') {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUserDetailPage() {
  const { id: userId } = useParams() as { id: string };
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Modals
  const [confirmDialog, setConfirmDialog] = useState<any>(null);
  const [txnModal, setTxnModal] = useState(false);
  const [acctModal, setAcctModal] = useState(false);
  const [savingsModal, setSavingsModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [editAcctModal, setEditAcctModal] = useState<any>(null);
  const [editSavingsModal, setEditSavingsModal] = useState<any>(null);
  const [editTxnModal, setEditTxnModal] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // New transaction form
  const [txnForm, setTxnForm] = useState({ type: 'credit', amount: '', description: '', category: 'Admin', account_id: '', notes: '' });
  // New account form
  const [acctForm, setAcctForm] = useState({ account_type: 'savings', account_name: 'Savings Account', balance: '0', currency: 'USD' });
  // New savings form
  const [savingsForm, setSavingsForm] = useState({ name: '', plan_type: 'flexible', balance: '0', target_amount: '', annual_rate: '0.18' });
  // Notification form
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'info' });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setProfileForm({
        full_name: json.profile?.full_name || '',
        email: json.auth?.email || '',
        phone: json.profile?.phone || '',
        ssn: json.profile?.ssn || '',
        drivers_license: json.profile?.drivers_license || '',
        date_of_birth: json.profile?.date_of_birth || '',
        address: json.profile?.address || '',
        account_tier: json.profile?.account_tier || 'starter',
        kyc_status: json.profile?.kyc_status || 'pending',
        status: json.profile?.status || 'active',
        is_admin: json.profile?.is_admin || false,
        admin_notes: json.profile?.admin_notes || '',
        avatar_url: json.profile?.avatar_url || '',
      });
    } catch (err: any) {
      showToast('Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateProfile = async () => {
    setSaving(true);
    try {
      const payload: any = { ...profileForm };
      if (newPassword) payload.password = newPassword;
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Profile updated successfully', 'success');
      setNewPassword('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateAccount = async (id: string, updates: any) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Account updated', 'success');
      setEditAcctModal(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const createAccount = async () => {
    setModalLoading(true);
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...acctForm, user_id: userId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Account created', 'success');
      setAcctModal(false);
      setAcctForm({ account_type: 'savings', account_name: 'Savings Account', balance: '0', currency: 'USD' });
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const createTransaction = async () => {
    setModalLoading(true);
    try {
      const res = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...txnForm, user_id: userId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Transaction created', 'success');
      setTxnModal(false);
      setTxnForm({ type: 'credit', amount: '', description: '', category: 'Admin', account_id: '', notes: '' });
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const updateTransaction = async (id: string, updates: any) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Transaction updated', 'success');
      setEditTxnModal(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Transaction deleted', 'success');
      setConfirmDialog(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const createSavings = async () => {
    setModalLoading(true);
    try {
      const res = await fetch('/api/admin/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...savingsForm, user_id: userId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Savings plan created', 'success');
      setSavingsModal(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const updateSavings = async (id: string, updates: any) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/savings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Savings updated', 'success');
      setEditSavingsModal(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const sendNotification = async () => {
    if (!notifForm.title || !notifForm.message) { showToast('Title and message required', 'error'); return; }
    setModalLoading(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notifForm, user_ids: [userId] }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Notification sent', 'success');
      setNotifModal(false);
      setNotifForm({ title: '', message: '', type: 'info' });
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const loanAction = async (loanId: string, status: string, admin_notes?: string) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/loans/${loanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes, approved_by: 'Super Admin' }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(`Loan ${status}`, 'success');
      setConfirmDialog(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-7 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#0A5CFF]/20 border-t-[#0A5CFF] rounded-full animate-spin" />
      </div>
    );
  }

  const profile = data?.profile || {};
  const auth = data?.auth || {};
  const accounts = data?.accounts || [];
  const transactions = data?.transactions || [];
  const loans = data?.loans || [];
  const savings = data?.savings || [];
  const displayName = profile.full_name || auth.email || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-5 lg:p-7 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <Link href="/admin/users" className="p-2 rounded-xl hover:bg-white border border-[#E8EEF7] text-slate-600 mt-0.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-[#0F172A]">{displayName}</h1>
            <StatusBadge status={profile.status || 'active'} />
            <StatusBadge status={profile.kyc_status || 'pending'} />
          </div>
          <p className="text-slate-500 text-sm mt-0.5">{auth.email} · ID: <span className="font-mono text-xs">{userId.slice(0, 8)}...</span></p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setNotifModal(true)} className="flex items-center gap-1.5 text-xs font-semibold border-2 border-[#E8EEF7] text-slate-600 px-3 py-2 rounded-xl hover:border-[#0A5CFF] hover:text-[#0A5CFF] transition-colors">
            <Bell className="w-3.5 h-3.5" /> Notify
          </button>
          {profile.status === 'active' ? (
            <button
              onClick={() => setConfirmDialog({ type: 'suspend', label: 'Suspend', variant: 'danger', message: `Suspend ${displayName}?`, action: () => { fetch(`/api/admin/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'suspended' }) }).then(() => { showToast('User suspended', 'success'); setConfirmDialog(null); fetchData(); }); } })}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#FFF0EF] text-[#E53935] border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              <UserX className="w-3.5 h-3.5" /> Suspend
            </button>
          ) : (
            <button
              onClick={() => { fetch(`/api/admin/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'active' }) }).then(() => { showToast('User activated', 'success'); fetchData(); }); }}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#E8FFF3] text-[#00C853] border border-green-200 px-3 py-2 rounded-xl hover:bg-green-50 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" /> Activate
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Balance', value: fmtAmt(accounts.reduce((s: number, a: any) => s + (a.balance || 0), 0)), color: '#0A5CFF' },
          { label: 'Active Loans', value: loans.filter((l: any) => l.status === 'disbursed').length, color: '#F64C9C' },
          { label: 'Transactions', value: transactions.length, color: '#7C3AED' },
          { label: 'Savings Plans', value: savings.length, color: '#00C853' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 card-shadow text-center">
            <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 card-shadow mb-5 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === tab ? 'gradient-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─────────── PROFILE TAB ─────────── */}
      {activeTab === 'Profile' && (
        <div className="space-y-5">
          {/* Avatar + Name */}
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <h2 className="font-bold text-[#0F172A] mb-5">Identity & Profile</h2>
            <div className="flex items-start gap-5 mb-6">
              {profileForm.avatar_url ? (
                <img src={profileForm.avatar_url} alt={displayName}
                  className="w-20 h-20 rounded-2xl object-cover shadow-md flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-extrabold shadow-md flex-shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Profile Picture URL</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E8EEF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] transition-all"
                    placeholder="https://example.com/photo.jpg"
                    value={profileForm.avatar_url || ''}
                    onChange={(e) => setProfileForm((f: any) => ({ ...f, avatar_url: e.target.value }))}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Paste any public image URL. Changes save with profile.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <AdminInput label="Full Name" required value={profileForm.full_name}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, full_name: e.target.value }))} />
              <AdminInput label="Email Address" type="email" value={profileForm.email}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, email: e.target.value }))} />
              <AdminInput label="Phone Number" value={profileForm.phone || ''}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, phone: e.target.value }))} />
              <AdminInput label="Date of Birth" type="date" value={profileForm.date_of_birth || ''}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, date_of_birth: e.target.value }))} />
              <AdminInput label="SSN" maxLength={9} value={profileForm.ssn || ''}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, ssn: e.target.value }))} />
              <AdminInput label="Driver's License" maxLength={20} value={profileForm.drivers_license || ''}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, drivers_license: e.target.value }))} />
              <div className="sm:col-span-2">
                <AdminInput label="Address" value={profileForm.address || ''}
                  onChange={(e) => setProfileForm((f: any) => ({ ...f, address: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <h2 className="font-bold text-[#0F172A] mb-5">Account Settings</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <AdminSelect label="Account Status" value={profileForm.status}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="closed">Closed</option>
              </AdminSelect>
              <AdminSelect label="KYC Status" value={profileForm.kyc_status}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, kyc_status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </AdminSelect>
              <AdminSelect label="Account Tier" value={profileForm.account_tier}
                onChange={(e) => setProfileForm((f: any) => ({ ...f, account_tier: e.target.value }))}>
                <option value="starter">Starter</option>
                <option value="premium">Premium</option>
                <option value="business">Business</option>
              </AdminSelect>
              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#0A5CFF]"
                    checked={profileForm.is_admin || false}
                    onChange={(e) => setProfileForm((f: any) => ({ ...f, is_admin: e.target.checked }))} />
                  <span className="text-sm font-semibold text-slate-700">Grant Admin Access</span>
                </label>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <h2 className="font-bold text-[#0F172A] mb-4">Reset Password</h2>
            <div className="flex gap-3 max-w-md">
              <div className="relative flex-1">
                <input type={showPassword ? 'text' : 'password'}
                  placeholder="New password (leave blank to keep)"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8EEF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] transition-all pr-10"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <h2 className="font-bold text-[#0F172A] mb-4">Internal Admin Notes</h2>
            <AdminTextarea
              placeholder="Notes visible only to admins..."
              rows={3}
              value={profileForm.admin_notes || ''}
              onChange={(e) => setProfileForm((f: any) => ({ ...f, admin_notes: e.target.value }))}
            />
          </div>

          <div className="flex justify-end">
            <button onClick={updateProfile} disabled={saving}
              className="flex items-center gap-2 gradient-primary text-white font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 text-sm">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Changes
            </button>
          </div>
        </div>
      )}

      {/* ─────────── ACCOUNTS TAB ─────────── */}
      {activeTab === 'Accounts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Bank Accounts ({accounts.length})</h2>
            <button onClick={() => setAcctModal(true)}
              className="flex items-center gap-1.5 gradient-primary text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md">
              <Plus className="w-3.5 h-3.5" /> Add Account
            </button>
          </div>
          {accounts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 card-shadow text-center text-slate-400">
              No accounts yet. Create one above.
            </div>
          ) : (
            accounts.map((acct: any) => (
              <div key={acct.id} className="bg-white rounded-2xl p-5 card-shadow flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-[#0F172A] text-sm">{acct.account_name || acct.account_type}</p>
                    <StatusBadge status={acct.status} />
                  </div>
                  <p className="font-mono text-xs text-slate-400">{acct.account_number} · {acct.currency} · {acct.account_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-[#0A5CFF]">{fmtAmt(acct.balance, acct.currency)}</p>
                  <button onClick={() => setEditAcctModal(acct)}
                    className="text-xs text-[#0A5CFF] font-semibold mt-1 flex items-center gap-1 ml-auto hover:underline">
                    <Edit2 className="w-3 h-3" /> Edit Balance
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─────────── TRANSACTIONS TAB ─────────── */}
      {activeTab === 'Transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Transactions ({transactions.length})</h2>
            <button onClick={() => setTxnModal(true)}
              className="flex items-center gap-1.5 gradient-primary text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md">
              <Plus className="w-3.5 h-3.5" /> Create Transaction
            </button>
          </div>
          <div className="bg-white rounded-2xl card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E8EEF7]">
                  <tr>
                    {['Description', 'Type', 'Amount', 'Date', 'Status', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#0F172A] truncate max-w-[180px]">{tx.description || '—'}</p>
                        <p className="text-xs text-slate-400 font-mono">{tx.reference}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${tx.type === 'credit' ? 'text-[#00C853]' : 'text-[#E53935]'}`}>
                          {tx.type?.toUpperCase()}
                        </span>
                        {tx.admin_created && <span className="ml-1 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium">Admin</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold text-sm ${tx.type === 'credit' ? 'text-[#00C853]' : 'text-[#0F172A]'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{fmtAmt(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(tx.created_at)}</td>
                      <td className="px-4 py-3"><StatusBadge status={tx.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setEditTxnModal(tx)}
                            className="p-1.5 rounded-lg bg-blue-50 text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white transition-colors">
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button onClick={() => setConfirmDialog({ type: 'deleteTxn', id: tx.id, label: 'Delete Transaction', message: `Delete transaction "${tx.description}"?`, action: () => deleteTransaction(tx.id) })}
                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-sm">No transactions yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────── LOANS TAB ─────────── */}
      {activeTab === 'Loans' && (
        <div className="space-y-4">
          <h2 className="font-bold text-[#0F172A]">Loan Applications ({loans.length})</h2>
          {loans.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 card-shadow text-center text-slate-400">No loan applications</div>
          ) : (
            loans.map((loan: any) => (
              <div key={loan.id} className="bg-white rounded-2xl p-5 card-shadow">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-[#0F172A] capitalize">{loan.loan_type?.replace('_', ' ')} Loan</p>
                      <StatusBadge status={loan.status} />
                    </div>
                    <p className="text-xs text-slate-400">Applied: {fmtDate(loan.created_at)} · Tenure: {loan.tenure_months} months</p>
                    {loan.admin_notes && <p className="text-xs text-[#FFB300] mt-1">Admin: {loan.admin_notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[#0A5CFF]">{fmtAmt(loan.amount)}</p>
                    <p className="text-xs text-slate-400">Outstanding: {fmtAmt(loan.outstanding_balance)}</p>
                  </div>
                </div>
                {['pending', 'under_review'].includes(loan.status) && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDialog({ type: 'approveLoan', id: loan.id, label: 'Approve Loan', variant: 'success', message: `Approve loan of ${fmtAmt(loan.amount)} for ${displayName}?`, action: () => loanAction(loan.id, 'approved') })}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#E8FFF3] text-[#00C853] border border-green-200 font-bold py-2.5 rounded-xl text-sm hover:bg-[#00C853] hover:text-white transition-colors">
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => setConfirmDialog({ type: 'rejectLoan', id: loan.id, label: 'Reject Loan', variant: 'danger', message: `Reject loan of ${fmtAmt(loan.amount)}?`, action: () => loanAction(loan.id, 'rejected', 'Rejected by admin') })}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#FFF0EF] text-[#E53935] border border-red-200 font-bold py-2.5 rounded-xl text-sm hover:bg-[#E53935] hover:text-white transition-colors">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
                {loan.status === 'approved' && (
                  <button
                    onClick={() => setConfirmDialog({ type: 'disburseLoan', id: loan.id, label: 'Disburse Loan', variant: 'success', message: `Disburse ${fmtAmt(loan.amount)} to ${displayName}'s account?`, action: () => loanAction(loan.id, 'disbursed') })}
                    className="w-full flex items-center justify-center gap-2 gradient-primary text-white font-bold py-2.5 rounded-xl text-sm shadow-md">
                    Disburse Funds to Account
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ─────────── SAVINGS TAB ─────────── */}
      {activeTab === 'Savings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Savings Plans ({savings.length})</h2>
            <button onClick={() => setSavingsModal(true)}
              className="flex items-center gap-1.5 gradient-primary text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md">
              <Plus className="w-3.5 h-3.5" /> Add Plan
            </button>
          </div>
          {savings.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 card-shadow text-center text-slate-400">No savings plans</div>
          ) : (
            savings.map((plan: any) => (
              <div key={plan.id} className="bg-white rounded-2xl p-5 card-shadow flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-[#0F172A] text-sm">{plan.name}</p>
                    <StatusBadge status={plan.plan_type} />
                    <StatusBadge status={plan.status} />
                  </div>
                  <p className="text-xs text-slate-400">Rate: {(plan.annual_rate * 100).toFixed(1)}% p.a. · Target: {fmtAmt(plan.target_amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-[#00C853]">{fmtAmt(plan.balance)}</p>
                  <button onClick={() => setEditSavingsModal(plan)}
                    className="text-xs text-[#0A5CFF] font-semibold mt-1 flex items-center gap-1 ml-auto hover:underline">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─────────── NOTIFICATIONS TAB ─────────── */}
      {activeTab === 'Notifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Sent Notifications</h2>
            <button onClick={() => setNotifModal(true)}
              className="flex items-center gap-1.5 gradient-primary text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md">
              <Bell className="w-3.5 h-3.5" /> Send Notification
            </button>
          </div>
          <p className="text-sm text-slate-500">Use the "Send Notification" button to push messages to this user's dashboard.</p>
        </div>
      )}

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* Edit Account Balance */}
      {editAcctModal && (
        <AccountEditModal
          account={editAcctModal}
          loading={modalLoading}
          onClose={() => setEditAcctModal(null)}
          onSave={(updates: any) => updateAccount(editAcctModal.id, updates)}
        />
      )}

      {/* Create Transaction */}
      <AdminModal open={txnModal} title="Create Transaction" onClose={() => setTxnModal(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect label="Type" required value={txnForm.type} onChange={(e) => setTxnForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="credit">Credit (+)</option>
              <option value="debit">Debit (−)</option>
            </AdminSelect>
            <AdminSelect label="Account" value={txnForm.account_id} onChange={(e) => setTxnForm((f) => ({ ...f, account_id: e.target.value }))}>
              <option value="">No account link</option>
              {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.account_name} ({fmtAmt(a.balance)})</option>)}
            </AdminSelect>
          </div>
          <AdminInput label="Amount ($)" required type="number" value={txnForm.amount} onChange={(e) => setTxnForm((f) => ({ ...f, amount: e.target.value }))} />
          <AdminInput label="Description" required value={txnForm.description} onChange={(e) => setTxnForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect label="Category" value={txnForm.category} onChange={(e) => setTxnForm((f) => ({ ...f, category: e.target.value }))}>
              {['Admin','Income','Transfer','Loan','Savings','Bills','Shopping','Transport','Other'].map((c) => <option key={c}>{c}</option>)}
            </AdminSelect>
          </div>
          <AdminInput label="Admin Notes" value={txnForm.notes} onChange={(e) => setTxnForm((f) => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setTxnModal(false)} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm">Cancel</button>
            <button onClick={createTransaction} disabled={modalLoading || !txnForm.amount || !txnForm.description}
              className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60 text-sm">
              {modalLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create Transaction
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Edit Transaction */}
      {editTxnModal && (
        <AdminModal open={!!editTxnModal} title="Edit Transaction" onClose={() => setEditTxnModal(null)}>
          <EditTransactionForm
            transaction={editTxnModal}
            loading={modalLoading}
            onClose={() => setEditTxnModal(null)}
            onSave={(updates: any) => updateTransaction(editTxnModal.id, updates)}
          />
        </AdminModal>
      )}

      {/* Create Account */}
      <AdminModal open={acctModal} title="Create Bank Account" onClose={() => setAcctModal(false)}>
        <div className="space-y-4">
          <AdminInput label="Account Name" value={acctForm.account_name} onChange={(e) => setAcctForm((f) => ({ ...f, account_name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect label="Account Type" value={acctForm.account_type} onChange={(e) => setAcctForm((f) => ({ ...f, account_type: e.target.value }))}>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
              <option value="wallet">Wallet</option>
              <option value="fixed_deposit">Fixed Deposit</option>
            </AdminSelect>
            <AdminSelect label="Currency" value={acctForm.currency} onChange={(e) => setAcctForm((f) => ({ ...f, currency: e.target.value }))}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </AdminSelect>
          </div>
          <AdminInput label="Opening Balance" type="number" value={acctForm.balance} onChange={(e) => setAcctForm((f) => ({ ...f, balance: e.target.value }))} />
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setAcctModal(false)} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm">Cancel</button>
            <button onClick={createAccount} disabled={modalLoading}
              className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60 text-sm">
              {modalLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create Account
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Create Savings Plan */}
      <AdminModal open={savingsModal} title="Create Savings Plan" onClose={() => setSavingsModal(false)}>
        <div className="space-y-4">
          <AdminInput label="Plan Name" required value={savingsForm.name} onChange={(e) => setSavingsForm((f) => ({ ...f, name: e.target.value }))} />
          <AdminSelect label="Plan Type" value={savingsForm.plan_type} onChange={(e) => setSavingsForm((f) => ({ ...f, plan_type: e.target.value }))}>
            <option value="flexible">Flexible</option>
            <option value="fixed">Fixed Deposit</option>
            <option value="target">Target Savings</option>
          </AdminSelect>
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Opening Balance ($)" type="number" value={savingsForm.balance} onChange={(e) => setSavingsForm((f) => ({ ...f, balance: e.target.value }))} />
            <AdminInput label="Target Amount ($)" type="number" value={savingsForm.target_amount} onChange={(e) => setSavingsForm((f) => ({ ...f, target_amount: e.target.value }))} />
          </div>
          <AdminInput label="Annual Interest Rate (e.g. 0.18)" type="number" step="0.01" value={savingsForm.annual_rate} onChange={(e) => setSavingsForm((f) => ({ ...f, annual_rate: e.target.value }))} />
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setSavingsModal(false)} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm">Cancel</button>
            <button onClick={createSavings} disabled={modalLoading || !savingsForm.name}
              className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60 text-sm">
              {modalLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create Plan
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Edit Savings */}
      {editSavingsModal && (
        <SavingsEditModal
          plan={editSavingsModal}
          loading={modalLoading}
          onClose={() => setEditSavingsModal(null)}
          onSave={(updates: any) => updateSavings(editSavingsModal.id, updates)}
        />
      )}

      {/* Send Notification */}
      <AdminModal open={notifModal} title="Send Notification" onClose={() => setNotifModal(false)}>
        <div className="space-y-4">
          <AdminInput label="Title" required value={notifForm.title} onChange={(e) => setNotifForm((f) => ({ ...f, title: e.target.value }))} />
          <AdminTextarea label="Message" required rows={4} value={notifForm.message} onChange={(e) => setNotifForm((f) => ({ ...f, message: e.target.value }))} />
          <AdminSelect label="Type" value={notifForm.type} onChange={(e) => setNotifForm((f) => ({ ...f, type: e.target.value }))}>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error / Alert</option>
          </AdminSelect>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setNotifModal(false)} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm">Cancel</button>
            <button onClick={sendNotification} disabled={modalLoading}
              className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60 text-sm">
              {modalLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <Bell className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Generic Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.label || ''}
        message={confirmDialog?.message || ''}
        confirmLabel={confirmDialog?.label || 'Confirm'}
        confirmVariant={confirmDialog?.variant || 'primary'}
        loading={modalLoading}
        onConfirm={() => confirmDialog?.action?.()}
        onCancel={() => setConfirmDialog(null)}
      />

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── Sub-components ───

function AccountEditModal({ account, loading, onClose, onSave }: any) {
  const [form, setForm] = useState({
    balance: String(account.balance || 0),
    account_number: account.account_number || '',
    account_name: account.account_name || '',
    status: account.status || 'active',
  });

  return (
    <AdminModal open title={`Edit Account: ${account.account_name}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-[#EEF4FF] rounded-xl p-4 text-sm text-[#0A5CFF] font-medium">
          Changing the balance directly will update the user's displayed balance immediately.
        </div>
        <AdminInput label="Balance ($)" required type="number" value={form.balance}
          onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))} />
        <AdminInput label="Account Number" value={form.account_number}
          onChange={(e) => setForm((f) => ({ ...f, account_number: e.target.value }))} maxLength={12} />
        <AdminInput label="Account Name / Label" value={form.account_name}
          onChange={(e) => setForm((f) => ({ ...f, account_name: e.target.value }))} />
        <AdminSelect label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
          <option value="active">Active</option>
          <option value="frozen">Frozen</option>
          <option value="closed">Closed</option>
        </AdminSelect>
        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm">Cancel</button>
          <button onClick={() => onSave(form)} disabled={loading}
            className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60 text-sm">
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

function SavingsEditModal({ plan, loading, onClose, onSave }: any) {
  const [form, setForm] = useState({
    balance: String(plan.balance || 0),
    target_amount: String(plan.target_amount || ''),
    annual_rate: String(plan.annual_rate || 0.18),
    status: plan.status || 'active',
    locked: plan.locked || false,
    admin_notes: plan.admin_notes || '',
  });

  return (
    <AdminModal open title={`Edit Savings: ${plan.name}`} onClose={onClose}>
      <div className="space-y-4">
        <AdminInput label="Current Balance ($)" required type="number" value={form.balance}
          onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))} />
        <AdminInput label="Target Amount ($)" type="number" value={form.target_amount}
          onChange={(e) => setForm((f) => ({ ...f, target_amount: e.target.value }))} />
        <AdminInput label="Annual Rate (e.g. 0.18 = 18%)" type="number" step="0.01" value={form.annual_rate}
          onChange={(e) => setForm((f) => ({ ...f, annual_rate: e.target.value }))} />
        <AdminSelect label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
          <option value="active">Active</option>
          <option value="matured">Matured</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="closed">Closed</option>
        </AdminSelect>
        <AdminInput label="Admin Notes" value={form.admin_notes}
          onChange={(e) => setForm((f) => ({ ...f, admin_notes: e.target.value }))} />
        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm">Cancel</button>
          <button onClick={() => onSave(form)} disabled={loading}
            className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60 text-sm">
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            <Save className="w-4 h-4" /> Update Savings
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

function EditTransactionForm({ transaction: tx, loading, onClose, onSave }: any) {
  const [form, setForm] = useState({
    description: tx.description || '',
    amount: String(tx.amount || ''),
    type: tx.type || 'credit',
    category: tx.category || 'Other',
    status: tx.status || 'completed',
    notes: tx.notes || '',
    recipient_name: tx.recipient_name || '',
    recipient_bank: tx.recipient_bank || '',
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminSelect label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </AdminSelect>
        <AdminInput label="Amount ($)" type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
      </div>
      <AdminInput label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      <div className="grid grid-cols-2 gap-4">
        <AdminSelect label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
          {['Admin','Income','Transfer','Loan','Savings','Bills','Shopping','Transport','Other'].map((c) => <option key={c}>{c}</option>)}
        </AdminSelect>
        <AdminSelect label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="reversed">Reversed</option>
        </AdminSelect>
      </div>
      <AdminInput label="Admin Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
      <div className="flex gap-3 justify-end pt-2">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm">Cancel</button>
        <button onClick={() => onSave(form)} disabled={loading}
          className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60 text-sm">
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <Save className="w-4 h-4" /> Save
        </button>
      </div>
    </div>
  );
}
