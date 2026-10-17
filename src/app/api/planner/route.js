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

// Identité Club = public.users.id : les membres Club n'existent que dans
// public.users (la FK routines.user_id -> auth.users a été retirée le 2026-10-17).
// auth.users n'est consulté qu'en repli : compte absent de public.users, ou
// routine historique enregistrée sous l'id auth (routines antérieures à ce
// correctif). Une routine trouvée sous l'id auth reste à cet id (pas de doublon).
async function findPublicUserId(supabaseAdmin, email) {
  const { data } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()
  return data?.id || null
}

async function findAuthUserId(supabaseAdmin, email) {
  const target = email.toLowerCase().trim()
  const perPage = 1000
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage })
    if (error) return null
    const users = data?.users || []
    const found = users.find(u => u.email?.toLowerCase() === target)
    if (found) return found.id
    if (users.length < perPage) return null
  }
  return null
}

function latestRoutine(supabaseAdmin, userId) {
  return supabaseAdmin
    .from('routines')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
}

// Renvoie { userId, routine } : routine cherchée sous l'id public puis l'id
// auth ; userId = id qui porte la routine existante, sinon id public (repli auth).
async function resolveRoutineOwner(supabaseAdmin, email) {
  const publicId = await findPublicUserId(supabaseAdmin, email)
  if (publicId) {
    const { data, error } = await latestRoutine(supabaseAdmin, publicId)
    if (error) return { error }
    if (data) return { userId: publicId, routine: data }
  }

  const authId = await findAuthUserId(supabaseAdmin, email)
  if (authId && authId !== publicId) {
    const { data, error } = await latestRoutine(supabaseAdmin, authId)
    if (error) return { error }
    if (data) return { userId: authId, routine: data }
  }
  return { userId: publicId || authId || null, routine: null }
}

export async function GET(request) {
  const email = await getEmail(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { userId, routine, error } = await resolveRoutineOwner(supabaseAdmin, email)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json(routine || null)
}

export async function POST(request) {
  const email = await getEmail(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { userId, error: resolveError } = await resolveRoutineOwner(supabaseAdmin, email)
  if (resolveError) return NextResponse.json({ error: resolveError.message }, { status: 500 })
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

  // Supprime sous l'id public et l'id auth (routine historique éventuelle).
  const publicId = await findPublicUserId(supabaseAdmin, email)
  const authId = await findAuthUserId(supabaseAdmin, email)
  const ids = [publicId, authId].filter((id, i, a) => id && a.indexOf(id) === i)
  if (!ids.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { error } = await supabaseAdmin.from('routines').delete().in('user_id', ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
