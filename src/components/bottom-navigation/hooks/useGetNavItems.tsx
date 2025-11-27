import { routerConfig } from '@/config/router.config';
import { useCityStore } from '@/entities/city/cityStore';
import useAuth from '@/hooks/useAuth';
import { useCity } from '@/lib/use-city';
import { Home, Search, User } from 'lucide-react';
import { useMemo } from 'react';

const useGetNavigation = () => {
    const {user} = useAuth();
    const city = useCity();
    const navigationItems = useMemo( () => [
        {
        name: "Главная",
        href: routerConfig.withCity(city, routerConfig.home),
        icon: Home,
        },
        {
        name: "Каталог",
        href: routerConfig.withCity(city, routerConfig.mobileCatalog),
        icon: Search,
        },
        {
        name: user ? "Аккаунт" : "Войти",
        href: user ? routerConfig.withCity(city, routerConfig.profile) :  routerConfig.withCity(city, routerConfig.mobileLogin),
        icon: User,
        },
    ], [user])

    return navigationItems;
};

export default useGetNavigation;
