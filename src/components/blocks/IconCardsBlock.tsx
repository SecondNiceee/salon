"use client"

import { Star, MessageSquare, Banknote, Heart, Phone, Mail, User, Calendar, Clock, MapPin, Home, Settings, CheckCircle, Info, Gift, ShoppingCart, Package, Truck, Award, Shield } from 'lucide-react'

interface Card {
  icon: string
  title: string
  description: string
}

interface IconCardsBlockProps {
  columns: "3" | "4"
  cards: Card[]
}

const iconMap = {
  "star": Star,
  "message-square": MessageSquare,
  "banknote": Banknote,
  "heart": Heart,
  "phone": Phone,
  "mail": Mail,
  "user": User,
  "calendar": Calendar,
  "clock": Clock,
  "map-pin": MapPin,
  "home": Home,
  "settings": Settings,
  "check-circle": CheckCircle,
  "info": Info,
  "gift": Gift,
  "shopping-cart": ShoppingCart,
  "package": Package,
  "truck": Truck,
  "award": Award,
  "shield": Shield,
}

export function IconCardsBlock({ columns = "3", cards }: IconCardsBlockProps) {
  const gridCols = columns === "3" ? "md:grid-cols-3" : "md:grid-cols-4"

  return (
    <div className={`grid grid-cols-1 gap-8 ${gridCols}`}>
      {cards.map((card, index) => {
        const IconComponent = iconMap[card.icon as keyof typeof iconMap] || Star
        
        return (
          <div key={index} className="flex flex-col items-center text-center">
            {/* Icon circle */}
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gray-200">
              <IconComponent className="h-14 w-14 text-gray-700" strokeWidth={1.5} />
            </div>
            
            {/* Title */}
            <h3 className="mb-3 text-2xl font-bold text-gray-900">
              {card.title}
            </h3>
            
            {/* Description */}
            <p className="text-base leading-relaxed text-gray-600">
              {card.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
