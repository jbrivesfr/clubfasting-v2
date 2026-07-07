'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useNewsfeedContext } from './NewsfeedProvider'
import { timeAgo, formatJourneyMessageJS, getDefaultAvatarUrl, countAllRepliesRecursive } from './utils'

function extractVimeoId(url) {
  if (!url) return ''
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : ''
}

export function ThreadModal({ item, onClose, userId }) {
  const { userProfile } = useNewsfeedContext()
  const authorName = userProfile?.name || 'Membre ClubFasting'
  const [replies, setReplies] = useState(item.replies || [])
  const [newReply, setNewReply] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [sortOrder, setSortOrder] = useState('default') // 'default' or 'chronological'
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const supabase = createClient()

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    // Focus textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Safe image URL parsing (handles string, array, JSON string)
  const safeImageUrls = (raw) => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : [raw]
      } catch {
        return [raw]
      }
    }
    return []
  }

  const itemImages = safeImageUrls(item.image_urls)

  const getAvatarUrl = (avatarPath, authorId) => {
    if (!avatarPath) return getDefaultAvatarUrl(authorId || item.id)
    if (avatarPath.startsWith('http')) return avatarPath
    if (avatarPath.startsWith('/')) return `https://clubfasting.com${avatarPath}`
    return avatarPath
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newReply.trim() && !imageFile) return

    setSubmitting(true)

    try {
      let imageUrl = null

      // Upload image if provided
      if (imageFile) {
        const fileName = `${userId}-${Date.now()}-${imageFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('newsfeed')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('newsfeed')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

      // Insert reply
      const { data: newComment, error: insertError } = await supabase
        .from('comments')
        .insert({
          content: newReply.trim(),
          author_id: userId,
          author_name: authorName,
          parent_id: item.id,
          image_urls: imageUrl ? JSON.stringify([imageUrl]) : null,
          journey_id: item.journey_id,
          series_id: item.series_id
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Add to replies list with author info
      const newReplyWithAuthor = {
        ...newComment,
        author_name: authorName,
        author_avatar: userProfile?.avatar_url || null
      }

      setReplies(prev => [...prev, newReplyWithAuthor])
      setNewReply('')
      setImageFile(null)
    } catch (err) {
      console.error('Error submitting reply:', err)
      alert('Erreur lors de l\'envoi de la réponse')
    } finally {
      setSubmitting(false)
    }
  }

  const sortedReplies = [...replies].sort((a, b) => {
    if (sortOrder === 'chronological') {
      return new Date(a.created_at) - new Date(b.created_at)
    }
    // Default: newest first
    return new Date(b.created_at) - new Date(a.created_at)
  })

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl border border-[#e2d9c3] dark:border-white/[0.08] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2d9c3] dark:border-white/[0.06] flex-shrink-0">
          <h2 className="font-bold text-gray-900 dark:text-white font-display">Fil de discussion</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content area - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Original post */}
          <div className="p-5 border-b border-[#e2d9c3] dark:border-white/[0.04]">
            <div className="flex items-start gap-3">
              <img
                src={getAvatarUrl(item.author_avatar, item.author_id)}
                alt={item.author_name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#e2d9c3] dark:ring-white/10 flex-shrink-0"
                onError={(e) => { e.target.src = getDefaultAvatarUrl(item.author_id) }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{item.author_name}</span>
                  <span className="text-gray-400 dark:text-zinc-600 text-xs">·</span>
                  <span className="text-gray-500 dark:text-zinc-500 text-xs">{timeAgo(item.created_at)}</span>
                </div>
                <div 
                  className="mt-2 text-gray-900 dark:text-white text-sm leading-relaxed [&_a]:text-orange-500 dark:[&_a]:text-orange-400 [&_a:hover]:text-orange-600 dark:[&_a:hover]:text-orange-300 [&_a]:underline [&_a]:underline-offset-2"
                  dangerouslySetInnerHTML={{ __html: formatJourneyMessageJS(item.content) }}
                />
                
                {/* Images */}
                {itemImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {itemImages.map((url, i) => (
                      <img
                        key={i}
                        src={typeof url === 'string' ? url : (url.preview || url.original || '')}
                        alt=""
                        className="w-full rounded-xl object-cover max-h-64"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ))}
                  </div>
                )}

                {/* Vimeo video embed */}
                {item.vimeo_id && (
                  <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={`https://player.vimeo.com/video/${item.vimeo_id}?autoplay=0&title=0&byline=0&portrait=0`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Replies section */}
          <div className="p-5">
            {/* Sort toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 dark:text-zinc-400">
                {replies.length} {replies.length === 1 ? 'réponse' : 'réponses'}
              </span>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800/50 rounded-lg p-1">
                <button
                  onClick={() => setSortOrder('default')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    sortOrder === 'default' 
                      ? 'bg-gray-200 dark:bg-white/[0.08] text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white'
                  }`}
                >
                  Plus récents
                </button>
                <button
                  onClick={() => setSortOrder('chronological')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    sortOrder === 'chronological' 
                      ? 'bg-gray-200 dark:bg-white/[0.08] text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white'
                  }`}
                >
                  Chronologique
                </button>
              </div>
            </div>

            {/* Replies list */}
            {sortedReplies.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-500 text-sm">
                Pas encore de réponses
              </div>
            ) : (
              <div className="space-y-4">
                {sortedReplies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-3">
                    <img
                      src={getAvatarUrl(reply.author_avatar || reply.author_custom_avatar_url, reply.author_id)}
                      alt={reply.author_name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#e2d9c3] dark:ring-white/5 flex-shrink-0"
                      onError={(e) => { e.target.src = getDefaultAvatarUrl(reply.author_id) }}
                    />
                    <div className="flex-1 min-w-0 bg-gray-100 dark:bg-zinc-800/30 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{reply.author_name}</span>
                        <span className="text-gray-400 dark:text-zinc-600 text-xs">·</span>
                        <span className="text-gray-500 dark:text-zinc-500 text-xs">{timeAgo(reply.created_at)}</span>
                      </div>
                      <div 
                        className="mt-1 text-sm text-gray-700 dark:text-zinc-300 [&_a]:text-orange-500 dark:[&_a]:text-orange-400 [&_a:hover]:text-orange-600 dark:[&_a:hover]:text-orange-300 [&_a]:underline [&_a]:underline-offset-2"
                        dangerouslySetInnerHTML={{ __html: formatJourneyMessageJS(reply.content) }}
                      />
                      {(() => {
                        const replyImages = safeImageUrls(reply.image_urls)
                        return replyImages.length > 0 && (
                          <div className="mt-2">
                            <img
                              src={typeof replyImages[0] === 'string' ? replyImages[0] : (replyImages[0].preview || replyImages[0].original || '')}
                            alt=""
                            className="w-full max-w-[200px] rounded-lg object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </div>
                      )})()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reply form */}
        <div className="flex-shrink-0 p-4 border-t border-[#e2d9c3] dark:border-white/[0.06] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              ref={textareaRef}
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrire une réponse..."
              rows={2}
              className="w-full bg-[#faf6ec] dark:bg-zinc-800/50 border border-[#e2d9c3] dark:border-white/[0.08] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 resize-none focus:outline-none focus:border-orange-500 transition-colors"
            />
            
            {/* Image preview */}
            {imageFile && (
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              {/* Image upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting || (!newReply.trim() && !imageFile)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold hover:from-orange-400 hover:to-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/30"
              >
                {submitting ? 'Envoi...' : 'Répondre'}
              </button>
            </div>

            {/* Hint */}
            <p className="text-[10px] text-zinc-600 text-center">
              Cmd+Enter pour envoyer
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}