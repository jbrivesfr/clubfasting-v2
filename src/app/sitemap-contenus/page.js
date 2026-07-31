import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Plan du site - Contenus',
  description: 'Liste de tous les contenus et articles du Club Fasting.',
}

export default async function SitemapContenusPage() {
  const supabase = createClient()

  // We query journey_steps and get the content to find all permalinks
  // Note: content is the mapped relation in Supabase
  const { data, error } = await supabase
    .from('journey_steps')
    .select('content:content_id ( id, permalink, title )')
    .not('content_id', 'is', null)

  let contents = []

  if (data && !error) {
    const rawContents = data.map(d => d.content).filter(c => c && c.permalink)

    // Remove duplicates by permalink
    const permalinks = new Set()
    for (const c of rawContents) {
      if (!permalinks.has(c.permalink)) {
        permalinks.add(c.permalink)
        contents.push(c)
      }
    }

    // Sort alphabetically by title
    contents.sort((a, b) => {
      const titleA = a.title || a.permalink
      const titleB = b.title || b.permalink
      return titleA.localeCompare(titleB, 'fr')
    })
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Que contient cette page de plan du site ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cette page contient la liste complète de tous les articles et contenus disponibles sur le Club Fasting, classés par ordre alphabétique pour faciliter votre recherche."
        }
      },
      {
        "@type": "Question",
        "name": "Comment accéder à un article spécifique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Il vous suffit de cliquer sur le titre de l'article dans la liste pour être redirigé directement vers son contenu complet."
        }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href="/" className="inline-block mb-8">
            <img
              src="/club-fasting-logo.png"
              alt="Logo Club Fasting, l'application pour votre jeûne intermittent"
              className="w-48 h-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold mb-4">Plan du site : Tous nos contenus</h1>
          <p className="text-gray-600 mb-8">
            Retrouvez ci-dessous la liste de tous les articles et contenus disponibles sur le Club Fasting.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4">Dossiers : Jeûne Intermittent</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/jeune-intermittent" className="text-orange-600 hover:text-orange-700 hover:underline block truncate" title="Le guide complet du Jeûne Intermittent : 16/8, Bienfaits et Perte de poids">
                Le guide complet du Jeûne Intermittent : 16/8, Bienfaits et Perte de poids
              </Link>
            </li>
            <li>
              <Link href="/jeune-intermittent-16-8" className="text-orange-600 hover:text-orange-700 hover:underline block truncate" title="La méthode 16/8 : Comment pratiquer le jeûne intermittent efficacement">
                La méthode 16/8 : Comment pratiquer le jeûne intermittent efficacement
              </Link>
            </li>
            <li>
              <Link href="/jeune-intermittent-18-6" className="text-orange-600 hover:text-orange-700 hover:underline block truncate" title="La méthode 18/6 : Comment pratiquer le jeûne intermittent efficacement">
                La méthode 18/6 : Comment pratiquer le jeûne intermittent efficacement
              </Link>
            </li>
            <li>
              <Link href="/jeune-intermittent-perte-de-poids" className="text-orange-600 hover:text-orange-700 hover:underline block truncate" title="Jeûne Intermittent et Perte de Poids : Résultats et Mécanismes">
                Jeûne Intermittent et Perte de Poids : Résultats et Mécanismes
              </Link>
            </li>
            <li>
              <Link href="/menu-jeune-intermittent" className="text-orange-600 hover:text-orange-700 hover:underline block truncate" title="Menu pour le Jeûne Intermittent : Que manger pour rompre le jeûne ?">
                Menu pour le Jeûne Intermittent : Que manger pour rompre le jeûne ?
              </Link>
            </li>
            <li>
              <Link href="/que-boire-pendant-le-jeune" className="text-orange-600 hover:text-orange-700 hover:underline block truncate" title="Que peut-on boire pendant un jeûne intermittent sans le casser ?">
                Que peut-on boire pendant un jeûne intermittent sans le casser ?
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">Tous les autres contenus</h2>
          {error && (
            <div className="text-red-500 mb-4">
              Erreur lors du chargement des contenus.
            </div>
          )}

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contents.map((content) => (
              <li key={content.id}>
                <Link
                  href={`/${content.permalink}`}
                  className="text-orange-600 hover:text-orange-700 hover:underline block truncate"
                  title={content.title || content.permalink}
                >
                  {content.title || content.permalink}
                </Link>
              </li>
            ))}
          </ul>

          {contents.length === 0 && !error && (
            <p className="text-gray-500 italic">Aucun contenu trouvé.</p>
          )}
        </div>
      </div>
    </div>
  )
}
