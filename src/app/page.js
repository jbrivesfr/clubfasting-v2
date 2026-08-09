import Link from 'next/link'

export const metadata = {
  title: 'Club Fasting',
  description: "Une nouvelle version pour mieux jeûner. Profitez de notre fenêtre de jeûne, du simulateur de glycémie et de l'analyse de repas par IA.",
  alternates: {
    canonical: 'https://app.clubfasting.com/',
  },
  openGraph: {
    title: 'Club Fasting',
    description: "Une nouvelle version pour mieux jeûner. Profitez de notre fenêtre de jeûne, du simulateur de glycémie et de l'analyse de repas par IA.",
    url: 'https://app.clubfasting.com/',
    siteName: 'Le Fasting',
    type: 'website',
    images: [
      {
        url: 'https://app.clubfasting.com/club-fasting-logo.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club Fasting',
    description: "Une nouvelle version pour mieux jeûner. Profitez de notre fenêtre de jeûne, du simulateur de glycémie et de l'analyse de repas par IA.",
    images: ['https://app.clubfasting.com/club-fasting-logo.png'],
  },
}

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
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Est-ce qu’un demi citron dans un verre d’eau tiède est à proscrire le matin à la place du café ou d’un thé ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pas de souci pour le citron dans l'eau, un demi c'est parfait. Cela ne casse pas votre jeûne."
            }
          },
          {
            "@type": "Question",
            "name": "Les capsules de café sont-elles autorisées pour le café du matin (sans lait ni sucre) ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Oui, c'est sans problème pour le jeûne. Il est souvent préférable de boire les cafés un peu plus allongés pendant le jeûne pour qu'ils soient moins agressifs sur l'estomac."
            }
          },
          {
            "@type": "Question",
            "name": "Le jeûne intermittent est-il efficace si on le pratique 5 jours par semaine ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Oui cela fonctionne également, sachant que la perte de poids sera potentiellement plus lente qu'en le faisant tous les jours. C'est une excellente idée de commencer à votre rythme, le plus important est de vous y mettre."
            }
          },
          {
            "@type": "Question",
            "name": "Je prends un traitement médical tous les matins, est-ce que cela casse le jeûne ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Si votre traitement est recommandé à jeun, cela devrait convenir. En règle générale, il n'y a pas de contre-indication avec le jeûne pour les médicaments sans sucre, mais n'hésitez pas à demander l'avis de votre médecin."
            }
          }
        ]
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
        <div className="space-y-4">
          <img
            src="/club-fasting-logo.png"
            alt="Logo de Club Fasting, application pour le jeûne intermittent"
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

        <div className="pt-8 w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Articles récents</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/jeune-intermittent-16-8"
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="font-medium text-gray-900 mb-1">Jeûne 16/8</div>
              <div className="text-xs text-gray-500">Le guide complet pour débuter</div>
            </Link>
            <Link
              href="/jeune-intermittent-18-6"
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="font-medium text-gray-900 mb-1">Jeûne 18/6</div>
              <div className="text-xs text-gray-500">Passer au niveau supérieur</div>
            </Link>
            <Link
              href="/jeune-intermittent-14-10"
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="font-medium text-gray-900 mb-1">Jeûne 14/10</div>
              <div className="text-xs text-gray-500">Idéal pour commencer en douceur</div>
            </Link>
            <Link
              href="/jeune-intermittent-5-2"
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="font-medium text-gray-900 mb-1">Jeûne 5:2</div>
              <div className="text-xs text-gray-500">La méthode sur la semaine</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
