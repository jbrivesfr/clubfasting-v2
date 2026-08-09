import { createClient } from '@supabase/supabase-js'
import { NextResponse, NextRequest } from 'next/server'
import { createClient as createServerClient } from '../../../../utils/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

export async function GET(request: NextRequest) {
  const supabaseServer = createServerClient()
  const { data: { user } } = await supabaseServer.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const daysParam = searchParams.get('days')
  let days = 7

  if (daysParam !== null) {
    days = parseInt(daysParam, 10)
    if (isNaN(days) || days < 1 || days > 90) {
      return NextResponse.json({ error: 'days parameter must be an integer between 1 and 90' }, { status: 400 })
    }
  }

  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const sinceISO = sinceDate.toISOString()

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const [postsRes, commentsRes, reactionsRes] = await Promise.all([
      supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }).gte('created_at', sinceISO),
      supabaseAdmin.from('comments').select('*', { count: 'exact', head: true }).gte('created_at', sinceISO),
      supabaseAdmin.from('reactions').select('*', { count: 'exact', head: true }).gte('created_at', sinceISO),
    ])

    if (postsRes.error) throw postsRes.error
    if (commentsRes.error) throw commentsRes.error
    if (reactionsRes.error) throw reactionsRes.error

    // Paginate to get all unique active users without hitting the 1000 row limit
    const uniqueUsers = new Set<string>()
    let from = 0
    let to = 999
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabaseAdmin
        .from('reactions')
        .select('user_id')
        .gte('created_at', sinceISO)
        .range(from, to)

      if (error) throw error

      if (data && data.length > 0) {
        data.forEach(r => {
          if (r.user_id) uniqueUsers.add(r.user_id)
        })
        if (data.length < 1000) {
          hasMore = false
        } else {
          from += 1000
          to += 1000
        }
      } else {
        hasMore = false
      }
    }

    return NextResponse.json({
      posts: postsRes.count || 0,
      comments: commentsRes.count || 0,
      reactions: reactionsRes.count || 0,
      unique_active_users: uniqueUsers.size,
      window_days: days,
      since: sinceISO,
    })
  } catch (error) {
    console.error('newsfeed engagement error:', error)
    return NextResponse.json({ error: 'Internal server error while fetching engagement data' }, { status: 500 })
  }
}
