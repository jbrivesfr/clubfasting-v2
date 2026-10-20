import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Lead quiz submission received:', data);

    // Stub implementation: Just acknowledge receipt
    return NextResponse.json({ success: true, message: 'Lead captured successfully' });
  } catch (error) {
    console.error('Error in lead-quiz API:', error);
    return NextResponse.json({ success: false, error: 'Bad Request' }, { status: 400 });
  }
}
