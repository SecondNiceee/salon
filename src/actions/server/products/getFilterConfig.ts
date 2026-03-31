"use server"

import { getPayload } from "payload"
import config from "../../../payload.config"
import type { FilterConfig, Category } from "@/payload-types"
import { unstable_cache } from "next/cache"

/**
 * Fetches the FilterConfig for a given category (or subcategory).
 * First looks for a FilterConfig linked directly to the subCategory,
 * then falls back to the parent category.
 */
const _getFilterConfig = async (
  subCategoryId: number,
  parentCategoryId?: number,
): Promise<FilterConfig | null> => {
  try {
    const payload = await getPayload({ config })

    // 1. Try to find FilterConfig for the subcategory directly
    const subCategoryResult = await payload.find({
      collection: "filter-configs",
      where: {
        category: { equals: subCategoryId },
      },
      limit: 1,
      depth: 0,
    })

    if (subCategoryResult.docs.length > 0) {
      return subCategoryResult.docs[0] as FilterConfig
    }

    // 2. Fallback: try to find FilterConfig for the parent category
    if (parentCategoryId) {
      const parentResult = await payload.find({
        collection: "filter-configs",
        where: {
          category: { equals: parentCategoryId },
        },
        limit: 1,
        depth: 0,
      })

      if (parentResult.docs.length > 0) {
        return parentResult.docs[0] as FilterConfig
      }
    }

    return null
  } catch (error) {
    console.error("Ошибка при получении FilterConfig:", error)
    return null
  }
}

export const getFilterConfig = async (
  subCategoryId: number,
  parentCategoryId?: number,
): Promise<FilterConfig | null> => {
  return unstable_cache(
    () => _getFilterConfig(subCategoryId, parentCategoryId),
    ["filter-configs", String(subCategoryId), String(parentCategoryId ?? "")],
    {
      tags: ["filter-configs"],
      revalidate: 60 * 60 * 24, // 24 hours
    },
  )()
}
