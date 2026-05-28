import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/analyze'

export async function POST(request) {
  try {
    const { imageBase64 } = await request.json()
    if (!imageBase64) {
      return NextResponse.json({ error: 'Aucune image fournie' }, { status: 400 })
    }
    const result = await analyzeImage(imageBase64, 'cart')
    return NextResponse.json(result)
  } catch (error) {
    console.error('Analyze cart error:', error)
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'analyse" },
      { status: 500 }
    )
  }
}
