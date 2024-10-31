"use client"

import AuthGuard from "@/components/Auth/AuthGuard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BadgeCheck, Heart, MessageCircle, MoreVertical, Bell } from "lucide-react"

export default function NotificationPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0000004f]">
        <div className="max-w-2xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-semibold text-white">Notifications</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#00000091] border-cyan-400/30">
                <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-cyan-400/10">
                  Mark all as read
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-cyan-400/10">
                  Notification settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


          {/* Notifications List */}
          <div className="space-y-4">
            {/* Like Notification */}
            <Card className="bg-transparent border-cyan-400/30 p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">John Doe</span>
                    <BadgeCheck className="h-4 w-4 fill-blue-400 text-white" />
                  </div>
                  <p className="text-gray-400">Liked your post</p>
                  <p className="text-gray-500 text-sm">Trading strategies for beginners</p>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                  <span className="text-xs text-gray-400">2m ago</span>
                </div>
              </div>
            </Card>

            {/* Comment Notification */}
            <Card className="bg-transparent border-cyan-400/30 p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">Alice Smith</span>
                    <BadgeCheck className="h-4 w-4 fill-blue-400 text-white" />
                  </div>
                  <p className="text-gray-400">Commented on your post</p>
                  <p className="text-gray-500 text-sm">Great analysis! Would love to hear more about</p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-xs text-gray-400">1h ago</span>
                </div>
              </div>
            </Card>

            {/* Follow Notification */}
            <Card className="bg-transparent border-cyan-400/30 p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">Robert Johnson</span>
                  </div>
                  <p className="text-gray-400">Started following you</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Follow Back
                  </Button>
                  <span className="text-xs text-gray-400">3h ago</span>
                </div>
              </div>
            </Card>

            {/* Mention Notification */}
            <Card className="bg-transparent border-cyan-400/30 p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>EW</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">Emma Wilson</span>
                    <BadgeCheck className="h-4 w-4 fill-blue-400 text-white" />
                  </div>
                  <p className="text-gray-400">Mentioned you in a comment</p>
                  <p className="text-gray-500 text-sm">
                    <span className="text-cyan-400">@hgdhgxxc</span> What do you think about this market trend?
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-xs text-gray-400">5h ago</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}