import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. React 19 Compiler Optimization
  reactCompiler: true,

  // 2. Enable Gzip and Brotli compression for smaller payload sizes
  compress: true,

  // 3. Obscure framework signature
  poweredByHeader: false,

  // 4. High-Performance Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // 5. Tree-shaking & Package Import Optimization
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge',
      'dompurify',
    ],
  },
};

export default nextConfig;

