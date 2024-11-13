"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BadgeCheck, Heart, MessageCircle, MoreVertical, Bell } from "lucide-react";
import socket from "@/redux/features/api/socketClient";
import { useAppSelector } from "@/redux/hooks";

// Define types for notifications
type Notification = {
  id: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  timestamp: string;
};

export default function NotificationPage() {
  const [ notifications, setNotifications ] = useState<Notification[]>([]);
  const user = useAppSelector((state) => state.auth.user);

  // Handle real-time notifications
  useEffect(() => {
    // Listen for incoming notifications
    socket.on("notification", (notification: Notification) => {
      console.log("Received notification:", notification); // Log received notifications
      setNotifications((prevNotifications) => [ notification, ...prevNotifications ]);
    });

    // Join the user's notification room for real-time updates
    const userId = user?.id;
    if (userId) {
      console.log("Joining notification room with userId:", userId); // Log room joining
      socket.emit("joinNotificationRoom", userId);
    } else {
      console.warn("User ID not found in localStorage");
    }

    // Cleanup socket connection on component unmount
    return () => {
      socket.off("notification");
    };
  }, [ user?.id ]);

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
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

// Component to render different notification types
const NotificationCard = ({ notification }: { notification: Notification }) => {
  return (
    <Card className="bg-transparent border-cyan-400/30 p-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={notification.senderAvatar || "/placeholder.svg"} />
          <AvatarFallback>{notification.senderName[ 0 ]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-white">{notification.senderName}</span>
            {notification.type === "LIKE" && (
              <>
                <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                <p className="text-gray-400">Liked your post</p>
              </>
            )}
            {notification.type === "COMMENT" && (
              <>
                <MessageCircle className="h-5 w-5 text-cyan-400" />
                <p className="text-gray-400">Commented on your post</p>
              </>
            )}
            {notification.type === "FOLLOW" && (
              <>
                <BadgeCheck className="h-4 w-4 fill-blue-400 text-white" />
                <p className="text-gray-400">Started following you</p>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500">{notification.timestamp}</p>
        </div>
      </div>
    </Card>
  );
};
