'use client'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let supabaseClient = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  supabaseClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return supabaseClient
}
