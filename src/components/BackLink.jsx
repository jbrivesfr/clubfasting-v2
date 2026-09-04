'use client'

/**
 * Lien de retour intelligent pour les pages outils :
 * 1. history.back() → retourne exactement d'où l'utilisateur vient (ex: /content)
 * 2. sinon, referrer externe (clubfasting.com)
 * 3. sinon, fallback (/dashboard)
 */
export default function BackLink({ fallback = '/dashboard', className = '', children }) {
  const handleClick = (e) => {
    if (typeof window === 'undefined') return
    if (window.history.length > 1) {
      e.preventDefault()
      window.history.back()
      return
    }
    try {
      const ref = document.referrer
      if (ref && new URL(ref).host !== window.location.host) {
        e.preventDefault()
        window.location.href = ref
      }
    } catch {
      // fallback : laisser le href par défaut
    }
  }

  return (
    <a href={fallback} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
