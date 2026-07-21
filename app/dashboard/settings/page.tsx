'use client';

import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Lock, Bell, Shield,
  Smartphone, Key, Eye, EyeOff, Save, Camera,
  Moon, Globe, CreditCard, LogOut
} from 'lucide-react';

const tabs = ['Profile', 'Security', 'Notifications', 'Preferences'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [saved, setSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState({
    emailLoans: true, emailTransfers: true, emailSavings: false,
    smsLoans: true, smsTransfers: true, smsSavings: true,
    pushAll: true
  });
  const [profileForm, setProfileForm] = useState({
    fullName: 'James Anderson', email: 'james@example.com',
    phone: '+1 800 123 4567', dob: '1990-03-15', address: '123 Madison Ave, New York',
    bio: 'Business owner and financial enthusiast.'
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1000px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences and security</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-2 card-shadow space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'gradient-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab === 'Profile' && <User className="w-4 h-4" />}
                {tab === 'Security' && <Shield className="w-4 h-4" />}
                {tab === 'Notifications' && <Bell className="w-4 h-4" />}
                {tab === 'Preferences' && <Globe className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'Profile' && (
            <div className="bg-white rounded-2xl p-6 card-shadow space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#0F172A]">Profile Information</h2>
                {saved && <span className="text-xs font-semibold text-[#00C853] bg-[#E8FFF3] px-3 py-1.5 rounded-full">Saved!</span>}
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    AI
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white shadow-md flex items-center justify-center border border-[#E8EEF7]">
                    <Camera className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">{profileForm.fullName}</p>
                  <p className="text-sm text-slate-400">Personal Account · KYC Verified</p>
                  <span className="inline-flex items-center gap-1 text-xs bg-[#E8FFF3] text-[#00C853] px-2 py-1 rounded-full mt-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'fullName', icon: User, type: 'text' },
                  { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
                  { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel' },
                  { label: 'Date of Birth', key: 'dob', icon: User, type: 'date' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{field.label}</label>
                    <div className="relative">
                      <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={field.type}
                        className="input-field pl-10"
                        value={profileForm[field.key as keyof typeof profileForm]}
                        onChange={(e) => setProfileForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      />
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Residential Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea className="input-field pl-10 resize-none h-16" value={profileForm.address} onChange={(e) => setProfileForm((f) => ({ ...f, address: e.target.value }))} />
                  </div>
                </div>
              </div>

              <button onClick={handleSave} className="flex items-center gap-2 gradient-primary text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
                <h2 className="font-bold text-[#0F172A]">Change Password</h2>
                {[
                  { label: 'Current Password', show: showOldPass, toggle: () => setShowOldPass(!showOldPass) },
                  { label: 'New Password', show: showNewPass, toggle: () => setShowNewPass(!showNewPass) },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{field.label}</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={field.show ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="Enter password" />
                      <button type="button" onClick={field.toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <button className="gradient-primary text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Update Password
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
                <h2 className="font-bold text-[#0F172A]">Security Settings</h2>
                {[
                  { label: 'Two-Factor Authentication (2FA)', desc: 'Add an extra layer of security via OTP', enabled: twoFA, toggle: () => setTwoFA(!twoFA), icon: Smartphone },
                  { label: 'Biometric Login', desc: 'Sign in with fingerprint or face ID', enabled: true, toggle: () => {}, icon: Key },
                  { label: 'Login Notifications', desc: 'Get notified on new device logins', enabled: true, toggle: () => {}, icon: Bell },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-start justify-between py-3 border-b border-[#E8EEF7] last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <setting.icon className="w-4 h-4 text-[#0A5CFF]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{setting.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{setting.desc}</p>
                      </div>
                    </div>
                    <button onClick={setting.toggle} className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 mt-1 ${setting.enabled ? 'bg-[#0A5CFF]' : 'bg-slate-200'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${setting.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="bg-white rounded-2xl p-6 card-shadow space-y-6">
              <h2 className="font-bold text-[#0F172A]">Notification Preferences</h2>
              {[
                {
                  section: 'Email Notifications',
                  items: [
                    { key: 'emailLoans', label: 'Loan Updates', desc: 'Approval status, disbursement alerts' },
                    { key: 'emailTransfers', label: 'Transfers', desc: 'Sent and received transfers' },
                    { key: 'emailSavings', label: 'Savings Interest', desc: 'Monthly interest credit alerts' },
                  ]
                },
                {
                  section: 'SMS Notifications',
                  items: [
                    { key: 'smsLoans', label: 'Loan Updates', desc: 'SMS alerts for loan activity' },
                    { key: 'smsTransfers', label: 'Transaction Alerts', desc: 'Every debit and credit' },
                    { key: 'smsSavings', label: 'Savings Alerts', desc: 'Maturity and interest alerts' },
                  ]
                }
              ].map((section) => (
                <div key={section.section}>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{section.section}</h3>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div key={item.key} className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">{item.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                          className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${notifs[item.key as keyof typeof notifs] ? 'bg-[#0A5CFF]' : 'bg-slate-200'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${notifs[item.key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Preferences' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 card-shadow space-y-4">
                <h2 className="font-bold text-[#0F172A]">App Preferences</h2>
                {[
                  { label: 'Dark Mode', desc: 'Use dark theme across the app', enabled: darkMode, toggle: () => setDarkMode(!darkMode), icon: Moon },
                  { label: 'Language: English', desc: 'App display language', enabled: true, toggle: () => {}, icon: Globe },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-start justify-between py-3 border-b border-[#E8EEF7] last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] flex items-center justify-center flex-shrink-0">
                        <pref.icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{pref.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{pref.desc}</p>
                      </div>
                    </div>
                    <button onClick={pref.toggle} className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 mt-1 ${pref.enabled ? 'bg-[#0A5CFF]' : 'bg-slate-200'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${pref.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <h3 className="font-bold text-red-700 mb-2 text-sm">Danger Zone</h3>
                <p className="text-xs text-red-600 mb-4">These actions are irreversible. Proceed with caution.</p>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
                    Close Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
