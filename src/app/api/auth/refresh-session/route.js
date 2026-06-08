import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const THIRTY_DAYS = 30 * 24 * 60 * 60

export async function POST(request) {
  const cookie = request.cookies.get('logemail')
  if (!cookie?.value) {
    return NextResponse.json({ error: 'No cookie auth' }, { status: 401 })
  }

  const email = decodeURIComponent(cookie.value)
  const isProd = process.env.NODE_ENV === 'production'

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Ensure auth user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existing = existingUsers?.users?.find(u => u.email === email)
    if (!existing) {
      await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { source: 'cookie-session-refresh' },
      })
    }

    // Generate magic link to bootstrap a session
    const { data: magicLink } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })

    if (!magicLink?.properties?.hashed_token) {
      return NextResponse.json({ error: 'Link generation failed' }, { status: 500 })
    }

    // Create the response and set session cookies
    const response = NextResponse.json({ success: true })

    const supabaseServer = createServerClient(
      SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                maxAge: options.maxAge || THIRTY_DAYS,
                sameSite: 'lax',
                secure: isProd,
              })
            })
          },
        },
      }
    )

    await supabaseServer.auth.verifyOtp({
      token_hash: magicLink.properties.hashed_token,
      type: 'email',
    })

    return response
  } catch (error) {
    console.error('Session refresh error:', error)
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 })
  }
}
