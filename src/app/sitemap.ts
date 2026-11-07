import type { MetadataRoute } from 'next';

const ACTIVE_SERVICE_SLUGS = [
  'web-development',
  'ui-ux-design',
  'ai-automation',
  'digital-marketing',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rizex.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamically include service pages from backend with catalog fallback
  const slugMap = new Map<string, { lastModified: Date; priority: number }>();

  // Initialize with official catalog slugs
  ACTIVE_SERVICE_SLUGS.forEach((slug) => {
    slugMap.set(slug, {
      lastModified: now,
      priority: slug === 'web-development' ? 0.9 : 0.8,
    });
  });

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/services`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const services = Array.isArray(data) ? data : data?.data || [];
      if (Array.isArray(services)) {
        services.forEach((service: { slug: string; updatedAt?: string }) => {
          if (service.slug) {
            slugMap.set(service.slug, {
              lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
              priority: 0.85,
            });
          }
        });
      }
    }
  } catch {
    // Graceful fallback to pre-defined active catalog slugs
  }

  const serviceRoutes: MetadataRoute.Sitemap = Array.from(slugMap.entries()).map(
    ([slug, meta]) => ({
      url: `${siteUrl}/services/${slug}`,
      lastModified: meta.lastModified,
      changeFrequency: 'weekly' as const,
      priority: meta.priority,
    })
  );

  return [...staticRoutes, ...serviceRoutes];
}
