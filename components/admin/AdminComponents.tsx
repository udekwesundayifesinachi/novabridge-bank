'use client';

import { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'success' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirm',
  confirmVariant = 'primary', loading, onConfirm, onCancel
}: ConfirmDialogProps) {
  if (!open) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-[#00C853] hover:bg-[#00a844] text-white',
    primary: 'gradient-primary text-white',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full z-10">
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            confirmVariant === 'danger' ? 'bg-red-100' : confirmVariant === 'success' ? 'bg-[#E8FFF3]' : 'bg-blue-50'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              confirmVariant === 'danger' ? 'text-red-600' : confirmVariant === 'success' ? 'text-[#00C853]' : 'text-[#0A5CFF]'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-[#0F172A] text-lg">{title}</h3>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm hover:border-slate-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center gap-2 ${colors[confirmVariant]}`}
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  type?: 'user' | 'kyc' | 'loan' | 'account' | 'generic';
}

export function StatusBadge({ status, type = 'generic' }: StatusBadgeProps) {
  const map: Record<string, string> = {
    active: 'bg-[#E8FFF3] text-[#00C853] border-[#B8F5D8]',
    suspended: 'bg-[#FFF0EF] text-[#E53935] border-[#FFCDD2]',
    closed: 'bg-slate-100 text-slate-500 border-slate-200',
    verified: 'bg-[#E8FFF3] text-[#00C853] border-[#B8F5D8]',
    pending: 'bg-[#FFF8E1] text-[#FFB300] border-[#FFE082]',
    rejected: 'bg-[#FFF0EF] text-[#E53935] border-[#FFCDD2]',
    approved: 'bg-[#E8FFF3] text-[#00C853] border-[#B8F5D8]',
    disbursed: 'bg-[#EEF4FF] text-[#0A5CFF] border-[#BFDBFE]',
    repaid: 'bg-slate-100 text-slate-500 border-slate-200',
    under_review: 'bg-[#FFF0F7] text-[#F64C9C] border-[#FBCFE8]',
    frozen: 'bg-slate-100 text-slate-500 border-slate-200',
    completed: 'bg-[#E8FFF3] text-[#00C853] border-[#B8F5D8]',
    failed: 'bg-[#FFF0EF] text-[#E53935] border-[#FFCDD2]',
    starter: 'bg-[#F8FAFC] text-slate-600 border-slate-200',
    premium: 'bg-[#EEF4FF] text-[#0A5CFF] border-[#BFDBFE]',
    business: 'bg-[#F5F0FF] text-[#7C3AED] border-[#DDD6FE]',
  };

  const cls = map[status] || 'bg-slate-100 text-slate-500 border-slate-200';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

interface AdminToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function AdminToast({ message, type, onClose }: AdminToastProps) {
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold max-w-sm ${
      type === 'success' ? 'bg-[#00C853]' : 'bg-[#E53935]'
    }`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose}><X className="w-4 h-4" /></button>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AdminModal({ open, title, onClose, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${widths[size]} z-10 my-4`}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#E8EEF7]">
          <h3 className="font-extrabold text-[#0F172A] text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}

export function AdminInput({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input {...props} className={`w-full px-4 py-2.5 rounded-xl border border-[#E8EEF7] bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/30 focus:border-[#0A5CFF] transition-all duration-200 text-sm ${props.className || ''}`} />
    </div>
  );
}

export function AdminSelect({ label, required, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; required?: boolean }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select {...props} className={`w-full px-4 py-2.5 rounded-xl border border-[#E8EEF7] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/30 focus:border-[#0A5CFF] transition-all duration-200 text-sm ${props.className || ''}`}>
        {children}
      </select>
    </div>
  );
}

export function AdminTextarea({ label, required, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; required?: boolean }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea {...props} className={`w-full px-4 py-2.5 rounded-xl border border-[#E8EEF7] bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/30 focus:border-[#0A5CFF] transition-all duration-200 text-sm resize-none ${props.className || ''}`} />
    </div>
  );
}

export function Pagination({
  page, total, limit, onChange
}: { page: number; total: number; limit: number; onChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-[#E8EEF7] bg-white">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold">{total > 0 ? from : 0}–{to}</span> of <span className="font-semibold">{total}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg border border-[#E8EEF7] text-xs font-medium text-slate-500 hover:border-[#0A5CFF] hover:text-[#0A5CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>
        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          let p = i + 1;
          if (totalPages > 5 && page > 3) p = page - 2 + i;
          if (p > totalPages) return null;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                page === p ? 'gradient-primary text-white shadow-sm' : 'border border-[#E8EEF7] text-slate-500 hover:border-[#0A5CFF]'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-[#E8EEF7] text-xs font-medium text-slate-500 hover:border-[#0A5CFF] hover:text-[#0A5CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
