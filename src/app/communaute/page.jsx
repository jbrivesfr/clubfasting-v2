import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'La communauté du Fasting | Club Fasting',
  description: 'Une méthode pas à pas, des réponses à vos questions, et des fasters motivés pour vous accompagner.',
  alternates: {
    canonical: 'https://app.clubfasting.com/communaute',
  },
  openGraph: {
    title: 'La communauté du Fasting | Club Fasting',
    description: 'Une méthode pas à pas, des réponses à vos questions, et des fasters motivés pour vous accompagner.',
    url: 'https://app.clubfasting.com/communaute',
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
    title: 'La communauté du Fasting | Club Fasting',
    description: 'Une méthode pas à pas, des réponses à vos questions, et des fasters motivés pour vous accompagner.',
    images: ['https://app.clubfasting.com/club-fasting-logo.png'],
  },
};

export default function Communaute() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex items-center shadow-sm">
        <Link href="/sitemap-contenus" className="text-gray-500 hover:text-gray-700 mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <span className="font-medium text-gray-800">Retour aux contenus</span>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
          La communauté du Fasting
        </h1>

        <p className="text-xl text-gray-700 mb-12 text-center max-w-2xl mx-auto">
          Une méthode pas à pas, des réponses à vos questions, et des fasters motivés pour vous accompagner.
        </p>

        {/* 3-column section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Méthode pas-à-pas</h3>
            <p className="text-gray-600">
              Laissez-vous guider semaine après semaine. Pas de devinettes, juste des étapes claires pour atteindre vos objectifs.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personnalisation</h3>
            <p className="text-gray-600">
              Trouvez le rythme qui vous correspond vraiment, sans frustration, et adaptez le jeûne à votre quotidien.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Communauté active</h3>
            <p className="text-gray-600">
              Échangez avec des centaines d'autres membres, partagez vos victoires et posez vos questions en toute bienveillance.
            </p>
          </div>
        </div>

        {/* Pourquoi le Club */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pourquoi le Club ?</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>La méthode originale depuis 2012</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Une communauté française bienveillante</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Des réponses rapides à vos questions</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Des programmes accessibles (à partir de 27€)</span>
            </li>
          </ul>
        </section>

        {/* Témoignages */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Ils ont rejoint la communauté</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 italic mb-4">"{'{{TEMOIGNAGE_1_TEXT}}'}"</p>
              <div className="font-semibold text-gray-900">- {'{{TEMOIGNAGE_1_NAME}}'}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 italic mb-4">"{'{{TEMOIGNAGE_2_TEXT}}'}"</p>
              <div className="font-semibold text-gray-900">- {'{{TEMOIGNAGE_2_NAME}}'}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 italic mb-4">"{'{{TEMOIGNAGE_3_TEXT}}'}"</p>
              <div className="font-semibold text-gray-900">- {'{{TEMOIGNAGE_3_NAME}}'}</div>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <div className="bg-orange-50 rounded-2xl p-8 md:p-12 text-center mb-16 border border-orange-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Prêt(e) à démarrer ?</h2>
          <Link
            href="/dashboard/register"
            className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-lg shadow-md shadow-orange-500/20"
          >
            Rejoindre la communauté
          </Link>
        </div>

        {/* Newsletter */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Restons en contact</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Recevez nos meilleurs conseils pour le jeûne intermittent directement dans votre boîte mail.
          </p>
          <form action="/api/subscribe" method="POST" className="space-y-3">
            <input
              type="email"
              name="email"
              placeholder="Votre adresse email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              S'inscrire à la newsletter
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
