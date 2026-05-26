import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const cookieStore = await cookies()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storageKey: 'sb-lyyevuyejxrjpsaisaal-auth-token',
        storage: {
          getItem: (key) => {
            const val = cookieStore.get(key)?.value
            return val || null
          },
          setItem: () => {},
          removeItem: () => {},
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let displayName = user.email?.split('@')[0] || 'Membre'
  let profile = null

  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    if (data) {
      profile = data
      displayName = data.full_name || displayName
    }
  } catch {
    // Profiles table might not exist, fall back to email
  }

  return <DashboardClient user={user} profile={profile} displayName={displayName} />
}
