import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const kyc = searchParams.get('kyc') || '';
    const offset = (page - 1) * limit;

    let q = supabaseAdmin.from('profiles').select('*', { count: 'exact' });
    if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    if (status) q = q.eq('status', status);
    if (kyc) q = q.eq('kyc_status', kyc);
    q = q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: profiles, count, error } = await q;
    if (error) throw error;

    // Get accounts for balance info
    const userIds = (profiles || []).map((p: any) => p.user_id);
    const { data: accounts } = await supabaseAdmin
      .from('accounts')
      .select('user_id, balance, account_type, account_number, status')
      .in('user_id', userIds.length ? userIds : ['00000000-0000-0000-0000-000000000000']);

    const accountMap = new Map<string, any[]>();
    (accounts || []).forEach((a: any) => {
      if (!accountMap.has(a.user_id)) accountMap.set(a.user_id, []);
      accountMap.get(a.user_id)!.push(a);
    });

    const users = (profiles || []).map((p: any) => {
      const userAccounts = accountMap.get(p.user_id) || [];
      const totalBalance = userAccounts.reduce((s: number, a: any) => s + (a.balance || 0), 0);
      return { ...p, accounts: userAccounts, total_balance: totalBalance };
    });

    return NextResponse.json({ users, total: count || 0, page, limit });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, full_name, phone, ssn, account_tier, kyc_status, status, initial_balance } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Email, password, and full name are required' }, { status: 400 });
    }

    // Use signUp instead of admin.createUser (anon key doesn't have admin access)
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user!.id;

    // Create profile
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      user_id: userId,
      full_name,
      email,
      phone: phone || null,
      ssn: ssn || null,
      account_tier: account_tier || 'starter',
      kyc_status: kyc_status || 'pending',
      status: status || 'active',
    });
    if (profileError) throw profileError;

    // Create default account
    const accountNumber = String(Math.floor(Math.random() * 900000000000) + 100000000000);
    const { error: accountError } = await supabaseAdmin.from('accounts').insert({
      user_id: userId,
      account_number: accountNumber,
      account_name: full_name,
      account_type: 'savings',
      currency: 'USD',
      balance: parseFloat(initial_balance) || 0,
      status: 'active',
    });
    if (accountError) throw accountError;

    return NextResponse.json({ success: true, user_id: userId, account_number: accountNumber });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
