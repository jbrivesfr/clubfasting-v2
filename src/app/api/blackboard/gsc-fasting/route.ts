import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const revalidate = 3600; // Cache 1h

function getAuthClient() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const jsonStr = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8');
    const credentials = JSON.parse(jsonStr);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
  }

  return null;
}

export async function GET() {
  try {
    const authClient = getAuthClient();

    if (!authClient) {
      return NextResponse.json(
        {
          error: 'Configuration manquante',
          hint: 'Les variables d\'environnement GOOGLE_APPLICATION_CREDENTIALS_BASE64 ou GOOGLE_PRIVATE_KEY/GOOGLE_SERVICE_ACCOUNT_EMAIL ne sont pas définies.',
        },
        { status: 200 }
      );
    }

    const searchconsole = google.searchconsole({
      version: 'v1',
      auth: authClient,
    });

    const siteUrl = process.env.GSC_PROPERTY_URL || 'sc-domain:fasting.fr';

    // Dates for last 7 days (usually GSC data is 2 days behind, so we look at T-9 to T-2)
    // Actually, simple last 7 days vs previous 7 days relative to today.
    const today = new Date();

    // Most recent available data in GSC is usually 2 days ago.
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 2);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6); // 7 days window (e.g. day -8 to day -2)

    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);

    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - 6);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Query for current 7 days (Top 10 Pages)
    const [currentRes, prevRes] = await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['page'],
          rowLimit: 10,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(prevStartDate),
          endDate: formatDate(prevEndDate),
          // No dimensions for totals? Actually, if no dimensions, we get a single row with totals
          // Or we can just sum up the dimensions. But querying without dimensions is safer to get absolute totals.
          // However, we want totals for current window as well. We can do an additional query for current totals,
          // or just assume the top 10 pages don't represent the total, so we should explicitly ask for totals.
        },
      }),
    ]);

    // Query for current totals
    const currentTotalRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      },
    });

    const currentTotals = currentTotalRes.data.rows && currentTotalRes.data.rows.length > 0
      ? currentTotalRes.data.rows[0]
      : { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    const prevTotals = prevRes.data.rows && prevRes.data.rows.length > 0
      ? prevRes.data.rows[0]
      : { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    const topPages = (currentRes.data.rows || []).map((row) => ({
      page: row.keys ? row.keys[0] : '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    }));

    return NextResponse.json({
      site: siteUrl,
      window: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
      totals: {
        clicks: currentTotals.clicks || 0,
        impressions: currentTotals.impressions || 0,
        ctr: currentTotals.ctr || 0,
        position: currentTotals.position || 0,
      },
      delta: {
        clicks: (currentTotals.clicks || 0) - (prevTotals.clicks || 0),
        impressions: (currentTotals.impressions || 0) - (prevTotals.impressions || 0),
      },
      topPages,
    });

  } catch (error: any) {
    let hint = 'Erreur inconnue avec l\'API Google Search Console.';
    const status = error.code || 500;

    if (status === 401 || status === 403) {
      hint = 'Problème d\'authentification ou de permissions. Vérifiez que le compte de service a accès à la propriété dans la Search Console.';
    } else if (status === 429) {
      hint = 'Quota dépassé sur l\'API Google Search Console.';
    }

    return NextResponse.json(
      {
        error: error.message || 'Erreur interne',
        hint,
      },
      { status: 200 } // as per spec, return 200 with {error, hint}
    );
  }
}
