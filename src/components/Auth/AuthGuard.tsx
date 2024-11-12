
"use client"
import { useGetUserByIdQuery } from '@/redux/features/api/authApi';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IUser } from '../Cryptohub/Types';

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const user: IUser = useAppSelector((state) => state.auth.user);
    const { data: userFromDb, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id || null);
    const [ toastShown, setToastShown ] = useState(false);

    useEffect(() => {
        
        if (!user && !toastShown) {
            toast.error("Please Login First!");
            setToastShown(true);
            router.push("/auth/login");
            return;
        }
    }, [ user, router, toastShown ]);

    if (userFromDbLoading) return null;
    if ((!user || !userFromDb) && !toastShown) {
        toast.error("Please Login First!");
        setToastShown(true);
        router.push("/auth/login");
        return;
    }

    if (!user) {
        return null;
    }

    return <div>{children}</div>;
};

export default AuthGuard;