/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['uploads.mangadex.org']
  },
  // rewrites() {
  //   return [{
  //     source: '/api/:path*',
  //     destination: 'https://api.mangadex.org/:path*'
  //   }
  // ]
  // }
}

module.exports = nextConfig
