'use client';

import Link from 'next/link';
import {
  Landmark, Twitter, Linkedin, Instagram, Facebook, Youtube,
  MapPin, Phone, Mail, Shield, ArrowRight
} from 'lucide-react';

const footerLinks = {
  Products: [
    { label: 'Personal Loans', href: '/loans' },
    { label: 'Salary Advance', href: '/loans' },
    { label: 'Business Loans', href: '/loans' },
    { label: 'Savings Account', href: '/savings' },
    { label: 'Virtual Cards', href: '/cards' },
    { label: 'Transfers', href: '/transfers' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Press', href: '/about' },
    { label: 'Partners', href: '/about' },
    { label: 'Blog', href: '/about' },
    { label: 'Newsroom', href: '/about' },
  ],
  Support: [
    { label: 'Help Center', href: '/support' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'System Status', href: '/support' },
    { label: 'Community', href: '/support' },
    { label: 'API Docs', href: '/support' },
    { label: 'Developers', href: '/support' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms of Service', href: '/about' },
    { label: 'Cookie Policy', href: '/about' },
    { label: 'AML Policy', href: '/about' },
    { label: 'Compliance', href: '/about' },
    { label: 'Licenses', href: '/about' },
  ],
};

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0F23] text-white relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px w-full gradient-primary opacity-60" />

      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay ahead with NovabridgeBank</h3>
              <p className="text-slate-400 text-sm">Get the latest updates on products, features, and financial tips.</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 lg:w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0A5CFF] transition-colors text-sm"
              />
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary font-semibold text-sm whitespace-nowrap hover:-translate-y-0.5 transition-transform duration-200 shadow-lg">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-max px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Novabridge<span className="text-[#F64C9C]">Bank</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              NovabridgeBank is a licensed digital financial institution providing innovative banking solutions to individuals and businesses across the United States and beyond.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-[#0A5CFF] flex-shrink-0" />
                <span>123 Finance Boulevard, New York, NY</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-[#0A5CFF] flex-shrink-0" />
                <span>+1 800 NOVA BANK</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-[#0A5CFF] flex-shrink-0" />
                <span>hello@novabridgebank.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#0A5CFF] transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white hover:pl-1 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Shield className="w-4 h-4 text-[#00C853]" />
              <span>Regulated by Federal Banking Authorities | FDIC Insured | PCI-DSS Compliant</span>
            </div>
            <p className="text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} NovabridgeBank Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </footer>
  );
}
