import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blackboardUrl = process.env.BLACKBOARD_API_URL || 'http://localhost:8080';
    const res = await fetch(blackboardUrl, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Failed to fetch from external blackboard service');
    }

    const data = await res.json();
    return NextResponse.json(data.ventes_stripe_7j || []);
  } catch (err) {
    console.error('Error fetching Stripe data from blackboard service:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
