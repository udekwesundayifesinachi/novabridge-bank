import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles').select('*').eq('user_id', userId).maybeSingle();
    if (profileError) throw profileError;

    const [accounts, loans, transactions, savings, cards, notifications] = await Promise.all([
      supabaseAdmin.from('accounts').select('*').eq('user_id', userId).order('created_at'),
      supabaseAdmin.from('loans').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabaseAdmin.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
      supabaseAdmin.from('savings_plans').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabaseAdmin.from('cards').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabaseAdmin.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    ]);

    return NextResponse.json({
      profile,
      accounts: accounts.data || [],
      loans: loans.data || [],
      transactions: transactions.data || [],
      savings: savings.data || [],
      cards: cards.data || [],
      notifications: notifications.data || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const body = await req.json();
    const { email, full_name, phone, ssn, drivers_license, date_of_birth, address,
            account_tier, kyc_status, status, is_admin, admin_notes, avatar_url } = body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (full_name !== undefined) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone;
    if (ssn !== undefined) updates.ssn = ssn;
    if (drivers_license !== undefined) updates.drivers_license = drivers_license;
    if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth;
    if (address !== undefined) updates.address = address;
    if (account_tier !== undefined) updates.account_tier = account_tier;
    if (kyc_status !== undefined) updates.kyc_status = kyc_status;
    if (status !== undefined) updates.status = status;
    if (is_admin !== undefined) updates.is_admin = is_admin;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (email !== undefined) updates.email = email;

    const { error } = await supabaseAdmin.from('profiles').update(updates).eq('user_id', userId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    // Delete all related data
    await Promise.all([
      supabaseAdmin.from('transactions').delete().eq('user_id', userId),
      supabaseAdmin.from('accounts').delete().eq('user_id', userId),
      supabaseAdmin.from('loans').delete().eq('user_id', userId),
      supabaseAdmin.from('savings_plans').delete().eq('user_id', userId),
      supabaseAdmin.from('cards').delete().eq('user_id', userId),
      supabaseAdmin.from('notifications').delete().eq('user_id', userId),
      supabaseAdmin.from('beneficiaries').delete().eq('user_id', userId),
    ]);

    const { error } = await supabaseAdmin.from('profiles').delete().eq('user_id', userId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
