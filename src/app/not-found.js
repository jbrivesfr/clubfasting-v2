import Link from 'next/link'

export const metadata = {
  title: 'Page introuvable — Club Fasting',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
        <img
          className="mx-auto h-24 w-auto object-contain mb-8"
          src="/club-fasting-logo.png"
          alt="Club Fasting Logo"
        />

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">404</h1>
        <p className="mt-2 text-lg font-medium text-gray-900">Page introuvable</p>
        <p className="mt-2 text-base text-gray-500">Rejoins la communauté du fasting</p>

        <div className="mt-10 flex flex-col items-center space-y-4 w-full">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-full rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            Retour au tableau de bord
          </Link>

          <a
            href="mailto:support@clubfasting.com"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Contacter le support
          </a>
        </div>
      </div>
    </div>
  )
}
