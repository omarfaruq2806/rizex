import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rizex.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamically include service pages
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/services`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const services = Array.isArray(data) ? data : data?.data || [];
      serviceRoutes = services.map((service: { slug: string; updatedAt?: string }) => ({
        url: `${siteUrl}/services/${service.slug}`,
        lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Fallback if backend is unreachable during static generation
    const fallbackSlugs = [
      'full-stack-nextjs-web-app',
      'saas-mvp-development',
      'ui-ux-design-prototype',
      'mobile-app-react-native',
      'custom-api-nestjs-backend',
    ];
    serviceRoutes = fallbackSlugs.map((slug) => ({
      url: `${siteUrl}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  }

  return [...staticRoutes, ...serviceRoutes];
}
