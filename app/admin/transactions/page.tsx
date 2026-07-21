'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, RefreshCw, Plus, Edit2, Trash2, Filter
} from 'lucide-react';
import {
  ConfirmDialog, StatusBadge, AdminToast, Pagination,
  AdminModal, AdminInput, AdminSelect
} from '@/components/admin/AdminComponents';

function fmtAmt(n: number | null | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [editModal, setEditModal] = useState<any>(null);
  const [confirmDel, setConfirmDel] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const limit = 20;

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), ...(search && { search }), ...(typeFilter && { type: typeFilter }) });
      const res = await fetch(`/api/admin/transactions?${params}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setTotal(data.total || 0);
    } catch { showToast('Failed to load transactions', 'error'); }
    finally { setLoading(false); }
  }, [page, search, typeFilter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  useEffect(() => { setPage(1); }, [search, typeFilter]);

  const updateTransaction = async (id: string, updates: any) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Transaction updated', 'success');
      setEditModal(null);
      fetchTransactions();
    } catch (err: any) { showToast(err.message, 'error'); }
    finally { setActionLoading(false); }
  };

  const deleteTransaction = async (id: string) => {
    setActionLoading(true);
    try {
      await fetch(`/api/admin/transactions/${id}`, { method: 'DELETE' });
      showToast('Transaction deleted', 'success');
      setConfirmDel(null);
      fetchTransactions();
    } catch { showToast('Delete failed', 'error'); }
    finally { setActionLoading(false); }
  };

  const totalCredits = transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Transactions</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total.toLocaleString()} total transactions</p>
        </div>
        <button onClick={fetchTransactions} className="p-2.5 rounded-xl bg-white border border-[#E8EEF7] text-slate-500 hover:text-[#0A5CFF] hover:border-[#0A5CFF] transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Credits', value: fmtAmt(totalCredits), color: '#00C853', bg: '#E8FFF3' },
          { label: 'Total Debits', value: fmtAmt(totalDebits), color: '#E53935', bg: '#FFF0EF' },
          { label: 'Net', value: fmtAmt(totalCredits - totalDebits), color: '#0A5CFF', bg: '#EEF4FF' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 card-shadow">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 card-shadow mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search description or reference..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8EEF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF]"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="px-4 py-2.5 rounded-xl border border-[#E8EEF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 bg-white"
          value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="credit">Credits Only</option>
          <option value="debit">Debits Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EEF7]">
              <tr>
                {['User', 'Description', 'Type', 'Amount', 'Category', 'Date', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded shimmer" /></td>
                  ))}</tr>
                ))
              ) : transactions.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-14 text-slate-400">No transactions found</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-[#0F172A] truncate max-w-[100px]">{tx.profiles?.full_name || '—'}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-[#0F172A] truncate max-w-[160px]">{tx.description || '—'}</p>
                      <p className="text-xs font-mono text-slate-400">{tx.reference?.slice(0, 14)}…</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold ${tx.type === 'credit' ? 'text-[#00C853]' : 'text-[#E53935]'}`}>
                        {tx.type?.toUpperCase()}
                      </span>
                      {tx.admin_created && <span className="ml-1 text-[9px] bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded-full">ADM</span>}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-sm">
                      <span className={tx.type === 'credit' ? 'text-[#00C853]' : 'text-[#0F172A]'}>
                        {tx.type === 'credit' ? '+' : '-'}{fmtAmt(tx.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tx.category || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={tx.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditModal(tx)}
                          className="p-1.5 rounded-lg bg-blue-50 text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white transition-colors">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => setConfirmDel(tx)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={total} limit={limit} onChange={setPage} />
      </div>

      {/* Edit Modal */}
      {editModal && (
        <AdminModal open title="Edit Transaction" onClose={() => setEditModal(null)}>
          <EditTxnForm tx={editModal} loading={actionLoading} onClose={() => setEditModal(null)} onSave={(u: any) => updateTransaction(editModal.id, u)} />
        </AdminModal>
      )}

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete Transaction"
        message={`Permanently delete this transaction (${fmtAmt(confirmDel?.amount)})?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={() => deleteTransaction(confirmDel.id)}
        onCancel={() => setConfirmDel(null)}
      />

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function EditTxnForm({ tx, loading, onClose, onSave }: any) {
  const [form, setForm] = useState({
    description: tx.description || '',
    amount: String(tx.amount || ''),
    type: tx.type || 'credit',
    category: tx.category || 'Other',
    status: tx.status || 'completed',
    notes: tx.notes || '',
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
          Save Changes
        </button>
      </div>
    </div>
  );
}
