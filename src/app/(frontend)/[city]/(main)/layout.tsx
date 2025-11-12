import type React from "react"
import { Categories } from "@/components/categories/categories";
import ConditionalHeroSlider from "@/components/hero-slider/conditional-hero-slider";

export default async function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div>
      <ConditionalHeroSlider />
      <div className="sticky z-50 flex flex-col  md:top-[92px] top-[72px]">
        <Categories />
      </div>
      {children}
    </div>
  )
}
