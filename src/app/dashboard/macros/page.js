'use client'

import { useState } from 'react'
import Link from 'next/link'

// Keto macro calculator formulas
function calculateBMR(weight, height, age, sex) {
  if (sex === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  }
  return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
}

function calculateTDEE(bmr, activity) {
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }
  return Math.round(bmr * (factors[activity] || 1.2))
}

function calculateMacros(weight, height, age, sex, activity, goal, mode) {
  const bmr = Math.round(calculateBMR(weight, height, age, sex))
  const tdee = calculateTDEE(bmr, activity)

  let calorieAdjustment = 0
  if (goal === 'loss') calorieAdjustment = -500
  else if (goal === 'gain') calorieAdjustment = 300

  const calories = Math.round(tdee + calorieAdjustment)

  // Protein: 1.8g per kg (middle of 1.6-2.2g range)
  const protein = Math.round(weight * 1.8)

  // Carbs based on mode
  let carbs = 0
  if (mode === 'strict') carbs = 20
  else if (mode === 'lazy') carbs = 40
  else if (mode === 'cyclical') carbs = 30 // base, higher on carb days

  // Fat: remaining calories (fat cal = total - protein*4 - carbs*4)
  const fatCal = calories - (protein * 4) - (carbs * 4)
  const fat = Math.round(fatCal / 9)

  return {
    bmr,
    tdee,
    calories,
    protein,
    carbs,
    fat,
    proteinPct: Math.round((protein * 4 / calories) * 100),
    carbsPct: Math.round((carbs * 4 / calories) * 100),
    fatPct: Math.round((fat * 9 / calories) * 100),
  }
}

const ACTIVITY_LABELS = {
  sedentary: 'Sédentaire (peu ou pas d\'exercice)',
  light: 'Léger (1-3j/semaine)',
  moderate: 'Modéré (3-5j/semaine)',
  active: 'Actif (6-7j/semaine)',
  veryActive: 'Très actif (2x/jour)',
}

const GOAL_LABELS = {
  loss: 'Perte de poids',
  maintenance: 'Maintien',
  gain: 'Prise de masse',
}

const MODE_DESCRIPTIONS = {
  strict: 'Max 20g glucides nets/jour. Idéal pour entrer rapidement en cétose.',
  lazy: 'Max 40g glucides nets/jour. Plus flexible, bon pour maintenance.',
  cyclical: '30g base + recharge glucides 1-2j/semaine. Pour sportifs avancés.',
}

export default function MacrosPage() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(35)
  const [sex, setSex] = useState('male')
  const [activity, setActivity] = useState('moderate')
  const [goal, setGoal] = useState('loss')
  const [mode, setMode] = useState('strict')
  const [results, setResults] = useState(null)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error

  const handleCalculate = (e) => {
    e.preventDefault()
    const m = calculateMacros(weight, height, age, sex, activity, goal, mode)
    setResults(m)
    setSaveState('idle')
  }

  const handleSaveTarget = async () => {
    if (!results) return
    setSaveState('saving')
    try {
      const res = await fetch('/api/macro-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calories: results.calories,
          protein_g: results.protein,
          fat_g: results.fat,
          net_carbs_g: results.carbs,
          mode,
        }),
      })
      if (!res.ok) throw new Error()
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

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
            <h1 className="text-lg font-bold font-display">Calculateur de Macros Keto</h1>
            <p className="text-xs text-gray-500 dark:text-zinc-500">Tes macros personnalisées en 30 secondes</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <form onSubmit={handleCalculate} className="space-y-6">
          {/* Body stats */}
          <div className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Tes données</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-zinc-500 mb-1.5 font-medium">Poids (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-zinc-500 mb-1.5 font-medium">Taille (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-zinc-500 mb-1.5 font-medium">Âge</label>
                <input type="number" value={age} onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-zinc-500 mb-1.5 font-medium">Sexe</label>
              <div className="flex gap-2">
                {['male', 'female'].map(s => (
                  <button key={s} type="button" onClick={() => setSex(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      sex === s ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30' : 'bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}>
                    {s === 'male' ? 'Homme' : 'Femme'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity & Goal */}
          <div className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Activité & Objectif</h2>

            <div>
              <label className="block text-xs text-gray-500 dark:text-zinc-500 mb-1.5 font-medium">Niveau d&apos;activité</label>
              <select value={activity} onChange={e => setActivity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 transition-colors">
                {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-zinc-500 mb-1.5 font-medium">Objectif</label>
              <div className="flex gap-2">
                {Object.entries(GOAL_LABELS).map(([k, v]) => (
                  <button key={k} type="button" onClick={() => setGoal(k)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      goal === k ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30' : 'bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keto mode */}
          <div className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Mode Keto</h2>
            <div className="space-y-3">
              {Object.entries(MODE_DESCRIPTIONS).map(([k, desc]) => (
                <button key={k} type="button" onClick={() => setMode(k)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    mode === k ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-gray-50 dark:bg-zinc-800/30 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      mode === k ? 'border-orange-500' : 'border-gray-300 dark:border-zinc-600'
                    }`}>
                      {mode === k && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize text-gray-900 dark:text-white">{k === 'strict' ? 'Strict' : k === 'lazy' ? 'Lazy' : 'Cyclique'}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
            Calculer mes macros
          </button>
        </form>

        {/* Results */}
        {results && (
          <div className="animate-slide-up space-y-6">
            {/* Calories ring */}
            <div className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-1">Calories quotidiennes</p>
              <p className="text-6xl font-black text-gray-900 dark:text-white font-display">{results.calories}</p>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                TDEE: {results.tdee} kcal {goal === 'loss' ? '− 500' : goal === 'gain' ? '+ 300' : ''}
              </p>
            </div>

            {/* Macro distribution */}
            <div className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Répartition Macronutriments</h3>

              {/* Macro bars */}
              {[
                { key: 'fat', label: 'Lipides', value: results.fat, unit: 'g', color: 'from-orange-500 to-red-500', pct: results.fatPct, calPerG: 9 },
                { key: 'protein', label: 'Protéines', value: results.protein, unit: 'g', color: 'from-sky-500 to-cyan-500', pct: results.proteinPct, calPerG: 4 },
                { key: 'carbs', label: 'Glucides nets', value: results.carbs, unit: 'g', color: 'from-emerald-500 to-teal-500', pct: results.carbsPct, calPerG: 4 },
              ].map(m => (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${m.color}`} />
                      <span className="text-sm text-gray-700 dark:text-zinc-300">{m.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{m.value}{m.unit}</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-500">({m.pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-500`}
                      style={{ width: `${m.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-0.5">
                    {m.value * m.calPerG} kcal ({m.pct}%)
                  </p>
                </div>
              ))}
            </div>

            {/* Macro breakdown card */}
            <div className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-4">En résumé</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-orange-500 dark:text-orange-400">{results.fat}g</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Lipides</p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-sky-500 dark:text-sky-400">{results.protein}g</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Protéines</p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-emerald-500 dark:text-emerald-400">{results.carbs}g</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Glucides nets</p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{results.calories}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Kcal</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveTarget}
                disabled={saveState === 'saving'}
                className="w-full mt-4 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {saveState === 'saving' ? 'Enregistrement...' :
                 saveState === 'saved' ? '✅ Objectif enregistré — visible dans le Journal du jour' :
                 saveState === 'error' ? '❌ Erreur, réessaie' :
                 'Enregistrer comme objectif du jour'}
              </button>
            </div>

            {/* Recommendations */}
            <div className="bg-orange-50 dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-red-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3">💡 Recommandations</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 dark:text-orange-400 mt-0.5">•</span>
                  <span>Maintiens tes glucides sous {results.carbs}g nets par jour pour rester en cétose.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 dark:text-orange-400 mt-0.5">•</span>
                  <span>Priorise les protéines ({results.protein}g/j) pour préserver ta masse musculaire.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 dark:text-orange-400 mt-0.5">•</span>
                  <span>Les lipides ({results.fat}g/j) sont ton carburant principal. Ne les réduis pas trop.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 dark:text-orange-400 mt-0.5">•</span>
                  <span>Bois 2-3L d&apos;eau par jour + électrolytes (sodium, potassium, magnésium).</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
