'use client';

import { Bell, CheckCheck, TrendingUp, AlertCircle, CreditCard, ArrowLeftRight, Gift } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'success',
    icon: TrendingUp,
    color: '#00C853',
    bg: '#E8FFF3',
    title: 'Loan Disbursement Successful',
    message: 'Your personal loan of $500,000 has been disbursed to your account.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    icon: ArrowLeftRight,
    color: '#0A5CFF',
    bg: '#EEF4FF',
    title: 'Transfer Received',
    message: 'You received $150,000 from Chris Davis (Citibank).',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    icon: AlertCircle,
    color: '#FFB300',
    bg: '#FFF8E1',
    title: 'Loan Repayment Due',
    message: 'Your monthly loan repayment of $35,000 is due in 3 days.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 4,
    type: 'success',
    icon: TrendingUp,
    color: '#00C853',
    bg: '#E8FFF3',
    title: 'Savings Interest Credited',
    message: '$8,500 interest has been credited to your savings account for August.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    icon: CreditCard,
    color: '#0A5CFF',
    bg: '#EEF4FF',
    title: 'Virtual Card Transaction',
    message: 'A transaction of $24.99 was made on your virtual card at Spotify.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 6,
    type: 'gift',
    icon: Gift,
    color: '#F64C9C',
    bg: '#FFF0F7',
    title: 'Referral Bonus Earned',
    message: 'You earned $5,000 referral bonus! Your friend Sarah just took their first loan.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 7,
    type: 'success',
    icon: CheckCheck,
    color: '#00C853',
    bg: '#E8FFF3',
    title: 'KYC Verification Approved',
    message: 'Your identity verification is complete. You now have full access to all features.',
    time: '5 days ago',
    read: true,
  },
];

export default function NotificationsPage() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[800px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <button className="text-sm font-semibold text-[#0A5CFF] bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-2xl p-5 card-shadow transition-all duration-200 hover:shadow-md cursor-pointer ${!notif.read ? 'border-l-4 border-[#0A5CFF]' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: notif.bg }}>
                <notif.icon className="w-5 h-5" style={{ color: notif.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-sm font-semibold ${notif.read ? 'text-slate-700' : 'text-[#0F172A]'}`}>
                    {notif.title}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-[#0A5CFF] flex-shrink-0" />}
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
