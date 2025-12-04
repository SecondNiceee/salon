// components/seo/ProductSchema.tsx
import type { Category, Media, Product as PayloadProduct } from "@/payload-types";

export function ProductSchema({ product }: { product: PayloadProduct }) {
  // Формируем URL товара (важно для canonical)
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/product?id=${product.id}`;

  const price = product.price;

  const availability = "https://schema.org/InStock"

  // Категории
  const category = (product.category as Category[])[0].title || "";
  const subCategory = (product.subCategory as Category).title || "";

  const imageUrl = product.image ? (product.image as Media).url : undefined;

  const schema: Record<string, any> = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "sku": String(product.id),
    "brand": {
      "@type": "Brand",
      "name": "Академия профессионального образования"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "RUB",
      "price": price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": availability,
      "seller": {
        "@type": "Organization",
        "name": "Академия профессионального образования"
      }
    },
    "category": [category, subCategory].filter(Boolean).join(" > ")
  };

  if (imageUrl) {
    schema.image = imageUrl;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}
