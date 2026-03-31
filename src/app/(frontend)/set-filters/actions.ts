"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import type { Category, Product, FilterConfig } from "@/payload-types"

// Get top-level categories (no parent)
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

// Get subcategories for a parent category
export async function getSubcategories(parentId: number): Promise<Category[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "categories",
    where: { parent: { equals: parentId } },
    sort: "order",
    limit: 0,
    depth: 0,
  })
  return result.docs as Category[]
}

// Get products by subCategory
export async function getProductsBySubCategory(subCategoryId: number): Promise<Product[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "products",
    where: { subCategory: { equals: subCategoryId } },
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

// Get filter config for a category or subcategory
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

// Check if category has subcategories with filter configs
export async function checkCategoryHasSubFilters(categoryId: number): Promise<boolean> {
  const payload = await getPayload({ config })
  
  // Get subcategories
  const subcategories = await payload.find({
    collection: "categories",
    where: { parent: { equals: categoryId } },
    limit: 0,
    depth: 0,
  })
  
  if (subcategories.docs.length === 0) return false
  
  // Check if any subcategory has a filter config
  for (const sub of subcategories.docs) {
    const filterConfig = await payload.find({
      collection: "filter-configs",
      where: { category: { equals: sub.id } },
      limit: 1,
      depth: 0,
    })
    if (filterConfig.docs.length > 0) return true
  }
  
  return false
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
