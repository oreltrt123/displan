/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>[^.]+)\\.displan\\.design',
          },
        ],
        destination: '/api/sites/:subdomain/:path*',
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www\\.(?<subdomain>[^.]+)\\.displan\\.design',
          },
        ],
        destination: '/api/sites/:subdomain/:path*',
      },
    ]
  },
}

module.exports = nextConfig