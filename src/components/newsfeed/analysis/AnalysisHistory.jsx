'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import ReactMarkdown from 'react-markdown'

export default function AnalysisHistory({ userId, type = 'all', onSelect }) {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    let query = supabase
      .from('user_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (type !== 'all') {
      query = query.eq('type', type)
    }

    query.then(({ data, error }) => {
      if (!error && data) setAnalyses(data)
      setLoading(false)
    })
  }, [userId, type])

  if (loading) {
    return <div className="flex justify-center py-4"><div className="w-4 h-4 border-2 border-t-emerald-500 border-zinc-700 rounded-full animate-spin" /></div>
  }

  if (analyses.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">Historique</h3>
      {analyses.map(a => {
        const score = a.analysis?.score
        return (
          <button
            key={a.id}
            onClick={() => { setSelected(a); onSelect?.(a) }}
            className="w-full flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:bg-zinc-800/40 transition-colors text-left"
          >
            {a.image_url ? (
              <img src={a.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-lg flex-shrink-0">
                {a.type === 'meal' ? '🍽️' : '🛒'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 truncate">
                {a.type === 'meal' ? 'Analyse de repas' : 'Analyse de caddie'}
              </p>
              <p className="text-xs text-zinc-500">
                {new Date(a.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            {score && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                score >= 8 ? 'bg-emerald-500/20 text-emerald-400' :
                score >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {score}/10
              </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-zinc-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )
      })}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelected(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Analyse précédente</h3>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {selected.image_url && (
              <img src={selected.image_url} alt="" className="w-full rounded-xl max-h-64 object-cover" />
            )}
            <p className="text-xs text-zinc-500">
              {new Date(selected.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {selected.analysis?.score && (
              <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${
                selected.analysis.score >= 8 ? 'bg-emerald-500/20 text-emerald-400' :
                selected.analysis.score >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                Note : {selected.analysis.score}/10
              </span>
            )}
            <div className="prose prose-sm prose-invert max-w-none [&_strong]:text-zinc-200">
              <ReactMarkdown>{selected.analysis?.analysis || 'Pas de détail disponible'}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
