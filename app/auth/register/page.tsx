'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, CreditCard,
  Landmark, ArrowRight, CheckCircle2, Shield, Gift
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const steps = ['Personal Info', 'Security', 'Verification'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    ssn: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agree: false,
  });

  const update = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleNext = () => {
    setError('');
    if (step === 0) {
      if (!form.fullName || !form.email || !form.phone) {
        setError('Please fill all required fields.');
        return;
      }
    }
    if (step === 1) {
      if (!form.password || form.password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            phone: form.phone,
          },
        },
      });
      if (signUpError) throw signUpError;

      await supabase.from('profiles').upsert({
        id: data.user?.id,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        ssn: form.ssn,
        referral_code: form.referralCode,
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 gradient-hero relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 70%, #F64C9C 0%, transparent 50%), radial-gradient(circle at 70% 30%, #3B8BFF 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Novabridge<span className="text-[#F64C9C]">Bank</span></span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Join 250,000+<br />smart savers &<br />borrowers
          </h1>
          <div className="space-y-3">
            {[
              'Free account with no monthly charges',
              'Instant loans from $50,000',
              'Earn 18% p.a. on savings',
              'Zero-fee transfers',
              'Virtual & physical debit cards',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00C853] flex-shrink-0" />
                <span className="text-white/80 text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral bonus */}
        <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-5 h-5 text-[#FFB300]" />
            <span className="text-white font-semibold text-sm">Referral Bonus</span>
          </div>
          <p className="text-white/60 text-xs">
            Enter a referral code to earn $5,000 cashback on your first loan.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F8FAFC] overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Landmark className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#0F172A]">Novabridge<span className="text-[#0A5CFF]">Bank</span></span>
            </Link>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                    i < step
                      ? 'bg-[#00C853] text-white'
                      : i === step
                      ? 'bg-[#0A5CFF] text-white'
                      : 'bg-[#E8EEF7] text-slate-400'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#0A5CFF]' : 'text-slate-400'}`}>
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-[#00C853]' : 'bg-[#E8EEF7]'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 card-shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#0F172A] mb-1">
                {step === 0 && 'Create your account'}
                {step === 1 && 'Set your password'}
                {step === 2 && 'Almost there!'}
              </h2>
              <p className="text-slate-500 text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#0A5CFF] font-semibold hover:underline">Sign in</Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" className="input-field pl-11" placeholder="John Michael Smith"
                      value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" className="input-field pl-11" placeholder="john@example.com"
                      value={form.email} onChange={(e) => update('email', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="tel" className="input-field pl-11" placeholder="+1 800 000 0000"
                      value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SSN
                    <span className="text-slate-400 font-normal ml-1">(Optional — required for loans)</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" className="input-field pl-11" placeholder="Enter your SSN"
                      value={form.ssn} onChange={(e) => update('ssn', e.target.value)} maxLength={9} />
                  </div>
                </div>
                <button onClick={handleNext} className="w-full gradient-primary text-white font-bold py-4 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  Continue <ArrowRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Create Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPass ? 'text' : 'password'} className="input-field pl-11 pr-11"
                      placeholder="Minimum 8 characters"
                      value={form.password} onChange={(e) => update('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    {[
                      form.password.length >= 8,
                      /[A-Z]/.test(form.password),
                      /[0-9]/.test(form.password),
                      /[^A-Za-z0-9]/.test(form.password),
                    ].map((met, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${met ? 'bg-[#00C853]' : 'bg-[#E8EEF7]'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">Use 8+ chars, uppercase, number, and symbol</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="password" className="input-field pl-11"
                      placeholder="Re-enter your password"
                      value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Referral Code <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" className="input-field pl-11" placeholder="Enter referral code"
                      value={form.referralCode} onChange={(e) => update('referralCode', e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="flex-1 border-2 border-[#E8EEF7] text-slate-600 font-semibold py-4 rounded-xl text-sm hover:border-slate-300 transition-colors">
                    Back
                  </button>
                  <button onClick={handleNext} className="flex-[2] gradient-primary text-white font-bold py-4 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                    Continue <ArrowRight className="inline w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Summary */}
                <div className="bg-[#F8FAFC] rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Account Summary</p>
                  {[
                    { label: 'Name', value: form.fullName },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-800 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="agree" required className="mt-1 rounded"
                    checked={form.agree} onChange={(e) => update('agree', e.target.checked)} />
                  <label htmlFor="agree" className="text-sm text-slate-600">
                    I agree to the{' '}
                    <Link href="/about" className="text-[#0A5CFF] font-medium hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/about" className="text-[#0A5CFF] font-medium hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 border-2 border-[#E8EEF7] text-slate-600 font-semibold py-4 rounded-xl text-sm hover:border-slate-300 transition-colors">
                    Back
                  </button>
                  <button type="submit" disabled={loading || !form.agree}
                    className="flex-[2] gradient-primary text-white font-bold py-4 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Shield className="w-4 h-4" /> Create Account</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
