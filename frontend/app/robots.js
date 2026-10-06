export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api',
          '/api/',
          '/book/status',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api',
          '/api/',
          '/book/status',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api',
          '/api/',
          '/book/status',
        ],
      },
    ],
    sitemap: 'https://second-innings.in/sitemap.xml',
    host: 'https://second-innings.in',
  };
}
