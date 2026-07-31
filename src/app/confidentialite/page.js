import Link from 'next/link'

export const metadata = {
  title: 'Politique de Confidentialité - Club Fasting',
  description: 'Politique de confidentialité et de gestion des données de Club Fasting.',
}

export default function Confidentialite() {
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

        <h1 className="text-3xl font-bold mb-4">Politique de Confidentialité</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Collecte des données</h2>
          <p>
            Nous collectons uniquement les données strictement nécessaires au fonctionnement de l&apos;application Club Fasting (email pour la connexion, données de suivi que vous choisissez d&apos;enregistrer).
          </p>

          <h2 className="text-xl font-semibold">2. Utilisation des données</h2>
          <p>
            Vos données sont utilisées exclusivement pour vous fournir le service Club Fasting. Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers à des fins commerciales.
          </p>

          <h2 className="text-xl font-semibold">3. Cookies et traceurs</h2>
          <p>
            Club Fasting n&apos;utilise <strong>aucun traceur ou outil d&apos;analyse tiers</strong> (pas de Google Analytics, pas de pixel Facebook, etc.). Les seuls cookies utilisés sont des cookies techniques strictement nécessaires au fonctionnement de l&apos;application (session de connexion).
          </p>

          <h2 className="text-xl font-semibold">4. Vos droits (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d&apos;accès, de rectification, de suppression et d&apos;opposition concernant vos données personnelles. Vous pouvez exercer ces droits en nous contactant à support@fasting.fr.
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
