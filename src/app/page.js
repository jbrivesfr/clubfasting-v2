import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-gray-900">
            Club <span className="text-orange-500">Fasting</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Ton métabolisme, tes outils, tes résultats.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
            <div className="text-2xl mb-1">⏰</div>
            <div className="text-gray-700 font-medium">Fenêtre de jeûne</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-gray-700 font-medium">Simulateur glycémie</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
            <div className="text-2xl mb-1">🍽️</div>
            <div className="text-gray-700 font-medium">Analyse repas IA</div>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-lg shadow-md shadow-orange-500/20"
        >
          Accéder au Club
        </Link>

        <p className="text-sm text-gray-500">
          Pas de mot de passe. Juste ton email.
        </p>
      </div>
    </div>
  )
}
