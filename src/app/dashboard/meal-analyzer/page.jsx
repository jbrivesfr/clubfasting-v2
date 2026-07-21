'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/utils/supabase/client'
import AnalysisHistory from '@/components/newsfeed/analysis/AnalysisHistory'

function ScoreBadge({ score }) {
  const colors = {
    1: 'bg-red-600', 2: 'bg-red-500', 3: 'bg-orange-600', 4: 'bg-orange-500',
    5: 'bg-yellow-500', 6: 'bg-yellow-400', 7: 'bg-lime-500', 8: 'bg-green-500',
    9: 'bg-emerald-500', 10: 'bg-emerald-400',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-bold ${colors[score] || 'bg-zinc-500'}`}>
      {score}/10
    </span>
  )
}

export default function MealAnalyzer() {
  const [image, setImage] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [score, setScore] = useState(null)
  const [macros, setMacros] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [historyKey, setHistoryKey] = useState(0)
  const fileRef = useRef(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [])

  // Compress image before sending
  const compressImage = useCallback((base64) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxW = 800
        const ratio = Math.min(1, maxW / img.width)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressed = canvas.toDataURL('image/jpeg', 0.7)
        resolve(compressed.split(',')[1])
      }
      img.onerror = () => resolve(base64.split(',')[1])
      img.src = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`
    })
  }, [])

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setAnalysis(null)
    setScore(null)
    setMacros(null)
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.onerror = () => setError('Erreur de lecture du fichier')
    reader.readAsDataURL(file)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    try {
      const compressed = await compressImage(image)
      const res = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: compressed, type: 'meal' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
      setAnalysis(data.analysis)
      setScore(data.score)
      setMacros({ calories: data.calories, carbs: data.carbs, protein: data.protein, fat: data.fat })
      setHistoryKey(k => k + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [image, compressImage])

  const reset = useCallback(() => {
    setImage(null)
    setAnalysis(null)
    setScore(null)
    setMacros(null)
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 dark:bg-zinc-950 dark:text-white">
      {/* Header */}
      <div className="border-b border-[#e2d9c3] dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold font-display">Montrez-moi votre assiette</h1>
            <p className="text-xs text-gray-500 dark:text-zinc-500">L&apos;IA analyse votre repas et l&apos;optimise pour votre métabolisme</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {!image ? (
          /* Upload state */
          <div className="text-center space-y-6">
            <div className="text-6xl">🍽️</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-zinc-300 mb-2">Analysez votre repas</h2>
              <p className="text-gray-500 text-sm">
                Prenez une photo de votre assiette et je vous dirai comment l&apos;améliorer pour optimiser votre métabolisme.
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
              Choisir une photo
            </button>
          </div>
        ) : (
          /* Analysis state */
          <div className="space-y-6">
            {/* Image preview */}
            <div className="relative rounded-xl overflow-hidden border border-[#e2d9c3] dark:border-zinc-800">
              <img
                src={image}
                alt="Votre repas"
                className={`w-full object-cover transition-all duration-300 ${analysis ? 'max-h-48' : 'max-h-96'}`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456ZM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423Z" />
                    </svg>
                    Évaluer le repas
                  </>
                )}
              </button>
              <button
                onClick={reset}
                disabled={loading}
                className="px-4 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl transition-colors disabled:opacity-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            {/* Result */}
            {analysis && !loading && (
              <div className="bg-white dark:bg-zinc-900/80 border border-[#e2d9c3] dark:border-zinc-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-emerald-400">Résultat de l&apos;analyse</h3>
                  {score && <ScoreBadge score={score} />}
                </div>
                {macros && (
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Calories', value: macros.calories, unit: 'kcal', color: 'text-orange-400' },
                      { label: 'Glucides', value: macros.carbs, unit: 'g', color: 'text-emerald-400' },
                      { label: 'Protéines', value: macros.protein, unit: 'g', color: 'text-sky-400' },
                      { label: 'Lipides', value: macros.fat, unit: 'g', color: 'text-rose-400' },
                    ].map((m, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-zinc-800/30 rounded-xl p-3 text-center">
                        <p className={`text-xl font-black ${m.color}`}>
                          {m.value !== undefined ? m.value : '?'}<span className="text-sm font-medium ml-0.5">{m.unit}</span>
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-500 mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="prose prose-sm max-w-none dark:prose-invert [&_h1]:text-emerald-400 [&_h2]:text-emerald-400 [&_h3]:text-emerald-400 [&_strong]:text-gray-900 dark:[&_strong]:text-zinc-200">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 dark:text-zinc-600 text-center">
              Cette analyse est fournie à titre informatif uniquement. Pour des conseils personnalisés, consultez un professionnel de la santé.
            </p>
          </div>
        )}

        {/* History - always visible */}
        {userId && (
          <div className="border-t border-[#e2d9c3] dark:border-zinc-800 pt-6">
            <AnalysisHistory key={historyKey} userId={userId} type="meal" />
          </div>
        )}
      </div>
    </div>
  )
}
