/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lyyevuyejxrjpsaisaal.supabase.co' },
      { protocol: 'https', hostname: 'vimeo.com' },
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'www.gravatar.com' },
      { protocol: 'https', hostname: 'clubfasting.com' }
    ]
  },
  async redirects() {
    return [
      {
        source: '/landing',
        destination: '/methodes-jeune',
        permanent: true,
      },
      {
        source: '/landing.php',
        destination: '/methodes-jeune',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
