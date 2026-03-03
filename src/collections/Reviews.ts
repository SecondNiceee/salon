import { isAdmin, isLoggedIn, isOwn } from '@/utils/accessUtils';
import { type CollectionConfig } from 'payload'

const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'product',
    defaultColumns: ['product', 'user', 'rating', 'createdAt'],
    group: 'Отзывы',
  },
  access: {
    read: () => true,
    create: isLoggedIn,
    update: ({req}) => {
      if (!req.user){
        return false;
      }
      return Boolean({
        user : {equals : req.user.id}
      }) || Boolean(req.user.accessCollections?.includes("reviews"))
      // Проверить работает ли это?
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Товар',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Пользователь',
      required: true,
      defaultValue: ({ user }) => user?.id, // автоматически подставляет текущего пользователя
      access: {
        create: () => false, // нельзя менять при создании
        read: () => true,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Оценка',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: {
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Комментарий',
      required: false,
      minLength: 10,
      maxLength: 1000,
      admin: {
        rows: 4,
      },
    },
  ],
  hooks: {
    beforeValidate : [
      async ({req, data}) => {
        if (!data){
          return data;
        }
        if (!data.user){
          const user = req.user;
          data.user = user?.id;
        }
        return data;
      }
    ],
    // ✅ Запрещаем оставлять более одного отзыва на товар
    beforeChange: [
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          const existing = await req.payload.find({
            collection: 'reviews',
            where: {
              and: [{ product: { equals: data.product} }, { user: { equals: req.user?.id } }],
            },
            limit: 1,
            overrideAccess: true, // проверяем даже если access скрывает
          })

          if (existing.docs.length > 0) {
            throw new Error('U already make review')
          }
        }
        return data
      },
    ],
    beforeRead: [
      async ({ doc, req }) => {
        // 🔐 Защита: не обрабатываем, если нет пользователя
        if (!doc.user || !req.payload) return doc

        try {
          const payload = req.payload

          // ✅ Подтягиваем ТОЛЬКО нужные поля пользователя
          const userResult = await payload.findByID({
            collection: 'users',
            id: typeof doc.user === 'object' ? doc.user.id : doc.user,
            overrideAccess: true, // игнорируем access.read
          })

          if (userResult) {
            // 🔁 Заменяем `user` на объект с нужными полями
            doc.user = {
              id: userResult.id,
              email: userResult.email,
            }
          }
        } catch (error) {
          console.error('❌ Error cant find user', error)
          // Оставляем хотя бы ID
        }

        return doc
      },
    ],

    // ✅ Обновляем рейтинг продукта при создании/обновлении отзыва
    afterChange: [
      async ({ operation, doc, req }) => {
        if (!['create', 'update'].includes(operation)) return doc

        let productId = doc.product
        if (typeof productId === 'object' && productId !== null) {
          productId = productId.id || productId.value
        }

        if (!productId) {
          console.warn('⚠️ No productId')
          return doc
        }

        try {
          const payload = req.payload

          // 🔍 Находим ВСЕ отзывы, КРОМЕ текущего
          const existingReviews = await payload.find({
            collection: 'reviews',
            where: {
              and: [
                { product: { equals: productId } },
                { id: { not_equals: doc.id } }, // исключаем текущий, если update
              ],
            },
            limit: 0,
            overrideAccess: true,
          })

          // ✅ Добавляем текущий отзыв вручную
          const allReviews = [...existingReviews.docs]

          // При create — добавляем новый
          // При update — заменяем (если уже есть)
          const existingIndex = allReviews.findIndex((r) => r.id === doc.id)
          if (existingIndex > -1) {
            allReviews[existingIndex] = doc
          } else {
            allReviews.push(doc) // ✅ Вот он — недостающий отзыв!
          }

          const count = allReviews.length
          const avg =
            count > 0
              ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
              : 0

          console.log(`📊 Учтено отзывов: ${count}, средний: ${avg}`)

          // 🔁 Обновляем продукт
          setTimeout(async () => {
            await payload.update({
              collection: 'products',
              id: productId,
              data: {
                averageRating: avg,
                reviewsCount: count,
              },
              overrideAccess: true,
            })
            console.log(`✅ Продукт ${productId} обновлён`)
          }, 50)
        } catch (error: any) {
          console.error('❌ Ошибка:', error.message)
        }

        return doc
      },
    ],

    // ✅ Обновляем рейтинг при удалении отзыва
    afterDelete: [
      async ({ doc, req }) => {
        let productId = doc.product
        if (typeof productId === 'object' && productId !== null) {
          productId = productId.id || productId.value
        }

        if (!productId) return

        try {
          const payload = req.payload

          // 🔍 Получаем ВСЕ отзывы, кроме удалённого
          const reviews = await payload.find({
            collection: 'reviews',
            where: {
              and: [{ product: { equals: productId } }, { id: { not_equals: doc.id } }],
            },
            limit: 0,
            overrideAccess: true,
          })

          const count = reviews.docs.length
          const avg =
            count > 0
              ? Math.round((reviews.docs.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
              : 0

          // 🔁 Обновляем продукт
          setTimeout(async () => {
            await payload.update({
              collection: 'products',
              id: productId,
              data: {
                averageRating: avg,
                reviewsCount: count,
              },
              overrideAccess: true,
            })
            console.log(`✅ Продукт ${productId} обновлён после удаления`)
          }, 50)
        } catch (error: any) {
          console.error('❌ Ошибка:', error.message)
        }
      },
    ],
  },
}

export default Reviews
