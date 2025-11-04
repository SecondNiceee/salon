import React from 'react';
import ProfileClientPage from './profile-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Личный кабинет — ГрандБАЗАР",
  description: "Ваш личный кабинет в интернет-магазине ГрандБАЗАР",
  robots: {
    index: false,    // ← не индексировать
    follow: false,   // ← не переходить по ссылкам
  },
  // Убираем OG и Twitter — не нужно для приватной страницы
  openGraph: undefined,
  twitter: undefined,
};


const ProfilePage = () => {
  return (
    <ProfileClientPage />
  );
};

export default ProfilePage;
