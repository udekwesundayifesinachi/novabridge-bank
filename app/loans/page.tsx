import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle2, Calculator, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoansPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="gradient-hero py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F64C9C]/10 rounded-full blur-3xl" />
          <div className="container-max grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" /> Instant Decision
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Loans that move<br />at your speed
              </h1>
              <p className="text-white/70 text-xl mb-8 leading-relaxed">
                Apply for up to $5M in minutes. No branch visits, no paperwork. Just smart, fast lending.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/register" className="flex items-center gap-2 bg-white text-[#0A5CFF] font-bold px-7 py-4 rounded-2xl shadow-xl hover:-translate-y-1 transition-all">
                  Apply Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-10">
                {[['2.5%', 'Monthly Rate'], ['30 min', 'Approval'], ['$5M', 'Max Loan']].map(([v, l]) => (
                  <div key={l}>
                    <p className="text-2xl font-extrabold">{v}</p>
                    <p className="text-white/50 text-xs">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-extrabold text-[#0F172A] mb-6">Loan Calculator</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-slate-600">Loan Amount</span>
                    <span className="font-bold text-[#0A5CFF]">$500,000</span>
                  </div>
                  <input type="range" min={50000} max={5000000} defaultValue={500000} className="w-full accent-[#0A5CFF]" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-slate-600">Duration</span>
                    <span className="font-bold text-[#0A5CFF]">12 months</span>
                  </div>
                  <input type="range" min={1} max={24} defaultValue={12} className="w-full accent-[#0A5CFF]" />
                </div>
                <div className="bg-[#EEF4FF] rounded-2xl p-5 text-center">
                  <p className="text-xs text-slate-400 mb-1">Estimated Monthly Payment</p>
                  <p className="text-4xl font-extrabold text-[#0A5CFF]">$56,250</p>
                  <p className="text-xs text-slate-400 mt-1">at 2.5% / month</p>
                </div>
                <Link href="/auth/register" className="w-full flex items-center justify-center gap-2 gradient-primary text-white font-bold py-4 rounded-2xl shadow-md text-sm">
                  Apply for This Loan <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Types */}
        <section className="section-padding bg-[#F8FAFC]">
          <div className="container-max">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-[#0F172A]">Find the right loan</h2>
              <p className="text-slate-500 text-lg mt-3">We have the perfect product for every financial need</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Personal Loan', amount: '$50K – $5M', rate: '2.5%/mo', tenure: 'Up to 24 mo', img: 'https://images.pexels.com/photos/7821937/pexels-photo-7821937.jpeg?auto=compress&cs=tinysrgb&w=500' },
                { name: 'Salary Advance', amount: 'Up to 3x salary', rate: '1.5%/mo', tenure: 'Up to 6 mo', img: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=500' },
                { name: 'Business Loan', amount: '$500K – $50M', rate: '2%/mo', tenure: 'Up to 36 mo', img: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=500' },
                { name: 'Auto Loan', amount: '$1M – $30M', rate: '1.8%/mo', tenure: 'Up to 48 mo', img: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=500' },
                { name: 'Education Loan', amount: '$100K – $3M', rate: '1.2%/mo', tenure: 'Up to 36 mo', img: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=500' },
                { name: 'Emergency Loan', amount: '$20K – $500K', rate: '3%/mo', tenure: 'Up to 3 mo', img: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=500' },
              ].map((loan) => (
                <div key={loan.name} className="bg-white rounded-2xl overflow-hidden card-shadow banking-card">
                  <img src={loan.img} alt={loan.name} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <h3 className="font-bold text-[#0F172A] mb-3">{loan.name}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[['Amount', loan.amount], ['Rate', loan.rate], ['Tenure', loan.tenure]].map(([label, value]) => (
                        <div key={label} className="bg-[#F8FAFC] rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">{label}</p>
                          <p className="text-xs font-bold text-[#0F172A] mt-0.5">{value}</p>
                        </div>
                      ))}
                    </div>
                    <Link href="/auth/register" className="w-full flex items-center justify-center gap-2 gradient-primary text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm">
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-[#0F172A]">Eligibility Requirements</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'US resident aged 21–65',
                'Valid SSN or Government ID',
                'Active bank account',
                'Verifiable source of income',
                'Minimum 3 months bank history',
                'No outstanding loan defaults',
              ].map((req) => (
                <div key={req} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl px-5 py-4">
                  <CheckCircle2 className="w-5 h-5 text-[#00C853] flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{req}</span>
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
