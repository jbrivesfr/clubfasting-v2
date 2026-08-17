import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Méthodes de jeûne intermittent : 16/8, 18/6, OMAD, 5:2 | Le Fasting',
  description: 'Découvrez les principales méthodes de jeûne intermittent : 16/8, 18/6, OMAD, 5:2, Warrior et le jeûne alterné. Trouvez celle qui vous convient.',
  alternates: {
    canonical: 'https://app.clubfasting.com/methodes-jeune',
  },
};

export default function MethodesJeune() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://app.clubfasting.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Méthodes de jeûne',
        item: 'https://app.clubfasting.com/methodes-jeune',
      },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quelle méthode de jeûne intermittent choisir pour débuter ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La méthode 16/8 est idéale pour débuter. Elle consiste à jeûner pendant 16 heures et à concentrer vos repas sur une fenêtre de 8 heures (par exemple de 12h à 20h). C&apos;est la plus facile à intégrer dans un quotidien actif.',
        },
      },
      {
        '@type': 'Question',
        name: '16/8 ou 18/6 pour perdre du poids ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Les deux méthodes sont efficaces. Le 18/6 offre une fenêtre alimentaire plus courte, ce qui peut accélérer la perte de poids chez certaines personnes en réduisant naturellement l’apport calorique. Cependant, le 16/8 reste le plus durable sur le long terme pour la majorité.',
        },
      },
      {
        '@type': 'Question',
        name: 'Peut-on boire pendant le jeûne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, l’hydratation est essentielle. Vous pouvez boire de l’eau, du café noir et du thé (sans sucre, ni lait, ni édulcorant) pendant vos heures de jeûne sans rompre votre jeûne.',
        },
      },
      {
        '@type': 'Question',
        name: 'Le jeûne intermittent est-il dangereux ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pour la plupart des adultes en bonne santé, le jeûne intermittent est sans danger. Il est cependant déconseillé aux femmes enceintes ou allaitantes, aux enfants, et aux personnes souffrant de troubles du comportement alimentaire ou de certaines maladies (consultez toujours un médecin).',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Les méthodes de jeûne intermittent
        </h1>

        <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl mx-auto">
          Il n&apos;existe pas une seule façon de jeûner. Découvrez les approches les plus populaires et trouvez celle qui s'adapte le mieux à votre style de vie et à vos objectifs.
        </p>

        <div className="space-y-12">
          {/* Method 1: 16/8 */}
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. La méthode 16/8</h2>
            <div className="prose text-gray-600 mb-6">
              <p>
                Le 16/8 est la méthode de jeûne intermittent la plus populaire et la plus accessible. Elle consiste à jeûner pendant 16 heures consécutives et à prendre tous vos repas dans une fenêtre de 8 heures. En général, cela implique simplement de sauter le petit-déjeuner et de dîner un peu plus tôt (par exemple, manger entre midi et 20h).
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-1">Pour qui ?</h3>
              <p className="text-blue-700 text-sm">
                Idéal pour les débutants, les personnes ayant un rythme de vie classique et ceux qui souhaitent une approche durable à long terme sans se sentir restreints.
              </p>
            </div>
            <Link
              href="/jeune-intermittent-16-8"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              En savoir plus sur le 16/8 <span className="ml-1">→</span>
            </Link>
          </section>

          {/* Method 2: 18/6 */}
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. La méthode 18/6</h2>
            <div className="prose text-gray-600 mb-6">
              <p>
                Une évolution logique du 16/8, cette approche réduit la fenêtre d'alimentation à 6 heures pour un jeûne de 18 heures. Elle permet de prolonger l'état de cétose et d&apos;autophagie, favorisant souvent une perte de masse grasse plus rapide, au prix d&apos;une fenêtre de repas un peu plus contraignante (ex: manger entre 13h et 19h).
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-1">Pour qui ?</h3>
              <p className="text-blue-700 text-sm">
                Pour ceux qui maîtrisent déjà le 16/8, qui font un plateau dans leur perte de poids, ou qui préfèrent naturellement faire seulement deux repas rapprochés dans la journée.
              </p>
            </div>
            <Link
              href="/jeune-intermittent-18-6"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              En savoir plus sur le 18/6 <span className="ml-1">→</span>
            </Link>
          </section>

          {/* Method 3: 20/4 (Warrior Diet) */}
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Le 20/4 (Régime du Guerrier / Warrior Diet)</h2>
            <div className="prose text-gray-600 mb-6">
              <p>
                Inspiré par le mode de vie des anciens guerriers, ce protocole implique un jeûne de 20 heures, suivi d&apos;une fenêtre alimentaire de 4 heures (souvent le soir). Durant la journée, seules de très petites quantités d&apos;aliments crus peuvent être tolérées par certains, bien que les puristes ne consomment que des boissons non caloriques.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-1">Pour qui ?</h3>
              <p className="text-blue-700 text-sm">
                Réservé aux jeûneurs expérimentés cherchant à maximiser les bienfaits cellulaires ou ceux qui ont des journées très intenses et préfèrent faire un seul gros repas copieux le soir.
              </p>
            </div>
          </section>

          {/* Method 4: OMAD */}
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. OMAD (One Meal A Day)</h2>
            <div className="prose text-gray-600 mb-6">
              <p>
                Le protocole OMAD, ou "Un Repas Par Jour", consiste à jeûner pendant environ 23 heures et à consommer tous ses besoins caloriques et nutritionnels en un seul grand repas d&apos;une heure. C&apos;est une forme extrême de restriction temporelle qui demande une excellente planification pour éviter les carences.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-1">Pour qui ?</h3>
              <p className="text-blue-700 text-sm">
                Pour les vétérans du jeûne cherchant un gain de temps maximal, une forte restriction calorique ou un défi mental. Ce n&apos;est généralement pas recommandé sur le long terme sans supervision.
              </p>
            </div>
          </section>

          {/* Method 5: 5:2 */}
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. La méthode 5:2</h2>
            <div className="prose text-gray-600 mb-6">
              <p>
                Contrairement aux méthodes précédentes (restriction temporelle journalière), le 5:2 se concentre sur la semaine. Vous mangez normalement (sans excès) pendant 5 jours, et vous limitez drastiquement vos calories (environ 500-600 kcal) pendant 2 jours non consécutifs (par exemple le lundi et le jeudi).
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-1">Pour qui ?</h3>
              <p className="text-blue-700 text-sm">
                Pour ceux qui ont du mal avec la restriction quotidienne mais qui peuvent supporter deux journées de diète stricte par semaine. C&apos;est une bonne alternative si vos week-ends sont très sociaux.
              </p>
            </div>
          </section>

          {/* Method 6: Jeûne Alterné */}
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Le jeûne alterné (Alternate-Day Fasting)</h2>
            <div className="prose text-gray-600 mb-6">
              <p>
                Le principe est simple : un jour vous mangez normalement à votre faim, et le lendemain vous jeûnez complètement (ou vous vous limitez à maximum 500 kcal). Vous alternez ainsi indéfiniment. Cette méthode crée un fort déficit calorique hebdomadaire.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-1">Pour qui ?</h3>
              <p className="text-blue-700 text-sm">
                Pour les personnes ayant un objectif de perte de poids important et rapide, capables de gérer la faim d&apos;un jeûne complet. Il n&apos;est pas fait pour les personnes ayant une activité physique intense les jours de jeûne.
              </p>
            </div>
             <Link
              href="/jeune-intermittent-perte-de-poids"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              En savoir plus sur la perte de poids <span className="ml-1">→</span>
            </Link>
          </section>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions Fréquentes (FAQ)</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quelle méthode de jeûne intermittent choisir pour débuter ?</h3>
              <p className="text-gray-600">La méthode 16/8 est idéale pour débuter. Elle consiste à jeûner pendant 16 heures et à concentrer vos repas sur une fenêtre de 8 heures (par exemple de 12h à 20h). C&apos;est la plus facile à intégrer dans un quotidien actif.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">16/8 ou 18/6 pour perdre du poids ?</h3>
              <p className="text-gray-600">Les deux méthodes sont efficaces. Le 18/6 offre une fenêtre alimentaire plus courte, ce qui peut accélérer la perte de poids chez certaines personnes en réduisant naturellement l’apport calorique. Cependant, le 16/8 reste le plus durable sur le long terme pour la majorité.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Peut-on boire pendant le jeûne ?</h3>
              <p className="text-gray-600">Oui, l’hydratation est essentielle. Vous pouvez boire de l’eau, du café noir et du thé (sans sucre, ni lait, ni édulcorant) pendant vos heures de jeûne sans rompre votre jeûne.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Le jeûne intermittent est-il dangereux ?</h3>
              <p className="text-gray-600">Pour la plupart des adultes en bonne santé, le jeûne intermittent est sans danger. Il est cependant déconseillé aux femmes enceintes ou allaitantes, aux enfants, et aux personnes souffrant de troubles du comportement alimentaire ou de certaines maladies (consultez toujours un médecin).</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/reponses-fasting"
              className="inline-block bg-white text-orange-600 border border-orange-200 font-semibold py-3 px-6 rounded-xl hover:bg-orange-50 transition-colors duration-200"
            >
              Voir toutes les questions fréquentes (FAQ)
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
