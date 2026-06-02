'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { NewsfeedProvider } from '@/components/newsfeed/NewsfeedProvider'
import { NewsfeedFeed } from '@/components/newsfeed/NewsfeedFeed'
import { JourneyTabs } from '@/components/newsfeed/JourneyTabs'

const TOOLS = [
  {
    id: 'fasting-planner',
    title: 'Fenêtre de jeûne',
    desc: 'Calcule et ajuste ta fenêtre de jeûne optimale.',
    tag: 'Routine',
    url: '/dashboard/planner',
    accent: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'glucose',
    title: 'Simulateur de glycémie',
    desc: 'Visualise l\'impact des aliments sur ta glycémie en temps réel.',
    tag: 'Analyse',
    url: '/dashboard/glucose',
    accent: 'from-sky-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'meal-analyzer',
    title: 'Montre-moi ton assiette',
    desc: 'L\'IA analyse ton repas et l\'optimise pour ton métabolisme.',
    tag: 'IA',
    url: '/dashboard/meal-analyzer',
    accent: 'from-emerald-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'cart-analyzer',
    title: 'Analyseur de caddie',
    desc: 'L\'IA analyse tes courses et te guide vers les meilleurs choix.',
    tag: 'IA',
    url: '/dashboard/cart-analyzer',
    accent: 'from-violet-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'bilan',
    title: 'Bilan Métabolique',
    desc: '9 questions pour comprendre où tu en es et quoi faire ensuite.',
    tag: 'Quiz',
    url: '/dashboard/bilan',
    accent: 'from-emerald-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop',
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

const HERO_IMAGE = 'https://images.unsplash.com/photo-1502301197179-65228ab57f78?w=1600&q=80&auto=format&fit=crop'

function FastingRing({ start, end }) {
  const size = 220
  const stroke = 16
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const fastingHours = 24 - (end - start)
  const eatingHours = end - start

  const eatingStartAngle = (start / 24) * 360
  const eatingArc = (eatingHours / 24) * circumference
  const gap = circumference - eatingArc

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-2xl">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${eatingArc} ${gap}`}
          strokeDashoffset={-((eatingStartAngle / 360) * circumference)}
          style={{ filter: 'drop-shadow(0 0 12px rgba(251,146,60,0.5))' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * 2 * Math.PI
          const x1 = size / 2 + (radius + stroke / 2 + 4) * Math.cos(angle)
          const y1 = size / 2 + (radius + stroke / 2 + 4) * Math.sin(angle)
          const x2 = size / 2 + (radius + stroke / 2 + (i % 6 === 0 ? 10 : 6)) * Math.cos(angle)
          const y2 = size / 2 + (radius + stroke / 2 + (i % 6 === 0 ? 10 : 6)) * Math.sin(angle)
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={i % 6 === 0 ? 1.5 : 1}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-medium">Jeûne</span>
        <span className="text-6xl font-black text-white leading-none mt-2 font-display">{fastingHours}</span>
        <span className="text-xs text-zinc-400 mt-2">heures par jour</span>
        <span className="text-[10px] uppercase tracking-wider text-orange-400/80 mt-3">
          {eatingHours}h de repas
        </span>
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
    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .maybeSingle()
      setDisplayName(profile?.name || user.email?.split('@')[0] || 'Membre')

      const { data: routineData } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', user.id)
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
          <p className="text-zinc-500 text-sm">Chargement...</p>
        </div>
      </div>
    )
  }

  const start = routine?.meals?.[0]?.time
  const end = routine?.meals?.[routine.meals.length - 1]?.time
  const hasWindow = start !== undefined && end !== undefined && end > start

  const hour = new Date().getHours()
  const greeting = hour < 6 ? 'Bonne nuit' : hour < 12 ? 'Bon matin' : hour < 18 ? 'Bel après-midi' : 'Bonne soirée'

  return (
    <NewsfeedProvider>
      <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient glows */}
      <div
        className="fixed inset-x-0 top-0 h-[700px] -z-0 pointer-events-none animate-pulse-glow"
        style={{
          background:
            'radial-gradient(50% 50% at 15% 0%, rgba(251,146,60,0.18) 0%, transparent 60%), radial-gradient(40% 50% at 85% 5%, rgba(239,68,68,0.12) 0%, transparent 60%)',
        }}
      />
      <div
        className="fixed inset-x-0 bottom-0 h-[400px] -z-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 100%, rgba(56,189,248,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <header className="relative z-20 border-b border-white/[0.06] backdrop-blur-xl bg-zinc-950/40 sticky top-0">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight font-display flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-sm shadow-lg shadow-orange-500/30">
              🔥
            </div>
            Club <span className="text-orange-400">Fasting</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-bold shadow-md">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-zinc-200 font-medium">{displayName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.04]"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-14 space-y-14">
        {/* Greeting */}
        <section className="space-y-3 animate-slide-up">
          <p className="text-xs uppercase tracking-[0.25em] text-orange-400/80 font-semibold">
            {greeting} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-display leading-[1.05]">
            Salut {displayName}{' '}
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            Voici ta routine de jeûne et tous tes outils pour avancer aujourd&apos;hui.
          </p>
        </section>

        {/* Fasting hero card */}
        {hasWindow ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] animate-slide-up">
            {/* BG image */}
            <div className="absolute inset-0">
              <img
                src={HERO_IMAGE}
                alt=""
                className="w-full h-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/85 to-zinc-900/70" />
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(60% 80% at 100% 0%, rgba(251,146,60,0.25) 0%, transparent 60%)',
              }} />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 items-center p-8 sm:p-12">
              <div className="flex justify-center lg:justify-start">
                <FastingRing start={start} end={end} />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3 font-medium">
                    Ta fenêtre de repas
                  </p>
                  <p className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 bg-clip-text text-transparent font-display leading-none">
                    {start}h <span className="text-zinc-700 font-light">→</span> {end}h
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {routine.meals.map((meal, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm text-zinc-200 flex items-center gap-2 backdrop-blur-sm"
                    >
                      <span className="text-base">{MEAL_ICONS[meal.name] || '🍽️'}</span>
                      <span className="font-medium">{meal.name}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-orange-300 font-semibold">{meal.time}h</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-2">
                  {routine.drink && DRINK_LABELS[routine.drink] && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="text-lg">{DRINK_LABELS[routine.drink].icon}</span>
                      <span>{DRINK_LABELS[routine.drink].label}</span>
                    </div>
                  )}
                  {routine.wake_up_time !== null && routine.wake_up_time !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="text-lg">🌅</span>
                      <span>Réveil {routine.wake_up_time}h</span>
                    </div>
                  )}
                  {routine.bed_time !== null && routine.bed_time !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="text-lg">🌙</span>
                      <span>Coucher {routine.bed_time}h</span>
                    </div>
                  )}
                </div>

                <Link
                  href="/dashboard/planner"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-sm text-white font-medium transition-all group"
                >
                  Ajuster ma fenêtre
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] animate-slide-up">
            <div className="absolute inset-0">
              <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/50" />
            </div>
            <div className="relative p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-5 shadow-lg shadow-orange-500/30 text-3xl">
                ⏰
              </div>
              <h2 className="text-3xl font-bold mb-3 font-display">Démarre ta routine</h2>
              <p className="text-zinc-400 mb-7 max-w-md mx-auto">
                Réponds à quelques questions, on calcule ta fenêtre de jeûne idéale.
              </p>
              <Link
                href="/dashboard/planner"
                className="inline-block px-7 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-full transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5"
              >
                Créer ma routine
              </Link>
            </div>
          </section>
        )}

        {/* Tools */}
        <section className="animate-slide-up">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-display">Tes outils</h2>
              <p className="text-sm text-zinc-500 mt-1">Pour optimiser ton métabolisme jour après jour</p>
            </div>
            <span className="text-xs text-zinc-600 uppercase tracking-wider font-medium">
              {TOOLS.length} apps
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                  className="card-glow group relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-white/[0.06] hover:border-white/[0.12] transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={tool.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay`} />
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white`}>
                      {tool.tag}
                    </span>
                  </div>
                  <div className="relative p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-white mb-1.5 font-display">{tool.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed flex-1">{tool.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500 group-hover:text-orange-300 transition-colors font-medium">
                      <span>Ouvrir</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Comp>
              )
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="animate-slide-up">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-display">Tes stats</h2>
              <p className="text-sm text-zinc-500 mt-1">Tes progrès en chiffres</p>
            </div>
            <span className="text-xs text-orange-400/70 uppercase tracking-wider font-medium px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              Bientôt
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Jeûnes complétés', value: '—', icon: '🔥', color: 'from-orange-500/20 to-transparent' },
              { label: 'Heures cumulées', value: '—', icon: '⏱️', color: 'from-sky-500/20 to-transparent' },
              { label: 'Moy. hebdo', value: '—', icon: '📊', color: 'from-emerald-500/20 to-transparent' },
              { label: 'Série actuelle', value: '—', icon: '📈', color: 'from-purple-500/20 to-transparent' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
                <div className="relative">
                  <div className="text-2xl mb-3 opacity-70">{stat.icon}</div>
                  <div className="text-3xl font-black text-white font-display">{stat.value}</div>
                  <div className="text-xs text-zinc-500 mt-1.5 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsfeed */}
        <section className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6 font-display">Fil d&apos;actualités</h2>
          <JourneyTabs />
          <NewsfeedFeed />
        </section>

        <footer className="pt-8 pb-4 text-center text-xs text-zinc-600 border-t border-white/[0.04]">
          <p className="mb-1">Club Fasting · v2.5</p>
          <p className="text-zinc-700">Ton métabolisme, tes outils, tes résultats.</p>
        </footer>
      </main>
    </div>
    </NewsfeedProvider>
  )
}
