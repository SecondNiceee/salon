// scripts/migrate-product-slugs.ts

const PAYLOAD_API_URL = "http://localhost:3000/api" // 👈 ЗАМЕНИ НА СВОЙ АДРЕС!
// Например: "https://your-site.com/api"

const translitMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
}

const generateSlug = (title: string, id: string): string => {
  const baseSlug = title
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80)

  return `${baseSlug}-${id.slice(-6)}`
}

async function fetchAllProductsWithoutSlug(): Promise<any[]> {
  const url = `${PAYLOAD_API_URL}/products`
  const params = new URLSearchParams({
    where: JSON.stringify({
      or: [
        { slug: { exists: false } },
        { slug: { equals: "" } },
        { slug: { equals: null } },
      ],
    }),
    limit: "1000",
    depth: "0",
  })

  const res = await fetch(`${url}?${params}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`)
  }
  const json = await res.json()
  return json.docs || []
}

async function updateProduct(id: string, slug: string): Promise<void> {
  const url = `${PAYLOAD_API_URL}/products/${id}`
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Failed to update product ${id}: ${res.status} – ${errorText}`)
  }
}

async function migrateProductSlugs() {
  console.log("Starting product slug migration...")

  const products = await fetchAllProductsWithoutSlug()
  console.log(`Found ${products.length} products without slug`)

  let updated = 0
  let errors = 0

  for (const product of products) {
    try {
      const slug = generateSlug(product.title, product.id)
      await updateProduct(product.id, slug)
      console.log(`✓ ${product.title} -> ${slug}`)
      updated++
    } catch (error) {
      console.error(`✗ Failed to update ${product.title} (${product.id}):`, error)
      errors++
    }
  }

  console.log(`\nMigration complete: ${updated} updated, ${errors} errors`)
  process.exit(0)
}

// Запуск
migrateProductSlugs().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})