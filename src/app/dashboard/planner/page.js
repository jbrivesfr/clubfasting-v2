'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const QUESTIONS = [
  {
    step: 1,
    title: 'Étape 1 : Ton repas incontournable',
    question: 'Quel repas tu ne voudrais manquer pour rien au monde ?',
    key: 'favoriteMeal',
    options: [
      { value: 'petit-dejeuner', label: 'Le petit-déjeuner 🍳' },
      { value: 'dejeuner', label: 'Le déjeuner 🥗' },
      { value: 'diner', label: 'Le dîner 🍝' },
    ],
  },
  {
    step: 2,
    title: 'Étape 2 : Ton rythme de vie',
    question: 'Quels sont tes horaires habituels ?',
    key: 'lifeRhythm',
  },
  {
    step: 3,
    title: 'Étape 3 : Ton allié pendant le jeûne',
    question: 'Que recherches-tu le plus dans une boisson ?',
    key: 'drinkHabit',
    options: [
      { value: 'boost', label: 'Un coup de fouet (café) ☕' },
      { value: 'refreshing', label: 'Rafraîchissant 🧊' },
      { value: 'soothing', label: 'Apaisant (tisane) 🍵' },
      { value: 'simple', label: 'Juste de l\'eau 💧' },
    ],
  },
]

const DRINK_LABELS = {
  'boost': 'Café / Thé ☕',
  'refreshing': 'Boisson fraîche 🧊',
  'soothing': 'Tisane 🍵',
  'simple': 'Eau 💧',
}

const MEAL_LABELS = {
  'Petit-déjeuner': '🍳 Petit-déj',
  'Déjeuner': '🥗 Déjeuner',
  'Dîner': '🍝 Dîner',
}

function generateMealPlan(answers) {
  const { favoriteMeal, wakeUpTime, bedTime, workHours, drinkHabit } = answers
  const meals = []

  // Generate 2 meals based on favorite
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
      <div className="flex flex-col items-center gap-4">
        <label className="text-gray-300">Je me lève vers</label>
        <select value={wakeUpTime} onChange={(e) => setWakeUpTime(parseInt(e.target.value))}
          className="w-full max-w-xs px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-500">
          {Array.from({ length: 24 }, (_, i) => i).map(h => (
            <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-center gap-4">
        <label className="text-gray-300">Je me couche vers</label>
        <select value={bedTime} onChange={(e) => setBedTime(parseInt(e.target.value))}
          className="w-full max-w-xs px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-500">
          {Array.from({ length: 24 }, (_, i) => i).map(h => (
            <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-gray-300 text-center mb-3">Je travaille principalement...</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'matin', label: 'Le matin' },
            { value: 'apres-midi', label: "L'après-midi" },
            { value: 'nuit', label: 'La nuit' },
            { value: 'journee', label: 'Toute la journée' },
          ].map(w => (
            <button key={w.value} onClick={() => setWorkHours(w.value)}
              className={`p-3 rounded-xl transition-colors text-sm ${
                workHours === w.value ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
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
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [routine, setRoutine] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      
      // Check existing routine
      const { data } = await supabase.from('routines').select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false }).limit(1).maybeSingle()
      if (data) setRoutine(data)
      setLoading(false)
    })
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
    const { error } = await supabase.from('routines').upsert({
      user_id: user.id,
      meals: plan.meals,
      drink: plan.drink,
      wake_up_time: plan.wake_up_time,
      bed_time: plan.bed_time,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    if (!error) {
      const { data } = await supabase.from('routines').select('*')
        .eq('user_id', user.id).single()
      setRoutine(data)
      setStep(QUESTIONS.length) // Show results
    }
    setSaving(false)
  }

  const reset = async () => {
    await supabase.from('routines').delete().eq('user_id', user.id)
    setRoutine(null)
    setStep(0)
    setAnswers({})
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="animate-spin text-4xl">⏳</div>
    </div>
  }

  const currentQ = QUESTIONS[step]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-200">← Dashboard</Link>
          <span className="text-sm text-gray-500">Fenêtre de jeûne</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {routine ? (
          // Results view
          <section className="space-y-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h1 className="text-2xl font-bold">Ta fenêtre de jeûne</h1>
              {routine.meals?.length >= 2 && (
                <p className="text-3xl font-black text-orange-400 mt-4">
                  {routine.meals[0].time}h - {routine.meals[routine.meals.length - 1].time}h
                </p>
              )}
              <p className="text-gray-400 mt-1">
                Fenêtre de repas : {routine.meals?.length >= 2 ? routine.meals[routine.meals.length - 1].time - routine.meals[0].time : 6}h
              </p>
            </div>

            {/* Timeline visualization */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="relative h-16 bg-gray-800 rounded-xl overflow-hidden">
                {routine.meals?.length >= 2 && (
                  <div className="absolute top-0 bottom-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold"
                    style={{
                      left: `${(routine.meals[0].time / 24) * 100}%`,
                      width: `${((routine.meals[routine.meals.length - 1].time - routine.meals[0].time) / 24) * 100}%`,
                    }}>
                    Repas
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {[0, 6, 12, 18, 24].map(h => <span key={h}>{h}h</span>)}
              </div>
            </div>

            {/* Meal details */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{routine.wake_up_time}h</div>
                <div className="text-xs text-gray-500 mt-1">⏰ Réveil</div>
              </div>
              {routine.meals?.map((m, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{MEAL_LABELS[m.name]?.split(' ')[0] || '🍽️'}</div>
                  <div className="font-semibold">{m.time}h</div>
                  <div className="text-xs text-gray-500 mt-1">{MEAL_LABELS[m.name]?.split(' ').slice(1).join(' ') || m.name}</div>
                </div>
              ))}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{routine.bed_time}h</div>
                <div className="text-xs text-gray-500 mt-1">🌙 Coucher</div>
              </div>
            </div>

            {routine.drink && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                <span className="text-xl">🥤</span>
                <div>
                  <div className="font-semibold">{DRINK_LABELS[routine.drink] || routine.drink}</div>
                  <div className="text-sm text-gray-500">Ta boisson pendant le jeûne</div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={reset}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
                Modifier
              </button>
              <Link href="/dashboard"
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-center">
                Retour au dashboard
              </Link>
            </div>
          </section>
        ) : saving ? (
          <div className="text-center py-10">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-400">Création de ta fenêtre...</p>
          </div>
        ) : (
          // Wizard
          <section className="space-y-6">
            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-orange-500' : 'bg-gray-800'}`} />
              ))}
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-2">{currentQ.title}</h2>
              <p className="text-gray-400">{currentQ.question}</p>
            </div>

            {currentQ.key === 'lifeRhythm' ? (
              <LifeRhythmStep onComplete={(data) => handleAnswer('wakeUpTime', data.wakeUpTime) || handleAnswer('bedTime', data.bedTime) || handleAnswer('lifeRhythm', data)} />
            ) : currentQ.key === 'lifeRhythm' ? null : (
              <div className="space-y-3">
                {currentQ.options?.map(opt => (
                  <button key={opt.value} onClick={() => handleAnswer(currentQ.key, opt.value)}
                    className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-left hover:border-orange-500 transition-all group">
                    <span className="text-lg">{opt.label}</span>
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
