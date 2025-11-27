"use client"
import { useCityStore } from "@/entities/city/cityStore"
import { useEffect } from "react"

export const CityInit = ({city} : {city : any}) => {
    const {setCity} = useCityStore();
    useEffect( () => {
        setCity(city);
    }, [])
    return null;
}