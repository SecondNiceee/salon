import type { Block } from "payload"

export const HeaderBlock: Block = {
  slug: "header",
  labels: {
    singular: "Заголовок",
    plural: "Заголовки",
  },
  fields: [
    {
      name: "text",
      type: "text",
      label: "Текст заголовка",
      admin: {
        description: "Введите текст заголовка",
      },
    },
    {
      name: "level",
      type: "select",
      label: "Уровень заголовка",
      defaultValue: "h3",
      options: [
        { label: "Заголовок 1 (основной)", value: "h1" },
        { label: "Заголовок 2", value: "h2" },
        { label: "Заголовок 3", value: "h3" },
        { label: "Заголовок 4", value: "h4" },
      ],
      admin: {
        description: "Выберите уровень заголовка (H1-H6)",
      },
    },
    {
      name: "color",
      type: "select",
      label: "Цвет заголовка",
      defaultValue: "black",
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
        description: "Выберите цвет заголовка",
      },
    },
  ],
}
