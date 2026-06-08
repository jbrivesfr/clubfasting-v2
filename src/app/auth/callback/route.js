import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const THIRTY_DAYS = 30 * 24 * 60 * 60
const COOKIE_DURATION = 365 * 24 * 60 * 60 // 1 year for magic link login

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
  const token = searchParams.get('token') // V1-style magic link token
  const next = searchParams.get('next') ?? '/dashboard'
  const origin = getOrigin(request)
  const isProd = process.env.NODE_ENV === 'production'

  // V1-style magic link (Amazon SES)
  if (token) {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Validate token
    const { data: tokens, error: tokenError } = await supabaseAdmin
      .from('login_tokens')
      .select('*')
      .eq('token', token)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .limit(1)

    if (tokenError || !tokens || tokens.length === 0) {
      return NextResponse.redirect(`${origin}/login?error=invalid_token`)
    }

    const tokenData = tokens[0]
    const email = tokenData.user_email

    // Mark token as used
    await supabaseAdmin
      .from('login_tokens')
      .update({ is_used: true })
      .eq('id', tokenData.id)

    // Get user info from users table
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('name, stripe')
      .eq('email', email)
      .maybeSingle()

    const userName = userData?.name ||
      email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    const description = userData?.stripe || ''

    const response = NextResponse.redirect(`${origin}${next}`)

    // Set cookies (same as V1 login.php)
    const cookieDomain = isProd ? '.clubfasting.com' : undefined
    response.cookies.set('logemail', email, {
      maxAge: COOKIE_DURATION,
      path: '/',
      domain: cookieDomain,
      sameSite: 'lax',
      secure: isProd,
      httpOnly: false, // dashboard JS needs to read it
    })
    response.cookies.set('username', userName, {
      maxAge: COOKIE_DURATION,
      path: '/',
      domain: cookieDomain,
      sameSite: 'lax',
      secure: isProd,
      httpOnly: false,
    })
    if (description) {
      response.cookies.set('description', description, {
        maxAge: COOKIE_DURATION,
        path: '/',
        domain: cookieDomain,
        sameSite: 'lax',
        secure: isProd,
        httpOnly: false,
      })
    }

    // Also create/update Supabase auth user for future compatibility
    try {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingAuthUser = authUsers?.users?.find(u => u.email === email)

      if (!existingAuthUser) {
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { name: userName },
        })
      }
    } catch (e) {
      console.error('Auth user sync error (non-fatal):', e.message)
    }

    // Update last_seen_at
    await supabaseAdmin
      .from('users')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('email', email)

    return response
  }

  // Supabase magic link (legacy, kept for backward compatibility)
  if (code || token_hash) {
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
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

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) return response
    } else {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (!error) return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
