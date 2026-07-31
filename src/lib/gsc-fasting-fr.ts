import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function fetchAndUpsertGSC(): Promise<any> {
  const credentialsJsonStr = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentialsJsonStr) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is missing');
  }

  const credentials = JSON.parse(credentialsJsonStr);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({
    version: 'v1',
    auth,
  });

  const siteUrl = process.env.GSC_SITE_URL || 'https://fasting.fr/';

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 28);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      dimensions: ['page'],
      type: 'auto',
      rowLimit: 1000,
    },
  });

  const rows = res.data.rows || [];

  if (rows.length === 0) {
    return { success: true, count: 0 };
  }

  const snapshotDate = formatDate(endDate);

  const records = rows.map((row) => ({
    date: snapshotDate,
    page: row.keys ? row.keys[0] : '',
    impressions: row.impressions || 0,
    clics: row.clicks || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { error } = await supabase
    .from('gsc_fastfr_snapshots')
    .upsert(records, { onConflict: 'date,page' });

  if (error) {
    console.error('Error upserting GSC snapshots:', error);
    throw error;
  }

  return { success: true, count: records.length, records };
}
