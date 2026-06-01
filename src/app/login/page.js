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
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-0 pointer-events-none opacity-60"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 0%, rgba(251,146,60,0.15) 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-md text-center space-y-6 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl shadow-orange-500/30 text-4xl">
            📧
          </div>
          <h2 className="text-3xl font-bold font-display">Vérifie tes emails</h2>
          <p className="text-zinc-400">
            Un lien de connexion a été envoyé à <strong className="text-white">{email}</strong>.
          </p>
          <p className="text-zinc-500 text-sm">
            Clique sur le lien dans l&apos;email pour accéder au Club.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            ← Utiliser un autre email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-0 pointer-events-none opacity-70"
        style={{
          background:
            'radial-gradient(45% 50% at 30% 0%, rgba(251,146,60,0.18) 0%, transparent 60%), radial-gradient(35% 40% at 80% 20%, rgba(239,68,68,0.12) 0%, transparent 60%)',
        }}
      />
      <div className="relative w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-black text-white font-display">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-lg shadow-lg shadow-orange-500/30">
              🔥
            </div>
            Club <span className="text-orange-400">Fasting</span>
          </Link>
          <h2 className="mt-3 text-zinc-400">Connecte-toi à ton espace</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/[0.08] shadow-2xl">
          <div>
            <label className="block text-sm text-zinc-300 mb-2 font-medium">Ton email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-950/60 border border-white/[0.1] text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="jean@example.com"
            />
            <p className="text-xs text-zinc-500 mt-2">
              On t&apos;envoie un lien magique par email. Pas de mot de passe.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien magique'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-4">v2.4 · 2026-06-01</p>
      </div>
    </div>
  )
}
