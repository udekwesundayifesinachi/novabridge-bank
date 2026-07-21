'use client';

import { useEffect, useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Shield,
  Edit2, CheckCircle2, Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        supabase.from('profiles').select('*').eq('user_id', data.user.id).maybeSingle().then(({ data: p }) => {
          setProfile(p);
        });
      }
    });
  }, []);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information</p>
        </div>
        <Link href="/dashboard/settings"
          className="flex items-center gap-2 text-sm font-semibold text-[#0A5CFF] bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
          <Edit2 className="w-4 h-4" /> Edit Profile
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 card-shadow mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center text-white text-3xl font-extrabold shadow-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-[#0F172A]">{displayName}</h2>
            <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                profile?.kyc_status === 'verified'
                  ? 'bg-[#E8FFF3] text-[#00C853]'
                  : profile?.kyc_status === 'rejected'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-[#FFF8E1] text-[#FFB300]'
              }`}>
                {profile?.kyc_status === 'verified' ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> KYC Verified</>
                ) : (
                  <><Clock className="w-3.5 h-3.5" /> KYC {profile?.kyc_status || 'Pending'}</>
                )}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-[#0A5CFF] px-3 py-1.5 rounded-full capitalize">
                {profile?.account_tier || 'Starter'} Account
              </span>
              <span className="text-xs text-slate-400">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid sm:grid-cols-2 gap-5">
        {[
          { icon: User, label: 'Full Name', value: displayName },
          { icon: Mail, label: 'Email Address', value: user?.email || '—' },
          { icon: Phone, label: 'Phone Number', value: profile?.phone || '—' },
          { icon: Calendar, label: 'Date of Birth', value: profile?.date_of_birth || '—' },
          { icon: MapPin, label: 'Address', value: profile?.address || '—' },
          { icon: Shield, label: 'SSN Status', value: profile?.ssn ? 'Linked' : 'Not linked' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-5 card-shadow flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-[#0A5CFF]" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
              <p className="text-sm font-semibold text-[#0F172A]">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Account Tier Upgrade */}
      {(!profile?.account_tier || profile?.account_tier === 'starter') && (
        <div className="mt-6 gradient-hero rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-lg mb-1">Upgrade to Premium</h3>
              <p className="text-white/70 text-sm">Unlock unlimited transfers, higher loan limits, and more.</p>
            </div>
            <Link href="/pricing"
              className="flex items-center gap-2 bg-white text-[#0A5CFF] font-bold px-5 py-3 rounded-xl text-sm shadow-md hover:-translate-y-0.5 transition-all">
              View Plans →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
