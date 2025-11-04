import type { Access, PayloadRequest } from "payload"

type AccessType = "users" | "categories" | "products" | "media" | "orders" | "reviews" | "pages"

export const isLoggedIn: Access = ({ req }) => {
  return !!req.user
}

export const isOwn: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === "admin") return true
  return {
    user: {
      equals: req.user.id,
    },
  }
}

export const isAccess = (type: AccessType): Access => {
  return ({ req }: { req: PayloadRequest }) => {
    const user = req.user
    if (!user || user.role === "user") {
      return false
    }
    if (user.role === "admin") {
      return true
    }
    return Boolean(user.accessCollections?.includes(type))
  }
}

export const isAdmin: Access = ({ req }) => {
  const user = req.user
  const docUser = req.data?.user
  return Boolean(user?.role === "admin" || user?.id === (typeof docUser === "object" ? docUser.id : docUser))
}
