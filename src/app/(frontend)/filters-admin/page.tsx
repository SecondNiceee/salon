import { getAllCategories, getAllFilterConfigs } from "./actions"
import FiltersAdminClient from "./filters-admin-client"

export const dynamic = "force-dynamic"

export default async function FiltersAdminPage() {
  const [categories, filterConfigs] = await Promise.all([
    getAllCategories(),
    getAllFilterConfigs(),
  ])

  return <FiltersAdminClient initialCategories={categories} initialFilterConfigs={filterConfigs} />
}
