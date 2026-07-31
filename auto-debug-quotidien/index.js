const express = require('express');
const cron = require('node-cron');
const { chromium } = require('playwright');
const https = require('https');
const http = require('http');

const app = express();
const port = process.env.PORT || 8080;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

const urlsToCheck = [
  'https://clubfasting.com/',
  'https://clubfasting.com/newsfeed',
  'https://app.clubfasting.com/login',
  'https://fasting.fr/'
];

async function sendSlackAlert(message) {
  if (!slackWebhookUrl) {
    console.warn('SLACK_WEBHOOK_URL is not defined. Skipping alert: ', message);
    return;
  }

  const payload = JSON.stringify({
    text: message,
    channel: '#ops'
  });

  const url = new URL(slackWebhookUrl);
  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = (url.protocol === 'https:' ? https : http).request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => responseBody += chunk);
    res.on('end', () => {
      if (res.statusCode >= 400) {
        console.error('Failed to send Slack alert. Status:', res.statusCode, responseBody);
      } else {
        console.log('Slack alert sent successfully.');
      }
    });
  });

  req.on('error', (e) => {
    console.error('Error sending Slack alert:', e);
  });

  req.write(payload);
  req.end();
}

async function checkUrls() {
  console.log('Starting URL check...');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    for (const url of urlsToCheck) {
      const page = await context.newPage();
      try {
        console.log(`Checking ${url}...`);
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const status = response ? response.status() : null;

        if (status !== 200) {
          const errMsg = `[auto-debug-quotidien] Alert! ${url} returned status code ${status}`;
          console.error(errMsg);
          await sendSlackAlert(errMsg);
        } else {
          console.log(`${url} is OK (200).`);
        }
      } catch (error) {
        const errMsg = `[auto-debug-quotidien] Alert! Failed to reach ${url}: ${error.message}`;
        console.error(errMsg);
        await sendSlackAlert(errMsg);
      } finally {
        await page.close();
      }
    }
  } catch (err) {
    console.error('Failed to launch browser or perform checks:', err);
    await sendSlackAlert(`[auto-debug-quotidien] Critical error during Playwright checks: ${err.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log('URL check complete.');
  }
}

// Run check every 6 hours
cron.schedule('0 */6 * * *', () => {
  checkUrls();
});

// Run once on startup for debugging purposes (optional but helpful)
setTimeout(checkUrls, 5000);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Scheduled jobs started.`);
});
