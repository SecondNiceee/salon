import { getCityBySlug } from "@/actions/server/cities/getCities"
import GrandBazarClientApp from "./main-client-page"
import { getCachedHomeContent } from "@/actions/server/getHomeContent"


export const revalidate = 3600
type Props = {
  params: Promise<{ city: string }>
}

const GrandBazarApp = async ({ params }: Props) => {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)

  const processedHomeContent = await getCachedHomeContent(city)

  return <GrandBazarClientApp city={city} homeContent={processedHomeContent} />
}

export default GrandBazarApp
