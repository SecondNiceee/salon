// utils/getUserFromCookie.ts
import { cookies } from 'next/headers'

export const getUserFromCookie = async () => {
  const cookieStore = await cookies()
  const payloadCookie = cookieStore.get('payload-token')

  if (!payloadCookie) {
    return null
  }

  const userRes = await fetch(`${process.env.BACKEND_URL}/api/users/me?select[id]=true`, {
    method: 'GET',
    headers: {
      Cookie: `payload-token=${payloadCookie.value}`,
    },
    cache: 'no-store',
  })

  if (!userRes.ok) {
    return null
  }

  const userData = await userRes.json()
  return userData.user // ← возвращаем объект user или undefined
}
