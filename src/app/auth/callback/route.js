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

  if (code || token_hash) {
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
              })
            })
          },
        },
      }
    )

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return response
      }
    } else {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (!error) {
        return response
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
