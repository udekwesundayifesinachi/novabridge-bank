'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Michael OBrien',
    role: 'Business Owner',
    company: 'OBrien Farms LLC',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "NovabridgeBank transformed my business. I got a $5M business loan approved in less than 3 hours. The process was seamless, and the customer service was exceptional. I couldn't believe how fast the funds hit my account.",
    amount: '$5M Business Loan',
  },
  {
    id: 2,
    name: 'Jessica Martinez',
    role: 'Civil Servant',
    company: 'US Department of Treasury',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "The salary advance feature saved me during a family emergency. I applied at midnight and the money was in my account by 6am. The repayment was automatically deducted from my salary — truly hassle-free!",
    amount: '$800K Salary Advance',
  },
  {
    id: 3,
    name: 'Chris Davis',
    role: 'Software Engineer',
    company: 'Tech Innovate Inc',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "I've used 5 different fintech apps and NovabridgeBank is by far the best. The virtual card works on all international websites, the savings interest rate is unbeatable, and the app is beautifully designed.",
    amount: 'Virtual Card & Savings',
  },
  {
    id: 4,
    name: 'Grace Wilson',
    role: 'Entrepreneur',
    company: 'Grace Beauty Hub',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "My fixed deposit account is earning 22% per annum! I've referred 12 friends already. NovabridgeBank is the real deal — transparent fees, fast support, and the dashboard analytics are incredibly helpful.",
    amount: '$2M Fixed Deposit',
  },
  {
    id: 5,
    name: 'Ian Moore',
    role: 'Import/Export Trader',
    company: 'Moore Global Trading',
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "Cross-border transfers used to be a nightmare. With NovabridgeBank, I send money internationally in minutes at the best exchange rates. My business cash flow has never been smoother.",
    amount: 'International Transfers',
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const next = () => setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  const active = testimonials[activeIndex];

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[#F64C9C] font-semibold text-sm bg-pink-50 px-4 py-2 rounded-full border border-pink-100 mb-4">
            <Star className="w-4 h-4 fill-[#F64C9C]" />
            Customer Stories
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A]">
            Loved by thousands
          </h2>
          <p className="text-slate-500 text-lg mt-3">Real stories from real customers who achieved their financial goals.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-3xl p-8 lg:p-12 card-shadow-lg relative overflow-hidden">
            <Quote className="absolute top-8 right-8 w-16 h-16 text-[#0A5CFF]/08" />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FFB300] text-[#FFB300]" />
              ))}
            </div>

            {/* Text */}
            <p className="text-slate-700 text-xl lg:text-2xl leading-relaxed font-medium mb-8 italic">
              "{active.text}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={active.avatar}
                  alt={active.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-md"
                />
                <div>
                  <p className="font-bold text-[#0F172A] text-lg">{active.name}</p>
                  <p className="text-slate-500 text-sm">{active.role} · {active.company}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 gradient-primary text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md">
                {active.amount}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-8 h-2 bg-[#0A5CFF]'
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-xl border-2 border-[#E8EEF7] flex items-center justify-center hover:border-[#0A5CFF] hover:text-[#0A5CFF] transition-colors duration-200 text-slate-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-white shadow-md hover:-translate-y-0.5 transition-transform duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnail row */}
          <div className="flex gap-4 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveIndex(i)}
                className={`flex items-center gap-3 flex-shrink-0 rounded-2xl px-4 py-3 transition-all duration-200 border-2 ${
                  i === activeIndex
                    ? 'border-[#0A5CFF] bg-blue-50 shadow-md'
                    : 'border-[#E8EEF7] bg-white hover:border-slate-300'
                }`}
              >
                <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-lg object-cover" />
                <div className="text-left">
                  <p className={`text-xs font-semibold ${i === activeIndex ? 'text-[#0A5CFF]' : 'text-slate-700'}`}>
                    {t.name.split(' ')[0]}
                  </p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
