import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'RjVo8/jW8rr6FTG4u/nl1kEMTBZmZcT1vtnPVS7cqurfh2KaTbiS3l+FMACqgbQLn9yMJ9MapHPkoukl6ZA5XA=='

export async function POST(request) {
  try {
    const { email, name } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Email valide requis' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )

    const displayName = name || email.split('@')[0]

    // Find or create user
    let userId
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existing && existing.length > 0) {
      userId = existing[0].id
    } else {
      // Create via admin API
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name: displayName },
      })
      if (createError) throw createError
      userId = newUser.user.id
    }

    // Update last_seen
    await supabase
      .from('users')
      .upsert({
        id: userId,
        email,
        name: displayName,
        last_seen_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    // Generate a custom JWT token matching Supabase format
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      sub: userId,
      email,
      role: 'authenticated',
      aud: 'authenticated',
      iss: 'supabase',
      iat: now,
      exp: now + (60 * 60 * 24 * 7), // 7 days
    }

    const access_token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' })

    return Response.json({
      success: true,
      access_token,
      user: { id: userId, email, name: displayName },
    })
  } catch (err) {
    console.error('Auth error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
