import Link from 'next/link';

export const metadata = {
  title: 'Lexique du Jeûne Intermittent : 30 Termes Essentiels Définis',
  description: 'Découvrez notre lexique complet du jeûne intermittent : autophagie, cétose, insuline et bien d\'autres. Des définitions simples pour tout comprendre.',
  alternates: {
    canonical: 'https://app.clubfasting.com/lexique-jeune-intermittent',
  },
  openGraph: {
    title: 'Lexique du Jeûne Intermittent : 30 Termes Essentiels Définis',
    description: 'Découvrez notre lexique complet du jeûne intermittent : autophagie, cétose, insuline et bien d\'autres. Des définitions simples pour tout comprendre.',
    url: 'https://app.clubfasting.com/lexique-jeune-intermittent',
    type: 'article',
    images: [
      {
        url: 'https://app.clubfasting.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lexique du Jeûne Intermittent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lexique du Jeûne Intermittent : 30 Termes Essentiels',
    description: 'Découvrez notre lexique complet du jeûne intermittent : autophagie, cétose, insuline et bien d\'autres.',
    images: ['https://app.clubfasting.com/og-image.jpg'],
  },
};

export default function LexiquePage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Lexique du Jeûne Intermittent : 30 Termes Essentiels Définis",
    "author": {
      "@type": "Person",
      "name": "JB"
    },
    "datePublished": "2024-05-01T08:00:00+01:00",
    "image": "https://app.clubfasting.com/og-image.jpg"
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Qu'est-ce que l'autophagie ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'autophagie est un processus naturel de nettoyage cellulaire où le corps recycle ses propres déchets pour créer de nouvelles cellules saines."
        }
      },
      {
        "@type": "Question",
        "name": "Que signifie la cétose ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La cétose est un état métabolique où le corps brûle ses réserves de graisses pour produire de l'énergie, plutôt que d'utiliser le sucre (glucose)."
        }
      },
      {
        "@type": "Question",
        "name": "Qu'est-ce que le jeûne 16/8 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le 16/8 est la méthode la plus populaire consistant à jeûner pendant 16 heures et à regrouper ses repas sur une fenêtre de 8 heures."
        }
      }
    ]
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 bg-white text-gray-900 leading-relaxed font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-center text-indigo-900">
        Le Lexique Complet du Jeûne Intermittent
      </h1>

      <div className="prose prose-lg mx-auto">
        <p className="mb-8">
          Bienvenue dans notre lexique dédié au <Link href="/jeune-intermittent" className="text-indigo-600 hover:underline">jeûne intermittent</Link>. Lorsque l'on commence à s'intéresser à cette pratique, on est souvent confronté à un vocabulaire nouveau et parfois complexe. Que signifie exactement l'autophagie ? Qu'est-ce que la cétose ? Quel est le rôle de l'insuline ? Pour vous aider à y voir plus clair, nous avons rassemblé et défini les 30 termes incontournables. Ce guide est conçu pour vous accompagner dans votre compréhension, sans jargon médical inutile, avec bienveillance et simplicité.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">1. Autophagie</h2>
        <p className="mb-6">
          Processus naturel et essentiel de nettoyage cellulaire. Lorsque vous jeûnez, votre corps n'est plus occupé à digérer. Il profite de ce temps pour recycler les protéines endommagées et les déchets cellulaires afin de créer de nouvelles cellules saines. C'est en quelque sorte le "grand ménage" de votre organisme.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">2. Cétose</h2>
        <p className="mb-6">
          Un état métabolique naturel. En l'absence d'apport en glucides (sucre), votre foie va transformer vos réserves de graisses en petites molécules appelées corps cétoniques pour fournir de l'énergie à vos organes, notamment à votre cerveau. C'est l'un des mécanismes clés de la <Link href="/jeune-intermittent-perte-de-poids" className="text-indigo-600 hover:underline">perte de poids</Link>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">3. Jeûne 16/8</h2>
        <p className="mb-6">
          La méthode la plus courante et la plus accessible. Elle consiste à alterner 16 heures de jeûne avec une fenêtre d'alimentation de 8 heures. Si vous souhaitez en savoir plus sur la façon de s'y prendre au quotidien, consultez notre guide sur la <Link href="/jeune-intermittent-16-8" className="text-indigo-600 hover:underline">méthode 16/8</Link>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">4. Insuline</h2>
        <p className="mb-6">
          Hormone sécrétée par le pancréas en réponse à l'élévation du taux de sucre dans le sang (glycémie) après un repas. Son rôle principal est de faire entrer le sucre dans vos cellules pour qu'il soit utilisé comme énergie ou stocké (souvent sous forme de graisse). Le jeûne permet de maintenir un taux d'insuline bas.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">5. Résistance à l'insuline</h2>
        <p className="mb-6">
          Condition où vos cellules deviennent "sourdes" aux signaux de l'insuline, obligeant le pancréas à en produire toujours plus. Cela favorise le stockage des graisses et la fatigue. Le jeûne intermittent aide à restaurer cette sensibilité.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">6. Glycémie</h2>
        <p className="mb-6">
          Taux de sucre (glucose) présent dans votre sang. Maintenir une glycémie stable est fondamental pour éviter les coups de fatigue et les fringales en milieu de journée.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">7. Glycogène</h2>
        <p className="mb-6">
          La forme sous laquelle votre corps stocke les glucides dans le foie et les muscles. Pendant un jeûne, votre corps va d'abord puiser dans ses réserves de glycogène avant de s'attaquer à vos réserves de graisses.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">8. Glucagon</h2>
        <p className="mb-6">
          Souvent décrit comme l'hormone opposée à l'insuline. Lorsque votre taux de sucre dans le sang baisse (comme pendant un jeûne), le pancréas libère du glucagon pour demander au foie de libérer ses réserves d'énergie.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">9. Ghréline</h2>
        <p className="mb-6">
          Surnommée "l'hormone de la faim". Elle est produite par l'estomac et signale à votre cerveau qu'il est l'heure de manger. Fait intéressant : elle fonctionne par cycles. Si vous ignorez la faim, le taux de ghréline finit naturellement par redescendre.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">10. Leptine</h2>
        <p className="mb-6">
          L'hormone de la satiété. Sécrétée principalement par vos cellules graisseuses, elle indique à votre cerveau que vous avez suffisamment mangé et que vous pouvez arrêter d'avoir faim.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">11. Fenêtre d'alimentation</h2>
        <p className="mb-6">
          La période de la journée durant laquelle vous consommez vos calories. Dans le cadre d'un 16/8, cette fenêtre s'étend sur 8 heures (par exemple de 12h à 20h).
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">12. Fenêtre de jeûne</h2>
        <p className="mb-6">
          La période où vous vous abstenez de consommer toute calorie. Seules l'eau, les tisanes et le café noir sont autorisés pour ne pas relancer la digestion.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">13. OMAD (One Meal A Day)</h2>
        <p className="mb-6">
          Une forme avancée de jeûne intermittent qui consiste à ne faire qu'un seul repas par jour (souvent un jeûne de 23h et une fenêtre d'alimentation d'1h). Une pratique à aborder progressivement pour être à l'aise.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">14. Jeûne 14/10</h2>
        <p className="mb-6">
          Une approche plus douce, idéale pour les débutants ou certaines femmes selon leur cycle, avec 14 heures de repos digestif et 10 heures pour s'alimenter.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">15. Jeûne 5:2</h2>
        <p className="mb-6">
          Méthode consistant à manger normalement pendant 5 jours de la semaine et à réduire drastiquement ses calories (autour de 500-600) les 2 jours restants.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">16. Jeûne sec</h2>
        <p className="mb-6">
          Un jeûne où l'on s'abstient à la fois de manger et de boire. Cette pratique n'est généralement pas recommandée dans le cadre de nos approches quotidiennes pour des raisons de sécurité et d'hydratation.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">17. Rompre le jeûne (Fast-breaking)</h2>
        <p className="mb-6">
          L'acte de prendre son premier repas après une période de jeûne. Le choix des aliments à ce moment-là est important pour votre confort digestif. N'hésitez pas à vous inspirer de notre <Link href="/menu-jeune-intermittent" className="text-indigo-600 hover:underline">menu pour le jeûne intermittent</Link>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">18. Métabolisme basal</h2>
        <p className="mb-6">
          La quantité d'énergie (calories) que votre corps dépense au repos complet pour maintenir ses fonctions vitales (respiration, rythme cardiaque, température corporelle).
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">19. Corps cétoniques</h2>
        <p className="mb-6">
          Les molécules produites par votre foie à partir de vos graisses lorsque vous êtes en cétose. Elles constituent un excellent carburant, très propre, pour votre cerveau.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">20. Horloge circadienne</h2>
        <p className="mb-6">
          Votre rythme biologique sur 24 heures. Le jeûne intermittent aide souvent à recadrer cette horloge interne, favorisant ainsi un meilleur sommeil et une digestion optimisée.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">21. Macronutriments (Macros)</h2>
        <p className="mb-6">
          Les trois grandes familles d'éléments nutritifs qui fournissent de l'énergie : les protéines, les lipides (graisses) et les glucides. Pendant votre fenêtre de repas, un bon équilibre de ces trois éléments est essentiel.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">22. Lipides</h2>
        <p className="mb-6">
          Les bonnes graisses (avocat, huile d'olive, oléagineux, poissons gras). Elles sont vos amies : elles rassasient durablement et sont indispensables au bon fonctionnement de votre cerveau et de vos hormones.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">23. Glucides raffinés</h2>
        <p className="mb-6">
          Les sucres et farines blanches transformés (pain blanc, viennoiseries, sodas). Ils provoquent des pics d'insuline rapides suivis de fringales intenses, compliquant grandement la pratique du jeûne.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">24. Bruit digestif</h2>
        <p className="mb-6">
          L'énergie constante et les légers inconforts liés à la digestion en continu. Le jeûne permet de mettre le système sur "pause", réduisant l'inflammation globale et la sensation de lourdeur.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">25. Cortisol</h2>
        <p className="mb-6">
          L'hormone du stress. À haute dose chronique, elle favorise le stockage des graisses, notamment au niveau du ventre. Une pratique douce du jeûne, sans pression, permet de mieux réguler ce stress.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">26. Électrolytes</h2>
        <p className="mb-6">
          Minéraux essentiels (sodium, potassium, magnésium) présents dans le sang. Lors d'un jeûne, on en perd parfois un peu avec l'eau. Une simple pincée de sel marin dans un verre d'eau aide souvent à éviter les petits maux de tête.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">27. Jeûne hydrique</h2>
        <p className="mb-6">
          Un jeûne strict où seule la consommation d'eau est permise. Dans notre approche quotidienne, nous tolérons généralement les thés, tisanes et le café noir sans sucre.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">28. Flexibilité métabolique</h2>
        <p className="mb-6">
          La capacité de votre corps à passer facilement et efficacement d'un carburant (les glucides de l'alimentation) à un autre (vos propres graisses stockées). C'est le but ultime du jeûne intermittent.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">29. Fringale (Craving)</h2>
        <p className="mb-6">
          Cette envie irrépressible de manger, souvent orientée vers du sucré, qui n'est pas une véritable faim physiologique mais plutôt le résultat d'une baisse brutale de la glycémie ou d'une habitude ancrée.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3 text-indigo-800">30. Plateau de perte de poids</h2>
        <p className="mb-6">
          Période où la balance ne bouge plus malgré vos efforts. C'est un phénomène très courant et normal. Le corps s'adapte. Il suffit parfois de changer légèrement sa fenêtre de jeûne ou ses menus pour relancer la machine.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-800">En résumé</h2>
        <p className="mb-12">
          Nous espérons que ce lexique vous aura permis d'y voir plus clair. N'essayez pas de tout retenir d'un coup. Le jeûne intermittent est une pratique d'écoute avant tout. En vous familiarisant peu à peu avec ces concepts, vous comprendrez mieux les signaux que votre corps vous envoie. L'essentiel est d'avancer à votre rythme, avec bon sens et sérénité.
        </p>
      </div>
    </main>
  );
}
