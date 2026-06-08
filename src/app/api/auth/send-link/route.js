import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.clubfasting.com'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check user exists in users table (same check as V1 login.php)
    const { data: users, error: userQueryError } = await supabaseAdmin
      .from('users')
      .select('id, email, name')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (userQueryError) {
      console.error('User query error:', userQueryError)
      return NextResponse.json({ error: 'Erreur de connexion.' }, { status: 500 })
    }

    if (!users) {
      return NextResponse.json({ error: 'Aucun compte trouvé avec cet email.' }, { status: 404 })
    }

    // Generate a V1-style token stored in login_tokens for 30-day cookie auth
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await supabaseAdmin.from('login_tokens').insert({
      user_email: normalizedEmail,
      token,
      expires_at: expiresAt.toISOString(),
      is_used: false,
    }).then(({ error }) => {
      if (error) console.warn('Token insert warning:', error.message)
    })

    const v2CallbackLink = `${SITE_URL}/auth/callback?token=${token}`

    // Send email via Supabase Auth — the OTP link goes to our callback
    const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${SITE_URL}/auth/callback`,
      },
    })

    if (otpError) {
      console.error('OTP send error:', otpError)
      return NextResponse.json({ error: "Erreur d'envoi de l'email." }, { status: 500 })
    }

    console.log(`✅ Magic link ready for ${normalizedEmail}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send-link error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
