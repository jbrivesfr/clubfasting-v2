export const metadata = {
  title: 'Connexion - Club Fasting',
  description: 'Accédez à votre compte Club Fasting pour retrouver votre espace de jeûne intermittent personnel et suivre votre incroyable progression au quotidien !!',
  alternates: {
    canonical: 'https://app.clubfasting.com/login',
  },
  openGraph: {
    title: 'Connexion - Club Fasting',
    description: 'Accédez à votre compte Club Fasting pour retrouver votre espace de jeûne intermittent personnel et suivre votre incroyable progression au quotidien !!',
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
    description: 'Accédez à votre compte Club Fasting pour retrouver votre espace de jeûne intermittent personnel et suivre votre incroyable progression au quotidien !!',
    images: ['https://app.clubfasting.com/club-fasting-logo.png'],
  },
}

export default function LoginLayout({ children }) {
  return <>{children}</>
}
