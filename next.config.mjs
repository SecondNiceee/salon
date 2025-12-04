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
      {
        source : "/kursy-massage",
        destination : "/moskva/kursy-massage",
        permanent : true
      },
      {
        source : "/kursy-kosmetologa",
        destination : "/moskva/kursy-kosmetologa",
        permanent : true
      },
      {
        source : "/kursy-tattoo",
        destination : "/moskva/kursy-tattoo",
        permanent : true
      },
      {
        source : "/massage",
        destination : "/moskva/massage",
        permanent : true
      },
      {
        source : "/massage-dlya-dvoih",
        destination : "/moskva/massage-dlya-dvoih",
        permanent : true
      },
      {
        source : "/anticellulitnyy-massage",
        destination : "/moskva/anticellulitnyy-massage",
        permanent : true
      },
      {
        source : "/lpg-massage",
        destination : "/moskva/lpg-massage",
        permanent : true
      },
      {
        source : "/abonementy-massage",
        destination : "/moskva/abonementy-massage",
        permanent : true
      },
      {
        source : "/cosmetology",
        destination : "/moskva/cosmetology",
        permanent : true
      },
      {
        source : "/spa",
        destination : "/moskva/spa",
        permanent : true
      },
      {
        source : "/spa-dlya-dvoih",
        destination : "/moskva/spa-dlya-dvoih",
        permanent : true
      },
      {
        source : "/tattoo",
        destination : "/moskva/tattoo",
        permanent : true
      },
      {
        source: "/podarochnyy-sertifikat",
        destination : "/moskva/podarochnyy-sertifikat",
        permanent : true
      },
      {
        source : "/favorites",
        destination : "/moskva/favorites",
        permanent : true
      },
      {
        source : "/orders",
        destination : "/moskva/orders",
        permanent : true
      },
      {
        source : "/profile",
        destination : "/moskva/profile",
        permanent : true
      },
      {
        source : "/catalog",
        destination : "/moskva/catalog",
        permanent : true
      },
      {
        source : "/contacts",
        destination : "/moskva/contacts",
        permanent : true
      },
      {
        source : "/login",
        destination : "/moskva/login",
        permanent : true
      },
      {
        source : "/product",
        destination : "/moskva/product",
        permanent : true
      }
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
        hostname: "**",
      },
    ],
    formats: ['image/avif', 'image/webp'], // Современные форматы
    minimumCacheTTL: 60 * 60 * 24 * 30, // Кэш на 30 дней
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
