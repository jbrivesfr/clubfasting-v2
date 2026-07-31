import Link from 'next/link'

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://app.clubfasting.com/#website",
        "url": "https://app.clubfasting.com/",
        "name": "Club Fasting",
        "description": "Une nouvelle version pour mieux jeûner.",
        "publisher": {
          "@id": "https://app.clubfasting.com/#organization"
        },
        "inLanguage": "fr-FR"
      },
      {
        "@type": "Organization",
        "@id": "https://app.clubfasting.com/#organization",
        "name": "Club Fasting",
        "url": "https://app.clubfasting.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://app.clubfasting.com/club-fasting-logo.png"
        },
        "sameAs": []
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 flex flex-col items-center justify-center px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-lg text-center space-y-8">
        <h1 className="sr-only">Club Fasting - Une nouvelle version pour mieux jeûner</h1>
        <div className="space-y-4">
          <img
            src="/club-fasting-logo.png"
            alt="Logo Club Fasting"
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
