import Link from 'next/link'
import Script from 'next/script'

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
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Le Fasting",
      "url": "https://clubfasting.com",
      "logo": "https://app.clubfasting.com/club-fasting-logo.png",
      "sameAs": [
        "https://www.youtube.com/@lefasting",
        "https://www.instagram.com/lefasting"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Peut-on boire un café pendant le jeûne ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, vous pouvez tout à fait boire du café noir, du thé ou des infusions sans sucre ni lait. Ces boissons ne rompent pas votre jeûne et peuvent même vous aider à patienter."
          }
        },
        {
          "@type": "Question",
          "name": "Faut-il jeûner 12h ou 16h ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La méthode 16/8 est idéale pour débuter. Elle consiste à jeûner pendant 16 heures et à concentrer vos repas sur une fenêtre de 8 heures (par exemple de 12h à 20h)."
          }
        },
        {
          "@type": "Question",
          "name": "Peut-on faire du sport pendant le jeûne ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pour les sportifs, la question de l'entraînement à jeun se pose souvent. Beaucoup trouvent un regain d'énergie étonnant en faisant leur sport le matin, avant le premier repas."
          }
        },
        {
          "@type": "Question",
          "name": "Que peut-on boire pendant un jeûne intermittent sans le casser ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, l’hydratation est essentielle. Vous pouvez boire de l’eau, du café noir et du thé (sans sucre, ni lait, ni édulcorant) pendant vos heures de jeûne sans rompre votre jeûne."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://clubfasting.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Club Fasting",
          "item": "https://app.clubfasting.com/"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 flex flex-col items-center justify-center px-4">
      <Script
        id="json-ld-schema"
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
