// src/actions/server/categories/getSubCategoryWithProducts.ts
"use server"

import { getPayload } from "payload"
import config from "../../../payload.config"
import type { Category, Product } from "@/payload-types"
import { unstable_cache } from "next/cache"

export type SubCategoryWithProducts = {
  subCategory: Category
  products: Product[]
  nextSubCategory: Category | null
  prevSubCategory: Category | null
  nextCategory: Category | null
  nextCategoryFirstSubCategory: Category | null
  prevCategory: Category | null
  prevCategoryLastSubCategory: Category | null
}

const _getSubCategoryWithProducts = async (subcategorySlug: string): Promise<SubCategoryWithProducts | null> => {
  try {
    const payload = await getPayload({ config })

    // 1. Найти подкатегорию по slug (value)
    const subCategoryResult = await payload.find({
      collection: "categories",
      where: {
        value: { equals: subcategorySlug },
        parent: { exists: true }, // Убеждаемся, что это подкатегория
      },
      limit: 1,
      depth: 2,
    })

    if (!subCategoryResult.docs.length) {
      return null
    }

    const subCategory = subCategoryResult.docs[0]
    const parentCategory = subCategory.parent as Category

    // 2. Получить все подкатегории с тем же parent (для навигации)
    const allSubCategories = await payload.find({
      collection: "categories",
      where: {
        parent: { equals: parentCategory.id },
      },
      sort: "createdAt",
      depth: 1,
    })

    // 3. Найти текущий индекс и определить следующую/предыдущую подкатегорию
    const currentIndex = allSubCategories.docs.findIndex((cat) => cat.id === subCategory.id)

    const nextSubCategory =
      currentIndex < allSubCategories.docs.length - 1 ? allSubCategories.docs[currentIndex + 1] : null

    const prevSubCategory = currentIndex > 0 ? allSubCategories.docs[currentIndex - 1] : null

    let nextCategory: Category | null = null
    let nextCategoryFirstSubCategory: Category | null = null
    let prevCategory: Category | null = null
    let prevCategoryLastSubCategory: Category | null = null

    if (!nextSubCategory || !prevSubCategory) {
      // Получаем все родительские категории
      const allParentCategories = await payload.find({
        collection: "categories",
        where: {
          parent: { exists: false },
        },
        sort: "createdAt",
        depth: 1,
      })

      // Находим индекс текущей родительской категории
      const parentIndex = allParentCategories.docs.findIndex((cat) => cat.id === parentCategory.id)

      // Если есть следующая категория и нет следующей подкатегории
      if (!nextSubCategory && parentIndex < allParentCategories.docs.length - 1) {
        nextCategory = allParentCategories.docs[parentIndex + 1]

        // Получаем первую подкатегорию следующей категории
        const nextCategorySubCategories = await payload.find({
          collection: "categories",
          where: {
            parent: { equals: nextCategory.id },
          },
          sort: "createdAt",
          limit: 1,
          depth: 1,
        })

        if (nextCategorySubCategories.docs.length > 0) {
          nextCategoryFirstSubCategory = nextCategorySubCategories.docs[0]
        }
      }

      if (!prevSubCategory && parentIndex > 0) {
        prevCategory = allParentCategories.docs[parentIndex - 1]

        // Получаем последнюю подкатегорию предыдущей категории
        const prevCategorySubCategories = await payload.find({
          collection: "categories",
          where: {
            parent: { equals: prevCategory.id },
          },
          sort: "-createdAt", // сортировка в обратном порядке чтобы получить последнюю
          limit: 1,
          depth: 1,
        })

        if (prevCategorySubCategories.docs.length > 0) {
          prevCategoryLastSubCategory = prevCategorySubCategories.docs[0]
        }
      }
    }

    // 5. Получить продукты этой подкатегории
    const productsResult = await payload.find({
      collection: "products",
      where: {
        subCategory: { equals: subCategory.id },
      },
      depth: 1,
      limit: 0, // все продукты
      sort: "createdAt",
      select: {
        averageRating: true,
        image: true,
        price: true,
        title: true,
        weight: true,
        reviewsCount: true,
        content: true,
        hasProductPage: true,
      },
    })

    return {
      subCategory,
      products: productsResult.docs,
      nextSubCategory,
      prevSubCategory,
      nextCategory,
      nextCategoryFirstSubCategory,
      prevCategory,
      prevCategoryLastSubCategory,
    }
  } catch (error) {
    console.error("Ошибка при получении подкатегории и товаров:", error)
    return null
  }
}

// Кэшируем на 1 день (86400 секунд) с тегом
export const getSubCategoryWithProducts = async (subcategorySlug: string) => {
  return unstable_cache(
    () => _getSubCategoryWithProducts(subcategorySlug),
    ["categories_and_products", subcategorySlug], // ✅ уникальный ключ для каждого слага
    {
      tags: ["categories_and_products"], // общий тег для массовой инвалидации
      revalidate: 60 * 60 * 24,
    },
  )()
}
