import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

async function getEmail(request) {
  // 1. Check logemail cookie (V1 auth)
  const cookie = request.cookies.get('logemail')
  if (cookie?.value) return decodeURIComponent(cookie.value)

  // 2. Check Supabase session
  const supabase = createServerClient(
    SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {}, // read-only
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email || null
}

async function resolveUserId(supabaseAdmin, email) {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()
  return user?.id
}

export async function GET(request) {
  const email = await getEmail(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const userId = await resolveUserId(supabaseAdmin, email)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from('routines')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || null)
}

export async function POST(request) {
  const email = await getEmail(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const userId = await resolveUserId(supabaseAdmin, email)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { error } = await supabaseAdmin.from('routines').upsert({
    user_id: userId,
    meals: body.meals,
    drink: body.drink,
    wake_up_time: body.wake_up_time,
    bed_time: body.bed_time,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })

  if (error) {
    console.error('Planner save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request) {
  const email = await getEmail(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const userId = await resolveUserId(supabaseAdmin, email)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await supabaseAdmin.from('routines').delete().eq('user_id', userId)
  return NextResponse.json({ success: true })
}
