// src/lib/searchProducts.ts
'use server';
import { getPayload } from 'payload';
import config from '../../../payload.config'; // путь к payload.config.ts
import { Product } from '@/payload-types'; // если сгенерирован

export const searchProducts = async (query: string): Promise<Product[] > => {
  if (!query || query.trim() === '') {
    return []
  }
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'products',
      where: {
        title: {
          contains: query, 
        },
      },
      select : {
            averageRating : true,
            image : true,
            price : true,
            title : true,
            reviewsCount : true
          },
      limit: 10,
      depth: 1,  // Загружать связанные поля (например, изображения)
    });

    return result.docs as Product[]
  } catch (error) {
    console.error('Ошибка при поиске товаров:', error);
    throw error;
  }
};
