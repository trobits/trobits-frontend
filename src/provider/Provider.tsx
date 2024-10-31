'use client'
import { store } from '@/redux/store'
import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            {children}
            <Toaster position='top-right' />
        </Provider>
    )
}
