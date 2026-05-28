'use client'

import { useState } from 'react'
import { useNewsfeedContext } from './NewsfeedProvider'

export function JourneyTabs() {
  const { journeys, selectedJourneyId, setSelectedJourneyId, loading } = useNewsfeedContext()
  
  const tabs = [
    { id: null, name: 'Tous' },
    ...journeys.map(j => ({
      id: j.id,
      name: j.title
    }))
  ]

  if (loading) {
    return (
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 w-20 rounded-full bg-zinc-800/50 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="relative mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id || 'all'}
            onClick={() => setSelectedJourneyId(tab.id)}
            className={`
              relative flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium
              transition-all duration-200 whitespace-nowrap
              ${selectedJourneyId === tab.id
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80 hover:text-white border border-white/[0.06] hover:border-white/[0.12]'
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>
      
      {/* Gradient fade on edges for scroll indication */}
      <div className="absolute right-0 top-0 bottom-2 w-8 pointer-events-none bg-gradient-to-l from-zinc-950 to-transparent" />
    </div>
  )
}