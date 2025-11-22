import { getCityBySlug } from "@/actions/server/cities/getCities";
import GrandBazarClientApp from "./main-client-page"

type Props = {
    params: Promise<{  city: string }>
}
const GrandBazarApp =  async ({ params }: Props) => {
    const { city: citySlug } = await params
    const city = await getCityBySlug(citySlug);
    return <GrandBazarClientApp city={city}  />
}

export default GrandBazarApp
