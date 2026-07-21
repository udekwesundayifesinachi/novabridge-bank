'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="gradient-hero py-20 px-4 sm:px-6 lg:px-8 text-center">
          <div className="container-max">
            <h1 className="text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
            <p className="text-white/70 text-xl max-w-xl mx-auto">
              Our team is always here to help. Reach out through any channel that works for you.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F172A] mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {[
                    { icon: Phone, label: 'Phone', value: '+1 800 NOVA BANK', sub: 'Mon–Fri, 8am–8pm EST' },
                    { icon: Mail, label: 'Email', value: 'hello@novabridgebank.com', sub: 'We reply within 24 hours' },
                    { icon: MapPin, label: 'Head Office', value: '123 Finance Boulevard', sub: 'New York, NY, United States' },
                    { icon: MessageCircle, label: 'Live Chat', value: 'Available 24/7', sub: 'In-app or on website' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 p-4 bg-[#F8FAFC] rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-[#0A5CFF]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                        <p className="font-semibold text-[#0F172A] text-sm">{item.value}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-8 card-shadow-lg">
                  {!submitted ? (
                    <>
                      <h2 className="text-2xl font-extrabold text-[#0F172A] mb-6">Send us a Message</h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                            <input type="text" required className="input-field" placeholder="John Smith"
                              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <input type="email" required className="input-field" placeholder="john@example.com"
                              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                          <select className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                            <option value="">Select a topic</option>
                            <option>Account Issue</option>
                            <option>Loan Application</option>
                            <option>Transaction Problem</option>
                            <option>Card Issue</option>
                            <option>KYC Verification</option>
                            <option>Feedback / Suggestion</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                          <textarea required className="input-field resize-none h-36" placeholder="Tell us how we can help you..."
                            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                        </div>
                        <button type="submit" disabled={loading}
                          className="flex items-center justify-center gap-2 gradient-primary text-white font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 text-sm">
                          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-[#E8FFF3] flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 className="w-8 h-8 text-[#00C853]" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-[#0F172A] mb-3">Message Sent!</h2>
                      <p className="text-slate-500 text-sm">Thank you for reaching out. Our team will respond to <strong>{form.email}</strong> within 24 hours.</p>
                      <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                        className="mt-6 gradient-primary text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md">
                        Send Another Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
