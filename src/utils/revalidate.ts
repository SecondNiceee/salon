import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePages = async () => {
  try {
    // Перевалидируем все страницы
    revalidatePath('/contacts')
    revalidatePath('/delivery')
    revalidatePath('/')
    
    // Перевалидируем теги
    revalidateTag('pages')
    revalidateTag('about')
    revalidateTag('contacts')
    
    console.log('Pages revalidated successfully')
  } catch (error) {
    console.error('Error revalidating pages:', error)
  }
}
