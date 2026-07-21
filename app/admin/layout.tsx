'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, ArrowLeftRight, CreditCard,
  ShieldCheck, BarChart3, Bell, Settings, LogOut, Landmark,
  Menu, X, ChevronRight, PiggyBank, Activity, Search,
  AlertCircle, Sliders, Database
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    links: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'User Management',
    links: [
      { label: 'All Users', href: '/admin/users', icon: Users },
      { label: 'KYC Review', href: '/admin/kyc', icon: ShieldCheck },
    ],
  },
  {
    label: 'Financial',
    links: [
      { label: 'Loans', href: '/admin/loans', icon: FileText },
      { label: 'Transactions', href: '/admin/transactions', icon: ArrowLeftRight },
      { label: 'Accounts', href: '/admin/accounts', icon: Database },
      { label: 'Savings', href: '/admin/savings', icon: PiggyBank },
    ],
  },
  {
    label: 'System',
    links: [
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href);

  return (
    <div className="flex h-screen bg-[#F0F2F8] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-[#0A0F23] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/8">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Landmark className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-white text-sm font-bold tracking-tight">NovabridgeBank</p>
              <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase">Admin Console</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="mx-4 mt-4 mb-2 flex items-center gap-2.5 bg-[#F64C9C]/15 border border-[#F64C9C]/25 rounded-xl px-3 py-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F64C9C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">SA</div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">Super Admin</p>
            <p className="text-white/40 text-[10px] truncate">Full Access</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#00C853] flex-shrink-0 ml-auto animate-pulse" />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="text-white/25 text-[9px] font-semibold uppercase tracking-widest px-3 py-2">{group.label}</p>
              <div className="space-y-0.5">
                {group.links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                        active
                          ? 'bg-[#0A5CFF] text-white shadow-lg'
                          : 'text-white/55 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      <link.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${active ? '' : 'group-hover:scale-110'}`} />
                      <span>{link.label}</span>
                      {link.label === 'KYC Review' && (
                        <span className="ml-auto text-[10px] font-bold bg-[#FFB300] text-black px-1.5 py-0.5 rounded-full">!</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/8 px-3 py-3 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 text-xs font-medium transition-colors">
            <Activity className="w-4 h-4" />
            <span>Switch to User View</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/10 text-xs font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#E8EEF7] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-1 bg-red-50 text-red-600 font-bold rounded-lg tracking-wide">ADMIN</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-[#0F172A] text-sm capitalize">
                {pathname === '/admin' ? 'Dashboard' : pathname?.split('/').filter(Boolean).slice(1).join(' / ') || 'Dashboard'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-[#F8FAFC] px-3 py-2 rounded-xl border border-[#E8EEF7]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
              System Operational
            </div>
            <Link href="/dashboard" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#0A5CFF] bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors border border-blue-100">
              User Dashboard →
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
