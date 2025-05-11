/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed invalid 'api' configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig