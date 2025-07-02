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
} from "lucide-react";
import socket from "@/redux/features/api/socketClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IoNotificationsCircle } from "react-icons/io5";
import { useGetNotificationByUseridQuery } from "@/redux/features/api/authApi";
import Loading from "@/components/Shared/Loading";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visibleCount, setVisibleCount] = useState(20); // Initially show 20 notifications
  const user = useAppSelector((state) => state.auth.user);
  const { data: allNotificationData, isLoading: allNotificationDataLoading, error: notificationError } =
    useGetNotificationByUseridQuery(user?.id);
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  
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

  if (window) {
    if (previousPath !== "/cryptohub/notifications" && currentPath === "/cryptohub/notifications") {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }
  
  if (allNotificationDataLoading) {
    return <Loading />;
  }

  if (notificationError) {
    let errorMsg = "";
    if (typeof notificationError.data === "object" && notificationError.data?.message) {
      errorMsg = notificationError.data.message;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-800/80 text-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">{errorMsg}</h2>
        </div>
      </div>
    );
  }
  
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 20);
  };
  
  const visibleNotifications = notifications.slice(0, visibleCount);
  
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0000004f]">
        <div className="max-w-2xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-semibold text-white">
                Notifications
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-cyan-400"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#00000091] border-cyan-400/30"
              >
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
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleShowMore}
                variant="outline"
                className="text-cyan-400 border-cyan-400"
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
// Component to render different notification types
// const NotificationCard = ({ notification }: { notification: Notification }) => {
//   return (
//     <Card className="bg-transparent border-cyan-400/30 p-4">
//       <div className="flex">
//         <Avatar />
//         <div className="flex-1 space-y-1">
//           <div className="flex items-center gap-1">
//             <h1 className="text-white"><IoNotificationsCircle className="size-10 mr-3" /></h1>
//             {notification.type === "LIKE" && (
//               <div className=" flex justify-between w-full items-center gap-3">
//                 <div className=" flex gap-2 items-center">

//                   <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
//                   <p className="text-gray-400">{notification?.message}</p>
//                 </div>
//                 <Link href={`/cryptohub/userProfile/${notification?.senderId}`} className=" px-2 py-2 rounded-md hover:bg-cyan-500 shadow-white transition-all font-sans bg-cyan-700 text-white">Visit Profile</Link>
//               </div>
//             )}
//             {notification.type === "COMMENT" && (
//               <div className=" flex justify-between w-full items-center gap-3">
//                 <div className=" flex gap-2 items-center">

//                   <MessageCircle className="h-5 w-5 text-cyan-400" />
//                   <p className="text-gray-400">{notification?.message}</p>
//                 </div>
//                 <Link href={`/cryptohub/userProfile/${notification?.senderId}`} className=" px-2 py-2 rounded-md hover:bg-cyan-500 shadow-white transition-all font-sans bg-cyan-700 text-white">Visit Profile</Link>
//               </div>
//             )}
//             {notification.type === "FOLLOW" && (
//               <div className=" flex justify-between w-full items-center gap-3">
//                 <div className=" flex gap-2 items-center">

//                   <BadgeCheck className="h-4 w-4 fill-blue-400 text-white" />
//                   <p className="text-gray-400">{notification?.message}</p>
//                 </div>
//                 <Link href={`/cryptohub/userProfile/${notification?.senderId}`} className=" px-2 py-2 rounded-md hover:bg-cyan-500 shadow-white transition-all font-sans bg-cyan-700 text-white">Visit Profile</Link>
//               </div>
//             )}
//           </div>
//           <p className="text-xs text-gray-500">{notification.timestamp}</p>
//         </div>
//       </div>
//     </Card>
//   );
// };

// Existing NotificationCard component
const NotificationCard = ({ notification }: { notification: Notification }) => {
  return (
    <Card className="bg-transparent border-cyan-400/30 p-4">
      <div className="flex">
        <Avatar />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1">
            <h1 className="text-white">
              <IoNotificationsCircle className="size-10 mr-3" />
            </h1>
            {notification.type === "LIKE" && (
              <div className=" flex justify-between w-full items-center gap-3">
                <div className=" flex gap-2 items-center">
                  <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                  <p className="text-gray-400">{notification?.message}</p>
                </div>
                <Link
                  href={`/cryptohub/userProfile/${notification?.senderId}`}
                  className=" px-2 py-2 rounded-md hover:bg-cyan-500 shadow-white transition-all font-sans bg-cyan-700 text-white"
                >
                  Visit Profile
                </Link>
              </div>
            )}
            {notification.type === "COMMENT" && (
              <div className=" flex justify-between w-full items-center gap-3">
                <div className=" flex gap-2 items-center">
                  <MessageCircle className="h-5 w-5 text-cyan-400" />
                  <p className="text-gray-400">{notification?.message}</p>
                </div>
                <Link
                  href={`/cryptohub/userProfile/${notification?.senderId}`}
                  className=" px-2 py-2 rounded-md hover:bg-cyan-500 shadow-white transition-all font-sans bg-cyan-700 text-white"
                >
                  Visit Profile
                </Link>
              </div>
            )}
            {notification.type === "FOLLOW" && (
              <div className=" flex justify-between w-full items-center gap-3">
                <div className=" flex gap-2 items-center">
                  <BadgeCheck className="h-4 w-4 fill-blue-400 text-white" />
                  <p className="text-gray-400">{notification?.message}</p>
                </div>
                <Link
                  href={`/cryptohub/userProfile/${notification?.senderId}`}
                  className=" px-2 py-2 rounded-md hover:bg-cyan-500 shadow-white transition-all font-sans bg-cyan-700 text-white"
                >
                  Visit Profile
                </Link>
              </div>
            )}
          </div>
          {notification.postId && (
            <div className="mt-4 flex justify-end">
              <Link
                href={`/cryptohub/cryptochat/${notification?.id}/${notification?.postId}`}
                className="px-3 py-2 text-sm font-medium rounded-md shadow-md bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                See Post
              </Link>
            </div>
          )}
          <p className="text-xs text-gray-500">{notification.timestamp}</p>
        </div>
      </div>
    </Card>
  );
};
