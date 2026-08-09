export default function robots() {
  const isProd = process.env.NEXT_PUBLIC_SITE_URL === 'https://app.clubfasting.com'

  if (!isProd) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://app.clubfasting.com/sitemap.xml',
      'https://app.clubfasting.com/sitemap-news.xml',
    ],
  }
}
