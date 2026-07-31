import Link from 'next/link'

export const metadata = {
  title: 'Mentions Légales - Club Fasting',
  description: 'Mentions légales de l\'application Club Fasting.',
}

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 flex flex-col px-4 py-8">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <header className="mb-8">
          <Link href="/" className="inline-block">
            <img
              src="/club-fasting-logo.png"
              alt="Club Fasting"
              className="h-12 w-auto"
            />
          </Link>
        </header>

        <h1 className="text-3xl font-bold mb-4">Mentions Légales</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Éditeur du site</h2>
          <p>
            Le site Club Fasting est édité par JB RIVES.<br />
            Contact : support@fasting.fr
          </p>

          <h2 className="text-xl font-semibold">2. Hébergement</h2>
          <p>
            Le site est hébergé par Google Cloud Platform (GCP).
          </p>

          <h2 className="text-xl font-semibold">3. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur le site (textes, images, logos, etc.) sont la propriété de leurs auteurs respectifs. Toute reproduction est interdite sans autorisation.
          </p>
        </section>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <Link href="/" className="text-orange-500 hover:underline">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
