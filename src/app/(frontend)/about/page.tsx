import { RichText } from '@payloadcms/richtext-lexical/react';
import { notFound } from 'next/navigation';
import { getAbout } from '@/actions/server/pages/getAbout';
import jsxConverters from '@/utils/jsx-converters';
import '@/styles/richText.scss';
import Script from 'next/script';

export const revalidate = 86400;

export default async function AboutPage() {
  try {
    const about = await getAbout();
    if (!about) {
      notFound();
    }
    const siteUrl = process.env.NEXT_PUBLIC_URL
    return (
      <>
        <div className="rich-container">
          <RichText converters={jsxConverters} data={about.content} />
        </div>

        {/* JSON-LD для SEO */}
        <Script id="about-json-ld" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ГрандБАЗАР',
            url: siteUrl,
            description: about.description || 'Интернет-магазин ГрандБАЗАР — надежный поставщик техники и аксессуаров.',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'RU',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              telephone: '+74951234567', // ← замени на реальный номер
              availableLanguage: 'Russian',
            },
          })}
        </Script>
      </>
    );
  } catch (error) {
    console.error('Error loading about page:', error);
    notFound();
  }
}

// Генерация метаданных с использованием NEXT_PUBLIC_URL
export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_URL 
  const aboutPageUrl = `${siteUrl}/about`;

  try {
    const aboutData = await getAbout();

    const title = aboutData?.title || 'О нас — ГрандБАЗАР';
    const description =
      aboutData?.description ||
      'Узнайте больше о нашей компании ГрандБАЗАР: история, миссия и ценности.';

    return {
      title,
      description,
      keywords: 'ГрандБАЗАР, о компании, магазин, доставка, электроника, аксессуары',

      openGraph: {
        title,
        description,
        url: aboutPageUrl,
        siteName: 'ГрандБАЗАР',
        locale: 'ru_RU',
        type: 'website'
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },

      alternates: {
        canonical: aboutPageUrl,
      },
    };
  } catch (error) {
    // Fallback
    return {
      title: 'О нас — ГрандБАЗАР',
      description: 'Узнайте больше о нашей компании ГрандБАЗАР',
      openGraph: {
        title: 'О нас — ГрандБАЗАР',
        description: 'Узнайте больше о нашей компании ГрандБАЗАР',
        url: aboutPageUrl,
        siteName: 'ГрандБАЗАР',
        locale: 'ru_RU',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'О нас — ГрандБАЗАР',
        description: 'Узнайте больше о нашей компании ГрандБАЗАР',
      },
    };
  }
}
