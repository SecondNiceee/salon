import type { CollectionConfig } from "payload"
import { isAccess } from "@/utils/accessUtils"
import { revalidateTag } from "next/cache"

const FilterConfigs: CollectionConfig = {
  slug: "filter-configs",
  admin: {
    useAsTitle: "id",
    group: "Категории, подкатегории, товары",
    description: "Настройка фильтров для категорий и подкатегорий",
    defaultColumns: ["category", "updatedAt"],
  },
  access: {
    create: isAccess("categories"),
    read: () => true,
    update: isAccess("categories"),
    delete: isAccess("categories"),
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("filter-configs")
          revalidateTag("categories_and_products")
        } catch {
          // revalidateTag не работает вне контекста Next.js (например, в скриптах)
        }
      },
    ],
  },
  fields: [
    {
      name: "category",
      type: "relationship",
      label: "Категория или подкатегория",
      relationTo: "categories",
      required: true,
      unique: true,
      admin: {
        description:
          "Выберите категорию или подкатегорию, для которой настраиваются фильтры. Один конфиг на одну категорию.",
      },
    },
    {
      name: "filters",
      type: "array",
      label: "Фильтры",
      admin: {
        description: "Список фильтров, которые будут отображаться на странице",
      },
      fields: [
        {
          name: "key",
          type: "text",
          label: "Ключ",
          required: true,
          admin: {
            description:
              "Уникальный ключ фильтра на английском (без пробелов): goal, direction, format, document",
          },
        },
        {
          name: "label",
          type: "text",
          label: "Название фильтра",
          required: true,
          admin: {
            description: 'Текст заголовка фильтра: "Ваша цель", "Направление", "Документ"',
          },
        },
        {
          name: "type",
          type: "select",
          label: "Тип выбора",
          required: true,
          defaultValue: "checkbox",
          options: [
            {
              label: "Чекбоксы (можно выбрать несколько)",
              value: "checkbox",
            },
            {
              label: "Радиокнопки (только одно значение)",
              value: "radio",
            },
            {
              label: "Диапазон (ползунок)",
              value: "range",
            },
          ],
        },
        {
          name: "rangeMin",
          type: "number",
          label: "Минимальное значение диапазона",
          defaultValue: 0,
          admin: {
            description: "Нижняя граница ползунка (например, 0 или 30)",
            condition: (_, siblingData) => siblingData?.type === "range",
          },
        },
        {
          name: "rangeMax",
          type: "number",
          label: "Максимальное значение диапазона",
          defaultValue: 120,
          admin: {
            description: "Верхняя граница ползунка (например, 120 или 480)",
            condition: (_, siblingData) => siblingData?.type === "range",
          },
        },
        {
          name: "rangeStep",
          type: "number",
          label: "Шаг ползунка",
          defaultValue: 30,
          admin: {
            description: "Шаг изменения значения (например, 30 для минут)",
            condition: (_, siblingData) => siblingData?.type === "range",
          },
        },
        {
          name: "rangeUnit",
          type: "text",
          label: "Единица измерения",
          admin: {
            description: 'Единица отображения рядом с числом: "мин", "ч", "₽" и т.д.',
            condition: (_, siblingData) => siblingData?.type === "range",
          },
        },
        {
          name: "rangeEmptyLabel",
          type: "text",
          label: "Текст при отсутствии выбора",
          admin: {
            description:
              'Текст, который показывается когда ползунок в минимальном положении. Например: "Любая длительность", "Любая цена", "Без ограничений"',
            condition: (_, siblingData) => siblingData?.type === "range",
          },
        },
        {
          name: "isAdvanced",
          type: "checkbox",
          label: "Дополнительный фильтр",
          defaultValue: false,
          admin: {
            description: 'Если включено — фильтр скрыт под кнопкой "Ещё параметры"',
          },
        },
        {
          name: "options",
          type: "array",
          label: "Варианты",
          minRows: 0,
          admin: {
            description: "Список значений, из которых можно выбирать (не нужен для типа «Диапазон»)",
            condition: (_, siblingData) => siblingData?.type !== "range",
          },
          fields: [
            {
              name: "value",
              type: "text",
              label: "Значение (ключ)",
              required: true,
              admin: {
                description: 'Внутренний ключ для фильтрации: "beginner", "medical", "offline"',
              },
            },
            {
              name: "label",
              type: "text",
              label: "Текст для отображения",
              required: true,
              admin: {
                description: 'Текст, который видит пользователь: "Начинающий", "Медицина", "Очно"',
              },
            },
          ],
        },
        {
          name: "showWhenRules",
          type: "array",
          label: "Показывать фильтр при условии",
          admin: {
            description:
              "Если заданы правила — фильтр будет скрыт по умолчанию и появится только когда выполнится одно из условий",
          },
          fields: [
            {
              name: "whenFilterKey",
              type: "text",
              label: "Когда в фильтре...",
              required: true,
              admin: {
                description: 'Ключ другого фильтра: например "style"',
              },
            },
            {
              name: "whenFilterValue",
              type: "text",
              label: "...выбрано значение",
              required: true,
              admin: {
                description: 'Значение другого фильтра: например "classic_tattoo"',
              },
            },
          ],
        },
        {
          name: "visibilityRules",
          type: "array",
          label: "Правила видимости опций",
          admin: {
            description:
              "Условия, при которых отдельные опции этого фильтра скрываются или подсвечиваются на основе выбора в другом фильтре",
          },
          fields: [
            {
              name: "targetOptionValue",
              type: "text",
              label: "Опция (значение), к которой применяется правило",
              required: true,
              admin: {
                description: 'Значение опции этого фильтра: например "medical_required"',
              },
            },
            {
              name: "action",
              type: "select",
              label: "Действие",
              required: true,
              options: [
                { label: "Скрыть", value: "hide" },
                { label: "Подсветить как важное", value: "highlight" },
                { label: "Выбрать автоматически (нельзя снять)", value: "autoselect" },
              ],
            },
            {
              name: "whenFilterKey",
              type: "text",
              label: "Когда в фильтре...",
              required: true,
              admin: {
                description: 'Ключ другого фильтра: например "goal"',
              },
            },
            {
              name: "whenFilterValue",
              type: "text",
              label: "...выбрано значение",
              required: true,
              admin: {
                description: 'Значение другого фильтра: например "beginner"',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default FilterConfigs
