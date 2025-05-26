// import AuthGuard from "@/components/Auth/AuthGuard"
import RecommendedAccounts from "@/components/Cards/RecommendedAccounts"
import TrendingTopic from "@/components/Cards/TrendingTopic"
import VerifiedAccounts from "@/components/Cards/VerifiedAccounts"
import UserProfile from "@/components/Cryptohub/UserProfile"
import React from 'react'

interface PageProps {
    params: {
        userId: string;
    }
}
const MySpotPage = ({ params: { userId } }: PageProps) => {
    return (
        <div>
            <div className="flex gap-4 flex-1 p-4 flex-wrap justify-center  min-h-screen bg-[#00000027]">
                {/* Main Feed */}
                <div className="flex-1">
                    <div className="min-h-screen bg-[#0000004d] ">
                        {/* Stars background effect */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute inset-0" />
                        </div>

                        <UserProfile userId={userId} />


                    </div>
                </div>
                <div className="w-80 space-y-4 ">
                    <TrendingTopic />
                    <VerifiedAccounts />
                    <RecommendedAccounts />
                </div>

            </div>
        </div>
    )
}

export default MySpotPage
