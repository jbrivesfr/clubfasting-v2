'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const TOOLS = [
  {
    id: 'fasting-planner',
    title: 'Fenêtre de jeûne',
    desc: 'Calcule et ajuste ta fenêtre de jeûne optimale',
    icon: '⏰',
    url: '/dashboard/planner',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'glycemia',
    title: 'Simulateur de glycémie',
    desc: 'Visualise l\'impact des aliments sur ta glycémie',
    icon: '📊',
    url: 'https://clubfasting.com/glucosemaster/',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'meal-analyzer',
    title: 'Montre-moi ton assiette',
    desc: 'Analyse ton repas avec l\'IA pour optimiser ton métabolisme',
    icon: '🍽️',
    url: 'https://analyseur-de-repas-gdv-v1-453490259042.us-west1.run.app',
    color: 'from-green-500 to-emerald-600',
  },
]

const MEAL_LABELS = {
  'Petit-déjeuner': '🍳 Petit-déj',
  'Déjeuner': '🥗 Déjeuner',
  'Dîner': '🍲 Dîner',
  'Repas': '🍽️ Repas',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [routine, setRoutine] = useState(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

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
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  const fastingWindow = routine?.meals?.length >= 2
    ? `${routine.meals[0].time}h - ${routine.meals[routine.meals.length - 1].time}h`
    : null

  const fastingDuration = routine?.meals?.length >= 2
    ? routine.meals[routine.meals.length - 1].time - routine.meals[0].time
    : null

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-gray-900">
            Club <span className="text-orange-500">Fasting</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{displayName}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <section>
          <h1 className="text-3xl font-bold text-gray-900">Salut {displayName} 👋</h1>
          <p className="text-gray-600 mt-2">
            Ta routine de jeûne, tes outils.
          </p>
        </section>

        {/* Fasting Window */}
        {routine ? (
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">⏰ Ta fenêtre de jeûne</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {fastingDuration ? `${fastingDuration}h` : '—'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Fenêtre</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{fastingWindow || '—'}</div>
                <div className="text-xs text-gray-500 mt-1">Repas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {routine.wake_up_time ? `${routine.wake_up_time}h` : '—'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Réveil</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {routine.bed_time ? `${routine.bed_time}h` : '—'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Coucher</div>
              </div>
            </div>
            {routine.meals && routine.meals.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {routine.meals.map((meal, i) => (
                  <span key={i} className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-sm text-orange-700">
                    {MEAL_LABELS[meal.name] || meal.name} · {meal.time}h
                  </span>
                ))}
              </div>
            )}
            {routine.drink && (
              <p className="mt-3 text-sm text-gray-500">
                🥤 Boisson : {routine.drink === 'boost' ? 'Café/Thé ☕' :
                  routine.drink === 'refreshing' ? 'Frais 🧊' :
                  routine.drink === 'soothing' ? 'Tisane 🍵' : 'Eau 💧'}
              </p>
            )}
            <div className="mt-4">
              <Link
                href="/dashboard/planner"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Ajuster ma fenêtre →
              </Link>
            </div>
          </section>
        ) : (
          <section className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl mb-3">⏰</div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Pas encore de routine</h2>
            <p className="text-gray-500 text-sm mb-4">Définis ta fenêtre de jeûne pour commencer à tracker tes progrès.</p>
            <Link
              href="/dashboard/planner"
              className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors text-sm shadow-sm"
            >
              Créer ma routine
            </Link>
          </section>
        )}

        {/* Tools */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">🛠️ Tes outils</h2>
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
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 transition-all hover:shadow-md shadow-sm"
              >
                <div className={`h-1.5 bg-gradient-to-r ${tool.color}`} />
                <div className="p-5">
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-semibold mb-1 text-gray-900">{tool.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                </div>
              </Comp>
              )
            })}
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">📊 Tes stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Jeûnes', value: '—', icon: '🔥' },
              { label: 'Heures totales', value: '—', icon: '⏱️' },
              { label: 'Moy. semaine', value: '—', icon: '📝' },
              { label: 'Série', value: '—', icon: '📈' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-lg font-semibold text-gray-700">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsfeed */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">📰 Fil d&apos;actualités</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
            <p className="text-lg mb-1">📭</p>
            <p className="text-gray-500">Le newsfeed arrive bientôt</p>
          </div>
        </section>
      </main>
    </div>
  )
}
