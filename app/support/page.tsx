import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, MessageCircle, Phone, Mail, Clock, ChevronRight, Zap } from 'lucide-react';

const categories = [
  { title: 'Getting Started', icon: '🚀', count: 12, color: '#0A5CFF' },
  { title: 'Account & KYC', icon: '🔐', count: 8, color: '#7C3AED' },
  { title: 'Loans & Credit', icon: '💰', count: 15, color: '#00C853' },
  { title: 'Transfers', icon: '💸', count: 10, color: '#FFB300' },
  { title: 'Cards', icon: '💳', count: 7, color: '#F64C9C' },
  { title: 'Security', icon: '🛡️', count: 9, color: '#E53935' },
];

const popularArticles = [
  'How to apply for a loan',
  'How to create a virtual card',
  'What is the transfer limit?',
  'How to upgrade my account tier',
  'How to set up 2FA',
  'What documents do I need for KYC?',
];

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="gradient-hero py-20 px-4 sm:px-6 lg:px-8">
          <div className="container-max text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4">How can we help?</h1>
            <p className="text-white/70 text-lg mb-8">Search our knowledge base or get in touch with support</p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full pl-14 pr-5 py-4 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A5CFF] text-base shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Contact Channels */}
        <section className="py-12 bg-white border-b border-[#E8EEF7]">
          <div className="container-max px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: MessageCircle, title: 'Live Chat', desc: 'Available 24/7', info: '< 2 min response', color: '#0A5CFF', action: 'Start Chat' },
                { icon: Phone, title: 'Phone Support', desc: '+1 800 NOVA BANK', info: 'Mon–Fri 8am–8pm EST', color: '#00C853', action: 'Call Now' },
                { icon: Mail, title: 'Email Support', desc: 'hello@novabridgebank.com', info: '< 24 hour response', color: '#F64C9C', action: 'Send Email' },
              ].map((channel) => (
                <div key={channel.title} className="bg-[#F8FAFC] rounded-2xl p-6 text-center card-shadow banking-card">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${channel.color}15` }}>
                    <channel.icon className="w-7 h-7" style={{ color: channel.color }} />
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-1">{channel.title}</h3>
                  <p className="text-sm text-slate-600 mb-1">{channel.desc}</p>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-4">
                    <Clock className="w-3.5 h-3.5" /> {channel.info}
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 shadow-md"
                    style={{ background: channel.color }}
                  >
                    {channel.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="section-padding bg-[#F8FAFC]">
          <div className="container-max">
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-10 text-center">Browse Help Topics</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div key={cat.title} className="feature-card bg-white rounded-2xl p-6 card-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${cat.color}15` }}>
                        {cat.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F172A]">{cat.title}</h3>
                        <p className="text-xs text-slate-400">{cat.count} articles</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Popular Articles */}
            <div className="mt-14 max-w-2xl mx-auto">
              <h2 className="text-2xl font-extrabold text-[#0F172A] mb-6">Popular Articles</h2>
              <div className="space-y-3">
                {popularArticles.map((article) => (
                  <a
                    key={article}
                    href="#"
                    className="flex items-center justify-between bg-white rounded-xl px-5 py-4 card-shadow hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-[#0A5CFF]" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-[#0A5CFF] transition-colors">{article}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0A5CFF] transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
