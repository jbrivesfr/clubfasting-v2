import * as process from 'process';

async function main() {
  const url = process.env.HEALTH_CHECK_URL || 'https://app.clubfasting.com/api/health-check';

  console.log(`Starting health check against ${url}...`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('Health check summary:', JSON.stringify(data, null, 2));

    if (data.ok) {
      console.log('Health check completed successfully.');
      process.exit(0);
    } else {
      console.error('One or more URLs failed the health check.');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('Failed to execute health check:', error.message);
    process.exit(1);
  }
}

main();
