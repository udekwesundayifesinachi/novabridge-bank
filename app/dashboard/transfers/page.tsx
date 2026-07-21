'use client';

import { useState } from 'react';
import {
  ArrowRight, Search, Star, Plus, Clock, CheckCircle,
  Building, User, Phone
} from 'lucide-react';

const banks = [
  'Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Goldman Sachs',
  'Capital One', 'US Bank', 'PNC Bank', 'TD Bank', 'Truist',
  'American Express', 'NovabridgeBank', 'Discover', 'Ally Bank'
];

const beneficiaries = [
  { id: 1, name: 'Sarah Johnson', bank: 'Chase', account: '•••• 4821', avatar: 'SJ', color: '#0A5CFF' },
  { id: 2, name: 'David Smith', bank: 'Bank of America', account: '•••• 9034', avatar: 'DS', color: '#00C853' },
  { id: 3, name: 'Emily Brown', bank: 'Wells Fargo', account: '•••• 2718', avatar: 'EB', color: '#F64C9C' },
  { id: 4, name: 'Chris Davis', bank: 'Citibank', account: '•••• 6652', avatar: 'CD', color: '#7C3AED' },
  { id: 5, name: 'Brian Wilson', bank: 'Goldman Sachs', account: '•••• 1143', avatar: 'BW', color: '#FFB300' },
];

const recentTransfers = [
  { name: 'Sarah Johnson', bank: 'Chase', amount: 50000, time: '2 hrs ago', status: 'success' },
  { name: 'David Smith', bank: 'Bank of America', amount: 25000, time: '1 day ago', status: 'success' },
  { name: 'Chris Davis', bank: 'Citibank', amount: 100000, time: '3 days ago', status: 'success' },
];

function fmtAmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function TransfersPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ bank: '', account: '', amount: '', narration: '', pin: '' });
  const [lookupDone, setLookupDone] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [success, setSuccess] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleLookup = () => {
    if (form.account.length >= 10) {
      setTimeout(() => {
        setAccountName('CHRISTOPHER DAVIS');
        setLookupDone(true);
      }, 800);
    }
  };

  const handleConfirm = () => {
    setStep(3);
  };

  const handleSubmit = () => {
    setTimeout(() => {
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[600px] mx-auto">
        <div className="bg-white rounded-3xl p-10 card-shadow text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8FFF3] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#00C853]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Transfer Successful!</h2>
          <p className="text-slate-500 text-sm mb-6">
            {fmtAmt(Number(form.amount))} sent to {accountName || 'Recipient'} · {form.bank}
          </p>
          <div className="bg-[#F8FAFC] rounded-2xl p-5 text-left space-y-3 mb-6">
            {[
              { label: 'Amount', value: fmtAmt(Number(form.amount)) },
              { label: 'Recipient', value: accountName },
              { label: 'Bank', value: form.bank },
              { label: 'Account', value: form.account },
              { label: 'Reference', value: `TXN-${Date.now()}` },
              { label: 'Status', value: 'Completed' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-slate-500">{item.label}</span>
                <span className="font-semibold text-[#0F172A]">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setSuccess(false); setStep(1); setForm({ bank: '', account: '', amount: '', narration: '', pin: '' }); setLookupDone(false); setAccountName(''); }}
              className="flex-1 border-2 border-[#E8EEF7] text-slate-600 font-semibold py-3 rounded-xl text-sm hover:border-slate-300 transition-colors"
            >
              New Transfer
            </button>
            <button className="flex-1 gradient-primary text-white font-bold py-3 rounded-xl text-sm shadow-md">
              Share Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Send Money</h1>
        <p className="text-slate-500 text-sm mt-1">Transfer to any bank in the US instantly</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Transfer Form */}
        <div className="lg:col-span-3 space-y-5">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 card-shadow">
            {['Recipient', 'Amount', 'Confirm'].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i + 1 < step ? 'bg-[#00C853] text-white' : i + 1 === step ? 'bg-[#0A5CFF] text-white' : 'bg-[#E8EEF7] text-slate-400'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i + 1 === step ? 'text-[#0A5CFF]' : 'text-slate-400'}`}>{s}</span>
                {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${i + 1 < step ? 'bg-[#00C853]' : 'bg-[#E8EEF7]'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
              <h2 className="font-bold text-[#0F172A]">Select Recipient</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bank Name</label>
                <select className="input-field" value={form.bank} onChange={(e) => update('bank', e.target.value)}>
                  <option value="">Select bank</option>
                  {banks.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Account Number</label>
                <div className="flex gap-3">
                  <input
                    type="text" className="input-field flex-1" placeholder="Enter 10-digit account number"
                    maxLength={10} value={form.account}
                    onChange={(e) => { update('account', e.target.value); setLookupDone(false); setAccountName(''); }}
                  />
                  <button onClick={handleLookup}
                    className="px-4 py-3 rounded-xl gradient-primary text-white font-semibold text-sm whitespace-nowrap shadow-md hover:shadow-lg transition-all">
                    Verify
                  </button>
                </div>
                {lookupDone && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-[#00C853] font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    {accountName}
                  </div>
                )}
              </div>
              <button
                disabled={!lookupDone || !form.bank}
                onClick={() => setStep(2)}
                className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Continue <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
              <h2 className="font-bold text-[#0F172A]">Enter Amount</h2>
              {/* Recipient Summary */}
              <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white text-sm font-bold">
                  {accountName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{accountName}</p>
                  <p className="text-xs text-slate-400">{form.bank} · {form.account}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">$</span>
                  <input
                    type="number" className="input-field pl-10 text-xl font-bold" placeholder="0"
                    value={form.amount} onChange={(e) => update('amount', e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[5000, 10000, 20000, 50000, 100000].map((amt) => (
                    <button key={amt} onClick={() => update('amount', String(amt))}
                      className="text-xs font-medium bg-[#EEF4FF] text-[#0A5CFF] px-3 py-1.5 rounded-lg hover:bg-[#0A5CFF] hover:text-white transition-colors">
                      {fmtAmt(amt)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Narration (Optional)</label>
                <input type="text" className="input-field" placeholder="What's this for?" value={form.narration} onChange={(e) => update('narration', e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-[#E8EEF7] text-slate-600 font-semibold py-3.5 rounded-xl text-sm">Back</button>
                <button disabled={!form.amount || Number(form.amount) <= 0} onClick={handleConfirm}
                  className="flex-[2] gradient-primary text-white font-bold py-3.5 rounded-xl text-sm shadow-md disabled:opacity-50 hover:shadow-lg transition-all">
                  Review Transfer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
              <h2 className="font-bold text-[#0F172A]">Confirm Transfer</h2>
              <div className="bg-[#F8FAFC] rounded-2xl p-5 space-y-3">
                {[
                  { label: 'Amount', value: fmtAmt(Number(form.amount)), highlight: true },
                  { label: 'Recipient', value: accountName },
                  { label: 'Bank', value: form.bank },
                  { label: 'Account', value: form.account },
                  { label: 'Fee', value: '$50' },
                  { label: 'Narration', value: form.narration || 'No narration' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm border-b border-[#E8EEF7] pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-500">{item.label}</span>
                    <span className={`font-semibold ${item.highlight ? 'text-[#0A5CFF] text-base' : 'text-[#0F172A]'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Enter 4-digit PIN</label>
                <input type="password" maxLength={4} className="input-field tracking-widest text-center text-2xl font-bold" placeholder="••••" value={form.pin} onChange={(e) => update('pin', e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border-2 border-[#E8EEF7] text-slate-600 font-semibold py-3.5 rounded-xl text-sm">Back</button>
                <button disabled={form.pin.length < 4} onClick={handleSubmit}
                  className="flex-[2] gradient-primary text-white font-bold py-3.5 rounded-xl text-sm shadow-md disabled:opacity-50 hover:shadow-lg transition-all">
                  Confirm & Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Beneficiaries + Recent */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Saved Beneficiaries</h3>
              <button className="text-xs text-[#0A5CFF] font-semibold">+ Add</button>
            </div>
            <div className="space-y-2">
              {beneficiaries.map((b) => (
                <button
                  key={b.id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors group text-left"
                  onClick={() => { update('account', b.account.replace('•••• ', '').padStart(10, '0')); update('bank', b.bank); }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: b.color }}>
                    {b.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{b.name}</p>
                    <p className="text-xs text-slate-400">{b.bank} · {b.account}</p>
                  </div>
                  <Star className="w-4 h-4 text-[#FFB300] flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 card-shadow">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Recent Transfers</h3>
            <div className="space-y-3">
              {recentTransfers.map((tx, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {tx.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{tx.name}</p>
                    <p className="text-xs text-slate-400">{tx.bank} · {tx.time}</p>
                  </div>
                  <span className="text-sm font-bold text-[#0F172A]">{fmtAmt(tx.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
