'use client'

import { useState } from 'react'
import Link from 'next/link'


export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue.')
      }

      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#faf6ec] text-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="relative max-w-md text-center space-y-6 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl shadow-orange-500/30 text-4xl">
            📧
          </div>
          <h2 className="text-3xl font-bold font-display">
            Bienvenue{name ? `, ${name}` : ''} !
          </h2>
          <p className="text-gray-600">
            Un lien de connexion a été envoyé à{' '}
            <strong className="text-gray-900">{email}</strong>.
          </p>
          <p className="text-gray-500 text-sm">
            Cliquez sur le lien dans l&apos;email pour accéder au Club.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            ← Utiliser un autre email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="relative w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-black text-gray-900 font-display">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-lg shadow-lg shadow-orange-500/30">
              🔥
            </div>
            Club <span className="text-orange-500">Fasting</span>
          </Link>
          <h2 className="mt-3 text-gray-700">Une nouvelle version pour mieux jeûner</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            Rejoignez le Club Fasting et prenez le contrôle de votre métabolisme.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl border border-[#e2d9c3] shadow-lg">
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">Votre prénom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#faf6ec] border border-[#e2d9c3] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="Jean"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">Votre email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#faf6ec] border border-[#e2d9c3] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="jean@example.com"
            />
            <p className="text-xs text-gray-500 mt-2">
              Nous vous envoyons un lien magique par email.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Déjà membre ?{' '}
          <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
            Se connecter
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">v2.6 · 2026-06-02</p>
      </div>
    </div>
  )
}
