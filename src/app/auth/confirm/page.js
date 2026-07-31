'use client'

import { Suspense, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function ConfirmHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('ready')
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
      // Full page navigation to ensure session cookie is picked up
      window.location.href = next
    }
  }, [tokenHash, type, next])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
        <p className="text-gray-500">Connexion en cours...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center space-y-5 max-w-sm animate-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-3xl">
          😕
        </div>
        <p className="text-gray-700">{errorMsg}</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 bg-white border border-[#e2d9c3] text-gray-700 rounded-full text-sm font-medium transition-colors hover:bg-gray-50"
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
        <h1 className="text-3xl font-bold text-gray-900 font-display">Bienvenue au Club</h1>
        <p className="text-gray-500 mt-2">Un dernier clic pour finaliser votre connexion.</p>
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
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
      }>
        <ConfirmHandler />
      </Suspense>
    </div>
  )
}
