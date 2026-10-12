/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://app.clubfasting.com',
  generateRobotsTxt: true,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/'],
      },
    ],
  },
};
