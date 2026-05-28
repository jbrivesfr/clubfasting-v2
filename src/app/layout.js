import './globals.css'

export const metadata = {
  title: 'Club Fasting',
  description: 'Ton métabolisme, tes outils, tes résultats.',
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
