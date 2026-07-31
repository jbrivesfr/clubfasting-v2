'use client'

import { usePathname } from 'next/navigation'

export default function CanonicalPath() {
  const pathname = usePathname()

  if (!pathname) return null

  const url = `https://app.clubfasting.com${pathname}`

  return <link rel="canonical" href={url} />
}
