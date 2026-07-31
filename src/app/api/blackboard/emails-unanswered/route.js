import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    // We are requested to list inbound emails from Supabase inbox table or stub.
    // Since the inbox table schema doesn't exist locally, we use a stub.
    const stubData = [
      {
        id: 'stub-1',
        subject: 'Question on fasting',
        from: 'john@example.com',
        created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        status: 'unanswered',
      },
      {
        id: 'stub-2',
        subject: 'App issue',
        from: 'jane@example.com',
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'unanswered',
      }
    ]
    return NextResponse.json(stubData)
  } catch (err) {
    console.error('Unhandled error in /api/blackboard/emails-unanswered:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
