import { NextResponse } from 'next/server';

export async function GET() {
  const urls = [
    'https://clubfasting.com/',
    'https://fasting.fr/',
    'https://app.clubfasting.com/'
  ];

  const results = await Promise.all(
    urls.map(async (url) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const startTime = Date.now();
      let status = 0;
      let ok = false;

      try {
        const response = await fetch(url, { signal: controller.signal });
        status = response.status;
        const latencyMs = Date.now() - startTime;
        ok = status < 400 && latencyMs < 5000;
        clearTimeout(timeoutId);
        return { url, status, latencyMs, ok };
      } catch (error) {
        clearTimeout(timeoutId);
        const latencyMs = Date.now() - startTime;
        return { url, status, latencyMs, ok: false };
      }
    })
  );

  return NextResponse.json(results, { status: 200 });
}
