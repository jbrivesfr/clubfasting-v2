import Link from 'next/link'

export const metadata = {
  title: 'Changelog - Club Fasting',
  description: 'Découvrez les dernières mises à jour et améliorations de Club Fasting.',
}

export default async function ChangelogPage() {
  const res = await fetch('https://api.github.com/repos/jbrivesfr/clubfasting-v2/pulls?state=closed&per_page=100', {
    next: { revalidate: 3600 }
  })

  if (!res.ok) {
    console.error('Failed to fetch changelog:', res.status, res.statusText)
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">Changelog</h1>
          <p className="mt-4 text-xl text-neutral-500 dark:text-neutral-400">
            Une erreur est survenue lors du chargement des dernières mises à jour. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    )
  }

  const prs = await res.json()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const mergedPrs = prs
    .filter(pr => pr.merged_at && new Date(pr.merged_at) > thirtyDaysAgo)
    .sort((a, b) => new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime())

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">Changelog</h1>
          <p className="mt-4 text-xl text-neutral-500 dark:text-neutral-400">
            Découvrez les dernières améliorations apportées à votre application Club Fasting au cours des 30 derniers jours.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-md">
          {mergedPrs.length > 0 ? (
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {mergedPrs.map((pr) => (
                <li key={pr.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-500 truncate">
                        {pr.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(pr.merged_at))}
                        </p>
                      </div>
                    </div>
                    {pr.body && (
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                            {pr.body.split('\n')[0]} {/* Showing only the first line of the body for brevity */}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 sm:px-6 text-center text-neutral-500 dark:text-neutral-400">
              Aucune mise à jour majeure n'a été effectuée ces 30 derniers jours.
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
           <Link href="/" className="text-amber-600 hover:text-amber-500 font-medium">
             Retour à l'accueil
           </Link>
        </div>
      </div>
    </div>
  )
}
