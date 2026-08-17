import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

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
        url: '/logo.png',
      },
    ],
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connexion - Club Fasting',
    description: 'Connectez-vous à votre compte Club Fasting pour accéder à votre espace de jeûne intermittent.',
  },
}

export default function LoginPage() {
  return <LoginForm />
}
