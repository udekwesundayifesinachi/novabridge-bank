'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, CheckCircle, XCircle, Eye, Banknote, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ConfirmDialog, StatusBadge, AdminToast, Pagination } from '@/components/admin/AdminComponents';

function fmtAmt(n: number | null | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const limit = 15;

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), ...(statusFilter && { status: statusFilter }) });
      const res = await fetch(`/api/admin/loans?${params}`);
      const data = await res.json();
      setLoans(data.loans || []);
      setTotal(data.total || 0);
    } catch { showToast('Failed to load loans', 'error'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchLoans(); }, [fetchLoans]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const loanAction = async (loanId: string, status: string, notes?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/loans/${loanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: notes, approved_by: 'Super Admin' }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(`Loan ${status} successfully`, 'success');
      setConfirmDialog(null);
      fetchLoans();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const statusCounts = {
    pending: loans.filter((l) => l.status === 'pending').length,
    under_review: loans.filter((l) => l.status === 'under_review').length,
    approved: loans.filter((l) => l.status === 'approved').length,
    disbursed: loans.filter((l) => l.status === 'disbursed').length,
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Loan Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total.toLocaleString()} total applications</p>
        </div>
        <button onClick={fetchLoans} className="p-2.5 rounded-xl bg-white border border-[#E8EEF7] text-slate-500 hover:text-[#0A5CFF] hover:border-[#0A5CFF] transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick status cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending', count: statusCounts.pending, color: '#FFB300', bg: '#FFF8E1', status: 'pending' },
          { label: 'Under Review', count: statusCounts.under_review, color: '#0A5CFF', bg: '#EEF4FF', status: 'under_review' },
          { label: 'Approved', count: statusCounts.approved, color: '#00C853', bg: '#E8FFF3', status: 'approved' },
          { label: 'Disbursed', count: statusCounts.disbursed, color: '#7C3AED', bg: '#F5F0FF', status: 'disbursed' },
        ].map((s) => (
          <button key={s.label} onClick={() => setStatusFilter(statusFilter === s.status ? '' : s.status)}
            className={`p-4 rounded-2xl text-left transition-all ${statusFilter === s.status ? 'ring-2 ring-offset-2' : 'hover:-translate-y-0.5'} bg-white card-shadow`}
>
            <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 card-shadow mb-5 flex gap-3 flex-wrap">
        <span className="text-sm font-semibold text-slate-600 self-center">Filter by status:</span>
        {[{ v: '', l: 'All' }, { v: 'pending', l: 'Pending' }, { v: 'under_review', l: 'Under Review' },
          { v: 'approved', l: 'Approved' }, { v: 'rejected', l: 'Rejected' },
          { v: 'disbursed', l: 'Disbursed' }, { v: 'repaid', l: 'Repaid' }].map((opt) => (
          <button key={opt.v}
            onClick={() => { setStatusFilter(opt.v); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === opt.v ? 'gradient-primary text-white shadow-sm' : 'bg-[#F8FAFC] text-slate-600 border border-[#E8EEF7] hover:border-slate-300'}`}>
            {opt.l}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EEF7]">
              <tr>
                {['Applicant', 'Loan Type', 'Amount', 'Duration', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded shimmer" /></td>
                  ))}</tr>
                ))
              ) : loans.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-14 text-slate-400">No loans found</td></tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-[#0F172A]">{loan.profiles?.full_name || '—'}</p>
                      <p className="text-xs text-slate-400">{loan.profiles?.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full capitalize">
                        {loan.loan_type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#0A5CFF] text-sm">{fmtAmt(loan.amount)}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{loan.tenure_months}mo</td>
                    <td className="px-5 py-3.5"><StatusBadge status={loan.status} /></td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {loan.created_at ? new Date(loan.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/users/${loan.user_id}`}
                          className="p-1.5 rounded-lg bg-[#EEF4FF] text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white transition-colors"
                          title="View User">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {['pending', 'under_review'].includes(loan.status) && (
                          <>
                            <button
                              onClick={() => setConfirmDialog({ label: 'Approve Loan', variant: 'success', message: `Approve ${fmtAmt(loan.amount)} loan for ${loan.profiles?.full_name}?`, action: () => loanAction(loan.id, 'approved') })}
                              className="p-1.5 rounded-lg bg-[#E8FFF3] text-[#00C853] hover:bg-[#00C853] hover:text-white transition-colors" title="Approve">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDialog({ label: 'Reject Loan', variant: 'danger', message: `Reject ${fmtAmt(loan.amount)} loan for ${loan.profiles?.full_name}?`, action: () => loanAction(loan.id, 'rejected', 'Rejected by admin') })}
                              className="p-1.5 rounded-lg bg-[#FFF0EF] text-[#E53935] hover:bg-[#E53935] hover:text-white transition-colors" title="Reject">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {loan.status === 'approved' && (
                          <button
                            onClick={() => setConfirmDialog({ label: 'Disburse Funds', variant: 'success', message: `Disburse ${fmtAmt(loan.amount)} to ${loan.profiles?.full_name}?`, action: () => loanAction(loan.id, 'disbursed') })}
                            className="p-1.5 rounded-lg bg-[#EEF4FF] text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white transition-colors" title="Disburse">
                            <Banknote className="w-3.5 h-3.5" />
                          </button>
                        )}
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
