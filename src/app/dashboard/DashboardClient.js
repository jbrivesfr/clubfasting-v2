'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
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

export default function DashboardClient({ user, profile, displayName }) {
  const router = useRouter()
  const supabase = createClient()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Club <span className="text-orange-500">Fasting</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{displayName}</span>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Welcome */}
        <section>
          <h1 className="text-3xl font-bold">
            Salut {displayName} 👋
          </h1>
          <p className="text-gray-400 mt-2">
            Bienvenue dans la nouvelle version du Club. Voici tes outils pour optimiser ton jeûne.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Jeûnes cette semaine', value: '...', icon: '🔥' },
            { label: 'Heures totales', value: '...', icon: '⏱️' },
            { label: 'Posts', value: '...', icon: '📝' },
            { label: 'Série actuelle', value: '...', icon: '📈' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-semibold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Tools */}
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
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Newsfeed preview */}
        <section>
          <h2 className="text-xl font-semibold mb-4">📰 Dernières nouvelles</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500">
            <p className="text-lg mb-1">📭</p>
            <p>Le newsfeed arrive bientôt</p>
            <p className="text-xs mt-1 text-gray-600">
              Ton espace communautaire sera intégré ici
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
