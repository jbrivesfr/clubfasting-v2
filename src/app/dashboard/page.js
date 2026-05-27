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
    desc: 'Visualise l\'impact des aliments sur ta glycémie',
    icon: '📊',
    url: 'https://clubfasting.com/glucosemaster/',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    id: 'meal-analyzer',
    title: 'Montre-moi ton assiette',
    desc: 'Analyse ton repas avec l\'IA pour optimiser ton métabolisme',
    icon: '🍽️',
    url: 'https://analyseur-de-repas-gdv-v1-453490259042.us-west1.run.app',
    accent: 'from-emerald-500 to-teal-500',
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
  const fastingHours = 24 - (end - start)
  const eatingHours = end - start

  const eatingStartAngle = (start / 24) * 360
  const eatingArc = (eatingHours / 24) * circumference
  const gap = circumference - eatingArc

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#fastingGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${eatingArc} ${gap}`}
          strokeDashoffset={-((eatingStartAngle / 360) * circumference)}
        />
        <defs>
          <linearGradient id="fastingGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-wider text-zinc-400">Jeûne</span>
        <span className="text-4xl font-black text-white leading-none mt-1">{fastingHours}h</span>
        <span className="text-xs text-zinc-500 mt-1">{eatingHours}h de repas</span>
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
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      const { data: profile } = await supabase
        .from('users')
        .select('name')
        .eq('email', session.user.email)
        .maybeSingle()
      setDisplayName(profile?.name || session.user.email?.split('@')[0] || 'Membre')

      const { data: routineData } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (routineData) {
        setRoutine(routineData)
      }

      setLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  const start = routine?.meals?.[0]?.time
  const end = routine?.meals?.[routine.meals.length - 1]?.time
  const hasWindow = start !== undefined && end !== undefined && end > start

  const hour = new Date().getHours()
  const greeting = hour < 6 ? 'Bonne nuit' : hour < 12 ? 'Bon matin' : hour < 18 ? 'Bel après-midi' : 'Bonne soirée'

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div
        className="absolute inset-x-0 top-0 h-[520px] -z-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 60% at 20% 0%, rgba(251,146,60,0.25) 0%, transparent 60%), radial-gradient(50% 50% at 80% 10%, rgba(239,68,68,0.15) 0%, transparent 60%)',
        }}
      />

      <header className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight">
            Club <span className="text-orange-400">Fasting</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-zinc-300">{displayName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 sm:py-14 space-y-12">
        <section className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-400/80 font-semibold">
            {greeting}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Salut {displayName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Ta routine de jeûne, en un coup d&apos;œil.
          </p>
        </section>

        {/* Fasting hero */}
        {hasWindow ? (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-900/40 border border-white/10 p-6 sm:p-10">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  'radial-gradient(40% 60% at 100% 0%, rgba(251,146,60,0.3) 0%, transparent 70%)',
              }}
            />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center md:justify-start">
                <FastingRing start={start} end={end} />
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
                    Ta fenêtre de repas
                  </p>
                  <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
                    {start}h <span className="text-zinc-600 font-light">→</span> {end}h
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {routine.meals.map((meal, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-200 flex items-center gap-1.5"
                    >
                      <span>{MEAL_ICONS[meal.name] || '🍽️'}</span>
                      <span>{meal.name}</span>
                      <span className="text-zinc-500">·</span>
                      <span className="text-orange-300 font-medium">{meal.time}h</span>
                    </span>
                  ))}
                </div>

                {routine.drink && DRINK_LABELS[routine.drink] && (
                  <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
                    <span>{DRINK_LABELS[routine.drink].icon}</span>
                    <span>Boisson : {DRINK_LABELS[routine.drink].label}</span>
                  </div>
                )}

                <div>
                  <Link
                    href="/dashboard/planner"
                    className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 font-medium group"
                  >
                    Ajuster ma fenêtre
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-900/40 border border-white/10 p-10 text-center">
            <div className="text-5xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold mb-2">Démarre ta routine</h2>
            <p className="text-zinc-400 mb-6 max-w-sm mx-auto">
              Réponds à quelques questions, on calcule ta fenêtre de jeûne idéale.
            </p>
            <Link
              href="/dashboard/planner"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20"
            >
              Créer ma routine
            </Link>
          </section>
        )}

        {/* Tools */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-xl font-bold">Tes outils</h2>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{TOOLS.length} apps</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TOOLS.map((tool) => {
              const isInternal = tool.url.startsWith('/')
              const Comp = isInternal ? Link : 'a'
              const props = isInternal
                ? { href: tool.url }
                : { href: tool.url, target: '_blank', rel: 'noopener noreferrer' }
              return (
                <Comp
                  key={tool.id}
                  {...props}
                  className="group relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-white/5 p-5 hover:border-white/15 transition-all hover:-translate-y-0.5"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${tool.accent} transition-opacity duration-300`}
                    style={{ mixBlendMode: 'overlay' }}
                  />
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.accent} flex items-center justify-center text-2xl mb-4 shadow-lg`}
                    >
                      {tool.icon}
                    </div>
                    <h3 className="font-semibold mb-1.5 text-white">{tool.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{tool.desc}</p>
                    <div className="mt-4 text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      Ouvrir →
                    </div>
                  </div>
                </Comp>
              )
            })}
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-xl font-bold">Tes stats</h2>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Bientôt</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Jeûnes', value: '—', icon: '🔥' },
              { label: 'Heures', value: '—', icon: '⏱️' },
              { label: 'Moyenne', value: '—', icon: '📝' },
              { label: 'Série', value: '—', icon: '📈' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-zinc-900/60 border border-white/5 p-4"
              >
                <div className="text-xl mb-2 opacity-60">{stat.icon}</div>
                <div className="text-2xl font-bold text-zinc-300">{stat.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsfeed */}
        <section>
          <h2 className="text-xl font-bold mb-5">Fil d&apos;actualités</h2>
          <div className="rounded-2xl bg-zinc-900/60 border border-white/5 p-10 text-center">
            <div className="text-3xl mb-2 opacity-60">📭</div>
            <p className="text-zinc-400">Le newsfeed arrive bientôt</p>
          </div>
        </section>

        <footer className="pt-8 pb-4 text-center text-xs text-zinc-600">
          Club Fasting · v2.2
        </footer>
      </main>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-10deg); }
        }
        .animate-wave {
          animation: wave 1.6s ease-in-out;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  )
}
