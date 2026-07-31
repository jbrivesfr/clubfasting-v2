'use client'

import { useState } from 'react'
import { useNewsfeed } from '@/hooks/useNewsfeed'
import { useNewsfeedContext } from './NewsfeedProvider'
import { NewsfeedCard } from './NewsfeedCard'
import { ThreadModal } from './ThreadModal'
import { EmptyState } from './EmptyState'

export function NewsfeedFeed() {
  const { user, selectedJourneyId } = useNewsfeedContext()
  const { items, loading, error, refresh } = useNewsfeed(user?.id, selectedJourneyId)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleOpenThread = (item) => {
    setSelectedItem(item)
  }

  const handleCloseThread = () => {
    setSelectedItem(null)
    // Refresh to get any new replies
    refresh()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className="rounded-2xl bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-white/[0.06] p-5 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-zinc-800" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-zinc-800" />
                  <div className="h-3 w-16 rounded bg-gray-200 dark:bg-zinc-800" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-zinc-800" />
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
            <div className="mt-4 h-20 rounded-xl bg-gray-100 dark:bg-zinc-800/50" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-white/[0.06] p-8 text-center">
        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-2xl mb-4">
            ⚠️
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-1">Erreur de chargement</p>
          <p className="text-sm text-gray-500 dark:text-zinc-500 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-5 py-2 rounded-full bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12] text-sm font-medium text-gray-700 dark:text-white transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="animate-fade-in">
            <NewsfeedCard
              item={item}
              onOpenThread={handleOpenThread}
              userId={user?.id}
            />
          </div>
        ))}
      </div>

      {/* Thread modal */}
      {selectedItem && (
        <ThreadModal
          item={selectedItem}
          onClose={handleCloseThread}
          userId={user?.id}
        />
      )}
    </>
  )
}