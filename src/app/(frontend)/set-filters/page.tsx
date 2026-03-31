import { getTopLevelCategories } from "./actions"
import SetFiltersClient from "./set-filters-client"

export const metadata = {
  title: "Назначить фильтры товарам",
}

export default async function SetFiltersPage() {
  const categories = await getTopLevelCategories()

  return <SetFiltersClient categories={categories} />
}
