'use client'

import { useMemo } from 'react'

/**
 * Lien de retour intelligent :
 * - si l'utilisateur vient du site club (clubfasting.com), on y retourne
 * - sinon on revient en arrière (navigation interne)
 * - fallback : /dashboard
 */
export default function BackLink({ fallback = '/dashboard', className = '', children }) {
  const externalReferrer = useMemo(() => {
    if (typeof document === 'undefined') return false
    try {
      const ref = document.referrer
      return Boolean(ref) && new URL(ref).host !== window.location.host
    } catch {
      return false
    }
  }, [])

  const handleClick = (e) => {
    if (externalReferrer) {
      e.preventDefault()
      window.location.href = document.referrer
      return
    }
    if (window.history.length > 1) {
      e.preventDefault()
      window.history.back()
    }
    // sinon : laisser le href fallback (/dashboard) faire son travail
  }

  return (
    <a href={fallback} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
