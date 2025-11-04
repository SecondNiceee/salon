"use client"
import { getProductById } from "@/actions/server/products/getProductById";
import { Product } from "@/payload-types";
import { RequestError } from "@/utils/request";
import { create } from "zustand";
interface ProductsStore{
    currentProduct : Product | null,
    products : Record<string, Product>,
    getProduct : (id : string) => Promise<void>,
    error : RequestError | null,
    loading : boolean
}
export const useProductsStore = create<ProductsStore>((set, get) => ({
    currentProduct : null,
    products : {},
    error : null,
    loading : false,
    getProduct : async (id : string) => {
        const products = get().products;
        if (products[id]){
            set({currentProduct : products[id]})
        }
        else{
            set({loading : true, error : null})
            const {error, product} = await getProductById(id);
            if (!product){
                set({error : {message : error.message, status : 500}})
            }
            else{
                set({currentProduct : product, products : {...products, [product.id]: product}})
            }
            set({loading : false})
        }
    }
}))
