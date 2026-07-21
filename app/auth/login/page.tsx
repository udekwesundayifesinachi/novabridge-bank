'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, Mail, Lock, Landmark, ArrowRight,
  Shield, Smartphone, Fingerprint
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (authError) throw authError;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col justify-between p-12">
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
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Welcome back to<br />smarter banking
          </h1>
          <p className="text-white/70 text-lg mb-10">
            Access your accounts, loans, transfers, and more — all in one secure place.
          </p>

          {/* Feature pills */}
          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Bank-grade 256-bit encryption' },
              { icon: Smartphone, text: 'Biometric authentication ready' },
              { icon: Fingerprint, text: 'Zero-knowledge security model' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm">
                <Icon className="w-5 h-5 text-[#00C853] flex-shrink-0" />
                <span className="text-white/80 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} NovabridgeBank Ltd. Federally Licensed. FDIC Insured.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0F172A]">Novabridge<span className="text-[#0A5CFF]">Bank</span></span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 card-shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Sign in to your account</h2>
              <p className="text-slate-500 text-sm">Don't have an account?{' '}
                <Link href="/auth/register" className="text-[#0A5CFF] font-semibold hover:underline">Create one free</Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    className="input-field pl-11"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-[#0A5CFF] hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    className="input-field pl-11 pr-11"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-white font-bold py-4 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8EEF7]" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3">OR CONTINUE WITH</div>
            </div>

            {/* Social logins */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Google', icon: '🔵' },
                { name: 'Apple', icon: '🍎' },
              ].map((provider) => (
                <button
                  key={provider.name}
                  className="flex items-center justify-center gap-2 border-2 border-[#E8EEF7] rounded-xl py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200"
                >
                  <span>{provider.icon}</span>
                  {provider.name}
                </button>
              ))}
            </div>

            {/* Biometric */}
            <div className="mt-4">
              <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E8EEF7] rounded-xl py-3 text-sm font-medium text-slate-500 hover:border-[#0A5CFF] hover:text-[#0A5CFF] transition-colors duration-200">
                <Fingerprint className="w-4 h-4" />
                Sign in with Biometrics
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to our{' '}
            <Link href="/about" className="text-[#0A5CFF] hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/about" className="text-[#0A5CFF] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
