import { createClient } from '@/utils/supabase/server'
import fs from 'fs'
import path from 'path'

function getPillars() {
  const exclude = ['api', 'auth', 'dashboard', 'login', 'register', 'newsfeed', 'sitemap-contenus', 'sitemap-news.xml', 'page', 'layout', 'robots.txt', 'sitemap.xml']
  let pillars = []

  try {
    // 1. Try to read from next/server/app-paths-manifest.json (available in both standalone and normal builds)
    const manifestPath = path.join(process.cwd(), '.next/server/app-paths-manifest.json')
    if (fs.existsSync(manifestPath)) {
      const appPaths = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      const allPaths = Object.keys(appPaths)

      allPaths.forEach(p => {
        if (p.endsWith('/page')) {
          const routeName = p.replace(/\/page$/, '').replace(/^\//, '')

          if (routeName && !exclude.includes(routeName) && !routeName.startsWith('api') && !routeName.startsWith('dashboard') && !routeName.startsWith('auth') && !routeName.startsWith('_') && !routeName.includes('/') && !routeName.includes('.')) {
            pillars.push(routeName)
          }
        }
      })
      if (pillars.length > 0) return [...new Set(pillars)]
    }

    // 2. Fallback to src/app directory reading
    const appDir = path.join(process.cwd(), 'src/app')
    if (fs.existsSync(appDir)) {
      const dirs = fs.readdirSync(appDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      pillars = dirs.filter(dir => !exclude.includes(dir) && !dir.startsWith('(') && !dir.startsWith('_') && !dir.includes('.'))
    }
  } catch (error) {
    console.error('Error discovering pillars:', error)
  }

  return [...new Set(pillars)]
}

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

  const pillars = getPillars()
  pillars.forEach(pillar => {
    urls.push({
      url: `https://app.clubfasting.com/${pillar}`,
      lastModified: maxDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  urls.push({
    url: 'https://app.clubfasting.com/sitemap-contenus',
    lastModified: maxDate,
    changeFrequency: 'daily',
    priority: 0.8,
  })

  return urls
}
