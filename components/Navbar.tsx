'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, ChevronDown, Landmark, Bell, User,
  CreditCard, Wallet, TrendingUp, Shield, HelpCircle,
  LogIn, UserPlus
} from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '#',
    children: [
      { label: 'Personal Loans', href: '/loans', icon: Wallet },
      { label: 'Savings', href: '/savings', icon: TrendingUp },
      { label: 'Cards', href: '/cards', icon: CreditCard },
      { label: 'Transfers', href: '/transfers', icon: Landmark },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isDashboard) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-[#E8EEF7]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors duration-200 ${
                  isScrolled ? 'text-[#0F172A]' : 'text-white'
                }`}
              >
                Novabridge<span className={isScrolled ? 'text-[#0A5CFF]' : 'text-[#F64C9C]'}>Bank</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isScrolled
                          ? 'text-slate-600 hover:text-[#0A5CFF] hover:bg-blue-50'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8EEF7] overflow-hidden py-2 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#0A5CFF] transition-colors duration-150"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <child.icon className="w-4 h-4 text-[#0A5CFF]" />
                            </div>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      pathname === link.href
                        ? isScrolled
                          ? 'text-[#0A5CFF] bg-blue-50'
                          : 'text-white bg-white/15'
                        : isScrolled
                        ? 'text-slate-600 hover:text-[#0A5CFF] hover:bg-blue-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/auth/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isScrolled
                    ? 'text-[#0A5CFF] hover:bg-blue-50'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Link>
              <Link
                href="/auth/register"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isScrolled
                    ? 'gradient-primary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-white text-[#0A5CFF] shadow-md hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Open Account
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors duration-200 ${
                isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 mobile-overlay lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl lg:hidden overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E8EEF7]">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-[#0F172A]">
                  Novabridge<span className="text-[#0A5CFF]">Bank</span>
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-5 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 mt-3">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-[#0A5CFF] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <child.icon className="w-4 h-4" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-blue-50 text-[#0A5CFF]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            <div className="p-5 border-t border-[#E8EEF7] space-y-3">
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#0A5CFF] text-[#0A5CFF] font-semibold text-sm hover:bg-blue-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-md"
                onClick={() => setMobileOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                Open Account
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
