async function getAllProducts() {
    const API_URL = "http://localhost:3000/api/products" // Замените на ваш актуальный URL
  
    try {
      const response = await fetch(`${API_URL}?limit=1000&depth=0`)
  
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`)
      }
  
      const { docs: products } = await response.json()
  
      const result = products.map((product: any) => ({
        id: product.id,
        title: product.title,
      }))
  
      console.log(JSON.stringify(result, null, 2))
      console.log(`\nTotal products: ${result.length}`)
    } catch (error) {
      console.error("Не удалось получить товары:", error)
    }
  
    process.exit(0)
  }
  
  getAllProducts()