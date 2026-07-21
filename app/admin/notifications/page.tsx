'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, Users, User, CheckCircle2 } from 'lucide-react';
import { AdminInput, AdminSelect, AdminTextarea, AdminToast } from '@/components/admin/AdminComponents';

export default function AdminNotificationsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    sendToAll: false,
    user_ids: [] as string[],
    title: '',
    message: '',
    type: 'info',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetch('/api/admin/users?limit=100').then((r) => r.json()).then((d) => setUsers(d.users || []));
  }, []);

  const filteredUsers = users.filter((u) =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (id: string) => {
    setForm((f) => ({
      ...f,
      user_ids: f.user_ids.includes(id) ? f.user_ids.filter((x) => x !== id) : [...f.user_ids, id],
    }));
  };

  const handleSend = async () => {
    if (!form.title || !form.message) { showToast('Title and message required', 'error'); return; }
    if (!form.sendToAll && form.user_ids.length === 0) { showToast('Select at least one user or send to all', 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          send_to_all: form.sendToAll,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
      showToast(`Notification sent to ${data.count} user(s)`, 'success');
      setForm({ sendToAll: false, user_ids: [], title: '', message: '', type: 'info' });
      setTimeout(() => setSent(false), 3000);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 lg:p-7 max-w-[1000px]">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Send Notifications</h1>
        <p className="text-slate-500 text-sm mt-0.5">Push messages directly to customer dashboards</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Message form */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
            <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0A5CFF]" /> Notification Content
            </h2>
            <AdminInput label="Title" required placeholder="e.g. Important Account Update" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <AdminTextarea label="Message" required rows={5} placeholder="Write your notification message here..."
              value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
            <AdminSelect label="Notification Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="info">Info (blue)</option>
              <option value="success">Success (green)</option>
              <option value="warning">Warning (yellow)</option>
              <option value="error">Alert (red)</option>
            </AdminSelect>

            {/* Preview */}
            {(form.title || form.message) && (
              <div className={`rounded-2xl p-4 border-l-4 ${
                form.type === 'success' ? 'bg-[#E8FFF3] border-[#00C853]' :
                form.type === 'warning' ? 'bg-[#FFF8E1] border-[#FFB300]' :
                form.type === 'error' ? 'bg-[#FFF0EF] border-[#E53935]' :
                'bg-[#EEF4FF] border-[#0A5CFF]'
              }`}>
                <p className="text-xs font-semibold text-slate-500 mb-1">Preview</p>
                <p className="font-bold text-[#0F172A] text-sm">{form.title || 'Notification title'}</p>
                <p className="text-slate-600 text-xs mt-1">{form.message || 'Message content'}</p>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 gradient-primary text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 text-sm"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? 'Sending...' : sent ? 'Sent!' : 'Send Notification'}
            </button>
          </div>
        </div>

        {/* Right: Recipient selection */}
        <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
          <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0A5CFF]" /> Recipients
          </h2>

          {/* Send to all toggle */}
          <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${form.sendToAll ? 'border-[#0A5CFF] bg-blue-50' : 'border-[#E8EEF7] hover:border-slate-300'}`}>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#0A5CFF]" />
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Send to All Users</p>
                <p className="text-xs text-slate-400">{users.length} registered users</p>
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-[#0A5CFF]" checked={form.sendToAll}
              onChange={(e) => setForm((f) => ({ ...f, sendToAll: e.target.checked, user_ids: [] }))} />
          </label>

          {!form.sendToAll && (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users to notify..."
                  className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-[#E8EEF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {form.user_ids.length > 0 && (
                <div className="text-xs font-semibold text-[#0A5CFF] bg-blue-50 px-3 py-2 rounded-xl">
                  {form.user_ids.length} user(s) selected
                </div>
              )}

              <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
                {filteredUsers.slice(0, 30).map((user) => (
                  <label
                    key={user.user_id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${form.user_ids.includes(user.user_id) ? 'border-[#0A5CFF] bg-blue-50' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <input type="checkbox" className="w-4 h-4 accent-[#0A5CFF] flex-shrink-0"
                      checked={form.user_ids.includes(user.user_id)}
                      onChange={() => toggleUser(user.user_id)} />
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(user.full_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{user.full_name || '—'}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </label>
                ))}
                {filteredUsers.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No users found</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
