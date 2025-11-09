'use server'

import { getPayload } from 'payload'
import config from '../../../payload.config' // путь к payload.config.ts
import { Category, Product } from '@/payload-types'

type CategoryValue = string

export type ProductsWithSubCategory = {
  subCategory: Category
  products: Product[]
}

export const getFilteredProducts = async (
  filter: CategoryValue,
): Promise<ProductsWithSubCategory[] | null> => {
  try {
    const payload = await getPayload({ config });
    
    const parent = await payload.find({
      collection: 'categories',
      where: { value: { equals: filter } },
      limit: 1,
    })
    // 2. Найти подкатегории, у которых `parent` = parent.id

    const subCategories = await payload.find({
      collection: 'categories',
      where: {
        parent: { equals: parent.docs[0].id },
      },
      sort : "createdAt"
    })

    // Шаг 2: Для каждой подкатегории найти связанные продукты
    const result = await Promise.all(
      subCategories.docs.map(async (subCategory: Category) => {
        const productsResult = await payload.find({
          collection: 'products',
          where: {
            subCategory: { equals: subCategory.id }, // Продукты с этой подкатегорией
          },
          depth: 1,
          limit: 0,
          sort : "createdAt",
          select : {
            averageRating : true,
            image : true,
            price : true,
            title : true,
            weight : true,
            reviewsCount : true
          }
        })

        return {
          subCategory,
          products: productsResult.docs,
        } as ProductsWithSubCategory
      }),
    );


    // Фильтруем подкатегории, у которых есть продукты
    const filteredResult = result.filter((item) => item.products.length > 0)

    return filteredResult
  } catch (error) {
    console.error('Ошибка при получении подкатегорий и товаров:', error)
    return null
  }
}
