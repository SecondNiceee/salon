"use server"

import { getPayload } from "payload";
import config from "@payload-config";

export const getContacts = async () => {
    const payload = await getPayload({config});
    const about = await payload.find({
      collection : "pages",
      where : {
        slug : {equals : "contacts"}
      }
    })
    return about.docs[0]
}
