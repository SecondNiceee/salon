"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import type { Category, Product, FilterConfig } from "@/payload-types"

export async function getTopLevelCategories(): Promise<Category[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "categories",
    where: { parent: { exists: false } },
    sort: "order",
    limit: 0,
    depth: 0,
  })
  return result.docs as Category[]
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "products",
    where: { category: { equals: categoryId } },
    limit: 0,
    depth: 0,
    select: {
      title: true,
      price: true,
      filterValues: true,
      category: true,
      subCategory: true,
    },
  })
  return result.docs as Product[]
}

export async function getFilterConfigByCategory(categoryId: number): Promise<FilterConfig | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "filter-configs",
    where: { category: { equals: categoryId } },
    limit: 1,
    depth: 0,
  })
  return (result.docs[0] as FilterConfig) ?? null
}

export async function updateProductFilterValues(
  productId: number,
  filterValues: { key: string; value: string }[],
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config })
    await payload.update({
      collection: "products",
      id: productId,
      data: { filterValues },
    })
    return { success: true }
  } catch (error) {
    console.error("[v0] updateProductFilterValues error:", error)
    return { success: false, error: String(error) }
  }
}
