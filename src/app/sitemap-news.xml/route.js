import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('comments')
    .select('id, title, content, created_at')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(1000)

  if (error) {
    console.error('Error fetching newsfeed for sitemap-news:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }

  const posts = data || []

  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${posts.map((post) => {
    // Top-level comments function as posts and contain a title.
    // We fall back to a truncated content if title is missing.
    const title = post.title || post.content?.substring(0, 50) || 'Post sur le Newsfeed'
    // Format date as ISO 8601
    const postDate = new Date(post.created_at)
    const date = postDate.toISOString()
    const url = `https://app.clubfasting.com/newsfeed/${post.id}`

    // Encode XML special characters
    const safeTitle = title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

    // Only include news block for articles created in the last 2 days
    if (postDate > twoDaysAgo) {
      return `
  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>Club Fasting</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${date}</news:publication_date>
      <news:title>${safeTitle}</news:title>
    </news:news>
  </url>`
    } else {
      return `
  <url>
    <loc>${url}</loc>
  </url>`
    }
  }).join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      // Optional: Add cache control if desired, though Vercel/Next.js might cache it anyway depending on config
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    },
  })
}
