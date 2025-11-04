import { CartItem } from '@/entities/cart/cartStore';
import React, { FC } from 'react'
import OrderItemMobile from './OrderItemMobile'
import OrderItemDesktop from './OrderItemDesktop'

interface IProductCard {
  item: CartItem
}

const OrderItem: FC<IProductCard> = ({ item }) => {

  return (
    <>
      {/* Mobile Layout (< 768px) */}
      <div className="block md:hidden">
            <OrderItemMobile item={item} />
      </div>

      {/* Desktop Layout (>= 768px) */}
      <div className="hidden md:block">
            <OrderItemDesktop item={item} />
      </div>
    </>
  )
}

export default OrderItem;
