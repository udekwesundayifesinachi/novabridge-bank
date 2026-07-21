import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Zap, Shield, Star } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    desc: 'Perfect for individuals getting started',
    color: '#64748b',
    popular: false,
    features: [
      'Free savings account',
      'Up to 5 free transfers/month',
      '$500K loan limit',
      '1 virtual card',
      'Mobile app access',
      'Email support',
    ],
    cta: 'Get Started Free',
    href: '/auth/register',
  },
  {
    name: 'Premium',
    price: '$2,500',
    period: '/month',
    desc: 'For power users who need more',
    color: '#0A5CFF',
    popular: true,
    features: [
      'Everything in Starter',
      'Unlimited free transfers',
      '$5M loan limit',
      '3 virtual cards + 1 physical card',
      'Priority customer support',
      'Advanced analytics',
      'Higher savings rates (+2%)',
      'QR payments',
    ],
    cta: 'Start Premium',
    href: '/auth/register',
  },
  {
    name: 'Business',
    price: '$9,999',
    period: '/month',
    desc: 'Built for SMEs and enterprises',
    color: '#7C3AED',
    popular: false,
    features: [
      'Everything in Premium',
      'Up to $50M loan limit',
      '10 virtual cards + 3 physical cards',
      'Multi-user access',
      'Payroll management',
      'API access',
      'Dedicated account manager',
      'Custom reporting',
    ],
    cta: 'Contact Sales',
    href: '/contact',
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="gradient-hero py-20 px-4 sm:px-6 lg:px-8 text-center">
          <div className="container-max">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm text-white font-medium mb-6">
              <Zap className="w-4 h-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-4">No hidden fees. Ever.</h1>
            <p className="text-white/70 text-xl max-w-xl mx-auto">
              Choose the plan that fits your financial journey. Upgrade or downgrade anytime.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="section-padding bg-[#F8FAFC]">
          <div className="container-max">
            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-3xl overflow-hidden card-shadow transition-all duration-300 hover:-translate-y-2 relative ${plan.popular ? 'ring-2 ring-[#0A5CFF] shadow-xl' : ''}`}
                >
                  {plan.popular && (
                    <div className="gradient-primary text-white text-xs font-bold text-center py-2 flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">{plan.name}</h3>
                      <p className="text-slate-500 text-sm">{plan.desc}</p>
                    </div>
                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-[#0F172A]">{plan.price}</span>
                      <span className="text-slate-400 text-sm ml-1">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.href}
                      className={`w-full flex items-center justify-center py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                        plan.popular
                          ? 'gradient-primary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                          : 'border-2 border-[#E8EEF7] text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Fees Table */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold text-[#0F172A] text-center mb-10">Transaction Fees</h2>
              <div className="bg-white rounded-3xl card-shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b border-[#E8EEF7]">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Service</th>
                      <th className="text-center px-6 py-4 text-sm font-semibold text-slate-600">Starter</th>
                      <th className="text-center px-6 py-4 text-sm font-semibold text-[#0A5CFF]">Premium</th>
                      <th className="text-center px-6 py-4 text-sm font-semibold text-[#7C3AED]">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Bank Transfer (ACH)', '$50/txn after 5 free', 'Unlimited free', 'Unlimited free'],
                      ['Airtime Top-up', 'Free', 'Free', 'Free'],
                      ['Bill Payments', '$100', 'Free', 'Free'],
                      ['Virtual Card Issuance', '$200', 'Free', 'Free'],
                      ['International Transfer', '$500 + 1.5%', '$500 + 1%', '0.5%'],
                      ['Loan Processing Fee', '1% of amount', '0.5%', '0%'],
                    ].map(([service, starter, premium, business]) => (
                      <tr key={service} className="border-b border-[#E8EEF7] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#0F172A]">{service}</td>
                        <td className="px-6 py-4 text-sm text-center text-slate-500">{starter}</td>
                        <td className="px-6 py-4 text-sm text-center font-semibold text-[#0A5CFF]">{premium}</td>
                        <td className="px-6 py-4 text-sm text-center font-semibold text-[#7C3AED]">{business}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
