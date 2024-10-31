import AuthGuard from "@/components/Auth/AuthGuard"
import RecommendedAccounts from "@/components/Cards/RecommendedAccounts"
import TrendingTopic from "@/components/Cards/TrendingTopic"
import VerifiedAccounts from "@/components/Cards/VerifiedAccounts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { BadgeCheck, Edit, Image as ImageIcon, LayoutGrid } from "lucide-react"
import React from 'react'

const MySpotPage = () => {
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

            <div className="relative max-w-2xl mx-auto p-4 pt-8">
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>T</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-semibold text-white">Tabi</h1>
                      <BadgeCheck className="h-5 w-5 fill-cyan-400 text-white" />
                    </div>
                    <p className="text-gray-400">@Tabi</p>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>1.5k Following</span>
                      <span>1.M Followers</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>

              {/* Post Creation */}
              <Card className="bg-transparent border-cyan-400/30 mb-6">
                <div className="p-4">
                  <textarea
                    placeholder="how do you feel about market today? share your ideas here!"
                    className="min-h-[100px] resize-none bg-transparent border-0 focus-visible:ring-0 text-gray-300 placeholder:text-gray-500"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400">
                        <LayoutGrid className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                      Post
                    </Button>
                  </div>
                </div>
              </Card>

              <div>
                <Button className=" px-3 py-2 rounded-md bg-indigo-500 text-white mr-3">Post</Button>
                <Button className=" px-3 py-2 rounded-md bg-indigo-500 text-white">Comment</Button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-4 ">
          <TrendingTopic />
          <VerifiedAccounts />
          <RecommendedAccounts />
        </div>

      </div>
    </AuthGuard>
  )
}

export default MySpotPage
