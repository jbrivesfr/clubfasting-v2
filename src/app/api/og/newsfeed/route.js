import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return new Response('Missing id', { status: 400 })
    }

    // Fetch the post content
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return new Response('Supabase credentials not configured', { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // We try to get from comments table
    const { data: comment, error } = await supabase
      .from('comments')
      .select('content, title, author_name')
      .eq('id', id)
      .single()

    if (error || !comment) {
      // If we couldn't find a comment, try to find a notification or return default
      return new Response('Not found', { status: 404 })
    }

    const title = comment.title || 'Nouveau message sur le Club Fasting'
    const authorName = comment.author_name || 'Membre ClubFasting'

    // We strip HTML tags from content for the subtitle (if needed)
    let textContent = comment.content || ''
    textContent = textContent.replace(/<[^>]*>?/gm, '').substring(0, 150)
    if (comment.content && comment.content.length > 150) {
      textContent += '...'
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#faf6ec',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #e2d9c3 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e2d9c3 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo or Brand */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#f97316' }}>Club Fasting</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              padding: '60px',
              borderRadius: '32px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
              width: '100%',
              border: '1px solid #e2d9c3',
              height: '420px', // Explicit height to prevent flex overflow issues
            }}
          >
            {/* Title / Content */}
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: '#18181b',
                lineHeight: 1.2,
                marginBottom: '20px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 28,
                color: '#52525b',
                lineHeight: 1.5,
                marginBottom: '40px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flexGrow: 1,
              }}
            >
              {textContent}
            </div>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '40px',
                  marginRight: '24px',
                  backgroundColor: '#f97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}
              >
                {authorName.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#18181b' }}>{authorName}</span>
                <span style={{ fontSize: 24, color: '#a1a1aa' }}>Sur le fil d'actualités</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1100,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
