// src/app/account/orders/page.tsx
import React from 'react';
import OrdersClientPage from './order-client';
import { Metadata } from 'next';

// 🔒 Приватная страница — не индексировать!
export const metadata:Metadata = {
  title: 'Мои заказы — ГрандБАЗАР',
  description: 'Отслеживайте статусы ваших заказов в интернет-магазине ГрандБАЗАР',
  robots: {
    index: false,    // ← не показывать в поиске
    follow: false,   // ← не переходить по ссылкам с этой страницы
  },
  // Соцсетевые метатеги не нужны — это личная информация
  openGraph: undefined,
  twitter: undefined,
};

const Orders = () => {
  return <OrdersClientPage />;
};

export default Orders;
