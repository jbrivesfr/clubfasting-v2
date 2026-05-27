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
    url: 'https://fasting-challenge-planner-453490259042.us-west1.run.app',
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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      // Try to get display name from users table
      const { data } = await supabase
        .from('users')
        .select('name')
        .eq('email', session.user.email)
        .maybeSingle()

      setDisplayName(data?.name || session.user.email?.split('@')[0] || 'Membre')
      setLoading(false)
    })
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Club <span className="text-orange-500">Fasting</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{displayName}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <section>
          <h1 className="text-3xl font-bold">Salut {displayName} 👋</h1>
          <p className="text-gray-400 mt-2">
            Bienvenue dans ta nouvelle interface Club Fasting.
          </p>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Jeûnes cette semaine', value: 'Bientôt', icon: '🔥' },
            { label: 'Heures totales', value: 'Bientôt', icon: '⏱️' },
            { label: 'Posts', value: 'Bientôt', icon: '📝' },
            { label: 'Série actuelle', value: 'Bientôt', icon: '📈' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-semibold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">🛠️ Tes outils</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TOOLS.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
                <div className="p-5">
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-semibold mb-1">{tool.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">📰 Fil d&apos;actualités</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500">
            <p className="text-lg mb-1">📭</p>
            <p>Le newsfeed arrive bientôt</p>
          </div>
        </section>
      </main>
    </div>
  )
}
