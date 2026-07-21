import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let q = supabaseAdmin.from('accounts').select('*, profiles!accounts_user_id_fkey(full_name, email)', { count: 'exact' });
    if (userId) q = q.eq('user_id', userId);
    q = q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await q;
    if (error) throw error;

    return NextResponse.json({ accounts: data || [], total: count || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, account_type, account_name, currency, balance, status, account_number } = body;

    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 });

    const acctNum = account_number || String(Math.floor(Math.random() * 900000000000) + 100000000000);

    const { data, error } = await supabaseAdmin.from('accounts').insert({
      user_id,
      account_number: acctNum,
      account_name: account_name || 'Account',
      account_type: account_type || 'savings',
      currency: currency || 'USD',
      balance: balance || 0,
      status: status || 'active',
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ account: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
