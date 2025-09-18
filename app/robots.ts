import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://muneeb.design';

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: [`${baseUrl}/sitemap.xml`]
  };
}
