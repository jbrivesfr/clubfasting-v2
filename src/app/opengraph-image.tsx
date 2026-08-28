import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Le Fasting - Méthode de jeûne intermittent depuis 2012'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#faf6ec',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="https://app.clubfasting.com/club-fasting-logo.png"
          alt="Le Fasting Logo"
          style={{ width: '400px' }}
        />
        <p
          style={{
            fontSize: 48,
            color: '#374151',
            marginTop: 40,
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          Méthode de jeûne intermittent depuis 2012
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}
