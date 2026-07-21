import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('transactions')
      .select('*, profiles!transactions_user_id_fkey(full_name, email)', { count: 'exact' });

    if (userId) q = q.eq('user_id', userId);
    if (type) q = q.eq('type', type);
    if (search) q = q.or(`description.ilike.%${search}%,reference.ilike.%${search}%,recipient_name.ilike.%${search}%`);

    q = q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await q;
    if (error) throw error;

    return NextResponse.json({ transactions: data || [], total: count || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      user_id, account_id, type, amount, description, category,
      recipient_name, recipient_account, recipient_bank, status, notes
    } = body;

    if (!user_id || !type || !amount) {
      return NextResponse.json({ error: 'user_id, type, amount required' }, { status: 400 });
    }

    const ref = 'TXN-ADMIN-' + Date.now().toString(36).toUpperCase();

    const { data, error } = await supabaseAdmin.from('transactions').insert({
      user_id,
      account_id: account_id || null,
      type,
      amount: parseFloat(amount),
      description: description || '',
      category: category || 'Admin',
      reference: ref,
      recipient_name: recipient_name || null,
      recipient_account: recipient_account || null,
      recipient_bank: recipient_bank || null,
      status: status || 'completed',
      admin_created: true,
      notes: notes || null,
    }).select().single();

    if (error) throw error;

    // Update account balance if account specified
    if (account_id) {
      const { data: acct } = await supabaseAdmin
        .from('accounts').select('balance').eq('id', account_id).single();
      if (acct) {
        const newBalance = type === 'credit'
          ? acct.balance + parseFloat(amount)
          : acct.balance - parseFloat(amount);
        await supabaseAdmin.from('accounts').update({ balance: Math.max(0, newBalance) }).eq('id', account_id);
      }
    }

    return NextResponse.json({ transaction: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
