import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Le guide complet du Jeûne Intermittent : 16/8, Bienfaits et Perte de poids',
  description: 'Découvrez tout ce qu\'il faut savoir sur le jeûne intermittent : les différentes méthodes (16/8), les bienfaits sur la santé, comment l\'intégrer à votre quotidien.',
  alternates: {
    canonical: 'https://app.clubfasting.com/jeune-intermittent',
  },
  openGraph: {
    title: 'Le guide complet du Jeûne Intermittent : 16/8, Bienfaits et Perte de poids',
    description: 'Découvrez tout ce qu\'il faut savoir sur le jeûne intermittent : les différentes méthodes (16/8), les bienfaits sur la santé, comment l\'intégrer à votre quotidien.',
    url: 'https://app.clubfasting.com/jeune-intermittent',
    type: 'article',
    images: [
      {
        url: 'https://app.clubfasting.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Le guide du Jeûne Intermittent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le guide complet du Jeûne Intermittent',
    description: 'Découvrez tout ce qu\'il faut savoir sur le jeûne intermittent : les différentes méthodes (16/8), les bienfaits sur la santé, comment l\'intégrer à votre quotidien.',
    images: ['https://app.clubfasting.com/og-image.jpg'],
  },
};

export default function JeuneIntermittentHubPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Qu'est-ce que le jeûne intermittent ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le jeûne intermittent est un mode d'alimentation qui alterne des périodes de jeûne (où l'on ne consomme pas de calories) et des périodes de prise alimentaire. Il ne s'agit pas d'un régime restrictif sur le choix des aliments, mais plutôt d'une organisation des repas dans le temps."
        }
      },
      {
        "@type": "Question",
        "name": "Quelle est la méthode la plus populaire ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La méthode la plus connue et la plus pratiquée est le 16/8. Elle consiste à jeûner pendant 16 heures consécutives (généralement en sautant le petit-déjeuner ou le dîner) et à regrouper tous ses repas sur une fenêtre de 8 heures."
        }
      },
      {
        "@type": "Question",
        "name": "Est-ce que le jeûne intermittent aide à perdre du poids ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, le jeûne intermittent peut vous aider à perdre du poids. En réduisant la fenêtre d'alimentation, vous réduisez naturellement l'apport calorique quotidien. De plus, les périodes de jeûne favorisent la baisse de l'insuline et l'utilisation des graisses stockées comme source d'énergie."
        }
      },
      {
        "@type": "Question",
        "name": "Peut-on boire pendant la période de jeûne ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolument. Il est même essentiel de bien s'hydrater. Pendant le jeûne, vous pouvez consommer de l'eau, du café noir, du thé ou des tisanes, à condition de ne pas y ajouter de sucre, de lait ou d'édulcorants pour ne pas rompre le jeûne."
        }
      }
    ]
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Le guide complet du Jeûne Intermittent",
    "author": {
      "@type": "Person",
      "name": "JB"
    },
    "datePublished": "2024-08-01T08:00:00+01:00",
    "image": "https://app.clubfasting.com/og-image.jpg"
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <div className="bg-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-block mb-8">
            <img
              src="/club-fasting-logo.png"
              alt="Club Fasting"
              className="h-12 w-auto"
            />
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Le guide complet du Jeûne Intermittent
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Bienvenue dans l'univers du jeûne intermittent. Si vous êtes ici, c'est que vous cherchez une méthode simple et naturelle pour retrouver votre forme, votre énergie, et vous sentir bien dans votre corps. Oubliez les régimes restrictifs compliqués. Découvrez comment réorganiser vos repas peut transformer votre quotidien.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-800 text-lg leading-relaxed">
        <p className="mb-8">
          Bonjour, c'est JB. Depuis des années, j'accompagne des milliers de personnes vers un mode de vie plus sain et équilibré grâce au jeûne intermittent. La clé du succès ne réside pas dans la privation, mais dans la compréhension de votre corps et de son rythme naturel. Sur cette page, j'ai rassemblé pour vous l'essentiel pour comprendre, démarrer et réussir votre pratique du jeûne.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-orange-600">Qu'est-ce que le jeûne intermittent ?</h2>
        <p className="mb-6">
          Contrairement à ce que l'on pourrait penser, le jeûne intermittent n'est pas un régime. C'est un mode d'alimentation, un rythme que l'on donne à ses repas. Vous ne changez pas nécessairement <em>ce que</em> vous mangez, mais <em>quand</em> vous le mangez. L'idée est simple : donner à votre système digestif le repos dont il a besoin pour que votre corps puisse puiser dans ses réserves et se régénérer.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-orange-600">Nos dossiers complets pour maîtriser le jeûne</h2>
        <p className="mb-6">
          Pour vous accompagner pas à pas, j'ai rédigé des guides détaillés sur les thématiques essentielles. Je vous invite à les parcourir pour construire une pratique sereine et durable :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <Link href="/jeune-intermittent-16-8" className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">La méthode 16/8</h3>
            <p className="text-gray-600">C'est la méthode reine. Découvrez comment jeûner 16 heures par jour de façon simple et intégrer ce rythme à votre vie sociale et familiale.</p>
            <span className="text-orange-600 font-medium mt-4 inline-block">Lire le guide →</span>
          </Link>

          <Link href="/jeune-intermittent-perte-de-poids" className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Jeûne et Perte de poids</h3>
            <p className="text-gray-600">Comprenez la mécanique de la perte de gras avec le jeûne, comment votre corps brûle les graisses et comment éviter la stagnation.</p>
            <span className="text-orange-600 font-medium mt-4 inline-block">Lire le dossier →</span>
          </Link>

          <Link href="/menu-jeune-intermittent" className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Menus et Repas</h3>
            <p className="text-gray-600">Que manger pendant vos fenêtres d'alimentation ? Voici des idées de repas équilibrés pour nourrir votre corps sans frustration.</p>
            <span className="text-orange-600 font-medium mt-4 inline-block">Voir les menus →</span>
          </Link>

          <Link href="/que-boire-pendant-le-jeune" className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">L'hydratation (Que boire ?)</h3>
            <p className="text-gray-600">Eau, café, thé, bouillon... Découvrez tout ce que vous pouvez boire pour tenir sereinement sans casser votre jeûne.</p>
            <span className="text-orange-600 font-medium mt-4 inline-block">En savoir plus →</span>
          </Link>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-orange-600">Foire Aux Questions (FAQ)</h2>
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Qu'est-ce que le jeûne intermittent ?</h3>
            <p>Le jeûne intermittent est un mode d'alimentation qui alterne des périodes de jeûne (où l'on ne consomme pas de calories) et des périodes de prise alimentaire. Il ne s'agit pas d'un régime restrictif sur le choix des aliments, mais plutôt d'une organisation des repas dans le temps.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Quelle est la méthode la plus populaire ?</h3>
            <p>La méthode la plus connue et la plus pratiquée est le 16/8. Elle consiste à jeûner pendant 16 heures consécutives (généralement en sautant le petit-déjeuner ou le dîner) et à regrouper tous ses repas sur une fenêtre de 8 heures.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Est-ce que le jeûne intermittent aide à perdre du poids ?</h3>
            <p>Oui, le jeûne intermittent peut vous aider à perdre du poids. En réduisant la fenêtre d'alimentation, vous réduisez naturellement l'apport calorique quotidien. De plus, les périodes de jeûne favorisent la baisse de l'insuline et l'utilisation des graisses stockées comme source d'énergie.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Peut-on boire pendant la période de jeûne ?</h3>
            <p>Absolument. Il est même essentiel de bien s'hydrater. Pendant le jeûne, vous pouvez consommer de l'eau, du café noir, du thé ou des tisanes, à condition de ne pas y ajouter de sucre, de lait ou d'édulcorants pour ne pas rompre le jeûne.</p>
          </div>
        </div>

        <p className="mt-12 mb-8">
          Prenez votre temps pour explorer ces ressources. Le plus important est d'y aller progressivement et d'écouter votre corps. N'hésitez pas à nous rejoindre sur le <Link href="/newsfeed" className="text-orange-600 hover:underline">fil d'actualité</Link> pour échanger avec le reste du Club Fasting.
        </p>

        <p className="mb-12 font-semibold">
          JB · Le Fasting
        </p>

      </div>
      <Footer />
    </main>
  );
}