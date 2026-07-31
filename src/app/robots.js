export default function robots() {
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
