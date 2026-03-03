export const getTextColorClass = (color: string) => {
    switch (color) {
      case "black":
        return "text-black"
      case "gray":
        return "text-gray-500"
      case "red":
        return "text-red-500"
      case "blue":
        return "text-blue-500"
      case "green":
        return "text-green-500"
      case "yellow":
        return "text-yellow-400"
      case "white":
      default:
        return "text-white"
    }
  }
