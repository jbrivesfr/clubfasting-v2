'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { LikeButton } from './LikeButton'
import { timeAgo, formatJourneyMessageJS, getDefaultAvatarUrl, countAllRepliesRecursive, getReplyAuthors } from './utils'


function AvatarImage({ src, fallback, alt, className, width, height }) {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  useEffect(() => { setImgSrc(src || fallback) }, [src, fallback])
  return (
    <Image
      src={imgSrc}
      alt={alt || 'User'}
      width={width}
      height={height}
      className={className}
      onError={() => { setImgSrc(fallback) }}
    />
  )
}

function PreviewImage({ src, alt, className }) {
  const [error, setError] = useState(false)
  if (error || !src) return null
  return (
    <Image
      src={src}
      alt={alt || ''}
      fill
      sizes="(max-width: 768px) 180px, 180px"
      className={className}
      onError={() => { setError(true) }}
    />
  )
}

function VimeoThumbnail({ vimeoId, className }) {
  const fallback = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80'
  const [imgSrc, setImgSrc] = useState(`https://vimeo.com/api/v2/video/${vimeoId}/thumbnail.gif`)

  return (
    <Image
      src={imgSrc}
      alt=""
      fill
      sizes="(max-width: 768px) 180px, 180px"
      className={className}
      onError={() => { setImgSrc(fallback) }}
    />
  )
}

export function NewsfeedCard({ item, onOpenThread, userId }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  const isAuthor = userId && item.author_id === userId
  const replyAuthors = getReplyAuthors(item)
  const totalReplies = item.replies ? countAllRepliesRecursive(item) : 0

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleCopyLink = () => {
    const url = `${window.location.origin}/dashboard?post=${item.id}`
    navigator.clipboard.writeText(url)
    setShowMenu(false)
  }

  const handleCardClick = () => {
    if (onOpenThread) {
      onOpenThread(item)
    }
  }

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return getDefaultAvatarUrl(item.author_id)
    if (avatarPath.startsWith('http')) return avatarPath
    if (avatarPath.startsWith('/')) return `https://clubfasting.com${avatarPath}`
    return avatarPath
  }

  return (
    <div 
      className={`
        group relative overflow-hidden rounded-2xl 
        bg-white border border-[#e2d9c3] dark:bg-zinc-900/60 dark:border-white/[0.06]
        hover:border-gray-300 dark:hover:border-white/[0.12] hover:-translate-y-1 
        transition-all duration-300 cursor-pointer
        ${item.is_pinned ? 'ring-1 ring-orange-500/30' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Pinned badge */}
      {item.is_pinned && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-wider border border-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            Épinglé
          </span>
        </div>
      )}

      {/* Card header */}
      <div className="relative flex items-start gap-3 p-5 pb-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <AvatarImage
            src={getAvatarUrl(item.author_avatar)}
            fallback={getDefaultAvatarUrl(item.author_id)}
            alt={item.author_name}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
          />
          {item.is_featured && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Author info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {item.author_name || 'Membre ClubFasting'}
            </span>
            <span className="text-gray-400 dark:text-zinc-600 text-xs">·</span>
            <span className="text-gray-500 dark:text-zinc-500 text-xs">
              {timeAgo(item.created_at)}
            </span>
          </div>
          
          {/* Journey tag if available */}
          {item.journey_name && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              <span className="text-xs text-sky-600 dark:text-sky-400/80 font-medium">{item.journey_name}</span>
            </div>
          )}
        </div>

        {/* Menu button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            className="p-1.5 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-[#e2d9c3] dark:border-white/[0.1] rounded-xl shadow-xl overflow-hidden z-50 min-w-[160px] animate-fade-in">
              <button
                onClick={(e) => { e.stopPropagation(); handleCopyLink() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Copier le lien
              </button>
              {isAuthor && (
                <>
                  <div className="border-t border-white/[0.06]" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/[0.05] hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Supprimer
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="px-5 pb-4">
        <div className="feed-comment-body flex gap-4">
          <div 
            className="feed-comment-main-content flex-1 min-w-0 text-gray-900 dark:text-white text-sm leading-relaxed [&_a]:text-orange-500 dark:[&_a]:text-orange-400 [&_a:hover]:text-orange-600 dark:[&_a:hover]:text-orange-300 [&_a]:underline [&_a]:underline-offset-2"
            dangerouslySetInnerHTML={{ __html: formatJourneyMessageJS(item.content) }}
          />
          
          {/* Square image preview on the right */}
          {(item.image_urls && item.image_urls.length > 0) && (
            <div className="feed-comment-image-preview flex-shrink-0 w-[180px] aspect-square relative rounded-xl overflow-hidden">
              <PreviewImage
                src={getImageUrl(item.image_urls[0])}
                className="w-full h-full object-cover"
              />
              {item.image_urls.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white font-medium">+{item.image_urls.length - 1}</span>
              )}
            </div>
          )}
          
          {/* Vimeo thumbnail on the right (only if no image_urls — avoid duplicate thumbnails) */}
          {item.has_vimeo_content && item.vimeo_id && (!item.image_urls || item.image_urls.length === 0) && (
            <div className="feed-comment-image-preview flex-shrink-0 w-[180px] aspect-square relative rounded-xl overflow-hidden">
              <VimeoThumbnail
                vimeoId={item.vimeo_id}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600 ml-0.5">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="relative flex items-center gap-4 px-5 py-4 border-t border-[#e2d9c3] dark:border-white/[0.04]">
        <LikeButton
          commentId={item.id}
          likesCount={item.likes_count}
          isLiked={item.is_liked}
          likers={item.likers || []}
          userId={userId}
        />

        {/* Replies */}
        <button 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/[0.08] text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white transition-all text-xs font-medium"
          onClick={(e) => { e.stopPropagation(); onOpenThread && onOpenThread(item) }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="tabular-nums">{totalReplies}</span>
        </button>

        {/* Reply authors avatars */}
        {replyAuthors.length > 0 && (
          <div className="flex items-center -space-x-2 ml-auto">
            {replyAuthors.map((author, i) => (
              <AvatarImage
                key={author.id || i}
                src={getAvatarUrl(author.avatar)}
                fallback={getDefaultAvatarUrl(author.id)}
                alt={author.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
              />
            ))}
          </div>
        )}

        {/* View more replies indicator */}
        {totalReplies > 0 && (
          <button 
            className="ml-auto text-xs text-gray-500 dark:text-zinc-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1"
            onClick={(e) => { e.stopPropagation(); onOpenThread && onOpenThread(item) }}
          >
            Voir le fil
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// Helper to get image URL from various formats
function getImageUrl(imageData) {
  if (!imageData) return null
  
  // If already a string URL
  if (typeof imageData === 'string') {
    if (imageData.startsWith('http')) return imageData
    if (imageData.startsWith('/')) return `https://clubfasting.com${imageData}`
    return imageData
  }
  
  // If array with original/preview
  if (Array.isArray(imageData) && imageData.length > 0) {
    const first = imageData[0]
    if (typeof first === 'string') return first
    if (first.preview) return first.preview
    if (first.original) return first.original
  }
  
  return null
}

