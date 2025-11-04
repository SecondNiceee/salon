import type { Product } from "@/payload-types"
import { isAccess } from "@/utils/accessUtils"
import type { CollectionConfig } from "payload"

const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    group: "Категории, подкатегории, товары",
  },
  access: {
    read: () => true,
    create: isAccess("products"),
    update: isAccess("products"),
    delete: isAccess("products"),
  },

  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Автоматически деактивируем скидку, если не указан размер
        if (data?.discount?.isActive && !data?.discount?.value) {
          data.discount.isActive = false
        }

        // Проверяем, что фиксированная скидка не превышает цену товара
        if (
          data?.discount?.isActive &&
          data?.discount?.type === "fixed" &&
          data?.discount?.value &&
          data?.price &&
          data.discount.value >= data.price
        ) {
          data.discount.value = Math.floor(data.price * 0.99) // Максимум 99% от цены
        }

        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        // Логируем изменения скидок для аудита
        if (data?.discount?.isActive !== originalDoc?.discount?.isActive) {
          console.log(
            `[DISCOUNT] Product ${data?.title || originalDoc?.title}: discount ${data?.discount?.isActive ? "activated" : "deactivated"}`,
          )
        }

        // Проверяем конфликты дат
        if (data?.discount?.isActive && data?.discount?.startDate && data?.discount?.endDate) {
          const startDate = new Date(data.discount.startDate)
          const endDate = new Date(data.discount.endDate)
          const now = new Date()

          // Если дата окончания уже прошла, деактивируем скидку
          if (endDate < now) {
            data.discount.isActive = false
            console.log(`[DISCOUNT] Product ${data?.title}: discount auto-deactivated (end date passed)`)
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Название",
      required: true,
    },
    {
      name: "price",
      type: "number",
      label: "Цена",
      required: true,
      min: 1,
      validate: (val: any) => {
        if (typeof val !== "number") {
          return "Цена неверный формат."
        }
        if (!val || val <= 0) return "Цена должна быть больше 0"
        if (val > 1000000) return "Цена не может превышать 1,000,000 ₽"
        return true
      },
    },
    {
      name: "discount",
      type: "group",
      label: "Скидка",
      validate: (val: any, { data }) => {
        const product = data as Product
        if (typeof val !== "object" || typeof data !== "object") {
          return "Discount must be an object"
        }
        if (!val?.isActive) return true

        // Проверяем, что все обязательные поля заполнены при активной скидке
        if (!val.type) return "Please choice dicount type"
        if (!val.value) return "Please choice dicount value"

        // Дополнительная проверка для фиксированной скидки
        if (val.type === "fixed" && product?.price && val.value >= product.price) {
          return `Discount cant be more than price`
        }

        // Проверяем логику дат
        if (val.startDate && val.endDate) {
          const startDate = new Date(val.startDate)
          const endDate = new Date(val.endDate)

          if (endDate <= startDate) {
            return "StartData cant be more than endDate"
          }
        }
        return true
      },
      fields: [
        {
          name: "isActive",
          type: "checkbox",
          label: "Активировать скидку",
          defaultValue: false,
        },
        {
          name: "type",
          type: "select",
          label: "Тип скидки",
          options: [
            {
              label: "Процент (%)",
              value: "percentage",
            },
            {
              label: "Фиксированная сумма (₽)",
              value: "fixed",
            },
          ],
          defaultValue: "percentage",
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.isActive,
          },
        },
        {
          name: "value",
          type: "number",
          label: "Размер скидки",
          required: true,
          min: 0.01,
          admin: {
            condition: (data, siblingData) => siblingData?.isActive,
            description:
              "Для процентной скидки - число от 0.01 до 99.99. Для фиксированной - сумма в рублях (не более 99% от цены товара).",
          },
          validate: (val: any, { siblingData, data }: { siblingData: any; data: any }) => {
            if (!siblingData?.isActive) return true
            if (!val || val <= 0) return "Размер скидки должен быть больше 0"

            if (siblingData?.type === "percentage") {
              if (val > 99.99) return "Процентная скидка не может превышать 99.99%"
              if (val < 0.01) return "Минимальная процентная скидка - 0.01%"
            } else if (siblingData?.type === "fixed") {
              if (val < 1) return "Минимальная фиксированная скидка - 1 ₽"
              if (data?.price && val >= data.price) {
                return `Фиксированная скидка не может быть больше или равна цене товара (${data.price} ₽)`
              }
              if (val > 100000) return "Максимальная фиксированная скидка - 100,000 ₽"
            }

            return true
          },
        },
        {
          name: "startDate",
          type: "date",
          label: "Дата начала скидки",
          required: false,
          admin: {
            condition: (data, siblingData) => siblingData?.isActive,
            description: "Оставьте пустым для немедленного начала. Дата не может быть в прошлом.",
          },
          validate: (val, { siblingData }: { siblingData: any }) => {
            if (!siblingData?.isActive || !val) return true

            const startDate = new Date(val)
            const now = new Date()

            if (startDate < now) {
              return "Дата начала скидки не может быть в прошлом"
            }

            return true
          },
        },
        {
          name: "endDate",
          type: "date",
          label: "Дата окончания скидки",
          required: false,
          admin: {
            condition: (data, siblingData) => siblingData?.isActive,
            description: "Оставьте пустым для бессрочной скидки. Должна быть позже даты начала.",
          },
          validate: (val, { siblingData }: { siblingData: any }) => {
            if (!siblingData?.isActive || !val) return true

            const endDate = new Date(val)
            const now = new Date()

            // Проверяем, что дата окончания не в прошлом
            if (endDate < now) {
              return "Дата окончания скидки не может быть в прошлом"
            }

            // Проверяем относительно даты начала
            if (siblingData?.startDate) {
              const startDate = new Date(siblingData.startDate)
              if (endDate <= startDate) {
                return "Дата окончания должна быть позже даты начала"
              }
            }

            return true
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Описание скидки",
          required: false,
          maxLength: 200,
          admin: {
            condition: (data, siblingData) => siblingData?.isActive,
            description: "Краткое описание акции или причины скидки (до 200 символов)",
          },
        },
      ],
    },
    {
      name: "category",
      type: "relationship",
      label: "Категория",
      relationTo: "categories",
      required: true,
      hasMany: true,
      admin: {
        description: "Выберите только категорию, без подкатегорий",
      },
      filterOptions: () => {
        return {
          parent: { exists: false },
        }
      },
    },
    {
      name: "subCategory",
      type: "relationship",
      label: "Подкатегория",
      relationTo: "categories",
      required: true,
      hasMany: false,
      // Показывать только категории, у которых задан parent
      filterOptions: () => ({
        parent: { exists: true },
      }),
      admin: {
        description: "Выберите подкатегорию",
      },
    },
    {
      name: "image",
      type: "upload",
      label: "Фотография",
      relationTo: "media",
      required: true,
      admin: {
        description: "Загрузите основное изображение товара",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание товара",
      required: false,
    },
    {
      name: "recommendedProducts",
      type: "relationship",
      label: "Рекомендованные услуги(будут ниже указываться)",
      relationTo: "products",
      hasMany: true,
      required: false,
    },
    {
      name: "averageRating",
      type: "number",
      label: "Средний рейтинг",
      defaultValue: 0,
      min: 0,
      max: 5,
      admin: {
        readOnly: true,
        description: "Обновляется автоматически при добавлении отзыва",
      },
    },
    {
      name: "reviewsCount",
      type: "number",
      label: "Количество отзывов",
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}

export default Products
