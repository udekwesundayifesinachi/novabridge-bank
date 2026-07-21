'use client';

import { CheckCircle2, UserPlus, ShieldCheck, FileText, ClipboardCheck, Banknote } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    desc: 'Sign up in under 3 minutes with your email and phone number.',
    color: '#0A5CFF',
    step: '01',
  },
  {
    icon: ShieldCheck,
    title: 'Verify Identity',
    desc: 'Submit your SSN and government-issued ID for KYC verification.',
    color: '#F64C9C',
    step: '02',
  },
  {
    icon: FileText,
    title: 'Apply for Loan',
    desc: 'Fill our smart application form. Takes less than 5 minutes.',
    color: '#7C3AED',
    step: '03',
  },
  {
    icon: ClipboardCheck,
    title: 'Instant Approval',
    desc: 'Our AI engine reviews your application and responds in minutes.',
    color: '#FFB300',
    step: '04',
  },
  {
    icon: Banknote,
    title: 'Funds Disbursed',
    desc: 'Approved funds sent directly to your account in seconds.',
    color: '#00C853',
    step: '05',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 text-[#0A5CFF] font-semibold text-sm bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-6">
              Simple Process
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
              Get funded in{' '}
              <span className="text-gradient">5 simple steps</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              From registration to funds in your account — our streamlined process takes less than 24 hours. No paperwork, no branch visits.
            </p>

            <div className="space-y-2">
              {[
                '100% online — no branch visits',
                'AI-powered credit scoring',
                'Bank-level 256-bit encryption',
                'Funds disbursed in under 1 hour',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C853] flex-shrink-0" />
                  <span className="text-slate-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-10">
              <a
                href="/auth/register"
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                Get Started Free
              </a>
              <a
                href="/loans"
                className="btn-outline inline-flex items-center gap-2 text-sm"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#0A5CFF] via-[#F64C9C] to-[#00C853] rounded-full" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative flex gap-6 group"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Step circle */}
                  <div
                    className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${step.color}15`, border: `2px solid ${step.color}30` }}
                  >
                    <step.icon className="w-7 h-7" style={{ color: step.color }} />
                    <span
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-5 group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-[#0F172A] text-base">{step.title}</h3>
                      <span className="text-xs font-bold text-slate-300">{step.step}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
