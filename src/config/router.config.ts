class Router {
  // Helper method to generate city-aware routes
  withCity(city: string, path: string): string {
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path
    return `/${city}${cleanPath ? `/${cleanPath}` : ""}`
  }

  // Base routes (will be prefixed with city)
  profile = "profile"
  home = "/"
  checkout = "checkout"
  orders = "orders"
  favorited = "favorites"
  mobileLogin = "login"
  mobileCatalog = "catalog"
  product = "product"
  about = "about"
  contacts = "contacts"

  // Get full path with city
  getPath(city: string, route: string): string {
    return this.withCity(city, route)
  }
}

export const routerConfig = new Router()
