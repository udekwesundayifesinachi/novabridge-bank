import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const [
      { count: totalUsers },
      { count: totalLoans },
      { count: pendingLoans },
      { count: activeAccounts },
      { data: totalBalanceData },
      { data: loansData },
      { data: txnsData },
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('loans').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('loans').select('*', { count: 'exact', head: true }).in('status', ['pending', 'under_review']),
      supabaseAdmin.from('accounts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('accounts').select('balance'),
      supabaseAdmin.from('loans').select('amount, status, created_at'),
      supabaseAdmin.from('transactions').select('type, amount, created_at'),
    ]);

    const totalBalance = (totalBalanceData || []).reduce((s: number, a: any) => s + (a.balance || 0), 0);

    // Build monthly chart data from real records
    const now = new Date();
    const monthlyMap: Record<string, { loans: number; approved: number; rejected: number; revenue: number }> = {};
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      monthlyMap[label] = { loans: 0, approved: 0, rejected: 0, revenue: 0 };
    }
    (loansData || []).forEach((l: any) => {
      if (!l.created_at) return;
      const label = new Date(l.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyMap[label]) return;
      monthlyMap[label].loans++;
      if (l.status === 'approved' || l.status === 'disbursed') monthlyMap[label].approved++;
      if (l.status === 'rejected') monthlyMap[label].rejected++;
    });
    (txnsData || []).forEach((t: any) => {
      if (!t.created_at || t.type !== 'credit') return;
      const label = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyMap[label]) return;
      monthlyMap[label].revenue += t.amount || 0;
    });
    const monthlyData = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

    const { data: recentUsers } = await supabaseAdmin
      .from('profiles')
      .select('user_id, full_name, email, kyc_status, account_tier, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: pendingLoansList } = await supabaseAdmin
      .from('loans')
      .select('id, user_id, loan_type, amount, status, created_at, profiles!loans_user_id_fkey(full_name)')
      .in('status', ['pending', 'under_review'])
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalLoans: totalLoans || 0,
        pendingLoans: pendingLoans || 0,
        activeAccounts: activeAccounts || 0,
        totalBalance,
      },
      monthlyData,
      recentUsers: recentUsers || [],
      pendingLoans: pendingLoansList || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
