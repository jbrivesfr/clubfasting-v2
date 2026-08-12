import { NextResponse } from 'next/server';

const URLS_TO_CHECK = [
  'https://clubfasting.com/',
  'https://clubfasting.com/login',
  'https://fasting.fr/',
  'https://app.clubfasting.com/',
  'https://app.clubfasting.com/newsfeed'
];

export async function GET(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const internalLogUrl = `${protocol}://${host}/api/health-check/log`;

  const checkUrl = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const startTime = Date.now();

    let statusCode = null;
    let errorMsg = null;
    let isHealthy = false;

    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      statusCode = response.status;
      isHealthy = response.status >= 200 && response.status < 400;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        errorMsg = 'Timeout (> 5s)';
      } else {
        errorMsg = error.message || 'Unknown error';
      }
    } finally {
      clearTimeout(timeoutId);
    }

    const responseTimeMs = Date.now() - startTime;

    const result = {
      url,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      is_healthy: isHealthy,
      error: errorMsg
    };

    try {
      await fetch(internalLogUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
      });
    } catch (logError) {
      console.error(`Failed to log health check for ${url}:`, logError);
    }

    return result;
  };

  const results = await Promise.all(URLS_TO_CHECK.map(checkUrl));
  const ok = results.every(r => r.is_healthy);

  return NextResponse.json({
    ok,
    checked_at: new Date().toISOString(),
    results
  });
}

export const dynamic = 'force-dynamic';
