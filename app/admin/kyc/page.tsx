'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Search, Check, X, Eye, RefreshCw } from 'lucide-react';
import { ConfirmDialog, StatusBadge, AdminToast, Pagination } from '@/components/admin/AdminComponents';
import Link from 'next/link';

export default function AdminKYCPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const limit = 15;

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), kyc: 'pending', ...(search && { search }) });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateKYC = async (userId: string, kyc_status: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kyc_status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(`KYC ${kyc_status}`, 'success');
      setConfirmDialog(null);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">KYC Review</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} pending verifications</p>
        </div>
        <button onClick={fetchUsers} className="p-2.5 rounded-xl bg-white border border-[#E8EEF7] text-slate-500 hover:text-[#0A5CFF] hover:border-[#0A5CFF] transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {total === 0 && !loading && (
        <div className="bg-[#E8FFF3] border border-green-200 rounded-2xl p-8 text-center mb-6">
          <ShieldCheck className="w-12 h-12 text-[#00C853] mx-auto mb-3" />
          <p className="font-bold text-[#00C853] text-lg">All Clear!</p>
          <p className="text-slate-500 text-sm mt-1">No pending KYC verifications at this time.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 card-shadow mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8EEF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF]"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EEF7]">
              <tr>
                {['User', 'SSN', 'Phone', 'Joined', 'KYC Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded shimmer" /></td>
                  ))}</tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-14 text-slate-400">No pending KYC users</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold">
                          {(user.full_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">{user.full_name || '—'}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{user.ssn ? `${user.ssn.slice(0, 4)}•••••••` : '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{user.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={user.kyc_status || 'pending'} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${user.user_id}`}
                          className="p-1.5 rounded-lg bg-[#EEF4FF] text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setConfirmDialog({ label: 'Approve KYC', variant: 'success', message: `Verify KYC for ${user.full_name}?`, action: () => updateKYC(user.user_id, 'verified') })}
                          className="p-1.5 rounded-lg bg-[#E8FFF3] text-[#00C853] hover:bg-[#00C853] hover:text-white transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDialog({ label: 'Reject KYC', variant: 'danger', message: `Reject KYC for ${user.full_name}?`, action: () => updateKYC(user.user_id, 'rejected') })}
                          className="p-1.5 rounded-lg bg-[#FFF0EF] text-[#E53935] hover:bg-[#E53935] hover:text-white transition-colors">
                          <X className="w-3.5 h-3.5" />
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

      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.label || ''}
        message={confirmDialog?.message || ''}
        confirmLabel={confirmDialog?.label || 'Confirm'}
        confirmVariant={confirmDialog?.variant || 'primary'}
        loading={actionLoading}
        onConfirm={() => confirmDialog?.action?.()}
        onCancel={() => setConfirmDialog(null)}
      />

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
