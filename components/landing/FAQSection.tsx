'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How do I open an account with NovabridgeBank?',
    a: 'Opening an account is 100% online. Simply click "Open Account", provide your email, phone number, SSN, and complete the identity verification process. Your account will be active within minutes.',
  },
  {
    q: 'How quickly can I get a loan approved?',
    a: 'Our AI-powered credit engine processes most applications in under 30 minutes. Once approved, funds are disbursed to your NovabridgeBank wallet or linked bank account within the same business day.',
  },
  {
    q: 'What are the eligibility requirements for a loan?',
    a: 'To be eligible for a personal loan, you must be a US resident aged 21–65, have a verifiable source of income, a valid SSN, and no outstanding defaulted loans. Business loans require 6+ months of operation history.',
  },
  {
    q: 'Is my money safe with NovabridgeBank?',
    a: 'Absolutely. NovabridgeBank is licensed by federal banking authorities, deposits are insured by the FDIC, and we use 256-bit encryption with multi-factor authentication. We also maintain PCI-DSS compliance for card security.',
  },
  {
    q: 'What are the interest rates on savings?',
    a: 'Our regular savings account offers up to 18% per annum, while fixed deposit accounts offer up to 22% per annum. Interest is calculated daily and credited monthly. No hidden fees.',
  },
  {
    q: 'How does the virtual card work?',
    a: 'Virtual cards are instant Visa/Mastercard numbers you can use for online shopping worldwide. You can fund them from your NovabridgeBank wallet, set spending limits, freeze/unfreeze instantly, and get real-time transaction alerts.',
  },
  {
    q: 'What transfer limits apply?',
    a: 'Standard accounts have a daily transfer limit of $2,000,000. This can be increased to $10,000,000 for premium accounts after enhanced verification. Corporate accounts have custom limits based on business needs.',
  },
  {
    q: 'How do I contact customer support?',
    a: '24/7 support via in-app chat, email (hello@novabridgebank.com), or phone (+1 800 NOVA BANK). Our average response time is under 2 minutes for chat and under 24 hours for email.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-[#F8FAFC]">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Header */}
          <div className="lg:sticky lg:top-24">
            <span className="inline-flex items-center gap-2 text-[#0A5CFF] font-semibold text-sm bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-6">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
              Common questions,<br />clear answers
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Everything you need to know about NovabridgeBank. Can't find an answer?
            </p>
            <a
              href="/support"
              className="inline-flex items-center gap-2 bg-[#0A5CFF] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Visit Help Center
            </a>

            {/* Illustration */}
            <div className="mt-10 bg-white rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00C853]/15 flex items-center justify-center">
                  <span className="text-[#00C853] text-lg">💬</span>
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">Still have questions?</p>
                  <p className="text-slate-500 text-xs">Chat with a human, not a bot</p>
                </div>
              </div>
              <a
                href="/contact"
                className="w-full flex items-center justify-center gap-2 bg-[#0F172A] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#1e293b] transition-colors"
              >
                Start Live Chat →
              </a>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden card-shadow transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`text-sm font-semibold pr-4 ${openIndex === i ? 'text-[#0A5CFF]' : 'text-[#0F172A]'}`}>
                    {faq.q}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                      openIndex === i ? 'bg-[#0A5CFF] text-white' : 'bg-[#F8FAFC] text-slate-500'
                    }`}
                  >
                    {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-[#E8EEF7] mb-4" />
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
