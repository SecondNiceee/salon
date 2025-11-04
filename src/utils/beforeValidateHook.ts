import { CollectionBeforeValidateHook } from "payload"

export const beforeValidateHook:CollectionBeforeValidateHook<any> = ({ data, req }) => {
        if (!data) return data
        if (!req.user) {
          throw new Error("Not authorized")
        }
        if (!data.user) {
          data.user = req.user.id
        } 
        console.log(data);
        return data
}
