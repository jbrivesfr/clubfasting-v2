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
      router.replace(next)
    }
  }, [tokenHash, type, next, router])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-4xl">⏳</div>
        <p className="text-gray-500">Connexion en cours...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">😕</div>
        <p className="text-gray-600">{errorMsg}</p>
        <Link href="/login" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
          Redemander un lien
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div className="text-5xl">👋</div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bienvenue au Club</h2>
        <p className="text-gray-500 mt-2">Clique pour finaliser ta connexion.</p>
      </div>
      <button
        onClick={handleConfirm}
        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-lg shadow-sm"
      >
        Se connecter
      </button>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="animate-spin text-4xl">⏳</div>
      }>
        <ConfirmHandler />
      </Suspense>
    </div>
  )
}
