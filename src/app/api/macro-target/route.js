import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

async function getEmail(request) {
  const cookie = request.cookies.get('logemail')
  if (cookie?.value) return decodeURIComponent(cookie.value)

  const supabase = createServerClient(
    SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email || null
}

async function resolveUserId(supabaseAdmin, email) {
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
  const authUser = authData?.users?.find(
    u => u.email?.toLowerCase() === email.toLowerCase()
  )
  if (authUser?.id) return authUser.id

  const { data: publicUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()
  return publicUser?.id || null
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
    .from('macro_targets')
    .select('*')
    .eq('user_id', userId)
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

  const { error } = await supabaseAdmin.from('macro_targets').upsert({
    user_id: userId,
    calories: body.calories,
    protein_g: body.protein_g,
    fat_g: body.fat_g,
    net_carbs_g: body.net_carbs_g,
    mode: body.mode,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })

  if (error) {
    console.error('Macro target save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
