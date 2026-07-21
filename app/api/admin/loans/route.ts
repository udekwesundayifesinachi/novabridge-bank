import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('loans')
      .select('*, profiles!loans_user_id_fkey(full_name, email, phone)', { count: 'exact' });

    if (status) q = q.eq('status', status);

    q = q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await q;
    if (error) throw error;

    return NextResponse.json({ loans: data || [], total: count || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, loan_type, amount, tenure_months, monthly_rate, purpose } = body;

    if (!user_id || !amount) {
      return NextResponse.json({ error: 'user_id and amount required' }, { status: 400 });
    }

    const rate = monthly_rate || 0.025;
    const months = tenure_months || 12;
    const emi = amount * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);

    const { data, error } = await supabaseAdmin.from('loans').insert({
      user_id,
      loan_type: loan_type || 'personal',
      amount: parseFloat(amount),
      outstanding_balance: parseFloat(amount),
      monthly_rate: rate,
      tenure_months: months,
      emi_amount: emi,
      purpose: purpose || '',
      status: 'pending',
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ loan: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
