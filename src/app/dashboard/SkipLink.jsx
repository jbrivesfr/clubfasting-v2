'use client'

import { useEffect } from 'react'

export default function SkipLink() {
  useEffect(() => {
    // Handling hash on load
    if (window.location.hash === '#main-content') {
      const el = document.getElementById('main-content')
      if (el) {
        el.scrollIntoView()
        el.focus()
      }
    }
  }, [])

  return (
    <a
      href="#main-content"
      className="skip-link absolute top-0 left-4 z-[100] -translate-y-full p-3 bg-orange-600 text-white font-bold transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600 rounded-b-md"
    >
      Aller au contenu principal
    </a>
  )
}
