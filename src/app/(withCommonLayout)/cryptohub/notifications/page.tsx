"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  MoreVertical,
  Bell,
  Clock,
  User,
  ArrowUpRight,
  Eye
} from "lucide-react";
import socket from "@/redux/features/api/socketClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IoNotificationsCircle } from "react-icons/io5";
import { useGetNotificationByUseridQuery, useMarkNotificationsAsReadMutation } from "@/redux/features/api/authApi";
import Loading from "@/components/Shared/Loading";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setPaths } from "@/redux/features/slices/authSlice";

// Define types for notifications
type Notification = {
  id: string;
  senderId: string;
  message: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  timestamp: string;
  postId?: string;
  category?: string;
  isSeen: boolean;
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visibleCount, setVisibleCount] = useState(20); // Initially show 20 notifications
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const user = useAppSelector((state) => state.auth.user);
  const { data: allNotificationData, isLoading: allNotificationDataLoading, error: notificationError } =
      useGetNotificationByUseridQuery(user?.id);
  const [markNotificationsAsRead, { isLoading: isMarkingRead }] = useMarkNotificationsAsReadMutation();
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  // Update paths without reload - FIXED!
  useEffect(() => {
    dispatch(setPaths(pathName));
  }, [pathName, dispatch]);

  // Handle real-time notifications
  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("receiveNotification", (notification: Notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    const userId = user?.id;
    if (userId) {
      socket.emit("joinUserRoom", userId);
    }

    return () => {
      socket.off("receiveNotification");
    };
  }, [user?.id]);

  useEffect(() => {
    if (allNotificationData?.data?.length) {
      setNotifications(allNotificationData.data);
    }
  }, [allNotificationData]);

  if (allNotificationDataLoading) {
    return <Loading />;
  }

  if (notificationError) {
    let errorMsg = "";
    if (typeof notificationError.data === "object" && notificationError.data?.message) {
      errorMsg = notificationError.data.message;
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="bg-gray-900/80 text-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">{errorMsg}</h2>
          </div>
        </div>
    );
  }

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 20);
  };

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'read') return notification.isSeen;
    if (filter === 'unread') return !notification.isSeen;
    return true;
  });
  const visibleNotifications = filteredNotifications.slice(0, visibleCount);

  return (
      <AuthGuard>
        <div className="min-h-screen bg-black">
          <div className="max-w-2xl mx-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Notifications</h1>
                  <p className="text-gray-400 text-sm">Stay updated with your activity</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 bg-gray-900 border-gray-700"
                >
                  <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
                    Mark all as read
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
                    Notification settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Toggle Buttons for All, Read, Unread */}
            <div className="flex justify-center gap-2 mb-6">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-blue-600 text-white' : ''}
              >
                All Notifications
              </Button>
              <Button
                variant={filter === 'read' ? 'default' : 'outline'}
                onClick={() => setFilter('read')}
                className={filter === 'read' ? 'bg-green-600 text-white' : ''}
              >
                Read
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilter('unread')}
                className={filter === 'unread' ? 'bg-yellow-500 text-white' : ''}
              >
                Unread
              </Button>
            </div>

            {/* Mark All as Read Button for Unread Filter */}
            {filter === 'unread' && filteredNotifications.length > 0 && (
              <div className="flex justify-end mb-4">
                <Button
                  onClick={async () => {
                    const ids = filteredNotifications.map(n => n.id);
                    await markNotificationsAsRead(ids);
                  }}
                  disabled={isMarkingRead}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  {isMarkingRead ? 'Marking...' : 'Mark All as Read'}
                </Button>
              </div>
            )}
            {/* Notifications List */}
            <div className="space-y-3">
              {visibleNotifications?.map((notification) => {
                if (notification?.senderId === user?.id) return;
                return (
                    <NotificationCard
                        key={notification.id}
                        notification={notification}
                    />
                );
              })}
            </div>

            {/* Show More Button */}
            {visibleCount < notifications.length && (
                <div className="flex justify-center mt-6">
                  <Button
                      onClick={handleShowMore}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
                  >
                    Show More
                  </Button>
                </div>
            )}
          </div>
        </div>
      </AuthGuard>
  );
}

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const [markNotificationsAsRead, { isLoading: isMarkingRead }] = useMarkNotificationsAsReadMutation();

  const handleProfileClick = () => {
    router.push(`/cryptohub/userProfile/${notification.senderId}`);
  };

  const handlePostClick = () => {
    if (notification.postId) {
      router.push(`/cryptohub/cryptochat/${notification.id}/${notification.postId}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />;
      case "COMMENT":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "FOLLOW":
        return <BadgeCheck className="h-4 w-4 text-green-500 fill-green-500" />;
      default:
        return null;
    }
  };

  const getGradientBorder = (type: string) => {
    switch (type) {
      case "LIKE":
        return "bg-gradient-to-r from-pink-500/20 to-purple-500/20";
      case "COMMENT":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20";
      case "FOLLOW":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20";
      default:
        return "bg-gray-800/50";
    }
  };

  return (
      <Card
          className={`
        relative overflow-hidden transition-all duration-300 ease-out
        bg-gray-900/80 border-gray-700/50 hover:border-gray-600/80
        hover:shadow-lg hover:shadow-gray-900/20
        group cursor-pointer
      `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${getGradientBorder(notification.type)}`} />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar with status indicator */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden">
                <IoNotificationsCircle className="h-6 w-6 text-gray-400" />
              </div>
              {/* Type indicator badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center border border-gray-700">
                {getIcon(notification.type)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock className="h-3 w-3" />
                  {notification.timestamp}
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {notification.message}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap relative z-10">
                <button
                    onClick={handleProfileClick}
                    className="inline-flex items-center h-8 px-3 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors rounded-md cursor-pointer relative z-20"
                >
                  <User className="h-3 w-3 mr-1" />
                  Visit Profile
                </button>

                {notification.postId && (
                    <button
                        onClick={handlePostClick}
                        className="inline-flex items-center h-8 px-3 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors rounded-md cursor-pointer relative z-20"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      See Post
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </button>
                )}
                {/* Mark as Read Button for Unread Notifications */}
                {!notification.isSeen && (
                  <button
                    onClick={async () => await markNotificationsAsRead([notification.id])}
                    disabled={isMarkingRead}
                    className="inline-flex items-center h-8 px-3 text-xs font-medium text-green-500 hover:text-white hover:bg-green-700/80 transition-colors rounded-md cursor-pointer relative z-20 border border-green-500 ml-2"
                  >
                    {isMarkingRead ? 'Marking...' : 'Mark as Read'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
        transform transition-transform duration-500 ease-out pointer-events-none
        ${isHovered ? 'translate-x-0' : '-translate-x-full'}
      `} />
      </Card>
  );
};