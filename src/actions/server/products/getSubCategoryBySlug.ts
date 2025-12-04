"use server"

import { getPayload } from "payload"
import config from "@payload-config"

export async function getSubCategoryBySlug(slug: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: "categories",
    where: { value: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  return result.docs[0] || null
}
