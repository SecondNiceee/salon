"use server"

import { unstable_cache } from "next/cache"
import { getPayload } from "payload"
import config from "../../../payload.config"
import type { Category } from "@/payload-types"

type ProductUrlData = {
  subcategorySlug: string
  productSlug: string
} | null

const getProductUrlDataCached = unstable_cache(
  async (productId: number): Promise<ProductUrlData> => {
    try {
      const payload = await getPayload({ config })

      const product = await payload.findByID({
        collection: "products",
        id: productId,
        depth: 1,
      })

      if (!product) {
        return null
      }

      // Get subcategory slug (value field from category)
      const subCategory = product.subCategory as Category | null
      if (!subCategory || !subCategory.value) {
        return null
      }

      return {
        subcategorySlug: subCategory.value,
        productSlug: product.slug || `product-${productId}`,
      }
    } catch (error) {
      console.error(`[getProductUrlData] Error for product ${productId}:`, error)
      return null
    }
  },
  ["product-url-data"],
  {
    tags: ["product-urls", "categories_and_products"],
    revalidate: 3600, // 1 hour
  },
)

export const getProductUrlData = async (productId: number): Promise<ProductUrlData> => {
  return getProductUrlDataCached(productId)
}

const getProductUrlsBatchCached = unstable_cache(
  async (productIds: number[]): Promise<Map<number, ProductUrlData>> => {
    try {
      const payload = await getPayload({ config })

      const products = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
        depth: 1,
        limit: productIds.length,
      })

      const urlMap = new Map<number, ProductUrlData>()

      for (const product of products.docs) {
        const subCategory = product.subCategory as Category | null
        if (subCategory && subCategory.value && product.slug) {
          urlMap.set(product.id, {
            subcategorySlug: subCategory.value,
            productSlug: product.slug,
          })
        } else {
          urlMap.set(product.id, null)
        }
      }

      return urlMap
    } catch (error) {
      console.error(`[getProductUrlsBatch] Error:`, error)
      return new Map()
    }
  },
  ["product-urls-batch"],
  {
    tags: ["product-urls", "categories_and_products"],
    revalidate: 3600,
  },
)

export const getProductUrlsBatch = async (productIds: number[]): Promise<Map<number, ProductUrlData>> => {
  return getProductUrlsBatchCached(productIds)
}
