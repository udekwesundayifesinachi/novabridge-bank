'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Globe, Database, Save } from 'lucide-react';
import { AdminInput, AdminToast } from '@/components/admin/AdminComponents';

export default function AdminSettingsPage() {
  const [form, setForm] = useState<any>({
    platform_name: 'NovabridgeBank',
    support_email: 'hello@novabridgebank.com',
    support_phone: '+1 800 NOVA BANK',
    default_loan_rate: '2.5',
    max_loan_amount: '5000000',
    min_loan_amount: '50000',
    flexible_savings_rate: '18',
    fixed_deposit_rate: '22',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setForm({
            platform_name: d.settings.platform_name || 'NovabridgeBank',
            support_email: d.settings.support_email || '',
            support_phone: d.settings.support_phone || '',
            default_loan_rate: String(d.settings.default_loan_rate ?? '2.5'),
            max_loan_amount: String(d.settings.max_loan_amount ?? '5000000'),
            min_loan_amount: String(d.settings.min_loan_amount ?? '50000'),
            flexible_savings_rate: String(d.settings.flexible_savings_rate ?? '18'),
            fixed_deposit_rate: String(d.settings.fixed_deposit_rate ?? '22'),
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Settings saved successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { title: 'Platform', icon: Globe, fields: [
      { key: 'platform_name', label: 'Platform Name' },
      { key: 'support_email', label: 'Support Email' },
      { key: 'support_phone', label: 'Support Phone' },
    ]},
    { title: 'Loan Configuration', icon: Database, fields: [
      { key: 'default_loan_rate', label: 'Default Interest Rate (% monthly)' },
      { key: 'max_loan_amount', label: 'Max Loan Amount ($)' },
      { key: 'min_loan_amount', label: 'Min Loan Amount ($)' },
    ]},
    { title: 'Savings Configuration', icon: Settings, fields: [
      { key: 'flexible_savings_rate', label: 'Flexible Savings Rate (% p.a.)' },
      { key: 'fixed_deposit_rate', label: 'Fixed Deposit Rate (% p.a.)' },
    ]},
  ];

  return (
    <div className="p-5 lg:p-7 max-w-2xl">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Admin Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Platform configuration and preferences</p>
      </div>

      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl p-6 card-shadow space-y-4">
            <h2 className="font-bold text-[#0F172A] flex items-center gap-2 text-sm">
              <section.icon className="w-4 h-4 text-[#0A5CFF]" /> {section.title}
            </h2>
            {section.fields.map((field) => (
              <AdminInput
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChange={(e: any) => setForm((f: any) => ({ ...f, [field.key]: e.target.value }))}
              />
            ))}
          </div>
        ))}

        <button onClick={save} disabled={saving || loading}
          className="flex items-center gap-2 gradient-primary text-white font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
