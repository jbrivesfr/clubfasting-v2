export const metadata = {
  title: 'Connexion - Club Fasting',
  description: 'Connectez-vous à votre compte Club Fasting pour accéder à votre espace de jeûne intermittent.',
  alternates: {
    canonical: 'https://app.clubfasting.com/login',
  },
  openGraph: {
    title: 'Connexion - Club Fasting',
    description: 'Connectez-vous à votre compte Club Fasting pour accéder à votre espace de jeûne intermittent.',
    url: 'https://app.clubfasting.com/login',
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
    title: 'Connexion - Club Fasting',
    description: 'Connectez-vous à votre compte Club Fasting pour accéder à votre espace de jeûne intermittent.',
    images: ['https://app.clubfasting.com/club-fasting-logo.png'],
  },
}

export default function LoginLayout({ children }) {
  return <>{children}</>
}
