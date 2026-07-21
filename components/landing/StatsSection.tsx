'use client';

import { useRef, useEffect, useState } from 'react';

const stats = [
  { value: 10, suffix: 'B+', prefix: '$', label: 'Loans Processed', description: 'Total loan volume disbursed' },
  { value: 250, suffix: 'K+', prefix: '', label: 'Happy Customers', description: 'Active verified users' },
  { value: 99.99, suffix: '%', prefix: '', label: 'Uptime SLA', description: 'Guaranteed availability' },
  { value: 4.9, suffix: '★', prefix: '', label: 'Customer Rating', description: 'Average app store rating' },
];

function CountUp({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2200;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(parseFloat(current.toFixed(2)));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = Number.isInteger(target) ? Math.round(count) : count.toFixed(2);

  return (
    <div ref={ref} className="text-5xl lg:text-6xl font-extrabold text-white">
      {prefix}{display}{suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #F64C9C 0%, transparent 50%), radial-gradient(circle at 80% 50%, #3B8BFF 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container-max px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-white/60 text-lg font-medium">Numbers that speak for themselves</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mt-2">
            The bank America trusts
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-4 bg-white/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                <CountUp target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <p className="text-white font-bold text-lg">{stat.label}</p>
              <p className="text-white/50 text-sm mt-1">{stat.description}</p>

              {/* Progress bar decoration */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-4">
                <div
                  className="h-full rounded-full bg-[#F64C9C]"
                  style={{ width: `${[80, 95, 100, 98][i]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Partner logos placeholder */}
        <div className="mt-20 pt-10 border-t border-white/15">
          <p className="text-center text-white/40 text-sm mb-8 font-medium uppercase tracking-widest">
            Trusted & Regulated by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {['FDIC', 'Federal Reserve', 'OCC', 'FinCEN', 'PCI-DSS', 'ISO 27001'].map((org) => (
              <div key={org} className="text-white/30 font-bold text-sm tracking-wider hover:text-white/60 transition-colors duration-200 cursor-default">
                {org}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
