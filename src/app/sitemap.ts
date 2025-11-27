import type { MetadataRoute } from "next"
import { getPayload } from "payload"
import config from "@payload-config"

function safeDate(dateString: string | null | undefined): Date {
  if (!dateString) return new Date()
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? new Date() : date
}

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const payload = await getPayload({ config })

  let cities: any[] = []
  try {
    const citiesGlobal = await payload.findGlobal({
      slug: "cities",
    })
    cities = citiesGlobal.cities || []
  } catch (e) {
    console.error("Cities sitemap error:", e)
    cities = [{ slug: "moskva", name: "Москва" }] // Fallback
  }

  const staticRoutes: MetadataRoute.Sitemap = []
  for (const city of cities) {
    staticRoutes.push(
      {
        url: `${siteUrl}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${siteUrl}/${city.slug}/catalog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${siteUrl}/${city.slug}/contacts`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      },
    )
  }

  const subcategoryRoutes: MetadataRoute.Sitemap = []
  try {
    const subcategoriesResult = await payload.find({
      collection: "categories",
      limit: 1000,
      where: {
        parent: {
          exists: true, // Only subcategories (those with a parent)
        },
      },
      select: {
        value: true,
        updatedAt: true,
      },
    })

    for (const city of cities) {
      for (const subcat of subcategoriesResult.docs) {
        subcategoryRoutes.push({
          url: `${siteUrl}/${city.slug}/${subcat.value}`,
          lastModified: safeDate(subcat.updatedAt),
          changeFrequency: "daily" as const,
          priority: 0.8,
        })
      }
    }
  } catch (e) {
    console.error("Subcategories sitemap error:", e)
  }

  const productRoutes: MetadataRoute.Sitemap = []
  try {
    const productsResult = await payload.find({
      collection: "products",
      limit: 10000,
      select: {
        id: true,
        updatedAt: true,
      },
    })

    for (const city of cities) {
      for (const product of productsResult.docs) {
        productRoutes.push({
          url: `${siteUrl}/${city.slug}/product?id=${product.id}`,
          lastModified: safeDate(product.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })
      }
    }
  } catch (e) {
    console.error("Products sitemap error:", e)
  }

  const pageRoutes: MetadataRoute.Sitemap = []
  try {
    const pagesResult = await payload.find({
      collection: "pages",
      limit: 100,
      where: {
        _status: {
          equals: "published",
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    for (const city of cities) {
      for (const page of pagesResult.docs) {
        pageRoutes.push({
          url: `${siteUrl}/${city.slug}/${page.slug}`,
          lastModified: safeDate(page.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })
      }
    }
  } catch (e) {
    console.error("Pages sitemap error:", e)
  }

  return [...staticRoutes, ...subcategoryRoutes, ...productRoutes, ...pageRoutes]
}
