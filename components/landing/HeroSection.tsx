'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Play, Shield, TrendingUp, Zap, ChevronRight,
  CreditCard, ArrowUpRight, BarChart3, Bell
} from 'lucide-react';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HeroSection() {
  return (
    <section className="hero-bg min-h-screen flex items-center relative overflow-hidden">
      {/* Animated orbs */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-[#F64C9C]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-blue-300/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-max px-4 sm:px-6 lg:px-8 pt-20 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#00C853] rounded-full animate-pulse" />
              <span>Trusted by 250,000+ Customers</span>
              <ChevronRight className="w-4 h-4 text-white/60" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Bank Smarter.{' '}
              <span className="text-gradient-pink block">Borrow Faster.</span>
              Grow Stronger.
            </h1>

            <p className="text-white/75 text-lg lg:text-xl leading-relaxed mb-8 max-w-lg">
              Experience the future of banking with instant loans, zero-fee transfers, and powerful savings tools — all in one secure digital platform.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 mb-10 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00C853]" />
                <span>Federally Licensed</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFB300]" />
                <span>99.99% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0A5CFF]" />
                <span>$10B+ Loans Processed</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/auth/register"
                className="flex items-center gap-2 bg-white text-[#0A5CFF] font-bold px-7 py-4 rounded-2xl text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                Open Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/loans"
                className="flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-7 py-4 rounded-2xl text-base hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                Apply for Loan
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 group">
                <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </span>
                Watch Demo
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/15">
              {[
                { label: 'Loans Processed', value: 10, suffix: 'B+', prefix: '$' },
                { label: 'Active Users', value: 250, suffix: 'K+' },
                { label: 'Uptime', value: 99, suffix: '.99%' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-white">
                    {stat.prefix}
                    <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main dashboard card */}
              <div className="glass rounded-3xl p-6 shadow-2xl floating-animation float-delay-1">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Total Balance</p>
                    <p className="text-3xl font-extrabold text-[#0F172A]">$2,847,500</p>
                    <span className="inline-flex items-center gap-1 text-xs text-[#00C853] font-medium mt-1">
                      <TrendingUp className="w-3 h-3" /> +12.4% this month
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-md">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-16 flex items-end gap-1 mb-6">
                  {[40, 60, 45, 80, 65, 90, 75, 95, 70, 100, 88, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm opacity-80 transition-all duration-300"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, ${i === 11 ? '#0A5CFF' : '#0A5CFF60'} 0%, transparent 100%)`,
                      }}
                    />
                  ))}
                </div>

                {/* Account Cards Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F8FAFC] rounded-2xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Savings</p>
                    <p className="text-lg font-bold text-[#0F172A]">$540,000</p>
                    <span className="text-xs text-[#00C853]">+5.2%</span>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-2xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Active Loan</p>
                    <p className="text-lg font-bold text-[#0F172A]">$200,000</p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                      <div className="bg-[#0A5CFF] h-1.5 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -top-6 -right-8 glass rounded-2xl px-4 py-3 shadow-xl floating-animation float-delay-2 flex items-center gap-3 w-56">
                <div className="w-9 h-9 rounded-xl bg-[#00C853]/15 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-[#00C853]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0F172A]">Loan Approved!</p>
                  <p className="text-xs text-slate-500">$500,000 disbursed</p>
                </div>
              </div>

              {/* Floating virtual card */}
              <div className="absolute -bottom-8 -left-8 floating-animation float-delay-3">
                <div className="credit-card w-52 h-32 p-4 shadow-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start relative z-10">
                    <CreditCard className="w-6 h-6 text-white/80" />
                    <span className="text-xs text-white/60 font-medium">VIRTUAL</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-white/80 text-xs tracking-widest font-mono">•••• •••• •••• 4291</p>
                    <p className="text-white text-xs font-semibold mt-1">JAMES ANDERSON</p>
                  </div>
                </div>
              </div>

              {/* Floating quick action */}
              <div className="absolute top-1/2 -right-14 transform -translate-y-1/2 glass rounded-2xl p-4 shadow-xl floating-animation float-delay-1">
                <div className="space-y-3">
                  {[
                    { label: 'Send', color: '#0A5CFF' },
                    { label: 'Receive', color: '#00C853' },
                    { label: 'Loan', color: '#F64C9C' },
                  ].map((action) => (
                    <div key={action.label} className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: action.color }}
                      >
                        {action.label[0]}
                      </div>
                      <span className="text-xs font-medium text-slate-700">{action.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 80H1440V30C1200 70 900 10 600 50C300 90 100 20 0 30V80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
