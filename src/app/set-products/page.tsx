import { getTopLevelCategories } from "./actions"
import SetProductsClient from "./set-products-client"

export const metadata = {
  title: "Назначить фильтры товарам",
}

export default async function SetProductsPage() {
  const categories = await getTopLevelCategories()

  return <SetProductsClient categories={categories} />
}
