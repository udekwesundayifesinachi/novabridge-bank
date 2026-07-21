'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CreditCard, ArrowLeftRight, TrendingUp,
  Wallet, Receipt, FileText, Users, Bell, Settings,
  LogOut, ChevronRight, Landmark, Menu, X, Search,
  Moon, Sun, Globe, Shield, HelpCircle, User,
  ChevronDown, PiggyBank
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Accounts', href: '/dashboard/accounts', icon: Wallet },
  { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
  { label: 'Loans', href: '/dashboard/loans', icon: FileText },
  { label: 'Cards', href: '/dashboard/cards', icon: CreditCard },
  { label: 'Transfers', href: '/dashboard/transfers', icon: ArrowLeftRight },
  { label: 'Bills', href: '/dashboard/bills', icon: Receipt },
  { label: 'Savings', href: '/dashboard/savings', icon: PiggyBank },
  { label: 'Beneficiaries', href: '/dashboard/beneficiaries', icon: Users },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Support', href: '/support', icon: HelpCircle },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/auth/login');
      } else {
        setUser(data.user);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 mobile-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 bg-white border-r border-[#E8EEF7] flex flex-col transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 w-72'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#E8EEF7]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <Landmark className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-[#0F172A]">
              Novabridge<span className="text-[#0A5CFF]">Bank</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
                {link.label === 'Notifications' && (
                  <span className="ml-auto bg-[#F64C9C] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Profile & Logout */}
        <div className="border-t border-[#E8EEF7] p-4 space-y-2">
          <Link
            href="/dashboard/profile"
            className="sidebar-link sidebar-link-inactive"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </Link>
          <button
            onClick={handleLogout}
            className="sidebar-link sidebar-link-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E8EEF7] flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <Landmark className="w-4 h-4" />
              <ChevronRight className="w-3 h-3" />
              <span className="font-medium text-[#0F172A] capitalize">
                {pathname?.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-56 pl-10 pr-4 py-2 rounded-xl border border-[#E8EEF7] bg-[#F8FAFC] text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] transition-all"
              />
            </div>

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language */}
            <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors hidden sm:flex">
              <Globe className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F64C9C] rounded-full" />
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E8EEF7] overflow-hidden py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#E8EEF7]">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{displayName}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  {[
                    { label: 'My Profile', href: '/dashboard/profile', icon: User },
                    { label: 'Security', href: '/dashboard/settings', icon: Shield },
                    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#0A5CFF] transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-[#E8EEF7] mt-1 pt-1">
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
