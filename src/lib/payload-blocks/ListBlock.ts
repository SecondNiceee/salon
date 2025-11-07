import type { Block } from "payload"

export const ListBlock: Block = {
  slug: "list",
  labels: {
    singular: "Список",
    plural: "Списки",
  },
  fields: [
    {
      type: "array",
      name: "items",
      label: "Элементы списка",
      admin: {
        description: "Добавьте элементы для красивого ненумерованного списка",
      },
      fields: [
        {
          type: "text",
          name: "text",
          label: "Текст элемента",
          required: true,
        },
      ],
    },
  ],
}
