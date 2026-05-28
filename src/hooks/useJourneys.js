'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

/**
 * Hook to fetch user journeys and series
 */
export function useJourneys(userId) {
  const [journeys, setJourneys] = useState([])
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const supabase = createClient()

  const fetchJourneysAndSeries = useCallback(async () => {
    if (!userId) {
      setJourneys([])
      setSeries([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch user's journeys (only is_space=true)
      const { data: journeysData, error: journeysError } = await supabase
        .from('user_journey_history')
        .select(`
          id,
          journey_id,
          journey_name,
          is_space,
          started_at,
          completed_at,
          progress
        `)
        .eq('user_id', userId)
        .eq('is_space', true)
        .order('started_at', { ascending: false })

      if (journeysError) throw journeysError

      setJourneys(journeysData || [])

      // Fetch user's series
      const { data: seriesData, error: seriesError } = await supabase
        .from('series')
        .select(`
          id,
          name,
          description,
          image_url,
          journey_id
        `)
        .eq('user_id', userId)
        .order('name', { ascending: true })

      if (seriesError) throw seriesError

      setSeries(seriesData || [])
    } catch (err) {
      console.error('Error fetching journeys:', err)
      setError(err.message || 'Failed to load journeys')
      setJourneys([])
      setSeries([])
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  useEffect(() => {
    fetchJourneysAndSeries()
  }, [fetchJourneysAndSeries])

  const refresh = useCallback(() => {
    fetchJourneysAndSeries()
  }, [fetchJourneysAndSeries])

  return { journeys, series, loading, error, refresh }
}

/**
 * Hook to get journeys for journey tabs (with "All" option)
 */
export function useJourneyTabs(userId) {
  const { journeys, series, loading, error, refresh } = useJourneys(userId)
  
  // Build tabs array: "All" + user's journeys
  const tabs = [
    { id: null, name: 'Tous' },
    ...journeys.map(j => ({
      id: j.journey_id,
      name: j.journey_name
    }))
  ]

  return { tabs, series, loading, error, refresh }
}