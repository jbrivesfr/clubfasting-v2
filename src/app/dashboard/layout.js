import CanonicalPath from './CanonicalPath'

export const metadata = {
  title: 'Tableau de bord - Club Fasting',
  description: 'Votre espace personnel Club Fasting.',
  openGraph: {
    title: 'Tableau de bord - Club Fasting',
    description: 'Votre espace personnel Club Fasting.',
    url: 'https://app.clubfasting.com/dashboard',
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
    title: 'Tableau de bord - Club Fasting',
    description: 'Votre espace personnel Club Fasting.',
    images: ['https://app.clubfasting.com/club-fasting-logo.png'],
  },
}

export default function DashboardLayout({ children }) {
  return (
    <>
      <CanonicalPath />
      {children}
    </>
  )
}
