'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users, Plus, Search, Filter, Download, RefreshCw,
  Eye, Edit2, Trash2, UserCheck, UserX, MoreHorizontal,
  ChevronDown, Mail, Phone
} from 'lucide-react';
import { ConfirmDialog, StatusBadge, AdminToast, Pagination } from '@/components/admin/AdminComponents';

function fmtAmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kycFilter, setKycFilter] = useState('');
  const [actionUser, setActionUser] = useState<any>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | 'delete' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const limit = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(kycFilter && { kyc: kycFilter }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, kycFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [search, statusFilter, kycFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAction = async () => {
    if (!actionUser || !actionType) return;
    setActionLoading(true);
    try {
      if (actionType === 'delete') {
        const res = await fetch(`/api/admin/users/${actionUser.user_id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error((await res.json()).error);
        showToast('User deleted successfully', 'success');
      } else {
        const newStatus = actionType === 'suspend' ? 'suspended' : 'active';
        const res = await fetch(`/api/admin/users/${actionUser.user_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        showToast(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`, 'success');
      }
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setActionLoading(false);
      setActionUser(null);
      setActionType(null);
    }
  };

  const openConfirm = (user: any, type: 'suspend' | 'activate' | 'delete') => {
    setActionUser(user);
    setActionType(type);
    setOpenMenuId(null);
  };

  const initials = (name: string) =>
    (name || 'UN').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const avatarColors = ['#0A5CFF', '#00C853', '#F64C9C', '#7C3AED', '#FFB300', '#E53935'];
  const getColor = (id: string) => avatarColors[id.charCodeAt(0) % avatarColors.length];

  return (
    <div className="p-5 lg:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">User Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total.toLocaleString()} total users</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchUsers} className="p-2.5 rounded-xl bg-white border border-[#E8EEF7] text-slate-500 hover:text-[#0A5CFF] hover:border-[#0A5CFF] transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/users/create"
            className="flex items-center gap-2 gradient-primary text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 card-shadow mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8EEF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 rounded-xl border border-[#E8EEF7] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="closed">Closed</option>
          </select>
          <select
            className="px-4 py-2.5 rounded-xl border border-[#E8EEF7] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] bg-white"
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
          >
            <option value="">All KYC</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EEF7]">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">KYC</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tier</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Balance</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded-lg shimmer" style={{ width: `${60 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.full_name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: getColor(user.user_id) }}
                          >
                            {initials(user.full_name)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0F172A] truncate max-w-[140px]">{user.full_name || '—'}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-xs text-slate-600">{user.phone || '—'}</p>
                      <p className="text-xs text-slate-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge status={user.status || 'active'} />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge status={user.kyc_status || 'pending'} />
                    </td>
                    <td className="px-5 py-3.5 text-center hidden lg:table-cell">
                      <StatusBadge status={user.account_tier || 'starter'} />
                    </td>
                    <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                      <span className="text-sm font-bold text-[#0F172A]">{fmtAmt(user.total_balance || 0)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/users/${user.user_id}`}
                          className="p-2 rounded-xl bg-[#EEF4FF] text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white transition-colors"
                          title="View / Edit"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {/* More menu */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === user.user_id ? null : user.user_id)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                          {openMenuId === user.user_id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#E8EEF7] overflow-hidden z-20">
                                {user.status === 'active' ? (
                                  <button
                                    onClick={() => openConfirm(user, 'suspend')}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-medium text-[#FFB300] hover:bg-yellow-50 transition-colors"
                                  >
                                    <UserX className="w-3.5 h-3.5" /> Suspend User
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => openConfirm(user, 'activate')}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-medium text-[#00C853] hover:bg-green-50 transition-colors"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" /> Activate User
                                  </button>
                                )}
                                <div className="h-px bg-[#E8EEF7]" />
                                <button
                                  onClick={() => openConfirm(user, 'delete')}
                                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete User
                                </button>
                              </div>
                            </>
                          )}
                        </div>
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!actionUser && !!actionType}
        title={
          actionType === 'delete' ? 'Delete User Account'
          : actionType === 'suspend' ? 'Suspend User Account'
          : 'Activate User Account'
        }
        message={
          actionType === 'delete'
            ? `Permanently delete ${actionUser?.full_name || 'this user'} and all their data? This cannot be undone.`
            : actionType === 'suspend'
            ? `Suspend ${actionUser?.full_name || 'this user'}? They will not be able to log in.`
            : `Reactivate ${actionUser?.full_name || 'this user'}? They will regain full account access.`
        }
        confirmLabel={actionType === 'delete' ? 'Delete' : actionType === 'suspend' ? 'Suspend' : 'Activate'}
        confirmVariant={actionType === 'delete' ? 'danger' : actionType === 'suspend' ? 'danger' : 'success'}
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => { setActionUser(null); setActionType(null); }}
      />

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
