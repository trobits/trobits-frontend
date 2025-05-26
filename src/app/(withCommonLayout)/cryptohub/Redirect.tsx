"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Redirect = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/cryptohub/cryptochat");
    }, [ router ]);

    return null;
}

export default Redirect;
