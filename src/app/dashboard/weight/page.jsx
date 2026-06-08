'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
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

export default function WeightTrackerPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [weightData, setWeightData] = useState([])
  const [weightInput, setWeightInput] = useState('')
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [deleteIdx, setDeleteIdx] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (error || !user) { router.push('/login'); return }
      setUser(user)
      setLoading(false)
    })
  }, [])

  const loadWeightData = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('email', user.email)
      .order('date', { ascending: true })
    if (!error && data) setWeightData(data)
  }, [user])

  useEffect(() => { if (user) loadWeightData() }, [user, loadWeightData])

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })

  // Stats
  const stats = (() => {
    if (weightData.length === 0) return null
    const w = weightData.map(e => e.weight)
    const current = w[w.length - 1]
    const start = w[0]
    const diff = current - start
    let weeklyAvg = 0
    if (weightData.length > 1) {
      const first = new Date(weightData[0].date)
      const last = new Date(weightData[weightData.length - 1].date)
      const weeks = Math.max(1, (last - first) / (7 * 86400000))
      weeklyAvg = diff / weeks
    }
    return { current, start, diff, weeklyAvg, min: Math.min(...w), max: Math.max(...w) }
  })()

  const trendEmoji = { down: '📉', up: '📈', stable: '➡️' }
  const trendLabel = { down: 'Perte', up: 'Gain', stable: 'Stable' }
  const trendColor = { down: 'text-emerald-400', up: 'text-red-400', stable: 'text-yellow-400' }

  // Chart data
  const labels = weightData.map(e => formatDate(e.date))
  const values = weightData.map(e => e.weight)

  // 30-day projection
  const projLabels = []
  const projValues = []
  if (weightData.length >= 2) {
    const last = weightData[weightData.length - 1]
    const prev = weightData[weightData.length - 2]
    const daysDiff = Math.max(1, (new Date(last.date) - new Date(prev.date)) / 86400000)
    const dailyRate = (last.weight - prev.weight) / daysDiff
    const lastDate = new Date(last.date)
    for (let i = 1; i <= 30; i++) {
      const d = new Date(lastDate)
      d.setDate(d.getDate() + i)
      projLabels.push(formatDate(d))
      projValues.push(last.weight + dailyRate * i)
    }
  }

  const chartData = {
    labels: [...labels, ...projLabels],
    datasets: [
      {
        label: 'Poids (kg)',
        data: [...values, ...Array(projValues.length).fill(null)],
        borderColor: '#F76F20',
        backgroundColor: 'rgba(247,111,32,0.15)',
        borderWidth: 2.5,
        tension: 0.4,
        pointBackgroundColor: '#F76F20',
        pointBorderColor: '#18181b',
        pointRadius: 4,
        pointHoverRadius: 7,
        fill: true,
      },
      {
        label: 'Projection 30j',
        data: [...Array(values.length).fill(null), ...projValues],
        borderColor: 'rgba(247,111,32,0.35)',
        backgroundColor: 'rgba(247,111,32,0.04)',
        borderWidth: 1.5,
        borderDash: [6, 4],
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#71717a', maxTicksLimit: 10, autoSkip: true },
      },
      y: {
        min: stats ? Math.max(0, stats.min - 2) : undefined,
        max: stats ? stats.max + 2 : undefined,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#71717a', callback: v => v + ' kg' },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { color: '#a1a1aa', usePointStyle: true, padding: 16, boxWidth: 8 },
      },
      tooltip: { callbacks: { label: ctx => ctx.parsed.y.toFixed(1) + ' kg' } },
    },
    onClick: (e, elements, chart) => {
      if (elements.length > 0 && elements[0].datasetIndex === 0) {
        const idx = elements[0].index
        if (idx < weightData.length) setDeleteIdx(idx)
      }
    },
  }

  const handleSave = async () => {
    const weight = parseFloat(weightInput)
    if (isNaN(weight) || weight <= 0) { setMessage({ type: 'error', text: 'Poids invalide.' }); return }
    if (!dateInput) { setMessage({ type: 'error', text: 'Date requise.' }); return }
    if (!user) { setMessage({ type: 'error', text: 'Connectez-vous.' }); return }

    setSaving(true)
    const selectedDate = new Date(dateInput).toISOString().split('T')[0]
    const existing = weightData.find(e => new Date(e.date).toISOString().split('T')[0] === selectedDate)

    const { error } = existing
      ? await supabase.from('weight_entries').update({ weight }).eq('id', existing.id)
      : await supabase.from('weight_entries').insert([{ email: user.email, weight, date: selectedDate }])

    if (error) {
      setMessage({ type: 'error', text: 'Erreur: ' + error.message })
    } else {
      setMessage({ type: 'success', text: existing ? 'Poids mis à jour !' : 'Poids enregistré !' })
      setWeightInput('')
      await loadWeightData()
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 4000)
  }

  const handleDelete = async () => {
    if (deleteIdx === null) return
    const entry = weightData[deleteIdx]
    const { error } = await supabase.from('weight_entries').delete().eq('id', entry.id)
    if (!error) {
      setMessage({ type: 'success', text: 'Entrée supprimée.' })
      setDeleteIdx(null)
      await loadWeightData()
      setTimeout(() => setMessage(null), 4000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  const trend = stats ? (stats.diff < 0 ? 'down' : stats.diff > 0 ? 'up' : 'stable') : null

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] backdrop-blur-xl bg-zinc-950/40 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white font-medium transition-colors">
            ← Dashboard
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="text-lg">⚖️</span>
            <span className="text-sm text-zinc-400">Suivi de poids</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 sm:px-6 py-10 space-y-8">
        {/* Title */}
        <section className="animate-slide-up">
          <p className="text-xs uppercase tracking-[0.25em] text-orange-400/80 font-semibold mb-2">
            Suivi · Poids
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
            Ta courbe de poids
          </h1>
          <p className="text-zinc-400 mt-2 max-w-lg">
            Enregistre ton poids pour visualiser tes progrès quotidiens.
          </p>
        </section>

        {/* Input */}
        <section className="animate-slide-up">
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Poids (kg)</label>
                <input
                  type="number" step="0.1" min="30" max="250"
                  value={weightInput} onChange={e => setWeightInput(e.target.value)}
                  placeholder="Ex: 75.5"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Date</label>
                <input
                  type="date" value={dateInput} onChange={e => setDateInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors [color-scheme:dark]"
                />
              </div>
              <button
                onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
              >
                {saving ? '...' : 'Sauvegarder'}
              </button>
            </div>

            {message && (
              <div className={`mt-4 px-4 py-2.5 rounded-xl text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {message.text}
              </div>
            )}
          </div>
        </section>

        {/* Stats */}
        {stats && (
          <section className="animate-slide-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Poids actuel', value: stats.current.toFixed(1) + ' kg', icon: '⚖️' },
                { label: 'Poids de départ', value: stats.start.toFixed(1) + ' kg', icon: '🏁' },
                {
                  label: 'Différence',
                  value: (stats.diff > 0 ? '+' : '') + stats.diff.toFixed(1) + ' kg',
                  icon: trendEmoji[trend],
                  sub: trendLabel[trend],
                  subColor: trendColor[trend],
                },
                { label: 'Moy. / semaine', value: (stats.weeklyAvg <= 0 ? '' : '+') + stats.weeklyAvg.toFixed(1) + ' kg', icon: '📊' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all"
                >
                  <div className="text-2xl mb-3 opacity-70">{stat.icon}</div>
                  <div className="text-2xl font-black text-white font-display">{stat.value}</div>
                  <div className="text-xs text-zinc-500 mt-1.5 font-medium flex items-center gap-1.5">
                    {stat.label}
                    {stat.sub && <span className={stat.subColor || 'text-zinc-500'}>· {stat.sub}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chart */}
        <section className="animate-slide-up">
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6">
            <h2 className="text-lg font-bold font-display mb-2">Historique</h2>
            {weightData.length === 0 ? (
              <div className="py-16 text-center text-zinc-500">
                <div className="text-4xl mb-3">📊</div>
                <p>Aucune donnée pour le moment.</p>
                <p className="text-sm mt-1">Ajoute ton premier poids ci-dessus.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-zinc-600 mb-4">
                  {weightData.length} entrée{weightData.length > 1 ? 's' : ''} · clique sur un point pour le supprimer
                </p>
                <div className="h-72 sm:h-80">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Delete modal */}
        {deleteIdx !== null && weightData[deleteIdx] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-bold font-display mb-2">Supprimer ?</h3>
              <p className="text-sm text-zinc-400 mb-2">
                {formatDate(weightData[deleteIdx].date)} · {weightData[deleteIdx].weight} kg
              </p>
              <p className="text-xs text-zinc-500 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteIdx(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-medium hover:bg-white/[0.08] transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="pt-8 pb-4 text-center text-xs text-zinc-600 border-t border-white/[0.04]">
          <p>Club Fasting · Suivi de poids</p>
        </footer>
      </main>
    </div>
  )
}
