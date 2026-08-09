import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clubfasting.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard',
        '/auth',
        '/login',
        '/register',
        '/newsfeed'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
