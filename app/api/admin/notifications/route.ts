import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_ids, title, message, type, action_url } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'title and message required' }, { status: 400 });
    }

    let targetUserIds: string[] = user_ids || [];

    // If 'all', fetch all user IDs
    if (body.send_to_all) {
      const { data: profiles } = await supabaseAdmin.from('profiles').select('user_id');
      targetUserIds = (profiles || []).map((p: any) => p.user_id);
    }

    if (!targetUserIds.length) {
      return NextResponse.json({ error: 'No target users specified' }, { status: 400 });
    }

    const rows = targetUserIds.map((uid: string) => ({
      user_id: uid,
      title,
      message,
      type: type || 'info',
      action_url: action_url || null,
      read: false,
    }));

    const { data, error } = await supabaseAdmin.from('notifications').insert(rows).select();
    if (error) throw error;

    return NextResponse.json({ success: true, count: data?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let q = supabaseAdmin
      .from('notifications')
      .select('*, profiles!notifications_user_id_fkey(full_name, email)', { count: 'exact' });

    if (userId) q = q.eq('user_id', userId);
    q = q.order('created_at', { ascending: false }).limit(limit);

    const { data, count, error } = await q;
    if (error) throw error;

    return NextResponse.json({ notifications: data || [], total: count || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
