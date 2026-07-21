import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    // Fetch all data in parallel
    const [
      { data: profiles },
      { data: loans },
      { data: transactions },
      { data: accounts },
      { data: savingsPlans },
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('created_at, kyc_status, status'),
      supabaseAdmin.from('loans').select('id, loan_type, amount, status, created_at'),
      supabaseAdmin.from('transactions').select('type, amount, created_at, category'),
      supabaseAdmin.from('accounts').select('balance, account_type, status, currency'),
      supabaseAdmin.from('savings_plans').select('balance, annual_rate, status'),
    ]);

    // User growth by month (last 8 months)
    const now = new Date();
    const months: { month: string; users: number; loans: number; revenue: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString();

      const userCount = (profiles || []).filter((p: any) => p.created_at >= monthStart && p.created_at < monthEnd).length;
      const loanCount = (loans || []).filter((l: any) => l.created_at >= monthStart && l.created_at < monthEnd).length;
      const revenue = (transactions || [])
        .filter((t: any) => t.type === 'credit' && t.created_at >= monthStart && t.created_at < monthEnd)
        .reduce((s: number, t: any) => s + (t.amount || 0), 0);

      months.push({ month: label, users: userCount, loans: loanCount, revenue });
    }

    // Loan portfolio breakdown by type
    const loanTypes: Record<string, number> = {};
    (loans || []).forEach((l: any) => {
      const t = l.loan_type || 'other';
      loanTypes[t] = (loanTypes[t] || 0) + 1;
    });
    const loanColors: Record<string, string> = {
      personal: '#0A5CFF', business: '#00C853', salary_advance: '#F64C9C', auto: '#FFB300', mortgage: '#7C3AED', other: '#64748b',
    };
    const loanBreakdown = Object.entries(loanTypes).map(([name, value]) => ({
      name: name.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
      color: loanColors[name] || '#64748b',
    }));

    // Account type distribution
    const acctTypes: Record<string, number> = {};
    (accounts || []).forEach((a: any) => {
      const t = a.account_type || 'other';
      acctTypes[t] = (acctTypes[t] || 0) + 1;
    });

    // Summary stats
    const totalBalance = (accounts || []).reduce((s: number, a: any) => s + (a.balance || 0), 0);
    const totalSavings = (savingsPlans || []).reduce((s: number, p: any) => s + (p.balance || 0), 0);
    const totalLoanAmount = (loans || []).filter((l: any) => l.status === 'disbursed').reduce((s: number, l: any) => s + (l.amount || 0), 0);
    const totalCredits = (transactions || []).filter((t: any) => t.type === 'credit').reduce((s: number, t: any) => s + (t.amount || 0), 0);
    const totalDebits = (transactions || []).filter((t: any) => t.type === 'debit').reduce((s: number, t: any) => s + (t.amount || 0), 0);

    return NextResponse.json({
      monthlyData: months,
      loanBreakdown,
      summary: {
        totalUsers: (profiles || []).length,
        totalAccounts: (accounts || []).length,
        totalBalance,
        totalSavings,
        totalLoanAmount,
        totalCredits,
        totalDebits,
        totalTransactions: (transactions || []).length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
