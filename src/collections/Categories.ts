// src/collections/Categories.ts
import { isAccess, isAdmin } from '@/utils/accessUtils';
import type { CollectionConfig } from 'payload';

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group : "Категории, подкатегории, товары",
    defaultColumns: ['title', 'parent', 'value'],
  },
  access : {
    create : isAccess("categories"),
    read : () => true,
    update : isAccess("categories"),
    delete : isAccess("categories"),
  },
  fields: [
    {
      name: 'value',
      type: 'text',
      unique: true,
      label: 'Уникальный ключ (label)',
      required: true,
      index : true,
      admin: {
        description:
          'Уникальное значение (английское) для категории. Используется внутри кода. ДОЛЖНО БЫТЬ ОДНО СЛОВО! НЕЛЬЗЯ ПРОБЕЛОВ',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string') {
          return 'Значение должно быть строкой';
        }
        if (!value) return true; // required: true уже проверит

        const regex = /^[a-z0-9_-]+$/;
        if (!regex.test(value)) {
          return 'Только латинские буквы, цифры, дефис (-) и подчёркивание (_)';
        }
        if (value.includes(' ')) {
          return 'Нельзя использовать пробелы';
        }
        if (value.length < 1) {
          return 'Минимум 1 символ';
        }
        return true;
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      label: 'Родительская категория',
      relationTo: 'categories',
      required: false,
      admin: {
        description: 'Если не выбрано — это основная категория',
      },
      filterOptions: {
        parent: {
          exists : false
        },
      },
    },

    // 🖼️ Иконка — только для родительских категорий
    {
      name: 'icon',
      type: 'upload',
      label: 'Иконка',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, { parent }) => !parent, // Только если НЕТ родителя
        description: 'Иконка нужна только для основных категорий',
      },
    },

    // 🖼️ Обложка — только для подкатегорий (если есть parent)
    {
      name: 'coverImage',
      type: 'upload',
      label: 'Обложка подкатегории',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, { parent }) => Boolean(parent), // Показывать, только если ЕСТЬ родитель
        description: 'Загрузите обложку для подкатегории (видны в каталоге)',
      },
    },
  ],
};

export default Categories;
