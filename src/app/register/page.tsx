import RegisterForm from './RegisterForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Inscription - Club Fasting',
  description: 'Créez votre compte Club Fasting pour commencer votre jeûne intermittent.',
  alternates: {
    canonical: 'https://app.clubfasting.com/register',
  },
  openGraph: {
    title: 'Inscription - Club Fasting',
    description: 'Créez votre compte Club Fasting pour commencer votre jeûne intermittent.',
    url: 'https://app.clubfasting.com/register',
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
    title: 'Inscription - Club Fasting',
    description: 'Créez votre compte Club Fasting pour commencer votre jeûne intermittent.',
  },
}

export default function RegisterPage() {
  return <RegisterForm />
}
