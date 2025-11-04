import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.BACKEND_URL || "http://localhost:3000"

  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/account/",
        "/checkout",
        "/login",
        "/forgotPassword",
        "/verify",
        "/api/",
        "/_next/",
        "/admin/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
