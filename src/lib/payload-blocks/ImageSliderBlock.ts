import { Block } from "payload";

export const ImageSliderBlock: Block = {
  slug: "imageSlider",
  labels: {
    singular: "Слайдер изображений",
    plural: "Слайдеры изображений",
  },
  fields: [
    {
      name: "images",
      type: "array",
      label: "Изображения",
      minRows: 2,
      maxRows: 20,
      required: true,
      admin: {
        description: "Добавьте изображения для слайдера (от 2 до 20)",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          label: "Изображение",
          relationTo: "media",
          required: true,
          admin: {
            description: "Выберите изображение для слайдера",
          },
        },
        {
          name: "caption",
          type: "text",
          label: "Подпись",
          required: false,
          admin: {
            description: "Добавьте подпись к изображению (необязательно)",
          },
        },
      ],
    },
    {
      name: "autoplay",
      type: "checkbox",
      label: "Автопрокрутка",
      defaultValue: false,
      admin: {
        description: "Включить автоматическую прокрутку слайдов",
      },
    },
    {
      name: "autoplayDelay",
      type: "number",
      label: "Задержка автопрокрутки (мс)",
      defaultValue: 3000,
      min: 1000,
      max: 10000,
      admin: {
        description: "Время задержки между слайдами в миллисекундах (1000-10000)",
        condition: (data) => data.autoplay === true,
      },
    },
    {
      name: "showArrows",
      type: "checkbox",
      label: "Показывать стрелки навигации",
      defaultValue: true,
      admin: {
        description: "Отображать стрелки для перехода между слайдами",
      },
    },
    {
      name: "showDots",
      type: "checkbox",
      label: "Показывать точки навигации",
      defaultValue: true,
      admin: {
        description: "Отображать точки-индикаторы слайдов",
      },
    },
  ],
};
