import { Loader } from 'lucide-react';
import React from 'react';

const LoaderPage = () => {
    return (
        <div className='flex min-h-[80vh] justify-center items-center'>
            <Loader className='animate-spin' />
        </div>
    );
};

export default LoaderPage;
