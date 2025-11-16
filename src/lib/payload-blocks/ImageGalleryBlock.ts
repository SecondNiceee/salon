import { Block } from "payload";

export const ImageGalleryBlock: Block = {
  slug: "imageGallery",
  labels: {
    singular: "Галерея изображений",
    plural: "Галереи изображений",
  },
  fields: [
    {
      name: "images",
      type: "array",
      label: "Изображения",
      minRows: 1,
      maxRows: 12,
      required: true,
      admin: {
        description: "Добавьте изображения для галереи (от 1 до 12)",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          label: "Изображение",
          relationTo: "media",
          required: true,
          admin: {
            description: "Выберите изображение для галереи",
          },
        },
        {
          name: "description",
          type: "text",
          label: "Описание",
          required: false,
          admin: {
            description: "Добавьте описание к изображению (необязательно)",
          },
        },
      ],
    },
    {
      name: "columns",
      type: "select",
      label: "Количество колонок",
      defaultValue: "3",
      options: [
        { label: "2 колонки", value: "2" },
        { label: "3 колонки", value: "3" },
        { label: "4 колонки", value: "4" },
      ],
      admin: {
        description: "Выберите количество колонок для отображения галереи",
      },
    }
  ],
}
