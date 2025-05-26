'use client'
import { persistor, store } from '@/redux/store'
import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export default function Providers({ children }: { children: ReactNode }) {
    
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
            <Toaster position='top-right' />
        </Provider>
    )
}
