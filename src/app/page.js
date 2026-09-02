import Link from 'next/link'
import Script from 'next/script'

export const metadata = {
  title: 'Le Fasting - Méthode simple pour se sentir mieux, perdre du poids, vivre plus longtemps',
  description: "Club Fasting : la communauté francophone pour jeûner 16h, perdre du poids et retrouver votre énergie. Méthode pas à pas, accompagnement personnalisé.",
  alternates: {
    canonical: 'https://app.clubfasting.com/',
  },
  openGraph: {
    title: 'Le Fasting - Méthode simple pour se sentir mieux, perdre du poids, vivre plus longtemps',
    description: "Club Fasting : la communauté francophone pour jeûner 16h, perdre du poids et retrouver votre énergie. Méthode pas à pas, accompagnement personnalisé.",
    url: 'https://app.clubfasting.com/',
    siteName: 'Le Fasting',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Fasting - Méthode simple pour se sentir mieux, perdre du poids, vivre plus longtemps',
    description: "Club Fasting : la communauté francophone pour jeûner 16h, perdre du poids et retrouver votre énergie. Méthode pas à pas, accompagnement personnalisé.",
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
          "name": "Le café noir casse-t-il le jeûne ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Non, le café noir et le thé sans sucre ne cassent pas le jeûne."
          }
        },
        {
          "@type": "Question",
          "name": "Combien de temps faut-il jeûner pour voir des résultats ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Minimum 12h, idéalement 16h chaque jour, pas de volume maximal."
          }
        },
        {
          "@type": "Question",
          "name": "Que manger pour rompre un jeûne de 16h ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Un vrai repas avec protéines, éviter fruits/jus seuls qui fatiguent."
          }
        },
        {
          "@type": "Question",
          "name": "Le jeûne intermittent est-il dangereux ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pour une personne en bonne santé, non — observer son ressenti énergie/sommeil."
          }
        },
        {
          "@type": "Question",
          "name": "Comment traverser un plateau de poids ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Routine simple et durable 1-2 semaines, ne pas tout révolutionner."
          }
        },
        {
          "@type": "Question",
          "name": "Faut-il faire du sport pendant le jeûne ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pas besoin de beaucoup, une routine équilibrée et efficace suffit."
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
