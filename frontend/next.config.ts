import type { NextConfig } from 'next';

function backendImagePattern() {
  const apiUrl = process.env.API_URL ?? 'http://localhost:4000/api';

  try {
    const url = new URL(apiUrl);
    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: '/images/**' as const,
    };
  } catch {
    return {
      protocol: 'http' as const,
      hostname: 'localhost',
      port: '4000',
      pathname: '/images/**' as const,
    };
  }
}

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      backendImagePattern(),
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        pathname: '/img/**',
      },
    ],
  },
};

export default nextConfig;
