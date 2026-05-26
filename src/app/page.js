import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight">
            Club <span className="text-orange-500">Fasting</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Ton métabolisme, tes outils, tes résultats. <br />
            La nouvelle version arrive.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Se connecter
          </Link>
          <Link
            href="/login?signup=true"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl transition-colors text-lg border border-gray-700"
          >
            Créer un compte
          </Link>
        </div>

        <p className="text-sm text-gray-600">
          Déjà 20 000+ membres nous font confiance
        </p>
      </div>
    </div>
  )
}
