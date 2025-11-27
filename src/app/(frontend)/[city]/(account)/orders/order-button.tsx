import { Button } from "@/components/ui/button"
import { useCityStore } from "@/entities/city/cityStore";
import { useRouter } from "next/navigation"

export const OrderButton = () => {
    const router = useRouter();
    const { city } = useCityStore();
    return (
        <Button
            onClick={() => router.push(`/${city}`)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm sm:text-base"
        >
            Перейти к покупкам
        </Button>
    )
}