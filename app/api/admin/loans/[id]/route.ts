import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, admin_notes, approved_by, amount, tenure_months, monthly_rate, outstanding_balance } = body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (approved_by !== undefined) updates.approved_by = approved_by;
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (tenure_months !== undefined) updates.tenure_months = tenure_months;
    if (monthly_rate !== undefined) updates.monthly_rate = monthly_rate;
    if (outstanding_balance !== undefined) updates.outstanding_balance = parseFloat(outstanding_balance);

    if (status === 'approved' || status === 'rejected') {
      updates.approved_at = new Date().toISOString();
    }

    if (status === 'disbursed') {
      updates.disbursed_at = new Date().toISOString();
      // Get loan to credit user's account
      const { data: loan } = await supabaseAdmin.from('loans').select('user_id, amount').eq('id', params.id).single();
      if (loan) {
        const { data: accounts } = await supabaseAdmin
          .from('accounts').select('id, balance, account_type').eq('user_id', loan.user_id).order('created_at');
        const acct = accounts?.find((a: any) => a.account_type === 'savings') || accounts?.find((a: any) => a.account_type === 'current') || accounts?.[0];
        if (acct) {
          await supabaseAdmin.from('accounts').update({ balance: acct.balance + loan.amount }).eq('id', acct.id);
          await supabaseAdmin.from('transactions').insert({
            user_id: loan.user_id,
            account_id: acct.id,
            type: 'credit',
            amount: loan.amount,
            description: 'Loan Disbursement',
            category: 'Loan',
            reference: 'LOAN-DISB-' + Date.now().toString(36).toUpperCase(),
            status: 'completed',
            admin_created: true,
          });
        }
      }
    }

    const { data, error } = await supabaseAdmin
      .from('loans').update(updates).eq('id', params.id).select().single();
    if (error) throw error;

    return NextResponse.json({ loan: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from('loans').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
