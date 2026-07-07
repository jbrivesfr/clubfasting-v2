'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import Link from 'next/link'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const TIME_LABELS = Array.from({ length: 181 }, (_, i) => `${i * 5} min`)

// Derive carbs per serving from GI + GL: GL = (GI × carbs) / 100 → carbs = (GL × 100) / GI
function getCarbs(gi, gl) {
  if (!gi || !gl || gi <= 0) return 0
  return Math.round((gl * 100) / gi)
}

// Physiology-based glucose curve model:
//   - GI drives peak HEIGHT (how fast glucose enters blood)
//   - Carbs drive peak WIDTH (how long body takes to clear glucose)
//   - Peak timing delayed for lower GI (slower absorption)
function calculateGlucoseCurve(gi, carbs) {
  const baseline = Array(181).fill(80)
  const c = Math.min(carbs || 0, 75)  // cap at 75g for sanity

  // Peak time: inversely proportional to GI (faster entry = earlier peak)
  // GI 100 → ~20min, GI 25 → ~50min
  const peakTime = 20 + ((100 - (gi || 50)) / 70) * 30

  // Peak height: GI is the main driver (rate of entry), carbs add area
  // GI 100 + 60g → ~170, GI 30 + 10g → ~116
  const peakValue = 80 + (gi || 0) * 0.60 + c * 0.45

  // Spread (std dev of the Gaussian): width grows with carbs
  // 10g → spread ~20, 50g → spread ~40
  const spread = 15 + c * 0.50 + ((100 - (gi || 50)) / 80) * 6

  for (let i = 0; i < 181; i++) {
    const timeEffect = Math.exp(-((i - peakTime) ** 2) / (2 * spread ** 2))
    let value = 80 + (peakValue - 80) * timeEffect

    // Post-peak linear decay: faster for high GI (insulin spike → crash)
    // and for high carbs (more insulin response)
    if (i > peakTime) {
      const decay = 0.005 + (gi || 50) / 100 * 0.012 + c * 0.00025
      value -= (i - peakTime) * decay
    }

    baseline[i] = Math.max(80, value)
  }
  return baseline
}

function getCurveColor(gi) {
  if (gi > 60) return '#ef4444'
  if (gi > 50) return '#f97316'
  if (gi > 40) return '#eab308'
  return '#10b981'
}

export default function GlucoseSimulator() {
  const [foodItems, setFoodItems] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedFood, setSelectedFood] = useState(null)
  const [stackedFoods, setStackedFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/fooditems.json')
      .then(r => r.json())
      .then(data => {
        const enriched = data.map(f => ({
          ...f,
          carbs: getCarbs(f.gi, f.gl),
        }))
        setFoodItems(enriched)
        const cats = [...new Set(enriched.map(f => f.category))]
        setCategories(cats)
        setActiveCategory(cats[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const selectFood = useCallback((food) => {
    setStackedFoods(prev => {
      const exists = prev.some(s => s.name === food.name)
      if (exists) {
        const next = prev.filter(s => s.name !== food.name)
        setSelectedFood(next.length > 0 ? next[next.length - 1] : null)
        return next
      }
      setSelectedFood(food)
      return [...prev, food].slice(-8)
    })
  }, [])

  const clearStack = useCallback(() => {
    setStackedFoods([])
    setSelectedFood(null)
  }, [])

  // Build chart data
  const chartData = {
    labels: TIME_LABELS,
    datasets: stackedFoods.length > 0
      ? stackedFoods.map((food, idx) => ({
          label: food.name,
          data: calculateGlucoseCurve(food.gi, food.carbs),
          borderColor: getCurveColor(food.gi),
          backgroundColor: 'transparent',
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 0,
        }))
      : [{
          label: 'Glycémie de base',
          data: Array(181).fill(80),
          borderColor: '#94a3b8',
          backgroundColor: 'rgba(148,163,184,0.1)',
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        }],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    scales: {
      y: {
        min: 70,
        max: 200,
        title: { display: true, text: 'Glucose sanguin (mg/dL)' },
        grid: { color: 'rgba(255,255,255,0.06)' },
        ticks: { color: '#9ca3af' },
      },
      x: {
        title: { display: true, text: 'Temps après ingestion' },
        ticks: {
          color: '#9ca3af',
          callback: (val) => (val % 36 === 0 ? TIME_LABELS[val] : ''),
          maxRotation: 0,
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9ca3af', boxWidth: 12, padding: 16 },
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6ec] text-gray-900 dark:bg-zinc-950 dark:text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-t-orange-500 border-zinc-700 rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 dark:bg-zinc-950 dark:text-white">
      {/* Header */}
      <div className="border-b border-[#e2d9c3] dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold font-display">Simulateur de glycémie</h1>
            <p className="text-xs text-gray-500 dark:text-zinc-500">Visualisez l&apos;impact des aliments sur votre glycémie</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Chart */}
        <div className="bg-white dark:bg-zinc-900/80 border border-[#e2d9c3] dark:border-zinc-800 rounded-xl p-4 h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Selected food info */}
        {selectedFood && (
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-lg px-4 py-2">
            <span className="text-2xl">{selectedFood.icon}</span>
            <div>
              <p className="font-medium text-sm">{selectedFood.name}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                IG: {selectedFood.gi || 'N/A'} · Glucides: {selectedFood.carbs || 'N/A'}g/portion
              </p>
            </div>
            {stackedFoods.length > 0 && (
              <button onClick={clearStack} className="ml-auto text-xs text-gray-500 hover:text-red-400 dark:text-zinc-500 dark:hover:text-red-400 transition-colors">
                Effacer ({stackedFoods.length})
              </button>
            )}
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-white text-gray-700 border border-[#e2d9c3] hover:text-gray-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {foodItems
            .filter(f => f.category === activeCategory)
            .map(food => (
              <button
                key={food.name}
                onClick={() => selectFood(food)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                  stackedFoods.some(s => s.name === food.name)
                    ? 'bg-orange-500/10 border border-orange-500/30'
                    : 'bg-white border border-[#e2d9c3] hover:border-gray-400 hover:bg-gray-50 dark:bg-zinc-900/60 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span className="text-3xl">{food.icon}</span>
                <span className="text-xs text-gray-700 dark:text-zinc-300 text-center leading-tight">{food.name}</span>
                {food.carbs > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    food.gi > 70 ? 'bg-red-500/20 text-red-400' :
                    food.gi > 55 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    IG {food.gi} · {food.carbs}g
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
