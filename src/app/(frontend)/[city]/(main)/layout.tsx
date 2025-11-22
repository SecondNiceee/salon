  import type React from "react"
  import { Categories } from "@/components/categories/categories";
  import ConditionalHeroSlider from "@/components/hero-slider/conditional-hero-slider";

  export default async function MainLayout(props: { children: React.ReactNode }) {
    const { children } = props;

    return (
      <div>
        <ConditionalHeroSlider />
        <div className="z-50 flex flex-col">
          <Categories />
        </div>
        {children}
      </div>
    )
  }
