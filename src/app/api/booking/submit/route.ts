import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { cookies } from "next/headers"

// Types
interface BookingData {
  name: string
  phone: string
  productId: string | number
  city?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: BookingData = await request.json()

    // Validate input
    if (!data.name || !data.phone || !data.productId) {
      console.log(data);
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (!data.city) {
      return NextResponse.json({ message: "Не удалось определить город" }, { status: 400 })
    }

    const payload = await getPayload({ config })

    let product
    try {
      product = await payload.findByID({
        collection: "products",
        id: data.productId,
      })
    } catch (error) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("payload-token")?.value

    let currentUser = null
    if (token) {
      try {
        const { user } = await payload.auth({ headers: request.headers })
        currentUser = user
      } catch (error) {
        console.log("No authenticated user found")
      }
    }

    const orderData: any = {
      orderNumber: `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      product: Number(data.productId),
      customerName: data.name,
      customerPhone: data.phone,
      status: "waiting_call",
      user: currentUser?.id || undefined,
      notes: `Город: ${data.city}`,
    }

    const order = await payload.create({
      collection: "orders",
      data: orderData,
      overrideAccess: true,
    })

    console.log("Booking order created:", order.id)

    return NextResponse.json(
      {
        message: "Booking submitted successfully",
        orderId: order.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Booking API error:", error)
    return NextResponse.json({ message: "Error processing booking" }, { status: 500 })
  }
}
