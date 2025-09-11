/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure based on environment
  ...(process.env.NODE_ENV === 'production' && process.env.FIREBASE_BUILD 
    ? {
        // Firebase Hosting - static export
        output: 'export',
        trailingSlash: true,
      }
    : {
        // Local development - standard Next.js
      }),
  env: {
    NEXT_PUBLIC_SIMULATION_API_URL: process.env.SIMULATION_API_URL || 'http://localhost:8000',
  },
  // Domain configuration for aprio.one (Firebase Hosting + Cloud Run)
  async rewrites() {
    // Only for local development - Firebase handles rewrites in production
    if (process.env.NODE_ENV !== 'production' || !process.env.FIREBASE_BUILD) {
      return [
        {
          source: '/api/:path*',
          destination: process.env.SIMULATION_API_URL ? `${process.env.SIMULATION_API_URL}/:path*` : 'http://localhost:8000/:path*',
        },
      ];
    }
    return [];
  },
  // Allow images from aprio.one domains
  images: {
    domains: ['aprio.one', 'dev.aprio.one', 'staging.aprio.one', 'www.aprio.one'],
    ...(process.env.FIREBASE_BUILD && { unoptimized: true }), // Required for static export
  },
}

module.exports = nextConfig
