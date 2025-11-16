import type { Block } from "payload"

export const BookingButtonBlock: Block = {
  slug: "bookingButton",
  labels: {
    singular: "Кнопка забронировать",
    plural: "Кнопки забронировать",
  },
  fields: [
    {
      name: "buttonText",
      type: "text",
      label: "Текст кнопки",
      defaultValue: "Забронировать",
      required: true,
      admin: {
        description: "Текст, который будет отображаться на кнопке",
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Стиль кнопки",
      defaultValue: "default",
      options: [
        { label: "Основной", value: "default" },
        { label: "Вторичный", value: "secondary" },
        { label: "Акцентный", value: "accent" },
      ],
      admin: {
        description: "Выберите стиль кнопки",
      },
    },
    {
      name: "size",
      type: "select",
      label: "Размер кнопки",
      defaultValue: "default",
      options: [
        { label: "Маленький", value: "sm" },
        { label: "Обычный", value: "default" },
        { label: "Большой", value: "lg" },
      ],
      admin: {
        description: "Выберите размер кнопки",
      },
    },
    {
      name: "alignment",
      type: "select",
      label: "Выравнивание",
      defaultValue: "left",
      options: [
        { label: "По левому краю", value: "left" },
        { label: "По центру", value: "center" },
        { label: "По правому краю", value: "right" },
      ],
      admin: {
        description: "Выберите выравнивание кнопки",
      },
    },
  ],
}
