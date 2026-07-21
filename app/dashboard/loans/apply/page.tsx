'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Briefcase, FileText, Upload, CheckCircle2,
  ChevronRight, ArrowLeft, Calculator
} from 'lucide-react';

const STEPS = ['Personal', 'Employment', 'Loan Details', 'Documents', 'Review'];

const loanTypes = [
  'Personal Loan', 'Salary Advance', 'Business Loan', 'SME Loan',
  'Auto Loan', 'Mortgage', 'Emergency Loan', 'Education Loan', 'Travel Loan'
];

export default function LoanApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Personal
    fullName: '', dob: '', address: '', maritalStatus: '',
    // Employment
    employer: '', jobTitle: '', income: '', employmentType: '',
    existingLoans: 'No',
    // Loan
    loanType: 'Personal Loan', amount: 200000, tenure: 12,
    purpose: '',
    // Guarantor
    guarantorName: '', guarantorPhone: '',
    // Docs
    idDoc: null as any, bankStatement: null as any, selfie: null as any,
  });

  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const monthlyRate = 0.025;
  const emi = form.amount * monthlyRate * Math.pow(1 + monthlyRate, form.tenure) / (Math.pow(1 + monthlyRate, form.tenure) - 1);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    router.push('/dashboard/loans');
  };

  const fmtAmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => step > 0 ? setStep((s) => s - 1) : router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Loan Application</h1>
          <p className="text-slate-500 text-sm mt-0.5">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              i < step ? 'bg-[#00C853] text-white' : i === step ? 'gradient-primary text-white shadow-md' : 'bg-[#F8FAFC] text-slate-400 border border-[#E8EEF7]'
            }`}>
              {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 card-shadow">
            {/* Step 0: Personal */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-bold text-[#0F172A] flex items-center gap-2"><User className="w-5 h-5 text-[#0A5CFF]" /> Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input className="input-field" placeholder="John Michael Smith" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth</label>
                    <input type="date" className="input-field" value={form.dob} onChange={(e) => update('dob', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Residential Address</label>
                    <input className="input-field" placeholder="123 Madison Ave, New York" value={form.address} onChange={(e) => update('address', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Marital Status</label>
                    <select className="input-field" value={form.maritalStatus} onChange={(e) => update('maritalStatus', e.target.value)}>
                      <option value="">Select</option>
                      <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Employment */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-bold text-[#0F172A] flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#0A5CFF]" /> Employment & Financial</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Employment Type</label>
                    <select className="input-field" value={form.employmentType} onChange={(e) => update('employmentType', e.target.value)}>
                      <option value="">Select</option>
                      <option>Employed (Salaried)</option><option>Self-Employed</option><option>Business Owner</option><option>Contractor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Employer / Business Name</label>
                    <input className="input-field" placeholder="ABC Corporation Ltd" value={form.employer} onChange={(e) => update('employer', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                    <input className="input-field" placeholder="Senior Manager" value={form.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Net Income ($)</label>
                    <input type="number" className="input-field" placeholder="500000" value={form.income} onChange={(e) => update('income', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Do you have existing loans?</label>
                    <div className="flex gap-3">
                      {['Yes', 'No'].map((opt) => (
                        <label key={opt} className={`flex items-center gap-2 flex-1 border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${form.existingLoans === opt ? 'border-[#0A5CFF] bg-blue-50' : 'border-[#E8EEF7] hover:border-slate-300'}`}>
                          <input type="radio" name="existingLoans" value={opt} checked={form.existingLoans === opt} onChange={() => update('existingLoans', opt)} className="accent-[#0A5CFF]" />
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Guarantor Name</label>
                    <input className="input-field" placeholder="Full name" value={form.guarantorName} onChange={(e) => update('guarantorName', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Guarantor Phone</label>
                    <input className="input-field" placeholder="+1 xxx xxx xxxx" value={form.guarantorPhone} onChange={(e) => update('guarantorPhone', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Loan Details */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-bold text-[#0F172A] flex items-center gap-2"><Calculator className="w-5 h-5 text-[#0A5CFF]" /> Loan Details</h2>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Loan Type</label>
                  <select className="input-field" value={form.loanType} onChange={(e) => update('loanType', e.target.value)}>
                    {loanTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">Loan Amount</label>
                    <span className="text-sm font-bold text-[#0A5CFF]">{fmtAmt(form.amount)}</span>
                  </div>
                  <input type="range" min={50000} max={5000000} step={50000} value={form.amount}
                    onChange={(e) => update('amount', Number(e.target.value))}
                    className="w-full accent-[#0A5CFF]" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>$50K</span><span>$5M</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">Repayment Period</label>
                    <span className="text-sm font-bold text-[#0A5CFF]">{form.tenure} months</span>
                  </div>
                  <input type="range" min={1} max={24} step={1} value={form.tenure}
                    onChange={(e) => update('tenure', Number(e.target.value))}
                    className="w-full accent-[#0A5CFF]" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1 mo</span><span>24 mo</span></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Purpose of Loan</label>
                  <textarea className="input-field resize-none h-20" placeholder="Describe what you need this loan for..." value={form.purpose} onChange={(e) => update('purpose', e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-bold text-[#0F172A] flex items-center gap-2"><Upload className="w-5 h-5 text-[#0A5CFF]" /> Document Upload</h2>
                {[
                  { key: 'idDoc', label: 'Government ID (SSN/Passport/Driver\'s License)', required: true },
                  { key: 'bankStatement', label: '3-Month Bank Statement', required: true },
                  { key: 'selfie', label: 'Selfie / Live Photo', required: true },
                ].map((doc) => (
                  <div key={doc.key}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {doc.label} {doc.required && <span className="text-red-500">*</span>}
                    </label>
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-colors hover:bg-[#F8FAFC] ${form[doc.key as keyof typeof form] ? 'border-[#00C853] bg-[#E8FFF3]' : 'border-[#E8EEF7]'}`}>
                      <input type="file" className="hidden" onChange={(e) => update(doc.key, e.target.files?.[0] || null)} />
                      {form[doc.key as keyof typeof form] ? (
                        <div className="flex items-center gap-2 text-[#00C853]">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-semibold">File uploaded</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-300 mb-2" />
                          <span className="text-sm text-slate-500">Click to upload or drag & drop</span>
                          <span className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (max 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-bold text-[#0F172A] flex items-center gap-2"><FileText className="w-5 h-5 text-[#0A5CFF]" /> Review Application</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Full Name', value: form.fullName || '—' },
                    { label: 'Employment', value: form.employmentType || '—' },
                    { label: 'Monthly Income', value: form.income ? fmtAmt(Number(form.income)) : '—' },
                    { label: 'Loan Type', value: form.loanType },
                    { label: 'Loan Amount', value: fmtAmt(form.amount) },
                    { label: 'Tenure', value: `${form.tenure} months` },
                    { label: 'Monthly EMI', value: fmtAmt(emi), highlight: true },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between py-2 border-b border-[#E8EEF7] last:border-0">
                      <span className="text-sm text-slate-500">{row.label}</span>
                      <span className={`text-sm font-semibold ${row.highlight ? 'text-[#0A5CFF]' : 'text-[#0F172A]'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#EEF4FF] rounded-xl p-4 text-xs text-[#0A5CFF] leading-relaxed">
                  By submitting this application, you confirm all provided information is accurate and authorize NovabridgeBank to perform credit checks.
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={() => setStep((s) => s - 1)} className="flex-1 border-2 border-[#E8EEF7] text-slate-600 font-semibold py-3.5 rounded-xl text-sm hover:border-slate-300 transition-colors">
                  Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep((s) => s + 1)} className="flex-[2] gradient-primary text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Continue <ChevronRight className="inline w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-[2] gradient-primary text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Loan Summary */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Loan Summary</h3>
            <div className="space-y-3">
              <div className="gradient-hero rounded-2xl p-5 text-white text-center">
                <p className="text-xs text-white/60 mb-1">Requested Amount</p>
                <p className="text-3xl font-extrabold">{fmtAmt(form.amount)}</p>
              </div>
              {[
                { label: 'Monthly EMI', value: fmtAmt(emi), color: '#0A5CFF' },
                { label: 'Interest Rate', value: '2.5% / month' },
                { label: 'Tenure', value: `${form.tenure} months` },
                { label: 'Total Repayable', value: fmtAmt(emi * form.tenure), color: '#F64C9C' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm border-b border-[#E8EEF7] pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-bold" style={{ color: row.color || '#0F172A' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Timeline */}
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Approval Timeline</h3>
            {[
              { label: 'Application Submitted', done: false },
              { label: 'Document Review', done: false },
              { label: 'Credit Assessment', done: false },
              { label: 'Approval Decision', done: false },
              { label: 'Disbursement', done: false },
            ].map((st, i) => (
              <div key={st.label} className="flex items-center gap-3 py-2">
                <div className="status-step-pending w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-xs text-slate-500">{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
