require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Required variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const URLS_TO_CHECK = [
  'https://clubfasting.com/',
  'https://app.clubfasting.com/newsfeed',
  'https://app.clubfasting.com/login',
  'https://fasting.fr/',
  'https://app.clubfasting.com/api/health'
];

async function checkUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { url, status: 'error', code: response.status, message: response.statusText };
    }
    return { url, status: 'ok', code: response.status, message: 'OK' };
  } catch (error) {
    return { url, status: 'error', code: 500, message: error.message };
  }
}

async function main() {
  console.log("Starting health checks...");
  const results = await Promise.all(URLS_TO_CHECK.map(checkUrl));

  const allOk = results.every(r => r.status === 'ok');

  const summary = {
    urls: results,
    total_checked: URLS_TO_CHECK.length,
    failed: results.filter(r => r.status !== 'ok').length
  };

  console.log("Health check summary:", JSON.stringify(summary, null, 2));

  try {
    // Insert into health_log table
    const { error: dbError } = await supabase
      .from('health_log')
      .insert({
        status: allOk ? 'ok' : 'error',
        summary: summary
      });

    if (dbError) {
      console.error("Failed to insert health_log:", dbError);
    } else {
      console.log("Inserted health log into database.");
    }

    // Broadcast to health_log channel
    console.log("Connecting to realtime channel 'health_log'...");
    const channel = supabase.channel('health_log');

    await new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        reject(new Error('Timeout connecting to Supabase Realtime channel'));
      }, 10000); // 10s timeout

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          clearTimeout(timeout);
          try {
            await channel.send({
              type: 'broadcast',
              event: 'health_check_complete',
              payload: summary
            });
            console.log("Broadcasted health log to realtime channel.");
            resolve();
          } catch (err) {
            reject(err);
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          clearTimeout(timeout);
          reject(new Error(`Failed to connect to channel, status: ${status}`));
        }
      });
    });

    await supabase.removeChannel(channel);

  } catch (error) {
    console.error("Error with Supabase operations:", error.message);
    // Even if broadcast fails, if urls failed we should exit with 1
  }

  if (!allOk) {
    console.error("One or more URLs failed the health check.");
    process.exit(1);
  }

  console.log("Health check completed successfully.");
  process.exit(0);
}

main();
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

const URLS_TO_CHECK = [
  'https://clubfasting.com',
  'https://fasting.fr',
  'https://app.clubfasting.com/login'
];

async function sendSlackAlert(message) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('No SLACK_WEBHOOK_URL configured, skipping slack alert for:', message);
    return;
  }

  try {
    const res = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: message
      })
    });

    if (!res.ok) {
      console.error('Failed to send slack alert:', await res.text());
    }
  } catch (err) {
    console.error('Error sending slack alert:', err);
  }
}

async function checkUrls() {
  let hasErrors = false;

  for (const url of URLS_TO_CHECK) {
    try {
      console.log(`Checking ${url}...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status !== 200) {
        const message = `🚨 Health Check Alert: ${url} returned status ${response.status} instead of 200.`;
        console.error(message);
        await sendSlackAlert(message);
        hasErrors = true;
      } else {
        console.log(`✅ ${url} is OK (200).`);
      }
    } catch (error) {
      const message = `🚨 Health Check Alert: Failed to fetch ${url}. Error: ${error.message}`;
      console.error(message);
      await sendSlackAlert(message);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

checkUrls();
