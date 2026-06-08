import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.clubfasting.com'
const V1_API_URL = 'https://clubfasting.com/api/send-magic-link.php'

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

    // Check user exists (same as V1 login.php)
    const { data: user, error: userQueryError } = await supabaseAdmin
      .from('users')
      .select('id, email, name')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (userQueryError) {
      console.error('User query error:', userQueryError)
      return NextResponse.json({ error: 'Erreur de connexion.' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Aucun compte trouvé avec cet email.' }, { status: 404 })
    }

    // Generate token (same format as V1 login.php)
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Store token in login_tokens table
    const { error: insertError } = await supabaseAdmin.from('login_tokens').insert({
      user_email: normalizedEmail,
      token,
      expires_at: expiresAt.toISOString(),
      is_used: false,
    })

    if (insertError) {
      console.error('Token insert error:', insertError)
      return NextResponse.json({ error: 'Erreur lors de la création du token.' }, { status: 500 })
    }

    const loginLink = `${SITE_URL}/auth/callback?token=${token}`

    // Send email via V1's existing Amazon SES system
    const v1Res = await fetch(V1_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        token,
        link: loginLink,
      }),
    })

    const v1Result = await v1Res.json()

    if (!v1Result.success) {
      console.error('SES send failed:', v1Result)
      return NextResponse.json({ error: "Erreur d'envoi de l'email. Veuillez réessayer." }, { status: 500 })
    }

    console.log(`✅ Magic link sent to ${normalizedEmail} via Amazon SES`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send-link error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
