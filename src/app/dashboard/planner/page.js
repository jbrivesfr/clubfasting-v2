'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BackLink from '@/components/BackLink'

// Meal type from hour
const MEAL_TYPE_FROM_HOUR = (h) => {
  if (h >= 5 && h <= 10) return { name: 'Petit-déjeuner', icon: '🍳' }
  if (h >= 11 && h <= 14) return { name: 'Déjeuner', icon: '🥗' }
  return { name: 'Dîner', icon: '🍲' }
}

function DraggableTime({ hour, onDragEnd, disabled }) {
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const currentHour = useRef(hour)

  useEffect(() => { currentHour.current = hour }, [hour])

  const handleDown = (clientX) => {
    if (disabled) return
    setDragging(true)
    startX.current = clientX
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    if (!dragging) return
    const threshold = 30

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const delta = clientX - startX.current
      const steps = Math.round(delta / threshold)
      let newHour = hour + steps
      newHour = Math.max(0, Math.min(23, newHour))
      if (newHour !== currentHour.current) {
        startX.current = clientX
        onDragEnd(newHour, false)
      }
    }

    const handleUp = (e) => {
      setDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
      const delta = clientX - startX.current
      const steps = Math.round(delta / threshold)
      let newHour = Math.max(0, Math.min(23, hour + steps))
      if (newHour !== hour) onDragEnd(newHour, true)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleMove, { passive: true })
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [dragging, hour, onDragEnd])

  const meal = MEAL_TYPE_FROM_HOUR(hour)

  return (
    <span
      onMouseDown={(e) => handleDown(e.clientX)}
      onTouchStart={(e) => handleDown(e.touches[0].clientX)}
      className={`inline-flex items-center gap-2 cursor-grab active:cursor-ew-resize select-none transition-all ${
        dragging ? 'scale-110 opacity-100' : 'hover:opacity-80'
      }`}
      title={`${meal.name} · glisser pour ajuster`}
    >
      <span className="text-2xl">{meal.icon}</span>
      <span className={`${dragging ? 'text-orange-300' : ''}`}>{hour}h</span>
    </span>
  )
}

const QUESTIONS = [
  {
    step: 1,
    title: 'Étape 1 : Votre repas incontournable',
    question: 'Quel repas ne voudriez-vous manquer pour rien au monde ?',
    key: 'favoriteMeal',
    options: [
      { value: 'petit-dejeuner', label: 'Le petit-déjeuner 🍳' },
      { value: 'dejeuner', label: 'Le déjeuner 🥗' },
      { value: 'diner', label: 'Le dîner 🍝' },
    ],
  },
  {
    step: 2,
    title: 'Étape 2 : Votre rythme de vie',
    question: 'Quels sont vos horaires habituels ?',
    key: 'lifeRhythm',
  },
  {
    step: 3,
    title: 'Étape 3 : Votre allié pendant le jeûne',
    question: 'Que recherchez-vous le plus dans une boisson ?',
    key: 'drinkHabit',
    options: [
      { value: 'boost', label: 'Un coup de fouet (café) ☕' },
      { value: 'refreshing', label: 'Rafraîchissant 🧊' },
      { value: 'soothing', label: 'Apaisant (tisane) 🍵' },
      { value: 'simple', label: "Juste de l'eau 💧" },
    ],
  },
]

const DRINK_LABELS = {
  boost: 'Café / Thé ☕',
  refreshing: 'Boisson fraîche 🧊',
  soothing: 'Tisane 🍵',
  simple: 'Eau 💧',
}

const MEAL_LABELS = {
  'Petit-déjeuner': '🍳 Petit-déj',
  'Déjeuner': '🥗 Déjeuner',
  'Dîner': '🍝 Dîner',
}

function generateMealPlan(answers) {
  const { favoriteMeal, lifeRhythm, drinkHabit } = answers
  const wakeUpTime = lifeRhythm?.wakeUpTime ?? 7
  const bedTime = lifeRhythm?.bedTime ?? 22
  const meals = []

  if (favoriteMeal === 'petit-dejeuner') {
    meals.push({ id: 1, name: 'Petit-déjeuner', time: Math.min(wakeUpTime + 1, 11) })
    meals.push({ id: 2, name: 'Déjeuner', time: Math.min(wakeUpTime + 6, 14) })
  } else if (favoriteMeal === 'dejeuner') {
    meals.push({ id: 1, name: 'Déjeuner', time: 12 })
    meals.push({ id: 2, name: 'Dîner', time: Math.min(bedTime - 2, 20) })
  } else {
    meals.push({ id: 1, name: 'Déjeuner', time: Math.min(wakeUpTime + 5, 13) })
    meals.push({ id: 2, name: 'Dîner', time: Math.min(bedTime - 2, 20) })
  }

  return { meals, drink: drinkHabit, wake_up_time: wakeUpTime, bed_time: bedTime }
}

function LifeRhythmStep({ onComplete }) {
  const [wakeUpTime, setWakeUpTime] = useState(7)
  const [bedTime, setBedTime] = useState(23)
  const [workHours, setWorkHours] = useState('matin')

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <label className="text-gray-700 font-medium">Je me lève vers</label>
        <select value={wakeUpTime} onChange={(e) => setWakeUpTime(parseInt(e.target.value))}
          className="w-full max-w-xs px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
          {Array.from({ length: 24 }, (_, i) => i).map(h => (
            <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-center gap-3">
        <label className="text-gray-700 font-medium">Je me couche vers</label>
        <select value={bedTime} onChange={(e) => setBedTime(parseInt(e.target.value))}
          className="w-full max-w-xs px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
          {Array.from({ length: 24 }, (_, i) => i).map(h => (
            <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-gray-700 text-center mb-3 font-medium">Je travaille principalement...</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'matin', label: 'Le matin' },
            { value: 'apres-midi', label: "L'après-midi" },
            { value: 'nuit', label: 'La nuit' },
            { value: 'journee', label: 'Toute la journée' },
          ].map(w => (
            <button key={w.value} onClick={() => setWorkHours(w.value)}
              className={`p-3 rounded-xl transition-colors text-sm font-medium ${
                workHours === w.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
              {w.label}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => onComplete({ wakeUpTime, bedTime, workHours })}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors">
        Suivant
      </button>
    </div>
  )
}

export default function PlannerPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [routine, setRoutine] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Drag-to-adjust state
  const [draftStart, setDraftStart] = useState(null)
  const [draftEnd, setDraftEnd] = useState(null)

  useEffect(() => {
    if (routine?.meals?.length >= 2) {
      setDraftStart(routine.meals[0].time)
      setDraftEnd(routine.meals[routine.meals.length - 1].time)
    }
  }, [routine])

  const saveRoutine = async (newStart, newEnd) => {
    setSaving(true)
    const startMeal = MEAL_TYPE_FROM_HOUR(newStart)
    const endMeal = MEAL_TYPE_FROM_HOUR(newEnd)
    const meals = [
      { id: 1, name: startMeal.name, time: newStart },
      { id: 2, name: endMeal.name, time: newEnd },
    ]
    await fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meals,
        drink: routine?.drink || null,
        wake_up_time: routine?.wake_up_time ?? null,
        bed_time: routine?.bed_time ?? null,
      }),
    })
    setSaving(false)
  }

  const handleDragEnd = (isStart) => async (newHour, shouldSave) => {
    if (isStart) {
      const clamped = Math.min(newHour, (draftEnd ?? 18) - 1)
      setDraftStart(Math.max(0, clamped))
      if (shouldSave && clamped >= 0 && clamped < (draftEnd ?? 18)) {
        await saveRoutine(clamped, draftEnd ?? 18)
      }
    } else {
      const clamped = Math.max(newHour, (draftStart ?? 8) + 1)
      setDraftEnd(Math.min(23, clamped))
      if (shouldSave && clamped <= 23 && clamped > (draftStart ?? 8)) {
        await saveRoutine((draftStart ?? 8), clamped)
      }
    }
  }

  useEffect(() => {
    // Load routine via API route (supports both cookie & Supabase auth)
    fetch('/api/planner')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setRoutine(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleAnswer = (key, value) => {
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      completePlanner(newAnswers)
    }
  }

  const completePlanner = async (finalAnswers) => {
    setSaving(true)
    const plan = generateMealPlan(finalAnswers)
    const res = await fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meals: plan.meals,
        drink: plan.drink,
        wake_up_time: plan.wake_up_time,
        bed_time: plan.bed_time,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.success) {
        setStep(QUESTIONS.length)
      }
    } else {
      console.error('Planner save failed:', await res.text())
    }
    setSaving(false)
  }

  const reset = async () => {
    await fetch('/api/planner', { method: 'DELETE' })
    setRoutine(null)
    setStep(0)
    setAnswers({})
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  const currentQ = QUESTIONS[step]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <BackLink className="text-sm text-gray-500 hover:text-gray-900 font-medium">← Dashboard</BackLink>
          <span className="text-sm text-gray-400">Fenêtre de jeûne</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {routine ? (
          <section className="space-y-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h1 className="text-2xl font-bold text-gray-900">Votre fenêtre de jeûne</h1>
              {routine.meals?.length >= 2 && draftStart != null && draftEnd != null && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="text-4xl font-black text-gray-900">
                    <DraggableTime hour={draftStart} onDragEnd={handleDragEnd(true)} disabled={saving} />
                  </span>
                  <span className="text-gray-300 text-3xl">→</span>
                  <span className="text-4xl font-black text-gray-900">
                    <DraggableTime hour={draftEnd} onDragEnd={handleDragEnd(false)} disabled={saving} />
                  </span>
                </div>
              )}
              {saving && <p className="text-xs text-orange-500 mt-1 animate-pulse">Enregistrement...</p>}
              <p className="text-gray-500 mt-2">
                Fenêtre de repas : {draftStart != null && draftEnd != null ? draftEnd - draftStart : 6}h
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="relative h-16 bg-gray-100 rounded-xl overflow-hidden">
                {draftStart != null && draftEnd != null && (
                  <div className="absolute top-0 bottom-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold"
                    style={{
                      left: `${(draftStart / 24) * 100}%`,
                      width: `${((draftEnd - draftStart) / 24) * 100}%`,
                    }}>
                    Repas
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                {[0, 6, 12, 18, 24].map(h => <span key={h}>{h}h</span>)}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{routine.wake_up_time}h</div>
                <div className="text-xs text-gray-500 mt-1">⏰ Réveil</div>
              </div>
              {routine.meals?.map((m, i) => (
                <div key={i} className="bg-white border border-2 border-orange-300 rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl mb-1">{MEAL_TYPE_FROM_HOUR(draftStart != null && i === 0 ? draftStart : draftEnd != null && i === routine.meals.length - 1 ? draftEnd : m.time).icon}</div>
                  <div className="font-semibold text-gray-900">
                    {draftStart != null && i === 0 ? draftStart : draftEnd != null && i === routine.meals.length - 1 ? draftEnd : m.time}h
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {MEAL_TYPE_FROM_HOUR(i === 0 ? (draftStart ?? m.time) : (draftEnd ?? m.time)).name}
                  </div>
                </div>
              ))}
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{routine.bed_time}h</div>
                <div className="text-xs text-gray-500 mt-1">🌙 Coucher</div>
              </div>
            </div>

            {routine.drink && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <span className="text-xl">🥤</span>
                <div>
                  <div className="font-semibold text-gray-900">{DRINK_LABELS[routine.drink] || routine.drink}</div>
                  <div className="text-sm text-gray-500">Votre boisson pendant le jeûne</div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={reset}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
                Modifier
              </button>
              <BackLink
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-center">
                Retour au dashboard
              </BackLink>
            </div>
          </section>
        ) : saving ? (
          <div className="text-center py-10">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-500">Création de votre fenêtre...</p>
          </div>
        ) : (
          <section className="space-y-6">
            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-orange-500' : 'bg-gray-200'}`} />
              ))}
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{currentQ.title}</h2>
              <p className="text-gray-500">{currentQ.question}</p>
            </div>

            {currentQ.key === 'lifeRhythm' ? (
              <LifeRhythmStep onComplete={(data) => handleAnswer('lifeRhythm', data)} />
            ) : (
              <div className="space-y-3">
                {currentQ.options?.map(opt => (
                  <button key={opt.value} onClick={() => handleAnswer(currentQ.key, opt.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-orange-300 hover:shadow-sm transition-all shadow-sm">
                    <span className="text-lg text-gray-700">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
