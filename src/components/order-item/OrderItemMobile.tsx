import { CartItem, useCartStore } from '@/entities/cart/cartStore';
import { Media } from '@/payload-types';
import Image from 'next/image';
import React, { FC } from 'react';
import { Button } from '../ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import SmartImage from '../smart-image/SmartImage';


interface IOrderItemDesktop{
    item : CartItem
}
const OrderItemMobile:FC<IOrderItemDesktop> = ({item}) => {
    const media = item.product.image as Media
    const { remove, increment, dicrement } = useCartStore()
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <div className="flex gap-3">
          {/* Image */}
          <div className="relative w-16 h-16 overflow-hidden rounded-lg bg-gray-50 flex-shrink-0">
            <SmartImage width={64}
              height={64}
              src={media?.url || '/placeholder.svg?height=64&width=64&query=product-thumbnail'}
              alt={media?.alt || item.product.title}
              className="object-cover w-full h-full"  />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col py-1 gap-2 min-w-0 overflow-hidden">
            <div className="flex items-end gap-2">
              <h3 className="font-medium text-base text-gray-900  line-clamp-2 leading-tight">
                {item.product.title}
              </h3>
            </div>

            <div className="flex justify-between items-center w-full">
                <div className="flex gap-2 items-center">

                </div>

                <div className="flex items-center bg-gray-50 rounded-lg p-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-gray-200"
                    onClick={() => dicrement(item.product.id as number)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-gray-200"
                    onClick={() => increment(item.product)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => remove(item.product.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default OrderItemMobile;
