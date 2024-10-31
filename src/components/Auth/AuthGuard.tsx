"use client"
import { useAppSelector } from '@/redux/hooks'
import React, { ReactNode } from 'react'
import LoginPage from './LoginPage';

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const user = useAppSelector((state) => state.auth.user);
    if (!user) {
        return <LoginPage />
    }
    console.log(user)
    return (
        <div>
            {children}
        </div>
    )
}

export default AuthGuard
