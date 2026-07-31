'use client'

import { useEffect } from 'react'

export default function LoginError({ error, reset }) {
  useEffect(() => {
    console.error('Login error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-sm animate-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-3xl">
          😕
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display mb-2">Oups, une erreur est survenue</h2>
          <p className="text-gray-600">{error.message || 'Impossible de charger la page de connexion.'}</p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-block px-6 py-2.5 bg-white border border-[#e2d9c3] text-gray-700 rounded-full text-sm font-medium transition-colors hover:bg-gray-50 shadow-sm"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
