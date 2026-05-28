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
        setFoodItems(data)
        const cats = [...new Set(data.map(f => f.category))]
        setCategories(cats)
        setActiveCategory(cats[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const selectFood = useCallback((food) => {
    setSelectedFood(food)
    setStackedFoods(prev => [...prev, food].slice(-8))
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
          data: food.glucose_impact || Array(181).fill(80),
          borderColor: ['#f97316', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899', '#eab308', '#ef4444', '#6366f1'][idx % 8],
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
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-t-orange-500 border-zinc-700 rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold font-display">Simulateur de glycémie</h1>
            <p className="text-xs text-zinc-500">Visualise l&apos;impact des aliments sur ta glycémie</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Chart */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Selected food info */}
        {selectedFood && (
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-2">
            <span className="text-2xl">{selectedFood.icon}</span>
            <div>
              <p className="font-medium text-sm">{selectedFood.name}</p>
              <p className="text-xs text-zinc-400">
                IG: {selectedFood.glycemic_index || 'N/A'} • Pic: {selectedFood.peak_time ? `${selectedFood.peak_time} min` : 'N/A'}
              </p>
            </div>
            {stackedFoods.length > 0 && (
              <button onClick={clearStack} className="ml-auto text-xs text-zinc-500 hover:text-red-400 transition-colors">
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
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
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
                    : 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60'
                }`}
              >
                <span className="text-3xl">{food.icon}</span>
                <span className="text-xs text-zinc-300 text-center leading-tight">{food.name}</span>
                {food.glycemic_index && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    food.glycemic_index > 70 ? 'bg-red-500/20 text-red-400' :
                    food.glycemic_index > 55 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    IG {food.glycemic_index}
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
