import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.clubfasting.com'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${SITE_URL}/login`)
  }

  // Create response with cookies baked in
  let response = NextResponse.redirect(`${SITE_URL}${next}`)

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
            request.cookies.set(name, value)
            response.cookies.set(name, value, {
              ...options,
              ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
              httpOnly: true,
              sameSite: 'lax',
              secure: true,
            })
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${SITE_URL}/login?error=auth`)
  }

  return response
}
