import { google, searchconsole_v1 } from 'googleapis';

export async function getGscClient(): Promise<searchconsole_v1.Searchconsole> {
  const env = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!env) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is missing');
  }

  const credentials = JSON.parse(env);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  return google.searchconsole({ version: 'v1', auth });
}

interface RunOnceOptions {
  siteUrl: string;
  days?: number;
}

export async function runOnce({ siteUrl, days = 28 }: RunOnceOptions) {
  const gsc = await getGscClient();

  const today = new Date();
  const endDateObj = new Date(today);
  endDateObj.setDate(today.getDate() - 3);

  const startDateObj = new Date(today);
  startDateObj.setDate(today.getDate() - days);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const startDate = formatDate(startDateObj);
  const endDate = formatDate(endDateObj);

  const response = await gsc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 500,
    },
  });

  return {
    rows: response.data.rows || [],
    dateRange: { start: startDate, end: endDate }
  };
}
