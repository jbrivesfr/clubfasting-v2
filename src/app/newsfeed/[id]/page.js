import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Shared supabase client at module scope
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null

async function getComment(id) {
  if (!supabase) return null
  const { data } = await supabase
    .from('comments')
    .select('title, content, author_name, created_at, image_urls')
    .eq('id', id)
    .single()
  return data
}

export async function generateMetadata({ params }) {
  const { id } = params
  const comment = await getComment(id)

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
    alternates: {
      canonical: `https://app.clubfasting.com/newsfeed/${id}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: `https://app.clubfasting.com/api/og/newsfeed?id=${id}`,
          width: 1100,
          height: 630,
        },
      ],
      url: `https://app.clubfasting.com/newsfeed/${id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://app.clubfasting.com/api/og/newsfeed?id=${id}`],
    },
  }
}

export default async function PostRedirectPage({ params }) {
  const { id } = params

  let jsonLd = null;
  const comment = await getComment(id)

  if (comment) {
    const headline = comment.title || `Message de ${comment.author_name || 'Membre ClubFasting'}`
    const description = comment.content
      ? comment.content.replace(/<[^>]*>?/gm, '').substring(0, 160)
      : 'Découvrez ce message sur le Club Fasting.'

    // Safe image URL parsing (handles string, array, JSON string)
    const safeImageUrls = (raw) => {
      if (!raw) return []
      if (Array.isArray(raw)) return raw
      if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw)
          return Array.isArray(parsed) ? parsed : [raw]
        } catch (e) {
          return [raw]
        }
      }
      return []
    }

    const itemImages = safeImageUrls(comment.image_urls)
    const imageUrl = itemImages.length > 0 && typeof itemImages[0] === 'string'
      ? itemImages[0]
      : `https://app.clubfasting.com/api/og/newsfeed?id=${id}`

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": headline,
      "image": imageUrl,
      "datePublished": comment.created_at,
      "author": {
        "@type": "Person",
        "name": comment.author_name || 'Membre ClubFasting'
      },
      "description": description
    }
  }

  // We do NOT use next/navigation server-side redirect here, otherwise
  // the crawler gets a 307 before receiving the <meta> tags.
  // Instead, return HTML to the crawler (which it ignores visual part of),
  // and trigger a client-side redirect for human visitors.

  return (
    <div className="min-h-screen bg-[#faf6ec] text-zinc-900 dark:bg-zinc-950 dark:text-white flex items-center justify-center p-6 text-center">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
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
