'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Landmark, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A]">Novabridge<span className="text-[#0A5CFF]">Bank</span></span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 card-shadow-lg">
          {!sent ? (
            <>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                  <Mail className="w-7 h-7 text-[#0A5CFF]" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Forgot your password?</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      className="input-field pl-11"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-primary text-white font-bold py-4 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#00C853]/15 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-[#00C853]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] mb-3">Check your inbox</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                We've sent a password reset link to <strong className="text-[#0F172A]">{email}</strong>.
                It expires in 15 minutes.
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Didn't receive it? Check your spam folder, or{' '}
                <button onClick={() => setSent(false)} className="text-[#0A5CFF] hover:underline font-medium">
                  try again
                </button>
              </p>
            </div>
          )}

          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-sm hover:text-[#0A5CFF] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
