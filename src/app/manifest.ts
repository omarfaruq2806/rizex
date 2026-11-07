import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RizeX — High Velocity Digital Agency & Milestone Platform',
    short_name: 'RizeX',
    description:
      'High-velocity digital agency platform for custom web applications, WordPress solutions, and AI automation workflows with escrow milestone security.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080402',
    theme_color: '#FFA500',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

