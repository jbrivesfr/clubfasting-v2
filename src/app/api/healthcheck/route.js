import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1. Check GSC (Google Search Console) connection
    let gscStatus = 'error'
    try {
      const sitemapResponse = await fetch('https://app.clubfasting.com/sitemap.xml', { method: 'HEAD' })
      gscStatus = sitemapResponse.ok ? 'ok' : 'error'
    } catch (e) {
      gscStatus = 'error'
    }

    // 2. Check Supabase connection
    const supabase = createClient()
    const { error: supabaseError } = await supabase.auth.getSession()
    const supabaseStatus = supabaseError ? 'error' : 'ok'

    // 3. Get last-deploy timestamp
    const deployTimestamp = process.env.DEPLOY_TIMESTAMP || (Date.now() - (process.uptime() * 1000))

    const status = (gscStatus === 'ok' && supabaseStatus === 'ok') ? 'ok' : 'error'

    return NextResponse.json({
      status,
      checks: {
        gsc: gscStatus,
        supabase: supabaseStatus,
      },
      lastDeploy: new Date(deployTimestamp).toISOString(),
    }, { status: status === 'ok' ? 200 : 500 })
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }
}
