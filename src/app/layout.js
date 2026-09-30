import './globals.css'

import PublicCanonicalPath from './PublicCanonicalPath'

export const metadata = {
  metadataBase: new URL('https://app.clubfasting.com'),
  title: {
    template: '%s | Le Fasting',
    default: 'Le Fasting — méthode simple pour jeûner 12-16h',
  },
  description: 'Rejoignez la communauté du fasting intermittent. Méthode pas à pas, soutien quotidien, programmes adaptés.',
  openGraph: {
    type: 'website',
    siteName: 'Le Fasting',
    locale: 'fr_FR',
    url: 'https://app.clubfasting.com',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
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
      "@type": "Organization",
      "name": "Club Fasting",
      "url": "https://clubfasting.com",
      "logo": "https://clubfasting.com/logo.png",
      "sameAs": []
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Club Fasting",
      "url": "https://clubfasting.com",
      "inLanguage": "fr-FR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://clubfasting.com/recherche?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <html lang="fr">
      <head>
        <PublicCanonicalPath />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          id="json-ld"
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
