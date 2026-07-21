'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Edit2, Plus, Search } from 'lucide-react';
import {
  StatusBadge, AdminToast, Pagination,
  AdminModal, AdminInput, AdminSelect, ConfirmDialog
} from '@/components/admin/AdminComponents';
import Link from 'next/link';

function fmtAmt(n: number | null | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const limit = 20;

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      const res = await fetch(`/api/admin/accounts?${params}`);
      const data = await res.json();
      setAccounts(data.accounts || []);
      setTotal(data.total || 0);
    } catch { showToast('Failed to load accounts', 'error'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const updateAccount = async (updates: any) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/accounts/${editModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Account updated successfully', 'success');
      setEditModal(null);
      fetchAccounts();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Account Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Total portfolio: {fmtAmt(totalBalance)}</p>
        </div>
        <button onClick={fetchAccounts} className="p-2.5 rounded-xl bg-white border border-[#E8EEF7] text-slate-500 hover:text-[#0A5CFF] hover:border-[#0A5CFF] transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EEF7]">
              <tr>
                {['Account Holder', 'Account Number', 'Type', 'Currency', 'Balance', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded shimmer" /></td>
                  ))}</tr>
                ))
              ) : accounts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-14 text-slate-400">No accounts found</td></tr>
              ) : (
                accounts.map((acct) => (
                  <tr key={acct.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/users/${acct.user_id}`} className="hover:text-[#0A5CFF] transition-colors">
                        <p className="text-sm font-semibold text-[#0F172A]">{acct.profiles?.full_name || '—'}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[140px]">{acct.profiles?.email}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{acct.account_number}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full capitalize">{acct.account_type?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-600">{acct.currency}</td>
                    <td className="px-5 py-3.5 font-extrabold text-[#0A5CFF] text-sm">{fmtAmt(acct.balance)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={acct.status} /></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setEditModal(acct)}
                        className="p-2 rounded-xl bg-[#EEF4FF] text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={total} limit={limit} onChange={setPage} />
      </div>

      {editModal && (
        <AdminModal open title={`Edit Account — ${editModal.profiles?.full_name}`} onClose={() => setEditModal(null)}>
          <AccountEditForm account={editModal} loading={modalLoading} onClose={() => setEditModal(null)} onSave={updateAccount} />
        </AdminModal>
      )}

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function AccountEditForm({ account, loading, onClose, onSave }: any) {
  const [form, setForm] = useState({
    balance: String(account.balance || 0),
    account_number: account.account_number || '',
    account_name: account.account_name || '',
    account_type: account.account_type || 'savings',
    currency: account.currency || 'USD',
    status: account.status || 'active',
  });

  return (
    <div className="space-y-4">
      <div className="bg-[#EEF4FF] rounded-xl p-3.5 text-sm text-[#0A5CFF] font-medium">
        Balance changes reflect immediately in the customer's dashboard.
      </div>
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Balance ($)" required type="number" value={form.balance}
          onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))} />
        <AdminInput label="Account Number" value={form.account_number}
          onChange={(e) => setForm((f) => ({ ...f, account_number: e.target.value }))} maxLength={12} />
      </div>
      <AdminInput label="Account Label" value={form.account_name}
        onChange={(e) => setForm((f) => ({ ...f, account_name: e.target.value }))} />
      <div className="grid grid-cols-2 gap-4">
        <AdminSelect label="Type" value={form.account_type} onChange={(e) => setForm((f) => ({ ...f, account_type: e.target.value }))}>
          <option value="savings">Savings</option>
          <option value="current">Current</option>
          <option value="wallet">Wallet</option>
          <option value="fixed_deposit">Fixed Deposit</option>
        </AdminSelect>
        <AdminSelect label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
          <option value="active">Active</option>
          <option value="frozen">Frozen</option>
          <option value="closed">Closed</option>
        </AdminSelect>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm">Cancel</button>
        <button onClick={() => onSave(form)} disabled={loading}
          className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60 text-sm">
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
