import { getCityBySlug } from "@/actions/server/cities/getCities"
import { getCachedHomeContent } from "@/actions/server/getHomeContent"
import { getCategoriesWithProducts } from "@/actions/server/categories/getCategoriesWithProducts"
import GrandBazarClientApp from "../../[city]/(main)/main-client-page";
import { defaultCitySlug } from "@/constants/dynamic-constants";


const GrandBazarApp = async () => {

  const city = await getCityBySlug(defaultCitySlug);

  const processedHomeContent = await getCachedHomeContent(city);

  const rezult = await getCategoriesWithProducts();

  return <GrandBazarClientApp productsAndCategories={rezult} city={city} homeContent={processedHomeContent} />
}

export default GrandBazarApp
