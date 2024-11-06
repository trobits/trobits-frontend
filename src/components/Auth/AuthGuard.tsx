"use client";
import { useAppSelector } from '@/redux/hooks';
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (!user) {
            toast.error("Please Login First!");
            router.push("/auth/login");
        }
    }, [ user, router ]); // Only runs when `user` or `router` changes

    if (!user) {
        return null; // Prevent rendering children if the user is not logged in
    }

    return <div>{children}</div>;
};

export default AuthGuard;
