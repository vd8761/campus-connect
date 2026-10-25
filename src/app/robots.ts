import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://campussquare.originbi.com').replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/api/files/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/university/attendance/',
          '/reports/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
