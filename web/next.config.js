/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SIMULATION_API_URL: process.env.SIMULATION_API_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig
