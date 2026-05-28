'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export function LikeButton({ commentId, likesCount, isLiked, likers = [], userId, onToggle }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const tooltipRef = useRef(null)
  const supabase = createClient()

  const handleClick = async (e) => {
    e.stopPropagation()
    
    if (!userId) return

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    try {
      if (isLiked) {
        await supabase.rpc('remove_like', {
          p_user_id: userId,
          p_comment_id: commentId
        })
      } else {
        await supabase.rpc('add_like', {
          p_user_id: userId,
          p_comment_id: commentId
        })
      }
      
      if (onToggle) {
        onToggle(commentId, isLiked)
      }
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  const likersList = likers.length > 0 
    ? likers.slice(0, 5).map(l => typeof l === 'string' ? l : l.name || 'User').filter(Boolean)
    : []

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleClick}
        disabled={!userId}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
          transition-all duration-200
          ${isLiked 
            ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
            : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white'
          }
          ${isAnimating ? 'scale-110' : 'scale-100'}
          ${!userId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onMouseEnter={() => likersList.length > 0 && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Thumbs up SVG */}
        <svg 
          className={`w-4 h-4 transition-transform ${isLiked ? 'fill-current' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={isLiked ? 'currentColor' : 'none'}
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        <span className="text-xs font-semibold tabular-nums">{likesCount || 0}</span>
      </button>

      {/* Tooltip with likers */}
      {showTooltip && likersList.length > 0 && (
        <div 
          ref={tooltipRef}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fade-in"
        >
          <div className="bg-zinc-900 border border-white/[0.1] rounded-xl px-3 py-2 shadow-xl min-w-[120px]">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 font-medium">
              Aiment
            </p>
            <div className="space-y-1">
              {likersList.map((name, i) => (
                <p key={i} className="text-xs text-white font-medium">{name}</p>
              ))}
              {likersList.length >= 5 && (
                <p className="text-[10px] text-zinc-500">et {likers.length - 5} autres</p>
              )}
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-8 border-transparent border-t-zinc-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}