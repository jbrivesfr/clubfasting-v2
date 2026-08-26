import CanonicalPath from './CanonicalPath'
import SkipLink from './SkipLink'

export const metadata = {
  title: 'Dashboard | Club Fasting',
  description: 'Votre espace personnel Club Fasting.',
  openGraph: {
    title: 'Dashboard | Club Fasting',
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
    title: 'Dashboard | Club Fasting',
    description: 'Votre espace personnel Club Fasting.',
    images: ['https://app.clubfasting.com/club-fasting-logo.png'],
  },
}

export default function DashboardLayout({ children }) {
  return (
    <>
      <SkipLink />
      <CanonicalPath />
      <nav aria-label="Navigation principale" className="hidden"></nav>
      <main id="main-content" tabIndex="-1">
        {children}
      </main>
    </>
  )
}
