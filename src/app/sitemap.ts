import type { MetadataRoute } from "next"
import { getPayload } from "payload"
import config from "@payload-config"

// ✅ Защита от invalid дат
function safeDate(dateString: string | null | undefined): Date {
  if (!dateString) return new Date()
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? new Date() : date
}

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  const payload = await getPayload({ config })

  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const categoriesResult = await payload.find({
      collection: "categories",
      limit: 100,
      where: {
        parent: {
          exists: false,
        },
      },
      select: {
        value: true,
        updatedAt: true,
      },
    })

    categoryRoutes = categoriesResult.docs.map((cat) => ({
      url: `${siteUrl}/${cat.value}`,
      lastModified: safeDate(cat.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  } catch (e) {
    console.error("Categories sitemap error:", e)
  }

  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const productsResult = await payload.find({
      collection: "products",
      limit: 10000,
      select: {
        id: true,
        updatedAt: true,
      },
    })

    productRoutes = productsResult.docs.map((product) => ({
      url: `${siteUrl}/product?id=${product.id}`,
      lastModified: safeDate(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch (e) {
    console.error("Products sitemap error:", e)
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
