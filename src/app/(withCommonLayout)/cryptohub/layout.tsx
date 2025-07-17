"use client";
import React, { useState, useEffect } from "react";
import { FaHashtag, FaUser } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { MdOutlineDynamicFeed } from "react-icons/md";
import { GrLogin } from "react-icons/gr";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearUser } from "@/redux/features/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetUserByIdQuery, useGetNotificationByUseridQuery } from "@/redux/features/api/authApi";
import socket from "@/redux/features/api/socketClient";

const CryptoLayout = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const pathname = usePathname();

  const user = useAppSelector((state) => state.auth.user);
  const { data: userFromDbData, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const { data: notificationData } = useGetNotificationByUseridQuery(user?.id, { skip: !user?.id });
  const userFromDb = userFromDbData?.data;

  // Handle notifications and socket updates
  useEffect(() => {
    if (notificationData?.data) {
      setNotifications(notificationData.data);
      // For now, show all notifications as unread (excluding user's own)
      // You can modify this logic based on your notification data structure
      const unread = notificationData.data.filter(notification =>
          notification.senderId !== user?.id
      );
      setUnreadCount(unread.length);
    }
  }, [notificationData, user?.id]);

  // Socket for real-time notifications
  useEffect(() => {
    if (user?.id) {
      socket.on("connect", () => {});

      socket.on("receiveNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        if (notification.senderId !== user?.id) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      socket.emit("joinUserRoom", user.id);

      return () => {
        socket.off("receiveNotification");
      };
    }
  }, [user?.id]);

  // Reset unread count when user visits notifications page
  useEffect(() => {
    if (pathname === "/cryptohub/notifications") {
      setUnreadCount(0);
    }
  }, [pathname]);

  const handleLogOut = () => {
    dispatch(clearUser());
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "CryptoChat", path: "/cryptohub/cryptochat", icon: FaHashtag },
    { name: "Feed", path: "/cryptohub/feed", icon: MdOutlineDynamicFeed },
    { name: "Expert Videos", path: "/cryptohub/videoPost", icon: MdOutlineDynamicFeed },
    { name: "My Spot", path: "/cryptohub/myspot", icon: FaUser },
    { name: "Notifications", path: "/cryptohub/notifications", icon: IoMdNotifications, hasNotification: unreadCount > 0, notificationCount: unreadCount },
  ];

  const maxRewards = 10000;
  // const currentRewards = userFromDb?.rewards ?? 0;
   const currentRewards = 10000;
  // Ensure rewardProgress is between 0 and 100
  const rewardProgress = Math.max(0, Math.min(100, (currentRewards / maxRewards) * 100));

  return (
      <div className="min-h-screen w-full bg-black text-white relative pt-32">
        {/* Sidebar */}
        <aside
            className={`fixed left-10 top-30 w-72 h-[calc(100vh-10rem)] z-30 bg-black/95 border border-gray-800 shadow-xl text-white flex flex-col justify-between rounded-2xl backdrop-blur-sm overflow-hidden transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <nav className="flex-1 w-full flex flex-col pt-8">
            <div className="px-6 mb-8">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-2">CRYPTO HUB</h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-white to-gray-400 rounded-full"></div>
            </div>

            <ul className="flex flex-col gap-3 w-full px-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname.includes(item.path);

                return (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <Button
                            onClick={() => setIsSidebarOpen(false)}
                            className={`w-full flex items-center justify-start gap-3 text-base font-medium px-4 py-3 rounded-xl transition-all duration-200 relative group ${isActive ? "bg-gray-900/80 text-white border border-gray-700" : "bg-transparent text-gray-400 hover:bg-gray-900/50 hover:text-white border border-transparent hover:border-gray-700"}`}
                        >
                          <div className="relative">
                            <IconComponent className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
                            {/* Minimal notification indicator */}
                            {item.hasNotification && (
                                <div className="absolute -top-0.5 -right-0.5">
                                  {item.notificationCount > 0 && (
                                      <>
                                        {/* Pulsing outer ring */}
                                        <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                                        {/* Solid inner dot */}
                                        <div className="relative w-2 h-2 bg-blue-500 rounded-full"></div>
                                      </>
                                  )}
                                </div>
                            )}
                          </div>
                          <span>{item.name}</span>
                          {isActive && <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>}
                        </Button>
                      </Link>
                    </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          {user && (
              <div className="px-4 pb-4">
                <div className="bg-gray-900/50 rounded-xl p-4 mb-4 border border-gray-800">
                  {userFromDbLoading ? (
                      <div className="flex items-center gap-3 mb-3 animate-pulse">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full" />
                        <div>
                          <div className="h-4 bg-gray-700 rounded w-24 mb-1" />
                          <div className="h-3 bg-gray-800 rounded w-16" />
                        </div>
                      </div>
                  ) : userFromDb ? (
                      <>
                        <div className="flex items-center gap-3 mb-3">
                          {userFromDb.profileImage ? (
                              <img
                                  src={userFromDb.profileImage}
                                  alt="Profile"
                                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                              />
                          ) : (
                              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {userFromDb.firstName?.[0]?.toUpperCase()}
                                {userFromDb.lastName?.[0]?.toUpperCase()}
                              </div>
                          )}
                          <div>
                            <p className="text-white font-medium text-sm">
                              {userFromDb.firstName} {userFromDb.lastName}
                            </p>
                            <p className="text-gray-400 text-xs">
                              @{userFromDb.firstName?.toLowerCase()}{userFromDb.lastName?.toLowerCase()}
                            </p>
                          </div>
                        </div>

                        {/* Posts, Followers, Following in one line */}
                        <div className="flex justify-around items-center text-center mb-4 text-sm">
                          <div>
                            <p className="text-white font-semibold">{userFromDb.posts?.length ?? 0}</p>
                            <p className="text-gray-400 text-xs">Posts</p>
                          </div>
                          <div className="w-px h-8 bg-gray-700"></div> {/* Divider */}
                          <div>
                            <p className="text-white font-semibold">{userFromDb.followers?.length ?? 0}</p>
                            <p className="text-gray-400 text-xs">Followers</p>
                          </div>
                          <div className="w-px h-8 bg-gray-700"></div> {/* Divider */}
                          <div>
                            <p className="text-white font-semibold">{userFromDb.following?.length ?? 0}</p>
                            <p className="text-gray-400 text-xs">Following</p>
                          </div>
                        </div>

                        {/* Rewards Progress Bar */}
                        <div className="mb-4">
                          <p className="text-gray-400 text-xs mb-1">Rewards : ${currentRewards}</p>
                          <div className="w-full bg-gray-700 rounded-full h-2.5 relative group">
                            <div
className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-300 relative"
                                style={{ width: `${rewardProgress}%` }}
                            >
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                              {currentRewards} / {maxRewards}
                            </div>
                          </div>
                          {/* Checkout Button when rewards >= 10000 */}
                         {currentRewards >= 10000 && (
  <div className="flex justify-center">
    <button
      className="mt-4 px-10 py-2 text-sm font-medium text-white rounded-xl shadow-md border-2 border-white/10 transition-all duration-300 bg-white/5 backdrop-blur-md hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:border-green-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
    >
      Checkout
    </button>
  </div>
)}






                        </div>
                      </>
                  ) : null}
                </div>

                <Link href="/">
                  <Button
                      onClick={handleLogOut}
                      className="group bg-white text-black hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 w-full flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <GrLogin className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    Logout
                  </Button>
                </Link>
              </div>
          )}
        </aside>

        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-32 left-4 z-40">
          <Button
              className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg p-3 backdrop-blur-sm border border-gray-700 transition-colors duration-200 relative"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu size={20} />
            {/* Mobile notification indicator */}
            {unreadCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5">
                  <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                  <div className="relative w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
            )}
          </Button>
        </div>

        {isSidebarOpen && (
            <div
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        <main className="lg:ml-80 lg:mr-4 ml-0 min-h-screen">
          {children}
        </main>
      </div>
  );
};

export default CryptoLayout;