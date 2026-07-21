'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

// No macro target saved yet: fall back to the "strict" keto default (20g net
// carbs/day) so the journal is useful before the user ever sets a target.
const DEFAULT_TARGET = { net_carbs_g: 20, protein_g: null, fat_g: null, calories: null, mode: 'strict (par défaut)' }

function startOfTodayISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function num(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function ProgressBar({ label, current, target, unit, color }) {
  const pct = target ? Math.min(100, Math.round((current / target) * 100)) : null
  const over = target && current > target
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-700 dark:text-zinc-300">{label}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {current}{unit} {target ? <span className="text-gray-500 dark:text-zinc-500 font-normal">/ {target}{unit}</span> : null}
        </span>
      </div>
      {target ? (
        <div className="w-full h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${over ? 'from-red-500 to-rose-600' : color} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}

export default function JournalPage() {
  const [userId, setUserId] = useState(null)
  const [target, setTarget] = useState(null)
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ net_carbs_g: 20, protein_g: '', fat_g: '', calories: '' })
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error

  const load = useCallback(async (uid) => {
    setLoading(true)
    const supabase = createClient()

    const [targetRes, mealsRes] = await Promise.all([
      fetch('/api/macro-target').then(r => (r.ok ? r.json() : null)).catch(() => null),
      supabase
        .from('user_analyses')
        .select('*')
        .eq('user_id', uid)
        .eq('type', 'meal')
        .gte('created_at', startOfTodayISO())
        .order('created_at', { ascending: true }),
    ])

    const t = targetRes || DEFAULT_TARGET
    setTarget(t)
    setForm({
      net_carbs_g: t.net_carbs_g ?? 20,
      protein_g: t.protein_g ?? '',
      fat_g: t.fat_g ?? '',
      calories: t.calories ?? '',
    })
    setMeals(mealsRes?.data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id)
        load(data.user.id)
      } else {
        setLoading(false)
      }
    })
  }, [load])

  const handleSaveTarget = async () => {
    setSaveState('saving')
    try {
      const res = await fetch('/api/macro-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          net_carbs_g: num(form.net_carbs_g) || 20,
          protein_g: form.protein_g === '' ? null : num(form.protein_g),
          fat_g: form.fat_g === '' ? null : num(form.fat_g),
          calories: form.calories === '' ? null : num(form.calories),
          mode: 'custom',
        }),
      })
      if (!res.ok) throw new Error()
      setSaveState('saved')
      setEditing(false)
      if (userId) load(userId)
    } catch {
      setSaveState('error')
    }
  }

  const totals = meals.reduce((acc, m) => {
    const a = m.analysis || {}
    acc.carbs += num(a.carbs)
    acc.protein += num(a.protein)
    acc.fat += num(a.fat)
    acc.calories += num(a.calories)
    return acc
  }, { carbs: 0, protein: 0, fat: 0, calories: 0 })

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 dark:bg-zinc-950 dark:text-white">
      <div className="border-b border-[#e2d9c3] dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold font-display">Journal du jour</h1>
            <p className="text-xs text-gray-500 dark:text-zinc-500">Ton total de glucides nets cumulé aujourd&apos;hui, à partir de tes photos de repas</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-t-orange-500 border-gray-200 dark:border-zinc-700 rounded-full animate-spin" />
          </div>
        ) : !userId ? (
          <div className="text-center py-12 text-gray-500 dark:text-zinc-500 text-sm">Connecte-toi pour voir ton journal du jour.</div>
        ) : (
          <>
            {target?.mode === 'strict (par défaut)' && !editing && (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
                <span>Objectif par défaut (20g glucides nets, mode strict) — pas encore personnalisé.</span>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <button onClick={() => setEditing(true)} className="underline font-medium">Modifier vite</button>
                  <Link href="/dashboard/macros" className="underline font-medium">Calculer précisément</Link>
                </div>
              </div>
            )}

            {/* Progress card */}
            <div className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Aujourd&apos;hui</h2>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="text-xs text-gray-500 hover:text-gray-800 dark:text-zinc-500 dark:hover:text-zinc-300 underline">
                    Modifier l&apos;objectif
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  {[
                    { key: 'net_carbs_g', label: 'Glucides nets (g)' },
                    { key: 'protein_g', label: 'Protéines (g, optionnel)' },
                    { key: 'fat_g', label: 'Lipides (g, optionnel)' },
                    { key: 'calories', label: 'Calories (optionnel)' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-gray-500 dark:text-zinc-500 mb-1.5 font-medium">{f.label}</label>
                      <input
                        type="number"
                        value={form[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveTarget}
                      disabled={saveState === 'saving'}
                      className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                      {saveState === 'saving' ? 'Enregistrement...' : saveState === 'error' ? '❌ Erreur, réessaie' : 'Enregistrer'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400 rounded-xl transition-colors text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <ProgressBar label="Glucides nets" current={totals.carbs} target={target?.net_carbs_g} unit="g" color="from-emerald-500 to-teal-500" />
                  <ProgressBar label="Protéines" current={totals.protein} target={target?.protein_g} unit="g" color="from-sky-500 to-cyan-500" />
                  <ProgressBar label="Lipides" current={totals.fat} target={target?.fat_g} unit="g" color="from-orange-500 to-red-500" />
                  <ProgressBar label="Calories" current={totals.calories} target={target?.calories} unit=" kcal" color="from-zinc-400 to-zinc-500" />
                </>
              )}
            </div>

            <Link
              href="/dashboard/meal-analyzer"
              className="block w-full text-center py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl shadow-lg transition-colors"
            >
              + Ajouter un repas (photo)
            </Link>

            {/* Today's meals list */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                Repas loggés aujourd&apos;hui ({meals.length})
              </h3>
              {meals.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-zinc-600 py-4 text-center">
                  Aucun repas encore aujourd&apos;hui. Prends une photo pour commencer.
                </p>
              ) : (
                meals.map(m => {
                  const a = m.analysis || {}
                  return (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900/40 border border-[#e2d9c3] dark:border-zinc-800 rounded-xl">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-lg flex-shrink-0 relative overflow-hidden">
                        {m.image_url && (
                          <img src={m.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                        )}
                        <span className="relative z-10">🍽️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-zinc-500">
                          {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-zinc-400">
                          {num(a.carbs)}g glucides · {num(a.calories)} kcal
                        </p>
                      </div>
                      {a.score && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          a.score >= 8 ? 'bg-emerald-500/20 text-emerald-400' :
                          a.score >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {a.score}/10
                        </span>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
