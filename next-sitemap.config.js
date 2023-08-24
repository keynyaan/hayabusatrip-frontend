module.exports = {
  siteUrl: 'https://www.hayabusatrip.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/500', '/settings', '/trips/*'],
      },
    ],
  },
  exclude: ['/404', '/500', '/settings', '/trips/*'],
}
