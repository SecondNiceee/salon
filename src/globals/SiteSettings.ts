import { revalidateTag } from "next/cache"
import type { GlobalConfig } from "payload"

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: () => true,
  },
  admin: {
    group: "Настройки сайта",
    description:
      "Основные настройки сайта и контактная информация. Если вы ставите изображение (в слайдере) сразу с текстом, то не добавляйте просто текст. Но будьте аккуратны, проверьте как ваш текст (на картинке) выглядит на мобилках и на пк.",
  },
  hooks: {
    afterChange: [
      ({}) => {
        revalidateTag("site-settings")
      },
    ],
  },
  fields: [
    {
      name: "slider",
      type: "group",
      label: "Слайдер на главной странице",
      admin: {
        description: "Изображения для слайдера на главной странице",
      },
      fields: [
        {
          name: "slides",
          type: "array",
          label: "Слайды",
          required: false,
          admin: {
            description: "Добавьте изображения для слайдера",
          },
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Изображение",
              required: true,
              admin: {
                description: "Изображение для слайда (рекомендуемый размер: 1280x200px)",
              },
            },
            {
              name: "title",
              type: "text",
              label: "Заголовок",
              required: false,
              admin: {
                description: "Основной заголовок слайда",
              },
            },
            {
              name: "subtitle",
              type: "text",
              label: "Подзаголовок",
              required: false,
              admin: {
                description: "Дополнительный текст под заголовком",
              },
            },
            {
              name: "titleColor",
              type: "select",
              label: "Цвет заголовка",
              required: false,
              defaultValue: "white",
              options: [
                { label: "Черный", value: "black" },
                { label: "Белый", value: "white" },
                { label: "Серый", value: "gray" },
                { label: "Красный", value: "red" },
                { label: "Синий", value: "blue" },
                { label: "Зеленый", value: "green" },
                { label: "Желтый", value: "yellow" },
              ],
              admin: {
                description: "Выберите цвет заголовка для лучшей читаемости",
              },
            },
            {
              name: "subtitleColor",
              type: "select",
              label: "Цвет подзаголовка",
              required: false,
              defaultValue: "white",
              options: [
                { label: "Черный", value: "black" },
                { label: "Белый", value: "white" },
                { label: "Серый", value: "gray" },
                { label: "Красный", value: "red" },
                { label: "Синий", value: "blue" },
                { label: "Зеленый", value: "green" },
                { label: "Желтый", value: "yellow" },
              ],
              admin: {
                description: "Выберите цвет подзаголовка для лучшей читаемости",
              },
            },
            {
              name: "imageOverlay",
              type: "select",
              label: "Затемнение изображения",
              required: false,
              defaultValue: "none",
              options: [
                { label: "Без затемнения", value: "none" },
                { label: "Легкое затемнение", value: "light" },
                { label: "Среднее затемнение", value: "medium" },
                { label: "Сильное затемнение", value: "dark" },
              ],
              admin: {
                description: "Уровень затемнения изображения для лучшей читаемости текста",
              },
            },
            {
              name: "link",
              type: "text",
              required: false,
              label:
                "Ссылка у слайда(куда ведет при нажатии) (Если ссылка внутри сайта, не пишите ссылку полностью лишь /meal или что-то такое.)",
            },
          ],
        },
      ],
    },
    {
      name: "companyInfo",
      type: "group",
      label: "Информация о компании",
      admin: {
        description: "Основная информация о вашей компании",
      },
      required: true,
      fields: [
        {
          name: "legalName",
          type: "text",
          label: "Юридическое название",
          required: true,
          defaultValue: 'ООО "Академия Спа"',
          admin: {
            description: "Полное юридическое название компании",
          },
        },
        {
          name: "year",
          type: "number",
          label: "Год основания",
          required: true,
          defaultValue: new Date().getFullYear(),
          admin: {
            description: "Год основания компании",
          },
        },
        {
          name: "phone",
          required: true,
          type: "text",
          label: "Телефон",
          defaultValue: "+7 968 784 58 54",
          admin: {
            description: "Основной контактный телефон компании",
          },
        },
        {
          name: "inn",
          type: "text",
          label: "ИНН",
          required: false,
          admin: {
            description: "ИНН компании (налоговый идентификационный номер)",
          },
        },
        {
          name: "legalAddress",
          type: "text",
          label: "Юридический адрес",
          required: false,
          admin: {
            description: "Юридический адрес компании",
          },
        },
        {
          name: "privacyPolicyDocument",
          type: "upload",
          relationTo: "media",
          label: "Политика конфиденциальности (PDF)",
          required: false,
          admin: {
            description: "Загрузите политику конфиденциальности в формате PDF",
          },
        },
      ],
    },
    {
      name: "orderSettings",
      type: "group",
      label: "Настройки заказов и доставки",
      admin: {
        description: "Настройки минимальной суммы заказа(Для физических товаров)",
      },
      required: true,
      fields: [
        {
          name: "minOrderAmount",
          type: "number",
          label: "Минимальная сумма заказа (₽)",
          required: true,
          defaultValue: 500,
          admin: {
            description: "Минимальная сумма заказа для оформления",
          },
        },
      ],
    },
    {
      name: "socialLinks",
      type: "group",
      label: "Ссылки на социальные сети",
      admin: {
        description: "Ссылки на ваши социальные сети и мессенджеры",
      },
      required: true,
      fields: [
        {
          name: "email",
          type: "text",
          label: "Email",
          required: false,
          defaultValue: "Ваш Email",
          admin: {
            description: "Контактный email адрес",
          },
        },
        {
          name: "vk",
          type: "text",
          label: "VK",
          required: false,
          defaultValue: "https://vk.com/grandbazar",
          admin: {
            description: "Ссылка на страницу ВКонтакте",
          },
        },
        {
          name: "telegram",
          type: "text",
          label: "Telegram",
          required: false,
          defaultValue: "https://t.me/grandbazar",
          admin: {
            description: "Ссылка на Telegram канал или бот",
          },
        },
        {
          name: "instagram",
          type: "text",
          label: "Instagram",
          required: false,
          defaultValue: "https://instagram.com/grandbazar",
          admin: {
            description: "Ссылка на Instagram профиль",
          },
        },
      ],
    },
  ],
}
