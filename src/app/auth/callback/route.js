import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

function getOrigin(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'app.clubfasting.com'
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  return `${proto}://${host}`
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') || 'magiclink'
  const next = searchParams.get('next') ?? '/dashboard'
  const origin = getOrigin(request)

  console.log('[AUTH] Callback called', { hasCode: !!code, hasTokenHash: !!token_hash, type, next, origin })

  if (code || token_hash) {
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            const cookies = request.cookies.getAll()
            console.log('[AUTH] cookies.getAll', { count: cookies.length, names: cookies.map(c => c.name) })
            return cookies
          },
          setAll(cookiesToSet) {
            console.log('[AUTH] cookies.setAll', { count: cookiesToSet.length, names: cookiesToSet.map(c => c.name) })
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
              })
            })
          },
        },
      }
    )

    if (code) {
      console.log('[AUTH] exchangeCodeForSession...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      console.log('[AUTH] exchangeCodeForSession result', { hasSession: !!data?.session, error: error?.message })
      if (!error) {
        return response
      }
    } else {
      console.log('[AUTH] verifyOtp...', { token_hash: token_hash?.slice(0, 20), type })
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
      console.log('[AUTH] verifyOtp result', { hasSession: !!data?.session, hasUser: !!data?.user, error: error?.message })
      if (!error) {
        return response
      }
    }
  }

  console.log('[AUTH] FAILED — redirecting to /login')
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
