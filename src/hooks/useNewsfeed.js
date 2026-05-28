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
 * Build feed items from RPC response (comments and notifications)
 */
function buildFeedItems(data) {
  if (!data) return []

  const { comments = [], notifications = [] } = data
  const itemMap = new Map()
  const seenNotifications = new Set()

  // Process notifications first
  notifications.forEach(notif => {
    if (notif.type === 'new_comment' && notif.comment_id) {
      // Skip if we've already seen this notification
      if (seenNotifications.has(`${notif.type}-${notif.comment_id}`)) return
      seenNotifications.add(`${notif.type}-${notif.comment_id}`)
      
      // Don't add as separate item, will be part of comment
    } else if (notif.type === 'featured') {
      // Add featured notification as item
      const key = `featured-${notif.id}`
      if (!seenNotifications.has(key)) {
        seenNotifications.add(key)
        itemMap.set(key, {
          id: notif.id,
          type: 'notification',
          notification_type: 'featured',
          is_featured: true,
          created_at: notif.created_at,
          most_recent_activity: notif.created_at,
          title: notif.title || 'Publication en avant',
          message: notif.message || '',
          image_url: notif.image_url || null,
          author_id: notif.actor_id,
          author_name: notif.actor_name,
          author_avatar: notif.actor_avatar,
          journey_id: notif.journey_id,
          likes_count: 0,
          replies_count: 0,
          likers: [],
          replies: []
        })
      }
    }
  })

  // Process comments
  comments.forEach(comment => {
    if (comment.parent_id) {
      // This is a reply, find parent and add to it
      const parentKey = findItemKey(itemMap, comment.parent_id)
      if (parentKey) {
        const parent = itemMap.get(parentKey)
        if (parent) {
          parent.replies = parent.replies || []
          parent.replies.push(comment)
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
      const key = `comment-${comment.id}`
      itemMap.set(key, {
        id: comment.id,
        type: 'comment',
        is_featured: comment.is_featured || false,
        is_pinned: comment.is_pinned || false,
        created_at: comment.created_at,
        most_recent_activity: comment.last_reply_at || comment.created_at,
        content: comment.content || '',
        author_id: comment.author_id,
        author_name: comment.author_name,
        author_avatar: comment.author_avatar,
        image_urls: comment.image_urls ? JSON.parse(comment.image_urls) : [],
        has_vimeo_content: comment.has_vimeo_content || false,
        vimeo_url: comment.vimeo_url || '',
        journey_id: comment.journey_id,
        journey_name: comment.journey_name,
        series_id: comment.series_id,
        likes_count: comment.likes_count || 0,
        replies_count: comment.replies_count || 0,
        is_liked: comment.is_liked || false,
        likers: comment.likers ? comment.likers.split(',').filter(Boolean) : [],
        replies: []
      })
    }
  })

  return Array.from(itemMap.values())
}

/**
 * Find the key for an item by its comment ID
 */
function findItemKey(itemMap, commentId) {
  for (const [key, item] of itemMap) {
    if (item.id === commentId) return key
    // Check in replies
    if (item.replies && item.replies.some(r => r.id === commentId)) {
      return key
    }
  }
  return null
}