import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sitemapUrl = 'https://app.clubfasting.com/sitemap.xml'
    const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`

    const response = await fetch(pingUrl, { method: 'GET' })

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Successfully pinged GSC' })
    } else {
      return NextResponse.json({ success: false, message: 'Failed to ping GSC', status: response.status }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
