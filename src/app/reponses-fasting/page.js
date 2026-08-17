import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Questions Fréquentes - Le Fasting',
  description: 'Trouvez les réponses à vos questions sur le jeûne intermittent. Café noir, thé, jus, durée du jeûne, sport, alimentation et horaires flexibles pour réussir.',
  alternates: {
    canonical: 'https://app.clubfasting.com/reponses-fasting',
  },
};

export default function ReponsesFasting() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Puis-je boire du café noir pendant le jeûne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, vous pouvez tout à fait boire du café noir pendant votre fenêtre de jeûne. Assurez-vous simplement de ne pas y ajouter de sucre, de lait, de crème ou d\'édulcorant, car cela casserait votre jeûne. Le café noir peut même vous aider à couper la faim grâce à la caféine.',
        },
      },
      {
        '@type': 'Question',
        name: 'Le thé est-il autorisé pendant le jeûne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolument. Tous les thés (vert, noir, blanc) et infusions (camomille, menthe, etc.) sont autorisés pendant le jeûne. Comme pour le café, vous devez les consommer nature, sans ajouter de miel, de sucre ou de lait.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle est la différence entre une durée de 12h et de 16h de jeûne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Un jeûne de 12 heures est souvent naturel (par exemple de 20h à 8h) et repose le système digestif. Un jeûne de 16 heures (méthode 16/8) prolonge la période pendant laquelle votre corps puise dans ses réserves de graisse pour produire de l\'énergie, optimisant ainsi la perte de poids et l\'autophagie.',
        },
      },
      {
        '@type': 'Question',
        name: 'Que faire si je stagne après 1 à 2 semaines (effet plateau) ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Il est très courant de rencontrer un plateau après quelques semaines. Si cela se produit, vérifiez que vous ne compensez pas pendant votre fenêtre alimentaire. Vous pouvez également varier la durée de votre jeûne, augmenter légèrement votre niveau d\'activité physique, ou vérifier votre hydratation. Donnez à votre corps le temps de s\'adapter.',
        },
      },
      {
        '@type': 'Question',
        name: 'Puis-je pratiquer un sport modéré en jeûnant ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, le sport modéré (comme la marche rapide, le yoga ou un footing léger) est tout à fait compatible avec le jeûne intermittent et peut même stimuler davantage la combustion des graisses. Écoutez toujours votre corps et hydratez-vous bien.',
        },
      },
      {
        '@type': 'Question',
        name: 'Puis-je boire des jus ou manger des fruits pendant le jeûne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Non, la consommation de jus ou de fruits cassera votre jeûne. Ils contiennent des glucides et du fructose qui déclencheront une sécrétion d\'insuline. Gardez les fruits pour votre fenêtre d\'alimentation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment dois-je m\'alimenter à la reprise de mon jeûne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Privilégiez une alimentation équilibrée et non transformée. Commencez par des protéines de qualité, des bons lipides et des fibres (légumes). Évitez les repas trop copieux ou très riches en sucres rapides pour ne pas brusquer votre système digestif.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment le jeûne affecte-t-il les femmes et le cycle hormonal ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le corps féminin peut être plus sensible au stress induit par un jeûne prolongé. Il est recommandé de commencer en douceur, par exemple avec un jeûne de 12h ou 14h. Si vous ressentez une grande fatigue ou des dérèglements, n\'hésitez pas à adapter vos horaires ou à consulter un professionnel de santé.',
        },
      },
      {
        '@type': 'Question',
        name: 'Puis-je avoir des horaires flexibles d\'un jour à l\'autre ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bien sûr. La flexibilité est l\'un des grands avantages du jeûne intermittent. Si vous jeûnez de 20h à 12h un jour, vous pouvez très bien faire de 21h à 13h le lendemain, ou adapter selon vos événements sociaux. L\'important est de respecter votre fenêtre de repos digestif.',
        },
      },
      {
        '@type': 'Question',
        name: 'À quoi ressemble une journée type de menus en jeûne intermittent ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dans un schéma 16/8 classique, vous pourriez boire de l\'eau et du café noir le matin. À 12h30, un premier repas composé de poulet grillé, de légumes de saison et d\'un filet d\'huile d\'olive. Vers 16h, une collation avec quelques amandes ou un fruit. À 20h, un dîner incluant du poisson, des légumes et des légumineuses. À vous de l\'adapter selon vos goûts !',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#faf6ec] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Navbar */}
      <nav className="bg-white border-b border-[#e2d9c3] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-xl font-bold text-gray-900 tracking-tight">Le Fasting</span>
            </Link>
            <div className="hidden md:flex space-x-6 items-center">
              <Link href="/jeune-intermittent" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Guide</Link>
              <Link href="/methodes-jeune" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Méthodes</Link>
              <Link href="/login" className="text-orange-600 hover:text-orange-700 text-sm font-medium border border-orange-200 bg-orange-50 px-4 py-2 rounded-full">Connexion</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 md:py-16">

        <div className="mb-12">
          <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center mb-6">
            <span className="mr-2">←</span> Retour à l'accueil
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Vos questions, nos réponses sur le jeûne
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
            Vous débutez avec le jeûne intermittent ou vous avez un doute sur une pratique ?
            Retrouvez ici les réponses aux questions les plus fréquentes pour vous accompagner sereinement.
          </p>
        </div>

        <div className="space-y-8">

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Puis-je boire du café noir pendant le jeûne ?</h2>
            <div className="prose text-gray-600">
              <p>
                Oui, vous pouvez tout à fait boire du café noir pendant votre fenêtre de jeûne. Assurez-vous simplement de ne pas y ajouter de sucre, de lait, de crème ou d'édulcorant, car cela casserait votre jeûne. Le café noir peut même vous aider à couper la faim grâce à la caféine.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Le thé est-il autorisé pendant le jeûne ?</h2>
            <div className="prose text-gray-600">
              <p>
                Absolument. Tous les thés (vert, noir, blanc) et infusions (camomille, menthe, etc.) sont autorisés pendant le jeûne. Comme pour le café, vous devez les consommer nature, sans ajouter de miel, de sucre ou de lait.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Quelle est la différence entre une durée de 12h et de 16h de jeûne ?</h2>
            <div className="prose text-gray-600">
              <p>
                Un jeûne de 12 heures est souvent naturel (par exemple de 20h à 8h) et repose le système digestif. Un jeûne de 16 heures (méthode 16/8) prolonge la période pendant laquelle votre corps puise dans ses réserves de graisse pour produire de l'énergie, optimisant ainsi la perte de poids et l'autophagie.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Que faire si je stagne après 1 à 2 semaines (effet plateau) ?</h2>
            <div className="prose text-gray-600">
              <p>
                Il est très courant de rencontrer un plateau après quelques semaines. Si cela se produit, vérifiez que vous ne compensez pas pendant votre fenêtre alimentaire. Vous pouvez également varier la durée de votre jeûne, augmenter légèrement votre niveau d'activité physique, ou vérifier votre hydratation. Donnez à votre corps le temps de s'adapter.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Puis-je pratiquer un sport modéré en jeûnant ?</h2>
            <div className="prose text-gray-600">
              <p>
                Oui, le sport modéré (comme la marche rapide, le yoga ou un footing léger) est tout à fait compatible avec le jeûne intermittent et peut même stimuler davantage la combustion des graisses. Écoutez toujours votre corps et hydratez-vous bien.
              </p>
            </div>
          </section>

          {/* Newsletter Form between Q5 and Q6 */}
          <div className="my-10 bg-orange-50 border border-orange-100 rounded-2xl p-6 md:p-8 text-center shadow-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Recevez nos conseils chaque semaine
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Rejoignez notre newsletter pour ne manquer aucune astuce sur le jeûne intermittent.
            </p>
            <form action="/subscribe" method="POST" className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                placeholder="Votre adresse e-mail"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                S'inscrire
              </button>
            </form>
          </div>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Puis-je boire des jus ou manger des fruits pendant le jeûne ?</h2>
            <div className="prose text-gray-600">
              <p>
                Non, la consommation de jus ou de fruits cassera votre jeûne. Ils contiennent des glucides et du fructose qui déclencheront une sécrétion d'insuline. Gardez les fruits pour votre fenêtre d'alimentation.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Comment dois-je m'alimenter à la reprise de mon jeûne ?</h2>
            <div className="prose text-gray-600">
              <p>
                Privilégiez une alimentation équilibrée et non transformée. Commencez par des protéines de qualité, des bons lipides et des fibres (légumes). Évitez les repas trop copieux ou très riches en sucres rapides pour ne pas brusquer votre système digestif.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Comment le jeûne affecte-t-il les femmes et le cycle hormonal ?</h2>
            <div className="prose text-gray-600">
              <p>
                Le corps féminin peut être plus sensible au stress induit par un jeûne prolongé. Il est recommandé de commencer en douceur, par exemple avec un jeûne de 12h ou 14h. Si vous ressentez une grande fatigue ou des dérèglements, n'hésitez pas à adapter vos horaires ou à consulter un professionnel de santé.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Puis-je avoir des horaires flexibles d'un jour à l'autre ?</h2>
            <div className="prose text-gray-600">
              <p>
                Bien sûr. La flexibilité est l'un des grands avantages du jeûne intermittent. Si vous jeûnez de 20h à 12h un jour, vous pouvez très bien faire de 21h à 13h le lendemain, ou adapter selon vos événements sociaux. L'important est de respecter votre fenêtre de repos digestif.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. À quoi ressemble une journée type de menus en jeûne intermittent ?</h2>
            <div className="prose text-gray-600">
              <p>
                Dans un schéma 16/8 classique, vous pourriez boire de l'eau et du café noir le matin. À 12h30, un premier repas composé de poulet grillé, de légumes de saison et d'un filet d'huile d'olive. Vers 16h, une collation avec quelques amandes ou un fruit. À 20h, un dîner incluant du poisson, des légumes et des légumineuses. À vous de l'adapter selon vos goûts !
              </p>
            </div>
          </section>

        </div>

        {/* Newsletter Form at the bottom of the page */}
        <div className="mt-16 bg-white border border-gray-200 rounded-2xl p-8 md:p-12 text-center shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Envie d'aller plus loin ?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir nos derniers articles, recettes et conseils exclusifs sur le jeûne intermittent directement dans votre boîte mail.
          </p>
          <form action="/subscribe" method="POST" className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              name="email"
              placeholder="Votre adresse e-mail"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Je m'abonne
            </button>
          </form>
        </div>

      </main>
      <Footer />
    </div>
  );
}
