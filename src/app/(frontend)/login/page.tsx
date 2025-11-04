// app/(frontend)/login/page.tsx
import type { Metadata } from "next";
import LoginPageClient from "./login-client-page";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Вход в аккаунт | ГрандБАЗАР",
  description: "Войдите в личный кабинет интернет-магазина ГрандБАЗАР, чтобы отслеживать заказы, управлять профилем и получать персональные предложения.",
  
  robots: {
    index: false,
    follow: false,
  },

  verification: {
    google: "", 
  },

  openGraph: {
    title: "Вход в аккаунт | ГрандБАЗАР",
    description: "Войдите в личный кабинет ГрандБАЗАР",
    type: "website",
    url: siteUrl ? `${siteUrl}/login` : undefined,
  },

  // Canonical — защита от дублей
  alternates: {
    canonical: siteUrl ? `${siteUrl}/login` : undefined,
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
