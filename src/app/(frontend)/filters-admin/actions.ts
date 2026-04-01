"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { revalidateTag } from "next/cache"
import type { Category, FilterConfig } from "@/payload-types"

// Types for filter data
export type FilterOption = { value: string; label: string }
export type VisibilityRule = {
  targetOptionValue: string
  action: "hide" | "highlight" | "autoselect"
  whenFilterKey: string
  whenFilterValue: string
}
export type ShowWhenRule = {
  whenFilterKey: string
  whenFilterValue: string
}
export type Filter = {
  key: string
  label: string
  type: "checkbox" | "radio" | "range"
  isAdvanced?: boolean | null
  options?: FilterOption[] | null
  rangeMin?: number | null
  rangeMax?: number | null
  rangeStep?: number | null
  rangeUnit?: string | null
  showWhenRules?: ShowWhenRule[] | null
  visibilityRules?: VisibilityRule[] | null
}

// Get all categories (flat list with parent info)
export async function getAllCategories(): Promise<Category[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "categories",
    sort: "order",
    limit: 0,
    depth: 1,
  })
  return result.docs as Category[]
}

// Get all filter configs with category info
export async function getAllFilterConfigs(): Promise<FilterConfig[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "filter-configs",
    limit: 0,
    depth: 1,
  })
  return result.docs as FilterConfig[]
}

// Get single filter config by ID
export async function getFilterConfigById(id: number): Promise<FilterConfig | null> {
  const payload = await getPayload({ config })
  try {
    const doc = await payload.findByID({
      collection: "filter-configs",
      id,
      depth: 1,
    })
    return doc as FilterConfig
  } catch {
    return null
  }
}

// Create new filter config
export async function createFilterConfig(data: {
  categoryId: number
  filters: Filter[]
}): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const payload = await getPayload({ config })
    const doc = await payload.create({
      collection: "filter-configs",
      data: {
        category: data.categoryId,
        filters: data.filters,
      },
    })
    revalidateTag("filter-configs")
    return { success: true, id: doc.id }
  } catch (error) {
    console.error("createFilterConfig error:", error)
    return { success: false, error: String(error) }
  }
}

// Update filter config
export async function updateFilterConfig(
  id: number,
  data: {
    categoryId?: number
    filters?: Filter[]
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config })
    const updateData: Record<string, unknown> = {}
    if (data.categoryId !== undefined) updateData.category = data.categoryId
    if (data.filters !== undefined) updateData.filters = data.filters

    await payload.update({
      collection: "filter-configs",
      id,
      data: updateData,
    })
    revalidateTag("filter-configs")
    return { success: true }
  } catch (error) {
    console.error("updateFilterConfig error:", error)
    return { success: false, error: String(error) }
  }
}

// Toggle isEnabled for filter config
export async function toggleFiltersEnabled(
  id: number,
  isEnabled: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config })
    await payload.update({
      collection: "filter-configs",
      id,
      data: { isEnabled },
    })
    revalidateTag("filter-configs")
    return { success: true }
  } catch (error) {
    console.error("toggleFiltersEnabled error:", error)
    return { success: false, error: String(error) }
  }
}

// Delete filter config
export async function deleteFilterConfig(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: "filter-configs",
      id,
    })
    revalidateTag("filter-configs")
    return { success: true }
  } catch (error) {
    console.error("deleteFilterConfig error:", error)
    return { success: false, error: String(error) }
  }
}
