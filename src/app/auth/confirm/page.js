'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function ConfirmHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('ready') // ready | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') || 'magiclink'
  const next = searchParams.get('next') || '/dashboard'

  const handleConfirm = useCallback(async () => {
    if (!tokenHash) {
      setErrorMsg('Lien invalide. Redemande un nouveau lien.')
      setStatus('error')
      return
    }

    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    
    if (error) {
      setErrorMsg(error.message === 'Email link is invalid or has expired'
        ? 'Le lien a expiré ou a déjà été utilisé. Redemande un nouveau lien.'
        : error.message)
      setStatus('error')
    } else {
      setStatus('success')
      // Full page navigation to ensure session cookie is picked up
      window.location.href = next
    }
  }, [tokenHash, type, next, router])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
        <p className="text-zinc-400">Connexion en cours...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center space-y-5 max-w-sm animate-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-3xl">
          😕
        </div>
        <p className="text-zinc-300">{errorMsg}</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white rounded-full text-sm font-medium transition-colors"
        >
          Redemander un lien
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center space-y-7 animate-slide-up">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl shadow-orange-500/30 text-4xl">
        👋
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white font-display">Bienvenue au Club</h2>
        <p className="text-zinc-400 mt-2">Un dernier clic pour finaliser ta connexion.</p>
      </div>
      <button
        onClick={handleConfirm}
        className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-full transition-all text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5"
      >
        Se connecter
      </button>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-0 pointer-events-none opacity-70"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 0%, rgba(251,146,60,0.18) 0%, transparent 60%)',
        }}
      />
      <Suspense fallback={
        <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
      }>
        <ConfirmHandler />
      </Suspense>
    </div>
  )
}
