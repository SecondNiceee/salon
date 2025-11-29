import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ['https://grandbazarr.ru'],
  //   },
  // },
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {  
  //           key: 'Content-Security-Policy',
  //           value: `
  //             default-src 'self';
  //             img-src 'self' data: https://grandbazarr.ru http://localhost:3000;
  //             script-src 'self' 'unsafe-eval' 'unsafe-inline';
  //             style-src 'self' 'unsafe-inline';
  //             font-src 'self' data:;
  //             connect-src 'self' http://localhost:3000 https://grandbazarr.ru;
  //             frame-ancestors 'self' https://grandbazarr.ru;
  //             object-src 'none';
  //             base-uri 'self';
  //             form-action 'self';
  //           `.replace(/\s+/g, ' ').trim(),
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'SAMEORIGIN',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //       ],
  //     }
  //   ]
  // },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/moskva',
        permanent: true, // Это 301-редирект
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "109.69.23.147",
      },
      {
        protocol: "https",
        hostname: "**", // Для production домена, если нужно
      },
    ],
    unoptimized: true,
  },
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
