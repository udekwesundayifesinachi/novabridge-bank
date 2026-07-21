import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let q = supabaseAdmin
      .from('savings_plans')
      .select('*, profiles!savings_plans_user_id_fkey(full_name, email)', { count: 'exact' });

    if (userId) q = q.eq('user_id', userId);
    q = q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await q;
    if (error) throw error;

    return NextResponse.json({ savings: data || [], total: count || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, name, plan_type, balance, target_amount, annual_rate, maturity_date, locked } = body;

    if (!user_id || !name) return NextResponse.json({ error: 'user_id and name required' }, { status: 400 });

    const { data, error } = await supabaseAdmin.from('savings_plans').insert({
      user_id,
      name,
      plan_type: plan_type || 'flexible',
      balance: balance || 0,
      target_amount: target_amount || null,
      annual_rate: annual_rate || 0.18,
      maturity_date: maturity_date || null,
      locked: locked || false,
      status: 'active',
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ savings_plan: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
