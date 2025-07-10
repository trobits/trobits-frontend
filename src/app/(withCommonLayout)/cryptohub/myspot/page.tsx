"use client"
import { useAppDispatch } from '@/redux/hooks'
import { usePathname } from 'next/navigation'
import { setPaths } from '@/redux/features/slices/authSlice'
import AuthGuard from "@/components/Auth/AuthGuard"
import RecommendedAccounts from "@/components/Cards/RecommendedAccounts"
import TrendingTopic from "@/components/Cards/TrendingTopic"
import VerifiedAccounts from "@/components/Cards/VerifiedAccounts"
import MyProfilePage from "@/components/Cryptohub/MyProfile"
import { useEffect } from 'react'

const MySpotPage = () => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  // Update paths without reload - FIXED!
  useEffect(() => {
    dispatch(setPaths(pathName));
  }, [pathName, dispatch]);

  return (
      <AuthGuard>
        <div className="flex gap-4 flex-1 p-4 flex-wrap justify-center  min-h-screen bg-[#00000027]">
          {/* Main Feed */}
          <div className="flex-1">
            <div className="min-h-screen bg-[#0000004d] ">
              {/* Stars background effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0" />
              </div>

              <MyProfilePage />
            </div>
          </div>
          <div className="w-80 space-y-4 ">
            <TrendingTopic />
            <RecommendedAccounts />
            <VerifiedAccounts />
          </div>
        </div>
      </AuthGuard>
  )
}

export default MySpotPage

