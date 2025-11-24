import { getSiteSettings } from "@/actions/server/globals/getSiteSettings"
import { replaceCityInRichText } from "@/utils/replaceCityVariables"
import { unstable_cache } from "next/cache"
import { getCityDeclensions } from "@/utils/replaceCityVariables"
import { getSubCategoryWithProducts } from "@/actions/server/products/getSubCategoryWithProducts"

export const getCachedHomeContent = unstable_cache(
  async (city: any) => {
    const siteSettings = await getSiteSettings()
    const homeContent = siteSettings?.homeContent

    if (!homeContent) return null

    const cityDeclensions = city.declensions;
    const processedHomeContent = replaceCityInRichText(homeContent, cityDeclensions)

    return processedHomeContent
  },
  ["home-content"],
  {
    revalidate: 86400, // 1 day
    tags: ["site-settings", "categories"],
  },
)

export const getCachedSubCategoryContent = unstable_cache(
  async (subcategorySlug: string, city: any) => {
    const data = await getSubCategoryWithProducts(subcategorySlug)

    if (!data) return { processedContent: null, processedContentAfter: null }

    const cityDeclensions = city.declensions;


    const processedContent = data.subCategory.content
      ? replaceCityInRichText(data.subCategory.content, cityDeclensions)
      : null

    const processedContentAfter = data.subCategory.contentAfter
      ? replaceCityInRichText(data.subCategory.contentAfter, cityDeclensions)
      : null

    return { processedContent, processedContentAfter }
  },
  ["subcategory-content"],
  {
    revalidate: 86400, // 1 day
    tags: ["site-settings", "categories"],
  },
)
