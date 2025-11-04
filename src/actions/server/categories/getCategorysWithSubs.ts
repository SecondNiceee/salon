// src/actions/getCategoriesWithSubcategories.ts
'use server';

import { getPayload } from 'payload';
import config from '../../../payload.config';
import { Category } from '@/payload-types';

export type CategoryWithSubs = {
  subCategories: Category[];
} & Category

export const getCategoriesWithSubs = async (): Promise<CategoryWithSubs[]> => {
  try {
    const payload = await getPayload({ config });

    // 1. Получаем основные категории (без родителя)
    const mainCategoriesResult = await payload.find({
      collection: 'categories',
      where: {
        parent: { exists: false },
      },
      depth: 1, 
      limit: 100,
      sort : "createdAt"
    });

    // 2. Для каждой — получаем подкатегории
    const result = await Promise.all(
      mainCategoriesResult.docs.map(async (mainCat) => {
        const subCategoriesResult = await payload.find({
          collection: 'categories',
          where: {
            parent: { equals: mainCat.id },
          },
          depth: 1,
          limit: 50,
        });

        return {
          ...mainCat,
          subCategories: subCategoriesResult.docs,
        };
      })
    );
    return result;
  } catch (error) {
    console.error('Ошибка при загрузке категорий с подкатегориями:', error);
    return [];
  }
};
