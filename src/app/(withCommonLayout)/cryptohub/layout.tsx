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
import AffiliateLinksBar from "@/components/AffiliateLinksBar";

/**
 * CryptoLayout component provides the main layout for the CryptoHub application.
 * It includes a sidebar for navigation, user profile display, and handles real-time notifications.
 * It is designed to be responsive, adapting to both large and small screens.
 */
const CryptoLayout = ({ children }) => {
  // Redux hooks for dispatching actions and selecting state
  const dispatch = useAppDispatch();
  // Next.js router hook for navigation
  const router = useRouter();
  // State to control the visibility of the mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State to keep track of unread notification count
  const [unreadCount, setUnreadCount] = useState(0);
  // State to store notifications
  const [notifications, setNotifications] = useState([]);
  // Next.js hook to get the current pathname
  const pathname = usePathname();

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);
  // Fetch user data from the database using RTK Query, skipping if user ID is not available
  const { data: userFromDbData, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  // Fetch notifications for the current user, skipping if user ID is not available
  const { data: notificationData } = useGetNotificationByUseridQuery(user?.id, { skip: !user?.id });
  // Extract user data from the fetched response
  const userFromDb = userFromDbData?.data;

  /**
   * Effect hook to handle initial notification data and update unread count.
   * Runs when notificationData or user.id changes.
   */
  useEffect(() => {
    if (notificationData?.data) {
      setNotifications(notificationData.data);
      // Filter out notifications sent by the current user to count unread notifications from others
      const unread = notificationData.data.filter(notification => notification.senderId !== user?.id);
      setUnreadCount(unread.length);
    }
  }, [notificationData, user?.id]);

  /**
   * Effect hook to set up real-time notification listeners via Socket.io.
   * Joins a user-specific room to receive notifications.
   * Cleans up the socket listener on component unmount.
   */
  useEffect(() => {
    if (user?.id) {
      // Socket connection event listener (optional, for debugging)
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      // Listener for incoming notifications
      socket.on("receiveNotification", (notification) => {
        // Add new notification to the beginning of the notifications array
        setNotifications((prev) => [notification, ...prev]);
        // Increment unread count only if the notification is not sent by the current user
        if (notification.senderId !== user?.id) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      // Emit event to join the user's specific room for notifications
      socket.emit("joinUserRoom", user.id);

      // Cleanup function: remove the receiveNotification listener when the component unmounts or user.id changes
      return () => {
        socket.off("receiveNotification");
        console.log("Socket disconnected and listener removed.");
      };
    }
  }, [user?.id]); // Dependency array: re-run effect if user.id changes

  /**
   * Effect hook to reset the unread notification count when the user navigates to the notifications page.
   */
  useEffect(() => {
    if (pathname === "/cryptohub/notifications") {
      setUnreadCount(0); // Reset unread count when on the notifications page
    }
  }, [pathname]); // Dependency array: re-run effect if pathname changes

  /**
   * Handles user logout. Clears user data from Redux and redirects to the home page.
   */
  const handleLogOut = () => {
    dispatch(clearUser()); // Dispatch action to clear user state
    router.push("/"); // Redirect to the home page
  };

  // Define navigation items for the sidebar
  const navigationItems = [
    { name: "CryptoChat", path: "/cryptohub/cryptochat", icon: FaHashtag },
    { name: "Feed", path: "/cryptohub/feed", icon: MdOutlineDynamicFeed },
    { name: "Expert Videos", path: "/cryptohub/videoPost", icon: MdOutlineDynamicFeed },
    { name: "My Spot", path: "/cryptohub/myspot", icon: FaUser },
    { name: "Notifications", path: "/cryptohub/notifications", icon: IoMdNotifications, hasNotification: unreadCount > 0, notificationCount: unreadCount },
  ];

  // Maximum rewards possible
  const maxRewards = 10000;
  // Calculate current rewards by summing up reward amounts from the user's rewards array
  const currentRewards = Array.isArray(userFromDb?.rewards)
    ? userFromDb.rewards.reduce((sum, reward) => sum + (reward.reward_amount || 0), 0)
    : 0;
  // Calculate reward progress as a percentage, clamped between 0 and 100
  const rewardProgress = Math.max(0, Math.min(100, (currentRewards / maxRewards) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* The main layout container with padding-top to account for a fixed header if one exists */}
      <div className="flex flex-1 pt-32 px-4">
        {/* Sidebar for larger screens (lg breakpoint and above) */}
        {/* Hidden on smaller screens using 'hidden lg:block' */}
        <div className="hidden lg:block w-72 mr-4 flex-shrink-0">
          <aside className="sticky top-32 h-fit bg-black/95 border border-gray-800 shadow-xl rounded-2xl backdrop-blur-sm p-4">
            {/* Crypto Hub Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-2">CRYPTO HUB</h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-white to-gray-400 rounded-full"></div>
            </div>
            {/* Navigation Links */}
            <ul className="flex flex-col gap-3">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname.includes(item.path);
                return (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <Button
                        // Button styling changes based on active state and hover
                        className={`w-full flex items-center justify-start gap-3 text-base font-medium px-4 py-3 rounded-xl transition-all duration-200 relative group ${isActive ? "bg-gray-900/80 text-white border border-gray-700" : "bg-transparent text-gray-400 hover:bg-gray-900/50 hover:text-white border border-transparent hover:border-gray-700"}`}
                      >
                        <div className="relative">
                          {/* Icon component */}
                          <IconComponent className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
                          {/* Notification indicator (pulsing dot) */}
                          {item.hasNotification && item.notificationCount > 0 && (
                            <div className="absolute -top-0.5 -right-0.5">
                              <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                              <div className="relative w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <span>{item.name}</span>
                        {/* Active indicator dot */}
                        {isActive && <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* User Profile Section (visible only if user is logged in) */}
            {user && (
              <div className="mt-8 border-t border-gray-800 pt-4">
                <div className="bg-gray-900/50 rounded-xl p-4 mb-4 border border-gray-800">
                  {userFromDbLoading ? (
                    // Loading state for user profile
                    <div className="flex items-center gap-3 mb-3 animate-pulse">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full" />
                      <div>
                        <div className="h-4 bg-gray-700 rounded w-24 mb-1" />
                        <div className="h-3 bg-gray-800 rounded w-16" />
                      </div>
                    </div>
                  ) : userFromDb ? (
                    // Display user profile if data is available
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        {userFromDb.profileImage ? (
                          // User profile image
                          <img
                            src={userFromDb.profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          // Placeholder for profile image if not available
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
                      {/* User stats: Posts, Followers, Following */}
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
                      {/* Rewards Display */}
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm font-medium">Rewards: {currentRewards}</p>
                      </div>
                    </>
                  ) : null}
                </div>
                {/* Logout Button */}
                <Button
                  onClick={handleLogOut}
                  className="group bg-white text-black hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 w-full flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <GrLogin className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                  Logout
                </Button>
              </div>
            )}
          </aside>
        </div>

        {/* Mobile Sidebar (fixed position, slides in/out) */}
        {/* Hidden on larger screens using 'lg:hidden' */}
        <aside
          className={`fixed top-0 left-0 w-72 h-full z-50 bg-black/95 border-r border-gray-800 shadow-xl text-white flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
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
                        onClick={() => setIsSidebarOpen(false)} // Close sidebar on navigation item click
                        className={`w-full flex items-center justify-start gap-3 text-base font-medium px-4 py-3 rounded-xl transition-all duration-200 relative group ${isActive ? "bg-gray-900/80 text-white border border-gray-700" : "bg-transparent text-gray-400 hover:bg-gray-900/50 hover:text-white border border-transparent hover:border-gray-700"}`}
                      >
                        <div className="relative">
                          <IconComponent className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
                          {item.hasNotification && item.notificationCount > 0 && (
                            <div className="absolute -top-0.5 -right-0.5">
                              <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                              <div className="relative w-2 h-2 bg-blue-500 rounded-full"></div>
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

          {/* User Profile Section for Mobile Sidebar */}
          {user && (
            <div className="px-4 pb-4 mt-8 border-t border-gray-800 pt-4">
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
                    <div className="flex justify-around items-center text-center mb-4 text-sm">
                      <div>
                        <p className="text-white font-semibold">{userFromDb.posts?.length ?? 0}</p>
                        <p className="text-gray-400 text-xs">Posts</p>
                      </div>
                      <div className="w-px h-8 bg-gray-700"></div>
                      <div>
                        <p className="text-white font-semibold">{userFromDb.followers?.length ?? 0}</p>
                        <p className="text-gray-400 text-xs">Followers</p>
                      </div>
                      <div className="w-px h-8 bg-gray-700"></div>
                      <div>
                        <p className="text-white font-semibold">{userFromDb.following?.length ?? 0}</p>
                        <p className="text-gray-400 text-xs">Following</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm font-medium">Rewards: {currentRewards}</p>
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

        {/* Mobile Sidebar Toggle Button */}
        {/* Visible only on smaller screens using 'lg:hidden' */}
        <div className="lg:hidden fixed top-32 left-4 z-40">
          <Button
            className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg p-3 backdrop-blur-sm border border-gray-700 transition-colors duration-200 relative"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu size={20} />
            {/* Mobile notification indicator on the toggle button */}
            {unreadCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5">
                <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </Button>
        </div>

        {/* Overlay when mobile sidebar is open */}
        {/* This div creates a semi-transparent overlay that closes the sidebar when clicked */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        {/* This area takes up the remaining space and displays the children components */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>

      {/* Footer / Affiliate Bar */}
      {/* This component is always at the bottom of the page */}
      <AffiliateLinksBar />
    </div>
  );
};

export default CryptoLayout;
