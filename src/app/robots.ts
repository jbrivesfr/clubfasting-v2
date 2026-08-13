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
        '/dashboard/',
        '/_next/',
        '/auth',
        '/login',
        '/register',
        '/newsfeed'
      ],
    },
    sitemap: [
      'https://clubfasting.com/sitemap.xml',
      'https://fasting.fr/sitemap.xml'
    ],
    host: 'https://app.clubfasting.com',
  }
}
