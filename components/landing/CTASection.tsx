'use client';

import Link from 'next/link';
import { ArrowRight, Smartphone, Star } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-max">
        <div className="relative gradient-hero rounded-3xl overflow-hidden px-8 py-16 lg:px-16 lg:py-20 text-white">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#F64C9C]/15 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-300/15 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6 backdrop-blur-sm">
                <Star className="w-4 h-4 fill-[#FFB300] text-[#FFB300]" />
                <span>4.9/5 Rating — Over 12,000 reviews</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
                Start your financial journey{' '}
                <span className="text-[#F64C9C]">today</span>
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Join over 250,000 Americans who have taken control of their finances with NovabridgeBank. Open your free account in 3 minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 bg-white text-[#0A5CFF] font-bold px-7 py-4 rounded-2xl text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  Open Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/loans"
                  className="flex items-center gap-2 bg-white/15 border border-white/25 text-white font-semibold px-7 py-4 rounded-2xl text-sm hover:bg-white/25 transition-all duration-300"
                >
                  Apply for Loan
                </Link>
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="w-5 h-5 text-white/60" />
                <span className="text-white/60 text-sm font-medium">Available on all devices</span>
              </div>
              {[
                {
                  store: 'App Store',
                  os: 'Download on the',
                  icon: '🍎',
                  badge: '4.9 ★',
                },
                {
                  store: 'Google Play',
                  os: 'Get it on',
                  icon: '▶',
                  badge: '4.8 ★',
                },
              ].map((app) => (
                <a
                  key={app.store}
                  href="#"
                  className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-5 py-4 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm group"
                >
                  <span className="text-2xl">{app.icon}</span>
                  <div className="flex-1">
                    <p className="text-white/60 text-xs">{app.os}</p>
                    <p className="text-white font-bold text-base">{app.store}</p>
                  </div>
                  <span className="text-white/60 text-sm font-medium">{app.badge}</span>
                </a>
              ))}

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {['256-bit SSL', 'Federally Licensed', 'FDIC Insured', 'PCI-DSS'].map((badge) => (
                  <span
                    key={badge}
                    className="text-white/50 text-xs font-medium bg-white/10 border border-white/15 rounded-full px-3 py-1"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
