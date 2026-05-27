'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

const TOOLS = [
  {
    id: 'fasting-planner',
    title: 'Fenêtre de jeûne',
    desc: 'Calcule et ajuste ta fenêtre de jeûne optimale',
    icon: '⏰',
    url: '/dashboard/planner',
    accent: 'from-orange-500 to-red-500',
  },
  {
    id: 'glycemia',
    title: 'Simulateur de glycémie',
    desc: "Visualise l'impact des aliments sur ta glycémie",
    icon: '📊',
    url: 'https://clubfasting.com/glucosemaster/',
    accent: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'meal-analyzer',
    title: "Montre-moi ton assiette",
    desc: "Analyse ton repas avec l'IA pour optimiser ton métabolisme",
    icon: '🍽️',
    url: 'https://analyseur-de-repas-gdv-v1-453490259042.us-west1.run.app',
    accent: 'from-green-500 to-emerald-600',
  },
]

const MEAL_ICONS = {
  'Petit-déjeuner': '🍳',
  'Déjeuner': '🥗',
  'Dîner': '🍲',
  'Repas': '🍽️',
}

const DRINK_LABELS = {
  boost: { icon: '☕', label: 'Café / Thé' },
  refreshing: { icon: '🧊', label: 'Boisson fraîche' },
  soothing: { icon: '🍵', label: 'Tisane' },
  simple: { icon: '💧', label: 'Eau' },
}

function FastingRing({ start, end }) {
  const size = 180
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const eatingHours = end - start

  const eatingStartAngle = (start / 24) * 360
  const eatingArc = (eatingHours / 24) * circumference
  const gap = circumference - eatingArc

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#fastingGradient2)"
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${eatingArc} ${gap}`}
          strokeDashoffset={-((eatingStartAngle / 360) * circumference)}
        />
        <defs>
          <linearGradient id="fastingGradient2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs text-gray-500 font-medium">Jeûne</span>
        <span className="text-4xl font-black text-gray-900 leading-none mt-1">{24 - eatingHours}h</span>
        <span className="text-xs text-gray-400 mt-1">{eatingHours}h de repas</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [routine, setRoutine] = useState(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      const { data: profile } = await supabase
        .from('users').select('name').eq('email', session.user.email).maybeSingle()
      setDisplayName(profile?.name || session.user.email?.split('@')[0] || 'Membre')

      const { data: routineData } = await supabase
        .from('routines').select('*').eq('user_id', session.user.id)
        .order('updated_at', { ascending: false }).limit(1).maybeSingle()
      if (routineData) setRoutine(routineData)
      setLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  const start = routine?.meals?.[0]?.time
  const end = routine?.meals?.[routine.meals.length - 1]?.time
  const hasWindow = start !== undefined && end !== undefined && end > start

  const hour = new Date().getHours()
  const greeting = hour < 6 ? 'Bonne nuit' : hour < 12 ? 'Bonjour' : hour < 18 ? "Bel après-midi" : 'Bonsoir'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-gray-900 tracking-tight">
            Club <span className="text-orange-500">Fasting</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600 font-medium">{displayName}</span>
            </div>
            <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-600">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-14 space-y-10">
        {/* Greeting */}
        <section>
          <p className="text-sm text-orange-500 font-semibold mb-1">{greeting}</p>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Salut {displayName} <span className="inline-block">👋</span></h1>
          <p className="text-gray-500 mt-1">Ta routine de jeûne, en un coup d&apos;œil.</p>
        </section>

        {/* Fasting Window */}
        {hasWindow ? (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center md:justify-start">
                <FastingRing start={start} end={end} />
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">TA FENÊTRE DE REPAS</p>
                  <p className="text-4xl sm:text-5xl font-black text-gray-900">
                    {start}h <span className="text-gray-300 font-light">→</span> {end}h
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {routine.meals.map((meal, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-700 flex items-center gap-1.5">
                      <span>{MEAL_ICONS[meal.name] || '🍽️'}</span>
                      <span>{meal.name}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-orange-500 font-semibold">{meal.time}h</span>
                    </span>
                  ))}
                </div>

                {routine.drink && DRINK_LABELS[routine.drink] && (
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <span>{DRINK_LABELS[routine.drink].icon}</span>
                    <span>Boisson : {DRINK_LABELS[routine.drink].label}</span>
                  </div>
                )}

                <div>
                  <Link href="/dashboard/planner" className="inline-flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium">
                    Ajuster ma fenêtre <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
            <div className="text-5xl mb-4">⏰</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Démarre ta routine</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Réponds à quelques questions, on calcule ta fenêtre de jeûne idéale.
            </p>
            <Link
              href="/dashboard/planner"
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
            >
              Créer ma routine
            </Link>
          </section>
        )}

        {/* Tools */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Tes outils</h2>
            <span className="text-xs text-gray-400">{TOOLS.length} apps</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TOOLS.map((tool) => {
              const isInternal = tool.url.startsWith('/')
              const Comp = isInternal ? Link : 'a'
              const props = isInternal
                ? { href: tool.url }
                : { href: tool.url, target: '_blank', rel: 'noopener noreferrer' }
              return (
                <Comp key={tool.id} {...props}
                  className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-orange-300 hover:shadow-md transition-all shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.accent} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                    {tool.icon}
                  </div>
                  <h3 className="font-semibold mb-1 text-gray-900">{tool.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                  <div className="mt-3 text-xs text-orange-500 font-medium">
                    Ouvrir →
                  </div>
                </Comp>
              )
            })}
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Tes stats</h2>
            <span className="text-xs text-gray-400">Bientôt disponible</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Jeûnes', value: '—', icon: '🔥' },
              { label: 'Heures', value: '—', icon: '⏱️' },
              { label: 'Moyenne', value: '—', icon: '📝' },
              { label: 'Série', value: '—', icon: '📈' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-400">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsfeed */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-5">Fil d&apos;actualités</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-gray-400">Le newsfeed arrive bientôt</p>
          </div>
        </section>

        <footer className="pt-8 pb-4 text-center text-xs text-gray-400">
          Club Fasting · v2.3
        </footer>
      </main>
    </div>
  )
}
