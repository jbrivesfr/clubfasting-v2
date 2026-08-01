const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lyyevuyejxrjpsaisaal.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eWV2dXllamxqcHNhaXNhYWwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjAyMTE4MiwiZXhwIjoxOTUxMzgxMTgyfQ.an-invalid-key-just-to-bypass-constructor';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  let { data: comments, error: e1 } = await supabase.from('comments').select('view_count, views').limit(1)
  console.log('comments view columns:', comments, e1);
  let { data: users, error: e2 } = await supabase.from('users').select('last_seen, last_login').limit(1)
  console.log('users columns:', users, e2);
}
run();
