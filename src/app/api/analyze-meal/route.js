import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/analyze'
import { withLogging } from '@/lib/api/withLogger'

export const POST = withLogging(async function POST(request) {
  // try/catch is now handled globally by withLogging, but we can keep business logic
  // error handling or let withLogging catch it. We'll let withLogging catch unexpected ones,
  // but keep the specific 400 bad request logic.
  const { imageBase64 } = await request.json()
  if (!imageBase64) {
    return NextResponse.json({ error: 'Aucune image fournie' }, { status: 400 })
  }
  const result = await analyzeImage(imageBase64, 'meal')
  return NextResponse.json(result)
})
