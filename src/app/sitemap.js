import { createClient } from '@/utils/supabase/server'

export default async function sitemap() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('journey_steps')
    .select('content:content_id ( id, permalink, title )')
    .not('content_id', 'is', null)

  let maxDate = new Date()

  let urls = [
    {
      url: 'https://app.clubfasting.com/newsfeed',
      lastModified: maxDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://app.clubfasting.com/guide-jeune-intermittent',
      lastModified: maxDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  ]

  if (data && !error) {
    const rawContents = data.map(d => d.content).filter(c => c && c.permalink)

    const contentsMap = new Map()
    for (const c of rawContents) {
      if (!contentsMap.has(c.permalink)) {
        contentsMap.set(c.permalink, c)
      }
    }

    const contentUrls = Array.from(contentsMap.values()).map(content => {
      return {
        url: `https://app.clubfasting.com/${content.permalink}`,
        lastModified: maxDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      }
    })

    urls = [...urls, ...contentUrls]
  }

  urls.push({
    url: 'https://app.clubfasting.com/sitemap-contenus',
    lastModified: maxDate,
    changeFrequency: 'daily',
    priority: 0.8,
  })

  return urls
}
