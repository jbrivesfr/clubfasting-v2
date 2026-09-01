import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1c1917',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
        }}
      >
        <span
          style={{
            fontSize: 20,
            color: '#ffffff',
            fontWeight: 800,
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          F
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}
