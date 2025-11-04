// app/contacts/page.tsx
import { RichText } from '@payloadcms/richtext-lexical/react';
import { notFound } from "next/navigation";
import jsxConverters from '@/utils/jsx-converters';
import "@/styles/richText.scss";
import { getContacts } from '@/actions/server/pages/getContacts';

// ✅ Умеренное кэширование: 1 день
export const revalidate = 86400;

// ✅ Schema.org для контактов
function ContactsSchema({ 
  title, 
  description,
}: { 
  title: string; 
  description: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": title,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.svg`,
          "description": description,
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ставрополь", // ← замени на реальный город
              "addressCountry": "RU"
            },
            "availableLanguage": ["Russian"]
          },
        }, null, 2)
      }}
    />
  );
}

export default async function ContactsPage() {
  try {
    const contacts = await getContacts();
    if (!contacts) {
      notFound();
    }

    const title = contacts.title || "Контакты | ГрандБАЗАР";
    const description = 
      contacts.description || 
      "Свяжитесь с нами: телефон, email, адрес офиса и форма обратной связи. Интернет-магазин ГрандБАЗАР всегда на связи!";

    return (
      <>
        <ContactsSchema 
          title={title} 
          description={description}
        />
        <div className="rich-container">
          <RichText converters={jsxConverters} data={contacts.content} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading contacts page:", error);
    notFound();
  }
}

// ✅ Полные метаданные
export async function generateMetadata() {
  try {
    const contactsData = await getContacts();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const title = contactsData?.title 
      ? `${contactsData.title} | ГрандБАЗАР` 
      : "Контакты | ГрандБАЗАР";

    const description = 
      contactsData?.description || 
      "Свяжитесь с нами: телефон, email, адрес офиса и форма обратной связи. Интернет-магазин ГрандБАЗАР всегда на связи!";

    return {
      title,
      description,
      keywords: [
        "контакты",
        "связаться с нами",
        "телефон",
        "email",
        "адрес",
        "ГрандБАЗАР",
        "поддержка",
        "обратная связь"
      ],
      alternates: {
        canonical: siteUrl ? `${siteUrl}/contacts` : undefined,
      },
      openGraph: {
        title,
        description,
        url: siteUrl ? `${siteUrl}/contacts` : undefined,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    return {
      title: "Контакты | ГрандБАЗАР",
      description: "Свяжитесь с нами: телефон, email, адрес офиса и форма обратной связи.",
      alternates: {
        canonical: siteUrl ? `${siteUrl}/contacts` : undefined,
      },
    };
  }
}
