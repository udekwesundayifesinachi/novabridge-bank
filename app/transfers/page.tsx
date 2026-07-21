import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Zap, Shield, Globe, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TransfersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="gradient-hero py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="container-max relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm text-white font-medium mb-6">
              <Zap className="w-4 h-4" /> Instant & Free
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-5">
              Transfer money<br />in seconds
            </h1>
            <p className="text-white/70 text-xl max-w-xl mx-auto mb-8">
              Send to any US bank account instantly. Zero fees for Premium members. Real-time confirmation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register" className="flex items-center gap-2 bg-white text-[#0A5CFF] font-bold px-7 py-4 rounded-2xl shadow-xl hover:-translate-y-1 transition-all text-sm">
                Send Money Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding bg-[#F8FAFC]">
          <div className="container-max">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-[#0F172A]">Transfer Features</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: 'Instant ACH', desc: 'Transfers in under 5 seconds via ACH', color: '#0A5CFF' },
                { icon: Globe, title: 'International', desc: 'Send to 50+ countries worldwide', color: '#00C853' },
                { icon: Shield, title: '100% Secure', desc: '256-bit encryption on every transfer', color: '#F64C9C' },
                { icon: Clock, title: '24/7 Available', desc: 'Transfer any time, any day', color: '#FFB300' },
              ].map((f) => (
                <div key={f.title} className="feature-card bg-white rounded-2xl p-6 card-shadow text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${f.color}15` }}>
                    <f.icon className="w-7 h-7" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
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
