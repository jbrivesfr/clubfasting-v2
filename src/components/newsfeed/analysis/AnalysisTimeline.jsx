'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import ReactMarkdown from 'react-markdown'

function ScoreBadge({ score }) {
  const colors = {
    1: 'bg-red-600', 2: 'bg-red-500', 3: 'bg-orange-600', 4: 'bg-orange-500',
    5: 'bg-yellow-500', 6: 'bg-yellow-400', 7: 'bg-lime-500', 8: 'bg-green-500',
    9: 'bg-emerald-500', 10: 'bg-emerald-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-white text-xs font-bold ${colors[score] || 'bg-zinc-500'}`}>
      {score}/10
    </span>
  )
}

function AnalysisCard({ analysis }) {
  const [expanded, setExpanded] = useState(false)
  const score = analysis.analysis?.score

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <span className="text-2xl">{analysis.type === 'meal' ? '🍽️' : '🛒'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 truncate">
            {analysis.type === 'meal' ? 'Analyse de repas' : 'Analyse de caddie'}
          </p>
          <p className="text-xs text-zinc-500">
            {new Date(analysis.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        {score && <ScoreBadge score={score} />}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          className={`w-4 h-4 text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {expanded && analysis.analysis?.analysis && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-3">
          <div className="prose prose-sm prose-invert max-w-none [&_strong]:text-zinc-200">
            <ReactMarkdown>{analysis.analysis.analysis}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AnalysisTimeline({ userId, type = 'all' }) {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    let query = supabase
      .from('user_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (type !== 'all') {
      query = query.eq('type', type)
    }

    query.then(({ data, error }) => {
      if (!error && data) setAnalyses(data)
      setLoading(false)
    })
  }, [userId, type])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-5 h-5 border-2 border-t-orange-500 border-zinc-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">
        <p className="text-3xl mb-2">📋</p>
        <p>Aucune analyse pour le moment</p>
        <p className="text-xs mt-1">Vos analyses de repas apparaîtront ici</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {analyses.map(a => (
        <AnalysisCard key={a.id} analysis={a} />
      ))}
    </div>
  )
}
