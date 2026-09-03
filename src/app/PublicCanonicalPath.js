import { headers } from 'next/headers'

export default function PublicCanonicalPath() {
  const headersList = headers()

  // Next.js headers don't strictly expose pathname in App Router.
  // Instead, the best practice for dynamic SSR canonicals without usePathname
  // is to rely on x-invoke-path or the current URL if available.
  const invokePath = headersList.get('x-invoke-path')
  const host = headersList.get('host') || 'clubfasting.com'

  let pathname = invokePath || '/'

  // Ignorer les routes du tableau de bord car elles ont leur propre CanonicalPath
  if (pathname.startsWith('/dashboard')) return null

  // Supprimer la barre oblique de fin
  let cleanPathname = pathname
  if (cleanPathname !== '/' && cleanPathname.endsWith('/')) {
    cleanPathname = cleanPathname.slice(0, -1)
  }

  // Construire l'URL
  let url = `https://${host.includes('localhost') ? 'clubfasting.com' : host}${cleanPathname}`

  return <link rel="canonical" href={url} />
}
