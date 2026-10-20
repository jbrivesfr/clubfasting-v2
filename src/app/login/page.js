'use client'

import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
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
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
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
      <main className="min-h-screen bg-[#faf6ec] text-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
        <div
          className="relative max-w-md text-center space-y-6 animate-slide-up"
          role="status"
          aria-live="polite"
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl shadow-orange-500/30 text-4xl"
            aria-hidden="true"
          >
            📧
          </div>
          <h1 className="text-3xl font-bold font-display">Vérifiez vos emails</h1>
          <p className="text-gray-600">
            Un lien de connexion a été envoyé à <strong className="text-gray-900">{email}</strong>.
          </p>
          <p className="text-gray-500 text-sm">
            Cliquez sur le lien dans l&apos;email pour accéder au Club.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
            aria-label="Utiliser une autre adresse email"
          >
            ← Utiliser un autre email
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf6ec] text-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="relative w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <h1 className="sr-only">Connexion au Club Fasting</h1>
          <img
            src="/club-fasting-logo.png"
            alt="Logo Club Fasting, connectez-vous à votre espace de jeûne intermittent"
            className="mx-auto w-64 max-w-full h-auto mb-6"
          />
          <p className="mt-1 text-lg text-gray-600 font-medium">
            Une nouvelle version pour mieux jeûner
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl border border-[#e2d9c3] shadow-lg">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2 font-medium">Votre email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#faf6ec] border border-[#e2d9c3] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="jean@example.com"
              aria-label="Adresse email"
              aria-describedby={error ? "email-hint email-error" : "email-hint"}
              aria-invalid={!!error}
            />
            <p id="email-hint" className="text-xs text-gray-500 mt-2">
              Nous vous envoyons un lien magique par email.
            </p>
          </div>

          {error && (
            <div id="email-error" role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            aria-label="Envoyer le lien magique"
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien magique'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">v2.6 · 2026-06-02</p>
      </div>
    </main>
  )
}
