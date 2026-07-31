import { createClient } from '@supabase/supabase-js'

export async function generateMetadata({ params }) {
  const { id } = params

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      title: 'Post sur Club Fasting'
    }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: comment } = await supabase
    .from('comments')
    .select('title, content, author_name')
    .eq('id', id)
    .single()

  if (!comment) {
    return {
      title: 'Post non trouvé'
    }
  }

  const title = comment.title || `Message de ${comment.author_name || 'Membre ClubFasting'}`
  const description = comment.content
    ? comment.content.replace(/<[^>]*>?/gm, '').substring(0, 160)
    : 'Découvrez ce message sur le Club Fasting.'

  return {
    title: `${title} | Club Fasting`,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og/newsfeed?id=${id}`,
          width: 1100,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/newsfeed?id=${id}`],
    },
  }
}

export default function PostRedirectPage({ params }) {
  // We do NOT use next/navigation server-side redirect here, otherwise
  // the crawler gets a 307 before receiving the <meta> tags.
  // Instead, return HTML to the crawler (which it ignores visual part of),
  // and trigger a client-side redirect for human visitors.

  return (
    <div className="min-h-screen bg-[#faf6ec] text-zinc-900 dark:bg-zinc-950 dark:text-white flex items-center justify-center p-6 text-center">
      <div>
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-bold font-display">Ouverture du message...</h1>
        <p className="text-sm text-zinc-500 mt-2">Vous allez être redirigé vers le fil d'actualités.</p>

        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace('/newsfeed?post=${params.id}');`
          }}
        />

        <noscript>
          <div className="mt-6">
            <a href={`/newsfeed?post=${params.id}`} className="text-orange-500 underline">
              Cliquez ici si la redirection ne fonctionne pas.
            </a>
          </div>
        </noscript>
      </div>
    </div>
  )
}
