'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const supabaseRef = useRef(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabaseRef.current) supabaseRef.current = createClient()
    setLoading(true)
    setError(null)

    try {
      const redirectTo = `https://app.clubfasting.com/auth/callback`

      const { error } = await supabaseRef.current.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectTo,
        },
      })

      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          <div className="text-5xl">📧</div>
          <h2 className="text-2xl font-bold">Vérifie tes emails</h2>
          <p className="text-gray-400">
            Un lien de connexion a été envoyé à <strong className="text-white">{email}</strong>.
          </p>
          <p className="text-sm text-gray-600">
            Clique sur le lien dans l&apos;email pour accéder au Club.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-orange-400 hover:text-orange-300"
          >
            ← Utiliser un autre email
          </button>
        </div>
      </div>
    )
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
            <p className="text-xs text-gray-600 mt-2">
              On t&apos;envoie un lien magique par email. Pas de mot de passe.
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
            {loading ? 'Envoi...' : 'Envoyer le lien magique'}
          </button>
        </form>
      </div>
    </div>
  )
}
