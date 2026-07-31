import Link from 'next/link'

export const metadata = {
  title: 'L\'Assiette du Fasting : Que Manger pour Casser le Jeûne ?',
  description: 'Découvrez comment composer l\'assiette idéale pour rompre votre jeûne intermittent. Astuces, aliments recommandés et erreurs à éviter pour maximiser vos résultats.',
  alternates: {
    canonical: 'https://app.clubfasting.com/assiettedufasting',
  },
  openGraph: {
    title: 'L\'Assiette du Fasting : Que Manger pour Casser le Jeûne ?',
    description: 'Découvrez comment composer l\'assiette idéale pour rompre votre jeûne intermittent. Astuces, aliments recommandés et erreurs à éviter pour maximiser vos résultats.',
    url: 'https://app.clubfasting.com/assiettedufasting',
    type: 'article',
  }
}

export default function AssietteDuFastingPage() {
  return (
    <main className="min-h-screen bg-[#faf6ec] text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">

        <div className="mb-8">
          <Link href="/" className="inline-block">
            <img
              src="/club-fasting-logo.png"
              alt="Club Fasting Logo"
              className="w-48 h-auto"
            />
          </Link>
        </div>

        <h1 className="text-4xl font-black mb-6 text-orange-600 tracking-tight leading-tight">
          L'Assiette du Fasting : Que manger pour casser le jeûne ?
        </h1>

        <div className="prose prose-lg text-gray-700 max-w-none">
          <p className="lead text-xl text-gray-600 mb-8 font-medium">
            Vous avez tenu votre période de jeûne, félicitations ! Mais maintenant, que devez-vous mettre dans votre assiette pour maximiser les bienfaits de vos efforts ? Le choix de votre premier repas est crucial.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-800">1. L'importance de la rupture du jeûne</h2>
          <p className="mb-6">
            L'erreur la plus commune est de se jeter sur des aliments très sucrés ou ultra-transformés. Après plusieurs heures sans manger, votre corps est particulièrement sensible à l'insuline. Un repas trop riche en glucides rapides provoquera un pic de glycémie important, suivi d'une baisse brutale qui vous laissera fatigué et affamé.
          </p>
          <p className="mb-6">
            L'objectif de "l'assiette du fasting" est donc d'apporter les nutriments essentiels tout en maintenant une stabilité énergétique. C'est le moment idéal pour nourrir votre corps avec ce dont il a vraiment besoin pour se régénérer.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-800">2. Comment composer l'assiette idéale ?</h2>
          <p className="mb-6">
            Pour rompre votre jeûne en douceur, voici la structure recommandée de votre première assiette :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Des protéines de qualité (environ 30-40% de l'assiette)</strong> : Elles sont essentielles pour la satiété et le maintien de la masse musculaire. Optez pour des œufs, du poulet, du poisson, du tofu ou des légumineuses.</li>
            <li><strong>Des légumes riches en fibres (environ 40-50% de l'assiette)</strong> : Les fibres ralentissent l'absorption des glucides et nourrissent votre microbiote. Brocolis, épinards, courgettes ou une belle salade mixte sont d'excellents choix.</li>
            <li><strong>Des bonnes graisses (environ 10-20% de l'assiette)</strong> : Avocat, huile d'olive vierge extra, noix ou graines. Les lipides aident à l'absorption des vitamines et procurent une énergie durable.</li>
          </ul>

          <p className="mb-6">
            Si vous souhaitez en savoir plus sur la méthode classique du jeûne, n'hésitez pas à consulter notre <Link href="/jeune-intermittent-16-8" className="text-indigo-600 hover:underline">guide complet sur le jeûne intermittent 16/8</Link> qui détaille les horaires et les fonctionnements.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-800">3. Exemples concrets de repas</h2>
          <p className="mb-6">
            Voici quelques exemples d'assiettes parfaites pour reprendre l'alimentation :
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Une omelette de 3 œufs aux épinards avec un demi-avocat et une poignée de tomates cerises.</li>
            <li>Un bol composé de quinoa, dés de poulet grillé, brocolis vapeur et un filet d'huile d'olive.</li>
            <li>Une grande salade avec du thon, des olives, des concombres et des graines de courge.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-800">Conclusion</h2>
          <p className="mb-6">
            Votre assiette du fasting n'a pas besoin d'être compliquée. Privilégiez les aliments bruts, non transformés, et écoutez votre faim. Mangez lentement et savourez ce repas que votre corps attend avec impatience.
          </p>
          <p className="mb-12">
            Pour découvrir d'autres articles et ressources sur la nutrition et nos méthodes, vous pouvez explorer notre <Link href="/sitemap-contenus" className="text-indigo-600 hover:underline">plan du site et liste des contenus</Link>. Prenez soin de vous !
          </p>
        </div>
      </div>
    </main>
  );
}
