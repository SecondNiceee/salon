// src/actions/getProductById.ts
'use server';

import { getPayload } from 'payload';
import config from '../../../payload.config';
import { Product } from '@/payload-types';

type Result =
  | { product: Product; error: null }
  | { product: null; error: { message: string } };


export const getProductById = async (id: number | string): Promise<Result> => {
  try {
    // Приводим id к строке (на всякий случай)
    const idStr = String(id);

    // Получаем инстанс Payload
    const payload = await getPayload({ config });

    // Ищем товар
    const result = await payload.findByID({
      collection: 'products',
      id: idStr,
      depth: 2,
       // подгружаем изображения, категории и т.д.
    });

    // Если товар не найден
    if (!result) {
      return {
        product: null,
        error: { message: 'Товар не найден' },
      };
    }

    return {
      product: result,
      error: null,
    };
  } catch (error: unknown) {
    // 🔹 Логируем ошибку на сервере
    console.error(`[getProductById] Ошибка при получении товара с ID ${id}:`, error);

    // 🔹 Возвращаем клиенту понятное сообщение
    return {
      product: null,
      error: { message: 'Не удалось загрузить товар' },
    };
  }
};
