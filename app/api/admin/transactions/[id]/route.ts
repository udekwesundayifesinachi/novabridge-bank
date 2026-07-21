import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { type, amount, description, category, status, notes, recipient_name, recipient_bank } = body;

    // Fetch existing transaction to reverse balance impact
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('transactions').select('type, amount, account_id, status').eq('id', params.id).single();
    if (fetchErr) throw fetchErr;

    const oldAmount = parseFloat(existing.amount) || 0;
    const oldType = existing.type;
    const oldStatus = existing.status;
    const accountId = existing.account_id;

    const updates: any = {};
    if (type !== undefined) updates.type = type;
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (recipient_name !== undefined) updates.recipient_name = recipient_name;
    if (recipient_bank !== undefined) updates.recipient_bank = recipient_bank;

    const { data, error } = await supabaseAdmin
      .from('transactions').update(updates).eq('id', params.id).select().single();
    if (error) throw error;

    // Reconcile account balance if the transaction was linked to an account
    // and the transaction is in a "completed" state (only completed txns affect balance)
    if (accountId && oldStatus === 'completed') {
      const { data: acct } = await supabaseAdmin
        .from('accounts').select('id, balance').eq('id', accountId).single();
      if (acct) {
        // Reverse old impact
        let newBalance = acct.balance;
        if (oldType === 'credit') newBalance -= oldAmount;
        else newBalance += oldAmount;

        // Apply new impact if still completed
        const newType = type ?? oldType;
        const newAmount = amount !== undefined ? parseFloat(amount) : oldAmount;
        const newStatus = status ?? oldStatus;
        if (newStatus === 'completed') {
          if (newType === 'credit') newBalance += newAmount;
          else newBalance -= newAmount;
        }

        await supabaseAdmin.from('accounts').update({ balance: Math.max(0, newBalance) }).eq('id', accountId);
      }
    }

    return NextResponse.json({ transaction: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Fetch transaction to reverse balance impact
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('transactions').select('type, amount, account_id, status').eq('id', params.id).single();
    if (fetchErr) throw fetchErr;

    const { error } = await supabaseAdmin.from('transactions').delete().eq('id', params.id);
    if (error) throw error;

    // Reverse the balance impact if it was a completed transaction linked to an account
    if (existing.account_id && existing.status === 'completed') {
      const { data: acct } = await supabaseAdmin
        .from('accounts').select('id, balance').eq('id', existing.account_id).single();
      if (acct) {
        const oldAmount = parseFloat(existing.amount) || 0;
        let newBalance = acct.balance;
        if (existing.type === 'credit') newBalance -= oldAmount;
        else newBalance += oldAmount;
        await supabaseAdmin.from('accounts').update({ balance: Math.max(0, newBalance) }).eq('id', existing.account_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
