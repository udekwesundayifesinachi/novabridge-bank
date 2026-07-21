'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { AdminInput, AdminSelect, AdminToast } from '@/components/admin/AdminComponents';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', phone: '', ssn: '',
    account_tier: 'starter', kyc_status: 'pending', status: 'active',
    initial_balance: '0',
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.full_name) {
      setToast({ message: 'Full name, email and password are required', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast({ message: 'User created successfully!', type: 'success' });
      setTimeout(() => router.push(`/admin/users/${data.user_id}`), 1200);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to create user', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 lg:p-7 max-w-2xl">
      <div className="flex items-center gap-3 mb-7">
        <Link href="/admin/users" className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Create New User</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manually create a customer account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="font-bold text-[#0F172A] mb-5 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#0A5CFF]" /> Personal Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput label="Full Name" required placeholder="John Michael Smith"
              value={form.full_name} onChange={(e) => update('full_name', e.target.value)} />
            <AdminInput label="Email Address" type="email" required placeholder="john@example.com"
              value={form.email} onChange={(e) => update('email', e.target.value)} />
            <AdminInput label="Phone Number" placeholder="+1 800 000 0000"
              value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            <AdminInput label="SSN" placeholder="9-digit number"
              value={form.ssn} onChange={(e) => update('ssn', e.target.value)} maxLength={9} />
          </div>
        </div>

        {/* Account Setup */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="font-bold text-[#0F172A] mb-5">Account Configuration</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <AdminInput
                label="Password"
                required
                type={showPass ? 'text' : 'password'}
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 bottom-2.5 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <AdminInput
              label="Initial Balance ($)"
              type="number"
              placeholder="0"
              value={form.initial_balance}
              onChange={(e) => update('initial_balance', e.target.value)}
            />
            <AdminSelect label="Account Tier" value={form.account_tier} onChange={(e) => update('account_tier', e.target.value)}>
              <option value="starter">Starter</option>
              <option value="premium">Premium</option>
              <option value="business">Business</option>
            </AdminSelect>
            <AdminSelect label="KYC Status" value={form.kyc_status} onChange={(e) => update('kyc_status', e.target.value)}>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </AdminSelect>
            <AdminSelect label="Account Status" value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </AdminSelect>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/users" className="px-6 py-3 rounded-xl border-2 border-[#E8EEF7] text-slate-600 font-semibold text-sm hover:border-slate-300 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 gradient-primary text-white font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 text-sm">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Create User
          </button>
        </div>
      </form>

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
