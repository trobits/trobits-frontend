"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Heart, BadgeCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import RecommendedAccounts from "@/components/Cards/RecommendedAccounts"
import VerifiedAccounts from "@/components/Cards/VerifiedAccounts"
import TrendingTopic from "@/components/Cards/TrendingTopic"

export default function Component() {
  return (
    <div className="flex gap-4 flex-1 p-4 flex-wrap justify-center  min-h-screen bg-[#00000027]">
      {/* Main Feed */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white mb-4">For You</h1>

        <Input
          placeholder="Search posts"
          className="mb-4 bg-[#00000088] border-0 text-white placeholder:text-gray-400 focus-visible:ring-primary/30"
        />
        {/* Feed card */}
        <Card className="bg-[#00000056] border-0 text-white">
          <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>BE</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-semibold">Bernard</span>
                <BadgeCheck className="h-4 w-4 fill-blue-400 text-white" />
                <span className="text-blue-400">@Bernard</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white">
              Follow
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200">Let  take it to the moon</p>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/5 mt-4 pt-4">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="flex gap-1 text-gray-400 hover:text-white">
                <Heart className="h-4 w-4" />
                <span>1</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex gap-1 text-gray-400 hover:text-white">
                <MessageCircle className="h-4 w-4" />
                <span>1</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-4 ">
        {/* Trending topic */}
        <TrendingTopic />
        {/* Verified account card */}
        <VerifiedAccounts />
        {/* Recommended account card */}
        <RecommendedAccounts />
      </div>

    </div>
  )
}