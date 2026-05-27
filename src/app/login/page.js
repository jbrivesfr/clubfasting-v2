'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      // Store token in localStorage (same format as clubfasting.com)
      localStorage.setItem('sb-lyyevuyejxrjpsaisaal-auth-token', JSON.stringify({
        access_token: data.access_token,
        expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
        user: data.user,
      }))

      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-black">
            Club <span className="text-orange-500">Fasting</span>
          </Link>
          <h2 className="mt-2 text-gray-400">Se connecter</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ton email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="jean@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Ton prénom <span className="text-gray-600">(optionnel)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="Jean"
            />
            <p className="text-xs text-gray-600 mt-1">
              Si c&apos;est ta première visite, on crée ton compte automatiquement
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-900/50 border border-red-800 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Accéder au Club'}
          </button>

          <p className="text-center text-xs text-gray-600">
            Pas de mot de passe. Simple, comme le jeûne.
          </p>
        </form>
      </div>
    </div>
  )
}
