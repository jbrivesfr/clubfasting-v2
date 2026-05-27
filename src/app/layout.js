export const metadata = {
  title: 'Club Fasting V2',
  description: 'Ton métabolisme, tes outils, tes résultats.',
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, background: '#f9fafb' }}>
        {children}
      </body>
    </html>
  )
}
