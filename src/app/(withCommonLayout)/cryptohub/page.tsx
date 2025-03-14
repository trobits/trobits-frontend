"use client"
import React from 'react'
import Redirect from './Redirect'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { usePathname } from 'next/navigation'
import { setPaths } from '@/redux/features/slices/authSlice'

const CryptoHubPage
  = () => {
    const dispatch = useAppDispatch();
    const previousPath = useAppSelector((state) => state.auth.previousPath);
    const currentPath = useAppSelector((state) => state.auth.currentPath);
    const pathName = usePathname();

    if (window) {
      if (previousPath !== "/cryptohub" && currentPath === "/cryptohub") {
        dispatch(setPaths(pathName));
        window.location.reload();
      }
    }
    return (
      <div>
        <Redirect />
      </div>
    )
  }

export default CryptoHubPage

