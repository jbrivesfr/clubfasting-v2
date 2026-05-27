'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export const dynamic = 'force-dynamic'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState(null)

  useEffect(() => {
    const code = searchParams.get('code')

    if (!code) {
      router.replace('/login')
      return
    }

    const supabase = createClient()
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('Auth exchange error:', error)
        setError(error.message)
        router.replace('/login?error=auth')
      } else {
        const next = searchParams.get('next') || '/dashboard'
        router.replace(next)
      }
    })
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-4xl">😕</div>
          <p className="text-gray-400">Erreur de connexion. Reessaie.</p>
          <a href="/login" className="text-orange-400 hover:text-orange-300 text-sm">Retour au login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="animate-spin text-4xl">⏳</div>
        <p className="text-gray-400">Connexion en cours...</p>
      </div>
    </div>
  )
}
