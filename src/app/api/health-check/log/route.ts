import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, status_code, response_time_ms, is_healthy, error } = body;

    if (!url || is_healthy === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error: dbError } = await supabaseAdmin
      .from('health_logs')
      .insert({
        url,
        status_code,
        response_time_ms,
        is_healthy,
        error
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Failed to insert health_log:', dbError);
      return NextResponse.json({ error: 'Failed to insert log' }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: any) {
    console.error('Error in health-check log route:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
