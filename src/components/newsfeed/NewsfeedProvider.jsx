'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

const NewsfeedContext = createContext(null)

export function NewsfeedProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [series, setSeries] = useState([])
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJourneyId, setSelectedJourneyId] = useState(null)

  const supabase = createClient()

  // Fetch user and related data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setUser(null)
          setUserProfile(null)
          setSeries([])
          setJourneys([])
          setLoading(false)
          return
        }

        setUser(session.user)

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()

        setUserProfile(profile)

        // Fetch user's series
        const { data: seriesData } = await supabase
          .from('series')
          .select('*')
          .eq('user_id', session.user.id)
          .order('name', { ascending: true })

        setSeries(seriesData || [])

        // Fetch user's journeys (only is_space=true, from series table)
        const { data: journeysData } = await supabase
          .from('series')
          .select('id, title, code')
          .eq('is_space', true)
          .order('order_index', { ascending: true })

        setJourneys(journeysData || [])
      } catch (err) {
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  // Add a new comment to the feed
  const addComment = useCallback(async (comment) => {
    // This will be handled by the refresh mechanism
  }, [])

  // Update a comment
  const updateComment = useCallback(async (commentId, updates) => {
    // This will be handled by the refresh mechanism
  }, [])

  // Delete a comment
  const deleteComment = useCallback(async (commentId) => {
    // This will be handled by the refresh mechanism
  }, [])

  const value = {
    user,
    userProfile,
    series,
    journeys,
    loading,
    selectedJourneyId,
    setSelectedJourneyId,
    addComment,
    updateComment,
    deleteComment
  }

  return (
    <NewsfeedContext.Provider value={value}>
      {children}
    </NewsfeedContext.Provider>
  )
}

export function useNewsfeedContext() {
  const context = useContext(NewsfeedContext)
  if (!context) {
    throw new Error('useNewsfeedContext must be used within a NewsfeedProvider')
  }
  return context
}