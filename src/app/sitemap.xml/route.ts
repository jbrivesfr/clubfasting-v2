import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const revalidate = 3600 // Cache for 1 hour

const PUBLIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' }
]

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clubfasting.com'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let urls = ''

  // Add static routes
  for (const route of PUBLIC_ROUTES) {
    urls += `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  }

  // Add newsfeed posts with images
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: posts } = await supabase
      .from('newsfeed_posts')
      .select('id, title, image_url')
      .not('image_url', 'is', null)

    if (posts) {
      for (const post of posts) {
        const safeTitle = (post.title || 'Image du post')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;')

        // Use sitemaps.org/0.9/image protocol
        urls += `
  <url>
    <loc>${baseUrl}/newsfeed/${post.id}</loc>
    <image:image>
      <image:loc>${supabaseUrl}/storage/v1/object/public/${post.image_url}</image:loc>
      <image:title>${safeTitle}</image:title>
    </image:image>
  </url>`
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    },
  })
}
