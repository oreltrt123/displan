/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Make sure you don't have a custom distDir setting
  // If you do, it should match what's in vercel.json
  // distDir: '.next'
}

module.exports = nextConfig