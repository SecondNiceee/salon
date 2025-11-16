import type { Block } from "payload"

export const IconCardsBlock: Block = {
  slug: "iconCards",
  labels: {
    singular: "Карточки с иконками",
    plural: "Карточки с иконками",
  },
  fields: [
    {
      name: "columns",
      type: "select",
      label: "Колонок в ряд",
      defaultValue: "3",
      options: [
        { label: "3 колонки", value: "3" },
        { label: "4 колонки", value: "4" },
      ],
      admin: {
        description: "Количество карточек в одном ряду",
      },
    },
    {
      name: "cards",
      type: "array",
      label: "Карточки",
      minRows: 1,
      fields: [
        {
          name: "icon",
          type: "select",
          label: "Иконка",
          required: true,
          options: [
            { label: "Звезда (Star)", value: "star" },
            { label: "Сообщения (MessageSquare)", value: "message-square" },
            { label: "Деньги (Banknote)", value: "banknote" },
            { label: "Сердце (Heart)", value: "heart" },
            { label: "Телефон (Phone)", value: "phone" },
            { label: "Email (Mail)", value: "mail" },
            { label: "Пользователь (User)", value: "user" },
            { label: "Календарь (Calendar)", value: "calendar" },
            { label: "Часы (Clock)", value: "clock" },
            { label: "Карта (MapPin)", value: "map-pin" },
            { label: "Дом (Home)", value: "home" },
            { label: "Настройки (Settings)", value: "settings" },
            { label: "Проверка (CheckCircle)", value: "check-circle" },
            { label: "Информация (Info)", value: "info" },
            { label: "Подарок (Gift)", value: "gift" },
            { label: "Корзина (ShoppingCart)", value: "shopping-cart" },
            { label: "Пакет (Package)", value: "package" },
            { label: "Грузовик (Truck)", value: "truck" },
            { label: "Награда (Award)", value: "award" },
            { label: "Щит (Shield)", value: "shield" },
          ],
          admin: {
            description: "Выберите иконку для карточки",
          },
        },
        {
          name: "title",
          type: "text",
          label: "Заголовок",
          required: true,
          admin: {
            description: "Заголовок карточки",
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Описание",
          required: true,
          admin: {
            description: "Текст описания карточки",
          },
        },
      ],
      admin: {
        description: "Добавьте карточки с иконками",
      },
    },
  ],
}
