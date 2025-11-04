import { routerConfig } from '@/config/router.config';
import Link from 'next/link';
import React from 'react';

const HeaderLogo = () => {
    return (
      <Link href={routerConfig.home} className="flex items-center flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold ml-2 lg:ml-3">ГрандБАЗАР</h1>
      </Link>
    );
};

export default HeaderLogo;
