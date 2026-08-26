import CanonicalPath from './CanonicalPath'
import SkipLink from './SkipLink'

export const metadata = {
  title: 'Dashboard | Club Fasting',
  description: 'Bienvenue sur votre tableau de bord personnel Club Fasting !! Suivez tous vos progrès de jeûne, analysez vos repas et atteignez tous vos objectifs !!!',
  alternates: {
    canonical: 'https://app.clubfasting.com/dashboard',
  },
  openGraph: {
    title: 'Dashboard | Club Fasting',
    description: 'Bienvenue sur votre tableau de bord personnel Club Fasting !! Suivez tous vos progrès de jeûne, analysez vos repas et atteignez tous vos objectifs !!!',
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
    description: 'Bienvenue sur votre tableau de bord personnel Club Fasting !! Suivez tous vos progrès de jeûne, analysez vos repas et atteignez tous vos objectifs !!!',
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
