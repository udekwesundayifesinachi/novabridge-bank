import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { balance, account_number, account_name, account_type, currency, status, interest_rate, locked_balance } = body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (balance !== undefined) updates.balance = balance;
    if (account_number !== undefined) updates.account_number = account_number;
    if (account_name !== undefined) updates.account_name = account_name;
    if (account_type !== undefined) updates.account_type = account_type;
    if (currency !== undefined) updates.currency = currency;
    if (status !== undefined) updates.status = status;
    if (interest_rate !== undefined) updates.interest_rate = interest_rate;
    if (locked_balance !== undefined) updates.locked_balance = locked_balance;

    const { data, error } = await supabaseAdmin
      .from('accounts').update(updates).eq('id', params.id).select().single();
    if (error) throw error;

    return NextResponse.json({ account: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from('accounts').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
