import { routerConfig } from '@/config/router.config';
import useAuth from '@/hooks/useAuth';
import { Home, Search, User } from 'lucide-react';
import { useMemo } from 'react';

const useGetNavigation = () => {
    const {user} = useAuth();
    const navigationItems = useMemo( () => [
        {
        name: "Главная",
        href: routerConfig.home,
        icon: Home,
        },
        {
        name: "Каталог",
        href: routerConfig.mobileCatalog,
        icon: Search,
        },
        {
        name: user ? "Аккаунт" : "Войти",
        href: user ? routerConfig.profile : routerConfig.mobileLogin,
        icon: User,
        },
    ], [user])

    return navigationItems;
};

export default useGetNavigation;
