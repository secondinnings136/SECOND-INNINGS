export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/api/*',
          '/book/status',
        ],
      },
      // Google Crawler Specific Rule
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
        ],
      },
      // Microsoft Bing Crawler Specific Rule
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
        ],
        crawlDelay: 1,
      },
      // MSN / Bing Media Crawler
      {
        userAgent: 'msnbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
        ],
      },
      // DuckDuckGo Crawler
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://second-innings.in/sitemap.xml',
    host: 'https://second-innings.in',
  };
}
