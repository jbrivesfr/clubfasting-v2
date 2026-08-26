export const metadata = {
  title: 'Inscription - Club Fasting',
  description: 'Créez votre compte Club Fasting pour commencer votre jeûne intermittent. Rejoignez notre programme exclusif pour transformer votre santé dès ce jour !',
  alternates: {
    canonical: 'https://app.clubfasting.com/register',
  },
  openGraph: {
    title: 'Inscription - Club Fasting',
    description: 'Créez votre compte Club Fasting pour commencer votre jeûne intermittent. Rejoignez notre programme exclusif pour transformer votre santé dès ce jour !',
    url: 'https://app.clubfasting.com/register',
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
    title: 'Inscription - Club Fasting',
    description: 'Créez votre compte Club Fasting pour commencer votre jeûne intermittent. Rejoignez notre programme exclusif pour transformer votre santé dès ce jour !',
    images: ['https://app.clubfasting.com/club-fasting-logo.png'],
  },
}

export default function RegisterLayout({ children }) {
  return <>{children}</>
}
