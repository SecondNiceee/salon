class Router {
  // Helper method to generate city-aware routes
  withCity(city: string | null, path: string): string {
    // Remove leading slash if present
    if (city) {
      const cleanPath = path.startsWith("/") ? path.slice(1) : path
      return `/${city}${cleanPath ? `/${cleanPath}` : ""}`
    }
    return path
  }

  // Base routes (will be prefixed with city)
  profile = "/profile"
  home = "/"
  checkout = "/checkout"
  orders = "/orders"
  favorited = "/favorites"
  mobileLogin = "/login"
  mobileCatalog = "/catalog"
  about = "/about"
  contacts = "/contacts"

  product(subcategorySlug: string, productSlug: string): string {
    return `/${subcategorySlug}/${productSlug}`
  }

  // Get full path with city
  getPath(city: string, route: string): string {
    return this.withCity(city, route)
  }
}

export const routerConfig = new Router()
