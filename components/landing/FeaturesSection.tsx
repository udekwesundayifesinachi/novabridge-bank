'use client';

import { useRef } from 'react';
import {
  Zap, Wallet, TrendingUp, ArrowLeftRight, Receipt, CreditCard,
  Building2, PieChart, Bitcoin, Briefcase, Users, LineChart
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Loans',
    desc: 'Get approved in minutes. Funds disbursed to your account same day.',
    color: '#0A5CFF',
    bg: '#EEF4FF',
  },
  {
    icon: Wallet,
    title: 'Digital Wallet',
    desc: 'Store, send and receive money instantly with zero fees.',
    color: '#00C853',
    bg: '#E8FFF3',
  },
  {
    icon: TrendingUp,
    title: 'Smart Savings',
    desc: 'Earn up to 18% p.a. on your savings with flexible plans.',
    color: '#F64C9C',
    bg: '#FFF0F7',
  },
  {
    icon: ArrowLeftRight,
    title: 'Fast Transfers',
    desc: 'Transfer to any bank in the US in under 30 seconds.',
    color: '#FFB300',
    bg: '#FFF8E1',
  },
  {
    icon: Receipt,
    title: 'Bill Payments',
    desc: 'Pay utility bills, airtime, data, and more from one place.',
    color: '#7C3AED',
    bg: '#F5F0FF',
  },
  {
    icon: CreditCard,
    title: 'Virtual Cards',
    desc: 'Instant virtual Visa/Mastercard for online shopping globally.',
    color: '#0A5CFF',
    bg: '#EEF4FF',
  },
  {
    icon: CreditCard,
    title: 'Physical Cards',
    desc: 'Premium debit and credit cards delivered to your doorstep.',
    color: '#E53935',
    bg: '#FFF0EF',
  },
  {
    icon: PieChart,
    title: 'Investments',
    desc: 'Grow your wealth with mutual funds, bonds, and stocks.',
    color: '#00C853',
    bg: '#E8FFF3',
  },
  {
    icon: Bitcoin,
    title: 'Crypto Ready',
    desc: 'Buy, sell, and hold cryptocurrencies with ease and security.',
    color: '#FFB300',
    bg: '#FFF8E1',
  },
  {
    icon: Briefcase,
    title: 'Business Banking',
    desc: 'Corporate accounts, payroll, and expense management.',
    color: '#0A5CFF',
    bg: '#EEF4FF',
  },
  {
    icon: Users,
    title: 'Payroll',
    desc: 'Automate staff payments and generate payslips instantly.',
    color: '#7C3AED',
    bg: '#F5F0FF',
  },
  {
    icon: LineChart,
    title: 'Expense Tracking',
    desc: 'Visualize and categorize your spending with smart analytics.',
    color: '#F64C9C',
    bg: '#FFF0F7',
  },
];

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-[#F8FAFC]">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[#0A5CFF] font-semibold text-sm bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-4">
            <Zap className="w-4 h-4" />
            Everything You Need
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight">
            Built for modern banking
          </h2>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto">
            One platform, infinite possibilities. From instant loans to global transfers — NovabridgeBank has everything covered.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card bg-white rounded-2xl p-6 card-shadow cursor-pointer group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: feature.bg }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2 group-hover:text-[#0A5CFF] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
