import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/analyze'
import { withLogging } from '@/lib/api/withLogger'

export const POST = withLogging(async function POST(request) {
  const { imageBase64 } = await request.json()
  if (!imageBase64) {
    return NextResponse.json({ error: 'Aucune image fournie' }, { status: 400 })
  }
  const result = await analyzeImage(imageBase64, 'cart')
  return NextResponse.json(result)
})
