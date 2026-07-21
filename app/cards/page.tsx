import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, CreditCard, Shield, Zap, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CardsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="gradient-hero py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="container-max grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <CreditCard className="w-4 h-4" /> Virtual & Physical Cards
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Cards built for the digital age
              </h1>
              <p className="text-white/70 text-xl mb-8">
                Get an instant virtual Visa or Mastercard for online shopping. Order a premium physical card delivered to your door.
              </p>
              <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-[#0A5CFF] font-bold px-7 py-4 rounded-2xl shadow-xl hover:-translate-y-1 transition-all text-sm">
                Get Your Card <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Card Display */}
            <div className="relative hidden lg:flex flex-col gap-4 items-center">
              {/* Virtual Card */}
              <div className="credit-card w-72 h-44 p-6 shadow-2xl floating-animation float-delay-1">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-xs font-medium">VIRTUAL</span>
                    <CreditCard className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/70 font-mono text-sm tracking-widest">4892 •••• •••• 7234</p>
                    <div className="flex justify-between mt-2">
                      <div>
                        <p className="text-white/40 text-xs">CARDHOLDER</p>
                        <p className="text-white text-xs font-semibold">YOUR NAME</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">EXPIRES</p>
                        <p className="text-white text-xs font-semibold">12/27</p>
                      </div>
                      <p className="text-white text-xl font-bold">VISA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section-padding bg-[#F8FAFC]">
          <div className="container-max">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-[#0F172A]">Everything you need in a card</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Instant Issuance', desc: 'Get a virtual card instantly after registration. No wait time.', color: '#0A5CFF' },
                { icon: Globe, title: 'Shop Worldwide', desc: 'Use your card on any website globally — Amazon, Netflix, Spotify, and more.', color: '#00C853' },
                { icon: Shield, title: 'Real-time Fraud Protection', desc: 'AI-powered fraud detection monitors every transaction 24/7.', color: '#F64C9C' },
                { icon: Lock, title: 'Freeze Instantly', desc: 'Lost your card? Freeze it in seconds from the app.', color: '#FFB300' },
                { icon: CreditCard, title: 'Multiple Currencies', desc: 'Create USD, EUR, and GBP virtual cards.', color: '#7C3AED' },
                { icon: CreditCard, title: 'Spending Controls', desc: 'Set daily limits, disable specific merchant categories.', color: '#E53935' },
              ].map((f) => (
                <div key={f.title} className="feature-card bg-white rounded-2xl p-6 card-shadow">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${f.color}15` }}>
                    <f.icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
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
