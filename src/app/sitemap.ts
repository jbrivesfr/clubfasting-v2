import { MetadataRoute } from 'next'

const PUBLIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const }
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clubfasting.com'

  return PUBLIC_ROUTES.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
