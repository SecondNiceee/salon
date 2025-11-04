import { CartItem, useCartStore } from '@/entities/cart/cartStore';
import { Media } from '@/payload-types';
import { getDiscountInfo } from '@/utils/discountUtils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { FC } from 'react';
import { Button } from '../ui/button';
import SmartImage from '../smart-image/SmartImage';

interface IOrderItemDesktop{
    item : CartItem
}
const OrderItemDesktop:FC<IOrderItemDesktop> = ({item}) => {
    const media = item.product.image as Media
    const discountInfo = getDiscountInfo(item.product)
    const { remove, increment, dicrement } = useCartStore()
    const price = item.product.price || 0
    const sum = price * item.quantity
    return (
        <div
          key={item.product.id}
          className="flex gap-4 p-4 transition-all duration-200 border group bg-gradient-to-r from-gray-50/80 to-blue-50/50 rounded-2xl hover:shadow-md border-gray-100/50"
        >
          <div className="relative w-20 h-20 overflow-hidden transition-shadow duration-200 bg-white shadow-sm rounded-xl group-hover:shadow-md">
            <SmartImage
              width={80}
              height={80}
              src={media?.url || "/placeholder.svg?height=80&width=80&query=product-thumbnail"}
              alt={media?.alt || item.product.title}
              className="object-cover w-full h-full"
             />
            {discountInfo.hasDiscount && (
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded text-[10px]">
                -{discountInfo.discountPercentage}%
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {item.product.weight?.value} {item.product.weight?.unit}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-1 bg-white rounded-lg shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dicrement(item.product.id)}
                    className="w-8 h-8 p-0 rounded-md hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => increment(item.product)}
                    className="w-8 h-8 p-0 rounded-md hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="font-medium text-gray-600">× {price} ₽</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text">
                  {sum} ₽
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => remove(item.product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
    );
};

export default OrderItemDesktop;
