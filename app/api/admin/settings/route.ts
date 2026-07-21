import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('platform_settings').select('*').eq('id', 1).maybeSingle();
    if (error) throw error;
    return NextResponse.json({ settings: data || {} });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      platform_name, support_email, support_phone,
      default_loan_rate, max_loan_amount, min_loan_amount,
      flexible_savings_rate, fixed_deposit_rate,
    } = body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (platform_name !== undefined) updates.platform_name = platform_name;
    if (support_email !== undefined) updates.support_email = support_email;
    if (support_phone !== undefined) updates.support_phone = support_phone;
    if (default_loan_rate !== undefined) updates.default_loan_rate = parseFloat(default_loan_rate);
    if (max_loan_amount !== undefined) updates.max_loan_amount = parseFloat(max_loan_amount);
    if (min_loan_amount !== undefined) updates.min_loan_amount = parseFloat(min_loan_amount);
    if (flexible_savings_rate !== undefined) updates.flexible_savings_rate = parseFloat(flexible_savings_rate);
    if (fixed_deposit_rate !== undefined) updates.fixed_deposit_rate = parseFloat(fixed_deposit_rate);

    const { data, error } = await supabaseAdmin
      .from('platform_settings').update(updates).eq('id', 1).select().single();
    if (error) throw error;

    return NextResponse.json({ settings: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
