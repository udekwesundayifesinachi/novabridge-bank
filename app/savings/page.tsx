import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, TrendingUp, PiggyBank, Lock, Percent } from 'lucide-react';
import Link from 'next/link';

export default function SavingsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="gradient-hero py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="container-max relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm text-white font-medium mb-6">
              <TrendingUp className="w-4 h-4" /> Earn More on Every Dollar
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-5">Save Smart. Earn Big.</h1>
            <p className="text-white/70 text-xl max-w-xl mx-auto mb-8">
              Up to 22% per annum. No hidden fees. Your money grows while you sleep.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register" className="flex items-center gap-2 bg-white text-[#0A5CFF] font-bold px-7 py-4 rounded-2xl shadow-xl hover:-translate-y-1 transition-all text-sm">
                Open Savings Account <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="section-padding bg-[#F8FAFC]">
          <div className="container-max">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-[#0F172A]">Choose your savings plan</h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Flexible Savings',
                  rate: '18% p.a.',
                  minBalance: '$1,000',
                  withdrawal: 'Anytime',
                  color: '#0A5CFF',
                  icon: PiggyBank,
                  features: ['Instant withdrawal', 'Daily interest accrual', 'No lock-in period', 'Auto-save feature'],
                },
                {
                  name: 'Fixed Deposit',
                  rate: '22% p.a.',
                  minBalance: '$100,000',
                  withdrawal: '30–365 days',
                  color: '#00C853',
                  icon: Lock,
                  features: ['Highest interest rate', '30, 90, 180, 365 day options', 'Auto-renew option', 'Early withdrawal penalty waived for emergencies'],
                  popular: true,
                },
                {
                  name: 'Target Savings',
                  rate: '18% p.a.',
                  minBalance: '$500',
                  withdrawal: 'On maturity',
                  color: '#F64C9C',
                  icon: Percent,
                  features: ['Set a savings goal', 'Automated contributions', 'Goal tracking dashboard', 'Bonus interest on completion'],
                },
              ].map((plan) => (
                <div key={plan.name} className={`bg-white rounded-3xl p-8 card-shadow banking-card relative ${plan.popular ? 'ring-2 ring-[#00C853]' : ''}`}>
                  {plan.popular && (
                    <span className="absolute top-4 right-4 bg-[#00C853] text-white text-xs font-bold px-3 py-1 rounded-full">Best Rate</span>
                  )}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${plan.color}15` }}>
                    <plan.icon className="w-7 h-7" style={{ color: plan.color }} />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">{plan.name}</h3>
                  <p className="text-4xl font-extrabold mt-3 mb-1" style={{ color: plan.color }}>{plan.rate}</p>
                  <p className="text-xs text-slate-400 mb-5">Min: {plan.minBalance} · Withdrawal: {plan.withdrawal}</p>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register"
                    className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-md text-white"
                    style={{ background: plan.color }}>
                    Open Account <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
