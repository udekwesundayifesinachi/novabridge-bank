import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { balance, target_amount, annual_rate, status, locked, maturity_date, admin_notes, name, plan_type } = body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (balance !== undefined) updates.balance = parseFloat(balance);
    if (target_amount !== undefined) updates.target_amount = parseFloat(target_amount);
    if (annual_rate !== undefined) updates.annual_rate = parseFloat(annual_rate);
    if (status !== undefined) updates.status = status;
    if (locked !== undefined) updates.locked = locked;
    if (maturity_date !== undefined) updates.maturity_date = maturity_date;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (name !== undefined) updates.name = name;
    if (plan_type !== undefined) updates.plan_type = plan_type;

    const { data, error } = await supabaseAdmin
      .from('savings_plans').update(updates).eq('id', params.id).select().single();
    if (error) throw error;

    return NextResponse.json({ savings_plan: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from('savings_plans').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
