export const getOverlayClass = (overlay: string) => {
    switch (overlay) {
      case "light":
        return "bg-black/20"
      case "medium":
        return "bg-black/40"
      case "dark":
        return "bg-black/60"
      case "none":
      default:
        return ""
    }
  }
