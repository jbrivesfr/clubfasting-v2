import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { runOnce } from '@/lib/seo/gsc-client';
import { searchconsole_v1 } from 'googleapis';

export async function POST(request: Request) {
  try {
    const cronSecret = request.headers.get('x-cron-secret');
    const isValidCron = cronSecret && cronSecret === process.env.CRON_SECRET;

    if (!isValidCron) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.role !== 'service_role') {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
      }
    }

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      return NextResponse.json({
        error: 'missing_config',
        hint: 'Set GOOGLE_APPLICATION_CREDENTIALS_JSON in Cloud Run env (service account JSON stringified)'
      }, { status: 503 });
    }

    const { rows, dateRange } = await runOnce({ siteUrl: 'sc-domain:fasting.fr' });
    const fetchedAt = new Date().toISOString();
    const supabase = createClient();

    const payload = [];

    for (const row of rows) {
      if (!row.keys || row.keys.length === 0) continue;
      const url = row.keys[0];

      payload.push({
        url: url,
        date_range_start: dateRange.start,
        date_range_end: dateRange.end,
        impressions: row.impressions,
        clicks: row.clicks,
        ctr: row.ctr,
        position: row.position,
        fetched_at: fetchedAt,
        raw: row as any,
      });
    }

    let updated = 0;
    if (payload.length > 0) {
      const { error } = await supabase
        .from('seo_gsc_snapshots')
        .upsert(payload, {
          onConflict: 'url,date_range_start,date_range_end',
        });

      if (error) {
        console.error('Error bulk upserting rows', error);
      } else {
        updated = payload.length;
      }
    }

    console.log(`GSC Pull: Processed ${updated} rows.`);

    return NextResponse.json({
      inserted: 0,
      updated: updated,
      missing_config: false,
      fetched_at: fetchedAt,
      date_range: [dateRange.start, dateRange.end],
    });
  } catch (error: any) {
    console.error('Error in GSC pull once route', error);
    return NextResponse.json({ error: 'internal_error', message: error.message }, { status: 500 });
  }
}
