import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('newsfeed_weekly_engagement')
      .select('*')
      .order('week_start', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching weekly engagement:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Unexpected error fetching weekly engagement:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
