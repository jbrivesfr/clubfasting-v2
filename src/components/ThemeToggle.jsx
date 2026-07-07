'use client'

import { useEffect, useState } from 'react'

/**
 * Small light/dark switch for the header.
 * Light is the default; the choice is persisted to localStorage and applied
 * before paint by the inline script in layout.js.
 */
export function ThemeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    const root = document.documentElement
    if (next) {
      root.classList.add('dark')
      try { localStorage.setItem('theme', 'dark') } catch (e) {}
    } else {
      root.classList.remove('dark')
      try { localStorage.setItem('theme', 'light') } catch (e) {}
    }
  }

  // Avoid hydration mismatch: render a neutral placeholder until mounted
  if (!mounted) {
    return <div className={`w-14 h-8 rounded-full ${className}`} aria-hidden />
  }

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 border
        ${isDark
          ? 'bg-zinc-800 border-white/10'
          : 'bg-[#efe6d0] border-[#e2d9c3]'} ${className}`}
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs
          shadow-md transition-transform duration-300
          ${isDark ? 'translate-x-6 bg-zinc-950' : 'translate-x-0 bg-white'}`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
