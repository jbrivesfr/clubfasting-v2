import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <img
            src="/club-fasting-logo.png"
            alt="Club Fasting"
            className="mx-auto w-64 max-w-full h-auto"
          />
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
          Une nouvelle version pour mieux jeûner
        </p>
      </div>
    </div>
  )
}
