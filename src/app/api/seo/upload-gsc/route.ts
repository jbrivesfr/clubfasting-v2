import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fixed authentication check based on code review feedback.
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const snapshot_date = formData.get('snapshot_date') as string
    const csv_file = formData.get('csv_file') as File

    if (!snapshot_date || !csv_file) {
      return NextResponse.json({ error: 'Missing snapshot_date or csv_file' }, { status: 400 })
    }

    const text = await csv_file.text()
    const lines = text.split('\n')

    let headerIndex = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Query') && lines[i].includes('Page') && lines[i].includes('Impressions') && lines[i].includes('Clicks')) {
        headerIndex = i
        break
      }
    }

    if (headerIndex === -1) {
      return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 })
    }

    const headers = lines[headerIndex].split(',').map(h => h.trim())
    const pageIndex = headers.indexOf('Page')
    const impressionsIndex = headers.indexOf('Impressions')
    const clicksIndex = headers.indexOf('Clicks')
    const ctrIndex = headers.indexOf('CTR')
    const positionIndex = headers.indexOf('Position')

    if (pageIndex === -1 || impressionsIndex === -1 || clicksIndex === -1 || ctrIndex === -1 || positionIndex === -1) {
      return NextResponse.json({ error: 'Missing required columns in CSV' }, { status: 400 })
    }

    const pageStats = new Map<string, { impressions: number, clicks: number, ctrSum: number, positionSum: number, count: number }>()

    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      let parsedRow: string[] = []
      let currentVal = ''
      let insideQuotes = false
      for (let char of line) {
        if (char === '"') {
          insideQuotes = !insideQuotes
        } else if (char === ',' && !insideQuotes) {
          parsedRow.push(currentVal)
          currentVal = ''
        } else {
          currentVal += char
        }
      }
      parsedRow.push(currentVal)

      if (parsedRow.length !== headers.length) continue

      const url = parsedRow[pageIndex].trim()
      const impressionsStr = parsedRow[impressionsIndex].trim().replace(/,/g, '')
      const clicksStr = parsedRow[clicksIndex].trim().replace(/,/g, '')
      const ctrStr = parsedRow[ctrIndex].trim().replace('%', '')
      const positionStr = parsedRow[positionIndex].trim()

      const impressions = parseInt(impressionsStr, 10) || 0
      const clicks = parseInt(clicksStr, 10) || 0
      const ctr = parseFloat(ctrStr) || 0
      const position = parseFloat(positionStr) || 0

      if (pageStats.has(url)) {
        const stats = pageStats.get(url)!
        stats.impressions += impressions
        stats.clicks += clicks
        stats.ctrSum += ctr
        stats.positionSum += position
        stats.count += 1
      } else {
        pageStats.set(url, { impressions, clicks, ctrSum: ctr, positionSum: position, count: 1 })
      }
    }

    const upsertData = Array.from(pageStats.entries()).map(([url, stats]) => {
      const ctr = stats.ctrSum / stats.count
      const position = stats.positionSum / stats.count
      return {
        url,
        snapshot_date,
        impressions: stats.impressions,
        clics: stats.clicks,
        ctr,
        position
      }
    })

    if (upsertData.length > 0) {
      const { error } = await supabase
        .from('seo_gsc_snapshots')
        .upsert(upsertData, { onConflict: 'url, snapshot_date' })

      if (error) {
        console.error('Error upserting GSC data:', error)
        return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 })
      }
    }

    let originalRowCount = 0;
    const values = Array.from(pageStats.values())
    for (let i = 0; i < values.length; i++) {
        originalRowCount += values[i].count
    }

    return NextResponse.json({
      uploaded: originalRowCount,
      snapshot_date,
      pages: pageStats.size
    })
  } catch (err) {
    console.error('GSC upload error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
