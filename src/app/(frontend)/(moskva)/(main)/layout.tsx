import type React from "react"
import { Categories } from "@/components/categories/categories"
import { getCategoriesWithSubs } from "@/actions/server/categories/getCategorysWithSubs";

export default async function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  const categories = await getCategoriesWithSubs();

  return (
    <div>
      <div className="z-50 flex flex-col">
        <Categories initialCategories={categories} />
      </div>  
      {children}
    </div>
  )
}
