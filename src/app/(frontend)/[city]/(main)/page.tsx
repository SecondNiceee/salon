import { getCityBySlug } from "@/actions/server/cities/getCities"
import GrandBazarClientApp from "./main-client-page"
import { getCachedHomeContent } from "@/actions/server/getHomeContent"
import { getCategoriesWithProducts } from "@/actions/server/categories/getCategoriesWithProducts"

type Props = {
  params: Promise<{ city: string }>
}
const GrandBazarApp = async ({ params }: Props) => {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)

  const processedHomeContent = await getCachedHomeContent(city);

  const rezult = await getCategoriesWithProducts();

  return <GrandBazarClientApp productsAndCategories={rezult} city={city} homeContent={processedHomeContent} />
}

export default GrandBazarApp
