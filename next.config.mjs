import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['https://grandbazarr.ru'],
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${process.env.NEXT_PUBLIC_URL || 'https://grandbazarr.ru'};`,
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Your Next.js config here
  // images: {
  //   remotePatterns: [
  //     // {
  //     //   protocol: 'https',
  //     //   hostname: 'grandbazarr.ru',
  //     //   port: '',
  //     //   pathname: '/api/media/file/**',
  //     // },
  //     {
  //       protocol: 'http',
  //       hostname: 'localhost',
  //       port: '3000',
  //       pathname: '/api/media/file/**',
  //     },
  //   ],
  // },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  eslint: {
    ignoreDuringBuilds: true, // Added eslint ignoreDuringBuilds setting
  },
  typescript: {
    ignoreBuildErrors: true, // Added typescript ignoreBuildErrors setting
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
