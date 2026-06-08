import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Find the user's UUID from the users table
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Ensure a Supabase auth user exists for this email
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existing = existingUsers?.users?.find(u => u.email === email.toLowerCase().trim())

    let authUserId = existing?.id
    if (!existing) {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase().trim(),
        email_confirm: true,
        user_metadata: { source: 'cookie-auth-sync' },
      })
      if (createError) {
        console.error('Auth user create error:', createError)
        return NextResponse.json({ error: 'Failed to sync auth user' }, { status: 500 })
      }
      authUserId = newUser.user.id
    }

    return NextResponse.json({ userId: userData.id, authUserId })
  } catch (error) {
    console.error('Ensure-session error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
