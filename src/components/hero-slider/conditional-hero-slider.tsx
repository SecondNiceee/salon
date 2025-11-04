"use client";

import { usePathname } from "next/navigation";
import HeroSlider from "./hero-slider";
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore";
import { ImageLoader } from "./image-loader";

export default function ConditionalHeroSlider() {
  const pathname = usePathname();
  const isSettingsLoading = useSiteSettings((state) => state.isLoading)

  // Показываем HeroSlider только на главной странице
  if (pathname === "/") { 
    if (isSettingsLoading) {
      return  <section className="relative max-w-7xl mx-auto px-4 md:py-4 py-2 w-full overflow-hidden">
        <ImageLoader />
      </section>
    }
    return <HeroSlider />;
  }

  return null;
}
