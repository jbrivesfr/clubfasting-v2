import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: comments, error } = await supabase
      .from('comments')
      .select('id, author_id, author_name, content, created_at')
      .is('parent_id', null)
      .is('deleted_at', null)
      .lt('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching pending comments:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    const parentIds = comments.map(c => c.id)
    let childComments = []

    if (parentIds.length > 0) {
      // Chunking may be required if parentIds is > 1000, but since we're just checking
      // for presence, and usually there aren't thousands of pending ones, it should be fine.
      const { data: children, error: childrenError } = await supabase
        .from('comments')
        .select('parent_id')
        .in('parent_id', parentIds)
        .is('deleted_at', null)

      if (childrenError) {
        console.error('Error fetching child comments:', childrenError)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
      }
      if (children) {
        childComments = children
      }
    }

    const repliedParentIds = new Set(childComments.map(c => c.parent_id))
    const unanswered = comments.filter(c => !repliedParentIds.has(c.id))

    const limitUnanswered = unanswered.slice(0, 100)
    const oldest = limitUnanswered[0]
    const oldestHours = oldest ? Math.floor((Date.now() - new Date(oldest.created_at).getTime()) / (1000 * 60 * 60)) : 0

    const mappedComments = limitUnanswered.map(c => ({
      id: c.id,
      post_id: c.id,
      author_id: c.author_id,
      author_name: c.author_name,
      text: c.content,
      created_at: c.created_at
    }))

    return NextResponse.json({
      count: unanswered.length,
      oldest_unanswered_hours: oldestHours,
      comments: mappedComments
    })
  } catch (err) {
    console.error('Pending comments endpoint error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
