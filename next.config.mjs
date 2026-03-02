import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_CDN_URL
      : undefined,
  async headers() {
    return [
      {
        source: '/:path*.{js,css}',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000' } // 30 дней
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/moskva',
        permanent: true, // Это 301-редирект
      },
      {
        source: "/kursy-massage",
        destination: "/moskva/kursy-massage",
        permanent: true
      },
      {
        source: "/kursy-kosmetologa",
        destination: "/moskva/kursy-kosmetologa",
        permanent: true
      },
      {
        source: "/kursy-tattoo",
        destination: "/moskva/kursy-tattoo",
        permanent: true
      },
      {
        source: "/massage",
        destination: "/moskva/massage",
        permanent: true
      },
      {
        source: "/massage-dlya-dvoih",
        destination: "/moskva/massage-dlya-dvoih",
        permanent: true
      },
      {
        source: "/anticellulitnyy-massage",
        destination: "/moskva/anticellulitnyy-massage",
        permanent: true
      },
      {
        source: "/lpg-massage",
        destination: "/moskva/lpg-massage",
        permanent: true
      },
      {
        source: "/abonementy-massage",
        destination: "/moskva/abonementy-massage",
        permanent: true
      },
      {
        source: "/cosmetology",
        destination: "/moskva/cosmetology",
        permanent: true
      },
      {
        source: "/spa",
        destination: "/moskva/spa",
        permanent: true
      },
      {
        source: "/spa-dlya-dvoih",
        destination: "/moskva/spa-dlya-dvoih",
        permanent: true
      },
      {
        source: "/tattoo",
        destination: "/moskva/tattoo",
        permanent: true
      },
      {
        source: "/podarochnyy-sertifikat",
        destination: "/moskva/podarochnyy-sertifikat",
        permanent: true
      },
      {
        source: "/favorites",
        destination: "/moskva/favorites",
        permanent: true
      },
      {
        source: "/orders",
        destination: "/moskva/orders",
        permanent: true
      },
      {
        source: "/profile",
        destination: "/moskva/profile",
        permanent: true
      },
      {
        source: "/catalog",
        destination: "/moskva/catalog",
        permanent: true
      },
      {
        source: "/contacts",
        destination: "/moskva/contacts",
        permanent: true
      },
      {
        source: "/login",
        destination: "/moskva/login",
        permanent: true
      },
      {
        source: "/product",
        destination: "/moskva/product",
        permanent: true
      }
    ]
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "alexestetica.ru" },
      { protocol: "https", hostname: "kesijuhidipret.begetcdn.cloud" }, // Добавляем CDN домен от Beget
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

}

export default withPayload(nextConfig, { devBundleServerPackages: false })
