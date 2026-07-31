import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sitemapUrl = 'https://app.clubfasting.com/sitemap.xml'
    const sitemapNewsUrl = 'https://app.clubfasting.com/sitemap-news.xml'

    const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`
    const pingNewsUrl = `https://www.google.com/ping?sitemap=${sitemapNewsUrl}`

    const [response, responseNews] = await Promise.all([
      fetch(pingUrl, { method: 'GET' }),
      fetch(pingNewsUrl, { method: 'GET' })
    ])

    if (response.ok && responseNews.ok) {
      return NextResponse.json({ success: true, message: 'Successfully pinged GSC for both sitemaps' })
    } else {
      const statuses = { sitemap: response.status, sitemapNews: responseNews.status }
      return NextResponse.json({ success: false, message: 'Failed to ping GSC for one or both sitemaps', statuses }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
