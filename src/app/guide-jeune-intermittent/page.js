import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Guide du Jeûne Intermittent : Tous les protocoles',
  description: 'Découvrez notre guide complet sur le jeûne intermittent. Apprenez quel protocole est fait pour vous (16:8, 18:6, 14:10, 5:2) et commencez à votre rythme.',
  alternates: {
    canonical: 'https://app.clubfasting.com/guide-jeune-intermittent',
  },
  openGraph: {
    title: 'Guide du Jeûne Intermittent : Tous les protocoles',
    description: 'Découvrez notre guide complet sur le jeûne intermittent. Apprenez quel protocole est fait pour vous (16:8, 18:6, 14:10, 5:2) et commencez à votre rythme.',
    url: 'https://app.clubfasting.com/guide-jeune-intermittent',
    type: 'article',
    images: [
      {
        url: 'https://app.clubfasting.com/og-guide.jpg',
        width: 1200,
        height: 630,
        alt: 'Guide Jeûne Intermittent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide du Jeûne Intermittent : Tous les protocoles',
    description: 'Découvrez notre guide complet sur le jeûne intermittent. Apprenez quel protocole est fait pour vous (16:8, 18:6, 14:10, 5:2) et commencez à votre rythme.',
    images: ['https://app.clubfasting.com/og-guide.jpg'],
  },
};

export default function GuideJeuneIntermittentPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://app.clubfasting.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Guides",
        "item": "https://app.clubfasting.com/guide-jeune-intermittent"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Jeûne intermittent",
        "item": "https://app.clubfasting.com/guide-jeune-intermittent"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quel protocole de jeûne intermittent est le plus efficace pour débuter ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour les débutants, le protocole 14:10 ou 16:8 est souvent le plus recommandé. Il permet à votre corps de s'habituer progressivement à une fenêtre de jeûne sans générer trop de stress, tout en étant facile à intégrer dans votre quotidien."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de temps avant de voir les premiers effets ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les premiers effets comme le regain d'énergie ou un meilleur confort digestif peuvent se ressentir dès les premiers jours. Pour des changements plus durables sur la silhouette, il faut généralement compter quelques semaines de pratique régulière."
        }
      },
      {
        "@type": "Question",
        "name": "Le jeûne 16:8 est-il adapté aux débutants ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, le jeûne 16:8 est très populaire et tout à fait adapté aux débutants. Si vous avez l'habitude de beaucoup grignoter, vous pouvez commencer par un 14:10 ou 12:12 pour y aller en douceur, puis évoluer vers le 16:8."
        }
      }
    ]
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 bg-white text-gray-900 leading-relaxed font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-center text-indigo-900">
        Guide du Jeûne Intermittent : Quel protocole choisir ?
      </h1>

      <div className="prose prose-lg mx-auto">
        <p className="mb-6">
          Bienvenue dans notre guide central dédié au jeûne intermittent. Si vous êtes ici, c'est probablement que vous cherchez à améliorer votre bien-être, retrouver de l'énergie ou atteindre un meilleur équilibre. Mais avec toutes les informations disponibles, il est parfois difficile de s'y retrouver. Vous vous demandez sûrement par où commencer.
        </p>
        <p className="mb-6">
          La première chose à comprendre, c'est qu'il n'existe pas une seule façon de pratiquer le jeûne intermittent. Votre corps est unique, votre emploi du temps l'est aussi, tout comme vos besoins et vos contraintes. C'est précisément pour cela que plusieurs protocoles existent. L'idée n'est pas de vous forcer à suivre un cadre rigide et inconfortable, mais plutôt de trouver la méthode qui s'intègre naturellement à votre style de vie. En jeûnant, l'objectif est de mettre votre système digestif au repos pour permettre à votre organisme de se concentrer sur d'autres fonctions essentielles, sans pour autant vous priver de vie sociale.
        </p>
        <p className="mb-6">
          Nous avons regroupé ci-dessous les différents protocoles de jeûne intermittent les plus pratiqués. Que vous soyez un grand débutant cherchant à y aller en douceur, ou que vous souhaitiez explorer une approche un peu plus avancée, vous trouverez une méthode adaptée à vos besoins. Ce guide est conçu comme un carrefour : il vous permet d'explorer les différentes options et de plonger dans des articles détaillés pour chaque méthode. Prenez le temps de les découvrir, et rappelez-vous qu'il est toujours préférable de commencer progressivement.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-800">Nos Guides par Protocole</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Jeûne 16:8</h3>
            <p className="text-gray-600 mb-6 flex-grow">La méthode la plus connue : 16 heures de jeûne et 8 heures pour s'alimenter, idéale pour un mode de vie actif.</p>
            <Link href="/jeune-16-8" className="inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg text-center hover:bg-indigo-700 transition-colors">
              Voir le guide
            </Link>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Jeûne 18:6</h3>
            <p className="text-gray-600 mb-6 flex-grow">Un protocole plus resserré de 18 heures, pour ceux qui ont déjà une expérience du jeûne et souhaitent aller plus loin.</p>
            <Link href="/jeune-18-6" className="inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg text-center hover:bg-indigo-700 transition-colors">
              Voir le guide
            </Link>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Jeûne 14:10</h3>
            <p className="text-gray-600 mb-6 flex-grow">L'approche en douceur parfaite pour débuter sereinement, avec une fenêtre de jeûne très accessible de 14 heures.</p>
            <Link href="/jeune-14-10" className="inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg text-center hover:bg-indigo-700 transition-colors">
              Voir le guide
            </Link>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Jeûne 5:2</h3>
            <p className="text-gray-600 mb-6 flex-grow">Une approche différente : manger normalement 5 jours, et réduire fortement son apport calorique 2 jours par semaine.</p>
            <Link href="/jeune-5-2" className="inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg text-center hover:bg-indigo-700 transition-colors">
              Voir le guide
            </Link>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-800">Foire Aux Questions (FAQ)</h2>
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Quel protocole de jeûne intermittent est le plus efficace pour débuter ?</h3>
            <p>Pour les débutants, le protocole 14:10 ou 16:8 est souvent le plus recommandé. Il permet à votre corps de s'habituer progressivement à une fenêtre de jeûne sans générer trop de stress, tout en étant facile à intégrer dans votre quotidien.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Combien de temps avant de voir les premiers effets ?</h3>
            <p>Les premiers effets comme le regain d'énergie ou un meilleur confort digestif peuvent se ressentir dès les premiers jours. Pour des changements plus durables sur la silhouette, il faut généralement compter quelques semaines de pratique régulière.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Le jeûne 16:8 est-il adapté aux débutants ?</h3>
            <p>Oui, le jeûne 16:8 est très populaire et tout à fait adapté aux débutants. Si vous avez l'habitude de beaucoup grignoter, vous pouvez commencer par un 14:10 ou 12:12 pour y aller en douceur, puis évoluer vers le 16:8.</p>
          </div>
        </div>

        <p className="mt-12 mb-8 text-center">
          Un terme vous échappe ou vous cherchez une définition précise ?<br />
          N'hésitez pas à consulter notre <Link href="/glossaire-jeune-intermittent" className="text-indigo-600 hover:underline font-medium">Glossaire du jeûne intermittent</Link>.
        </p>
      </div>
      <Footer />
    </main>
  );
}