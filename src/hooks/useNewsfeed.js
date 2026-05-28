'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

/**
 * Hook to fetch and manage newsfeed data
 */
export function useNewsfeed(userId, journeyFilterId = null) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const supabase = createClient()

  const fetchNewsfeedData = useCallback(async () => {
    if (!userId) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: rpcError } = await supabase.rpc('get_newsfeed_data', {
        p_user_id: userId,
        p_journey_filter_id: journeyFilterId
      })

      if (rpcError) throw rpcError

      // Process and build the feed items from comments and notifications
      const feedItems = buildFeedItems(data)
      
      // Sort: featured first, then by most recent activity
      feedItems.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        return new Date(b.most_recent_activity || b.created_at) - new Date(a.most_recent_activity || a.created_at)
      })

      setItems(feedItems)
    } catch (err) {
      console.error('Error fetching newsfeed:', err)
      setError(err.message || 'Failed to load newsfeed')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [userId, journeyFilterId, supabase])

  useEffect(() => {
    fetchNewsfeedData()
  }, [fetchNewsfeedData])

  const refresh = useCallback(() => {
    fetchNewsfeedData()
  }, [fetchNewsfeedData])

  const toggleLike = useCallback(async (itemId, isLiked) => {
    try {
      if (isLiked) {
        // Unlike
        await supabase.rpc('remove_like', {
          p_user_id: userId,
          p_comment_id: itemId
        })
      } else {
        // Like
        await supabase.rpc('add_like', {
          p_user_id: userId,
          p_comment_id: itemId
        })
      }
      
      // Update local state optimistically
      setItems(prev => prev.map(item => {
        if (item.id === itemId) {
          const likers = isLiked 
            ? item.likers.filter(id => id !== userId)
            : [...item.likers, userId]
          return {
            ...item,
            likes_count: likers.length,
            is_liked: !isLiked,
            likers
          }
        }
        return item
      }))
    } catch (err) {
      console.error('Error toggling like:', err)
      // Refresh on error to get correct state
      fetchNewsfeedData()
    }
  }, [userId, supabase, fetchNewsfeedData])

  return { items, loading, error, refresh, toggleLike }
}

/**
 * Parse image_urls safely (could be JSON string, array, or single URL string)
 */
function parseImageUrls(raw) {
  if (!raw) return []
  try {
    if (typeof raw === 'string') {
      const trimmed = raw.trim()
      if (trimmed.startsWith('[')) return JSON.parse(trimmed)
      return [trimmed]
    }
    if (Array.isArray(raw)) return raw
    return []
  } catch (e) {
    console.warn('Failed to parse image_urls:', e)
    return []
  }
}

/**
 * Parse likers safely
 */
function parseLikers(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') return raw.split(',').filter(Boolean)
  return []
}

/**
 * Build feed items from RPC response.
 * The RPC returns { comments: [], notifications: [] } with a unified object format.
 * Both share fields: id, is_notification, title, content, page_url, author_*, image_urls,
 *   has_vimeo_content, vimeo_id, has_pdf_content, pdf_url, is_featured, is_pinned, likes, etc.
 * Notifications are content cards; comments are user posts.
 */
function buildFeedItems(data) {
  if (!data) return []

  const { comments = [], notifications = [] } = data
  const itemMap = new Map()
  const notificationPageUrls = new Set()

  // Helper to build a unified item from raw comment/notification
  function makeItem(raw) {
    return {
      id: raw.id,
      type: raw.is_notification ? 'notification' : 'comment',
      is_notification: raw.is_notification || false,
      is_featured: raw.is_featured === true || raw.is_featured === 'true',
      is_pinned: raw.is_pinned === true || raw.is_pinned === 'true',
      is_seen: raw.is_seen || false,
      created_at: raw.created_at,
      most_recent_activity: raw.last_reply_at || raw.created_at,
      content: raw.content || raw.description || '',
      title: raw.title || '',
      author_id: raw.author_id || raw.user_id,
      author_name: raw.author_name || raw.author_canonical_name || 'Club Fasting',
      author_avatar: raw.author_avatar || raw.author_custom_avatar_url || null,
      author_email: raw.author_email || null,
      image_urls: parseImageUrls(raw.image_urls),
      has_vimeo_content: raw.has_vimeo_content || false,
      vimeo_id: raw.vimeo_id || '',
      has_pdf_content: raw.has_pdf_content || false,
      pdf_url: raw.pdf_url || '',
      has_embed_content: raw.has_embed_content || false,
      embed_url: raw.embed_url || '',
      page_url: raw.page_url || '',
      journey_id: raw.journey_id || raw.series_id,
      journey_name: raw.journey_name || '',
      series_id: raw.series_id,
      likes_count: raw.likes_count || raw.likes || 0,
      replies_count: raw.replies_count || 0,
      is_liked: raw.is_liked || raw.liked_by_current_user || false,
      likers: parseLikers(raw.likers || raw.likers_details),
      content_id: raw.content_id,
      notification_enabled: raw.notification_enabled,
      replies: []
    }
  }

  // Process notifications (content cards from journeys)
  notifications
    .filter(n => !n.page_url || !n.page_url.includes('trash'))
    .forEach(notif => {
      const item = makeItem(notif)
      if (item.page_url) notificationPageUrls.add(item.page_url)
      itemMap.set(`notif-${item.id}`, item)
    })

  // Process comments (user posts + replies)
  comments
    .filter(c => !c.page_url || !c.page_url.includes('trash'))
    .forEach(comment => {
      if (comment.parent_id) {
        // This is a reply to another comment - attach to parent
        const parentKey = findItemKey(itemMap, comment.parent_id)
        if (parentKey) {
          const parent = itemMap.get(parentKey)
          if (parent) {
            const replyItem = makeItem(comment)
            parent.replies = parent.replies || []
            parent.replies.push(replyItem)
            parent.replies_count = (parent.replies_count || 0) + 1
            // Update most recent activity
            const commentDate = new Date(comment.created_at)
            const parentDate = new Date(parent.most_recent_activity || parent.created_at)
            if (commentDate > parentDate) {
              parent.most_recent_activity = comment.created_at
            }
          }
        }
      } else {
        // Top-level comment
        // Skip if it's a reply to a notification (matched by page_url) unless pinned
        const isPinned = comment.is_pinned === true || comment.is_pinned === 'true'
        if (notificationPageUrls.has(comment.page_url) && !isPinned) return

        const item = makeItem(comment)
        itemMap.set(`comment-${item.id}`, item)
      }
    })

  // Attach comments as replies to matching notifications (by page_url)
  itemMap.forEach((item, key) => {
    if (item.is_notification && item.page_url) {
      itemMap.forEach((other, otherKey) => {
        if (key !== otherKey && !other.is_notification && other.page_url === item.page_url && !other.parent_id) {
          item.replies.push(other)
          item.replies_count = (item.replies_count || 0) + 1
          itemMap.delete(otherKey) // Remove from root level
        }
      })
      // Sort replies by date
      item.replies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }
  })

  // Return as array, sorted: featured first, then by most recent activity
  const items = Array.from(itemMap.values())
  items.sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1
    if (!a.is_featured && b.is_featured) return 1

    const getMostRecentTime = (item) => {
      const isGlobalNotif = String(item.id).startsWith('notif-global-')
      let mostRecent = isGlobalNotif ? 0 : new Date(String(item.created_at).replace(' ', 'T')).getTime()
      if (item.replies && item.replies.length > 0) {
        const mostRecentReply = Math.max(...item.replies.map(r => new Date(String(r.created_at).replace(' ', 'T')).getTime()))
        mostRecent = Math.max(mostRecent, mostRecentReply)
      }
      return mostRecent
    }

    const aTime = getMostRecentTime(a)
    const bTime = getMostRecentTime(b)
    if (bTime !== aTime) return bTime - aTime
    return new Date(String(b.created_at).replace(' ', 'T')).getTime() - new Date(String(a.created_at).replace(' ', 'T')).getTime()
  })

  return items
}

/**
 * Find the key for an item by its raw ID (unprefixed).
 * itemMap keys are prefixed: "notif-UUID" or "comment-UUID".
 */
function findItemKey(itemMap, rawId) {
  const targetId = String(rawId)
  // Try both possible prefixes
  for (const prefix of ['notif-', 'comment-']) {
    const key = prefix + targetId
    if (itemMap.has(key)) return key
  }
  // Also check in replies of all items
  for (const [key, item] of itemMap) {
    if (item.replies && item.replies.some(r => String(r.id) === targetId)) {
      return key
    }
  }
  return null
}