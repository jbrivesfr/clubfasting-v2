import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

if (fs.existsSync('.env.local')) {
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required.');
  process.exit(1);
}

const supabase = createClient('https://lyyevuyejxrjpsaisaal.supabase.co', SUPABASE_SERVICE_KEY);

async function main() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .is('response', null)
      .lt('created_at', twentyFourHoursAgo);

    if (countError) {
      console.error('Failed to fetch count:', countError);
      process.exit(1);
    }

    const { data, error: dataError } = await supabase
      .from('comments')
      .select('user_id, email, content, created_at')
      .is('response', null)
      .lt('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: true })
      .limit(5);

    if (dataError) {
      console.error('Failed to fetch data:', dataError);
      process.exit(1);
    }

    console.log(`PENDING_COUNT: ${count}`);
    for (const row of data) {
      let snippet = row.content || '';
      if (snippet.length > 80) {
        snippet = snippet.substring(0, 80) + '...';
      }
      console.log(`user=${row.user_id} email=${row.email} snippet=${snippet} created=${row.created_at}`);
    }

    process.exit(0);
  } catch (error) {
    if (error && error.message) {
      console.error('Error:', error.message);
    } else {
      console.error('Error:', JSON.stringify(error));
    }
    process.exit(1);
  }
}

main();
