'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Edit2, Search, PiggyBank } from 'lucide-react';
import {
  StatusBadge, AdminToast, Pagination,
  AdminModal, AdminInput, AdminSelect
} from '@/components/admin/AdminComponents';
import Link from 'next/link';

function fmtAmt(n: number | null | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

export default function AdminSavingsPage() {
  const [savings, setSavings] = useState<any[]>([]);
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

  const fetchSavings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      const res = await fetch(`/api/admin/savings?${params}`);
      const data = await res.json();
      setSavings(data.savings || []);
      setTotal(data.total || 0);
    } catch { showToast('Failed to load savings', 'error'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchSavings(); }, [fetchSavings]);

  const updateSavings = async (id: string, updates: any) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/savings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Savings plan updated', 'success');
      setEditModal(null);
      fetchSavings();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const totalBalance = savings.reduce((s, p) => s + (p.balance || 0), 0);

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Savings Plans</h1>
          <p className="text-slate-500 text-sm mt-0.5">Total deposits: {fmtAmt(totalBalance)}</p>
        </div>
        <button onClick={fetchSavings} className="p-2.5 rounded-xl bg-white border border-[#E8EEF7] text-slate-500 hover:text-[#0A5CFF] hover:border-[#0A5CFF] transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EEF7]">
              <tr>
                {['Owner', 'Plan Name', 'Type', 'Balance', 'Target', 'Rate', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded shimmer" /></td>
                  ))}</tr>
                ))
              ) : savings.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-14 text-slate-400">
                  <PiggyBank className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  No savings plans found
                </td></tr>
              ) : (
                savings.map((plan) => (
                  <tr key={plan.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/users/${plan.user_id}`} className="hover:text-[#0A5CFF]">
                        <p className="text-sm font-semibold text-[#0F172A]">{plan.profiles?.full_name || '—'}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[120px]">{plan.profiles?.email}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#0F172A]">{plan.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full capitalize">{plan.plan_type}</span>
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-[#00C853] text-sm">{fmtAmt(plan.balance)}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{plan.target_amount ? fmtAmt(plan.target_amount) : '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#0A5CFF]">{((plan.annual_rate || 0) * 100).toFixed(1)}%</td>
                    <td className="px-5 py-3.5"><StatusBadge status={plan.status} /></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setEditModal(plan)}
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
        <AdminModal open title={`Edit: ${editModal.name}`} onClose={() => setEditModal(null)}>
          <SavingsEditForm plan={editModal} loading={modalLoading} onClose={() => setEditModal(null)} onSave={(u: any) => updateSavings(editModal.id, u)} />
        </AdminModal>
      )}

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function SavingsEditForm({ plan, loading, onClose, onSave }: any) {
  const [form, setForm] = useState({
    balance: String(plan.balance || 0),
    target_amount: String(plan.target_amount || ''),
    annual_rate: String(plan.annual_rate || 0.18),
    status: plan.status || 'active',
    locked: plan.locked || false,
    admin_notes: plan.admin_notes || '',
    name: plan.name || '',
  });

  return (
    <div className="space-y-4">
      <AdminInput label="Plan Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      <AdminInput label="Balance ($)" required type="number" value={form.balance}
        onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))} />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Target Amount ($)" type="number" value={form.target_amount}
          onChange={(e) => setForm((f) => ({ ...f, target_amount: e.target.value }))} />
        <AdminInput label="Annual Rate (0.18 = 18%)" type="number" step="0.01" value={form.annual_rate}
          onChange={(e) => setForm((f) => ({ ...f, annual_rate: e.target.value }))} />
      </div>
      <AdminSelect label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
        <option value="active">Active</option>
        <option value="matured">Matured</option>
        <option value="withdrawn">Withdrawn</option>
        <option value="closed">Closed</option>
      </AdminSelect>
      <AdminInput label="Admin Notes" value={form.admin_notes} onChange={(e) => setForm((f) => ({ ...f, admin_notes: e.target.value }))} />
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
