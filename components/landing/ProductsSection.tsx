'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Percent } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Personal Loan',
    amount: '$50K – $5M',
    rate: '2.5% monthly',
    tenure: 'Up to 24 months',
    tag: 'Most Popular',
    tagColor: '#0A5CFF',
    img: 'https://images.pexels.com/photos/7821937/pexels-photo-7821937.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/loans',
  },
  {
    id: 2,
    name: 'Salary Advance',
    amount: 'Up to 3x salary',
    rate: '1.5% monthly',
    tenure: 'Up to 6 months',
    tag: 'Fast Approval',
    tagColor: '#00C853',
    img: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/loans',
  },
  {
    id: 3,
    name: 'Business Loan',
    amount: '$500K – $50M',
    rate: '2% monthly',
    tenure: 'Up to 36 months',
    tag: 'SME Friendly',
    tagColor: '#7C3AED',
    img: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/loans',
  },
  {
    id: 4,
    name: 'Auto Loan',
    amount: '$1M – $30M',
    rate: '1.8% monthly',
    tenure: 'Up to 48 months',
    tag: 'Low Rate',
    tagColor: '#FFB300',
    img: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/loans',
  },
  {
    id: 5,
    name: 'Savings Account',
    amount: 'No minimum',
    rate: '18% p.a. yield',
    tenure: 'Flexible',
    tag: 'Best Rate',
    tagColor: '#00C853',
    img: 'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/savings',
  },
  {
    id: 6,
    name: 'Fixed Deposit',
    amount: 'From $100K',
    rate: '22% p.a. yield',
    tenure: '30–365 days',
    tag: 'High Yield',
    tagColor: '#F64C9C',
    img: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/savings',
  },
  {
    id: 7,
    name: 'Virtual Card',
    amount: 'Free issuance',
    rate: 'USD, EUR, GBP',
    tenure: 'Instant activation',
    tag: 'New',
    tagColor: '#0A5CFF',
    img: 'https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/cards',
  },
  {
    id: 8,
    name: 'Credit Card',
    amount: 'Up to $2M limit',
    rate: '0% for 3 months',
    tenure: 'Revolving credit',
    tag: 'Premium',
    tagColor: '#E53935',
    img: 'https://images.pexels.com/photos/6214481/pexels-photo-6214481.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/cards',
  },
  {
    id: 9,
    name: 'Education Loan',
    amount: '$100K – $3M',
    rate: '1.2% monthly',
    tenure: 'Up to 36 months',
    tag: 'Special Rate',
    tagColor: '#7C3AED',
    img: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/loans',
  },
];

export default function ProductsSection() {
  return (
    <section className="section-padding bg-[#F8FAFC]">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[#0A5CFF] font-semibold text-sm bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-3">
              <TrendingUp className="w-4 h-4" />
              Our Products
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A]">
              The right product<br />for every goal
            </h2>
          </div>
          <Link
            href="/loans"
            className="flex items-center gap-2 text-[#0A5CFF] font-semibold text-sm hover:gap-3 transition-all duration-200 whitespace-nowrap"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-400 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span
                  className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: product.tagColor }}
                >
                  {product.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-[#0F172A] mb-3 group-hover:text-[#0A5CFF] transition-colors">
                  {product.name}
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#F8FAFC] rounded-xl p-2">
                    <p className="text-xs text-slate-400 mb-0.5">Amount</p>
                    <p className="text-xs font-bold text-[#0F172A]">{product.amount}</p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl p-2">
                    <p className="text-xs text-slate-400 mb-0.5">Rate</p>
                    <p className="text-xs font-bold text-[#0A5CFF]">{product.rate}</p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl p-2">
                    <p className="text-xs text-slate-400 mb-0.5">Tenure</p>
                    <p className="text-xs font-bold text-[#0F172A]">{product.tenure}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[#0A5CFF] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-[#0A5CFF] transition-colors">
                    <Percent className="w-4 h-4 text-[#0A5CFF] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
