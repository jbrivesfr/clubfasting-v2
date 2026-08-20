import './globals.css'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://club-fasting.com'),
  title: 'Club Fasting',
  description: "Une nouvelle version pour mieux jeûner. Profitez de notre fenêtre de jeûne, du simulateur de glycémie et de l'analyse de repas par IA.",
  openGraph: {
    title: 'Club Fasting',
    description: "Une nouvelle version pour mieux jeûner. Profitez de notre fenêtre de jeûne, du simulateur de glycémie et de l'analyse de repas par IA.",
    url: 'https://app.clubfasting.com',
    siteName: 'Club Fasting',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club Fasting',
    description: "Une nouvelle version pour mieux jeûner. Profitez de notre fenêtre de jeûne, du simulateur de glycémie et de l'analyse de repas par IA.",
    images: ['/og-image.jpg'],
  },
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
}

// Applies the saved theme before paint to avoid a flash. Light is the default.
const themeInitScript = `try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`

export default function RootLayout({ children }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Le Fasting",
      "url": "https://clubfasting.com",
      "inLanguage": "fr-FR"
    }
  ];

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
