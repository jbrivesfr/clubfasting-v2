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

export async function GET(request) {
  const email = await getEmail(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabaseAdmin
    .from('weight_entries')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .order('date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(request) {
  const email = await getEmail(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error } = await supabaseAdmin.from('weight_entries').insert({
    email: email.toLowerCase().trim(),
    weight: body.weight,
    date: body.date,
  })

  if (error) {
    console.error('Weight save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request) {
  const email = await getEmail(request)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  if (body.date) {
    await supabaseAdmin.from('weight_entries').delete()
      .eq('email', email.toLowerCase().trim())
      .eq('date', body.date)
  } else {
    await supabaseAdmin.from('weight_entries').delete()
      .eq('email', email.toLowerCase().trim())
  }

  return NextResponse.json({ success: true })
}
