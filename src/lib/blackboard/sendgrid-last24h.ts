export interface SendgridEmail {
  from_email: string;
  subject: string;
  sent_at: string;
  status: string;
}

export interface SendgridLast24hResult {
  count: number;
  items: SendgridEmail[];
}

export async function fetchSendgridLast24h(): Promise<SendgridLast24hResult> {
  if (!process.env.SENDGRID_API_KEY) {
    // TODO: wire real Sendgrid API when key available
    return { count: 0, items: [] };
  }

  try {
    const url = 'https://api.sendgrid.com/v3/messages?limit=20';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Sendgrid API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const messages = data.messages || [];

    const items: SendgridEmail[] = messages.map((msg: any) => ({
      from_email: msg.from_email || '',
      subject: msg.subject || '',
      sent_at: msg.last_event_time || '',
      status: msg.status || '',
    }));

    return {
      count: items.length,
      items,
    };
  } catch (error) {
    console.warn('Failed to fetch Sendgrid last 24h emails:', error);
    return { count: 0, items: [] };
  }
}
