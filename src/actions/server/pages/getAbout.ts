"use server"

import { getPayload } from "payload";
import config from "@payload-config";

export const getAbout = async () => {
    const payload = await getPayload({config});
    const about = await payload.find({
      collection : "pages",
      where : {
        slug : {equals : "about"}
      }
    })
    return about.docs[0]
}
