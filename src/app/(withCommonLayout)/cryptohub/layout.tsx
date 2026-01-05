"use client";

import React, { useState, useEffect } from "react";
import { FaHashtag, FaUser } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { MdOutlineDynamicFeed } from "react-icons/md";
import { GrLogin } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearUser } from "@/redux/features/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetUserByIdQuery, useGetNotificationByUseridQuery, useAllUserQuery, useDeleteUserCompletelyMutation } from "@/redux/features/api/authApi";
import socket from "@/redux/features/api/socketClient";
import AffiliateLinksBar from "@/components/AffiliateLinksBar";
import { X } from "lucide-react";
import { Trash2Icon } from "lucide-react";
import { Gift } from "lucide-react";


const CryptoLayout = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const pathname = usePathname();
  const [isDeleteModalOpen, setDeleteIsModalOpen] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const { data: userFromDbData, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const { data: allUsersData, isLoading: allUsersLoading } = useAllUserQuery({});

  const { data: notificationData } = useGetNotificationByUseridQuery(user?.id, { skip: !user?.id });
  const userFromDb = userFromDbData?.data;

   // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following">("followers");
  const [modalUsers, setModalUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (notificationData?.data) {
      setNotifications(notificationData.data);
      const unread = notificationData.data.filter((n) => n.senderId !== user?.id);
      setUnreadCount(unread.length);
    }
  }, [notificationData, user?.id]);

  useEffect(() => {
    if (user?.id) {
      socket.on("receiveNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        if (notification.senderId !== user?.id) {
          setUnreadCount((prev) => prev + 1);
        }
      });
      socket.emit("joinUserRoom", user.id);
      return () => socket.off("receiveNotification");
    }
  }, [user?.id]);

  useEffect(() => {
    if (pathname === "/cryptohub/notifications") {
      setUnreadCount(0);
    }
  }, [pathname]);

  const handleLogOut = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const [deleteUserCompletely, { isLoading }] = useDeleteUserCompletelyMutation();

  const deleteAccount = async () => {
    try {
      console.log("USERRRR", user);
      
      await deleteUserCompletely(user?.id).unwrap();
      dispatch(clearUser());
      router.push("/");

      // Optionally redirect or clear localStorage/session
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const navigationItems = [
    { name: "CryptoChat", path: "/cryptohub/cryptochat", icon: FaHashtag },
    { name: "Feed", path: "/cryptohub/feed", icon: MdOutlineDynamicFeed },
    { name: "Expert Videos", path: "/cryptohub/videoPost", icon: MdOutlineDynamicFeed },
    { name: "My Spot", path: "/cryptohub/myspot", icon: FaUser },
    {
      name: "Notifications",
      path: "/cryptohub/notifications",
      icon: IoMdNotifications,
      hasNotification: unreadCount > 0,
      notificationCount: unreadCount,
    },
  ];

  const maxRewards = 10000;
  const currentRewards = Array.isArray(userFromDb?.rewards)
    ? userFromDb.rewards.reduce((sum, reward) => sum + (reward.reward_amount || 0), 0)
    : 0;


    // 📌 Open modal and fetch user details
const openModal = (type: "followers" | "following") => {
  setModalType(type);
  setIsModalOpen(true);

  if (!allUsersData) return;

  const ids = type === "followers" ? userFromDb?.followers : userFromDb?.following;

  console.log("All Users Data:", allUsersData);
  

  if (ids?.length) {
    const filtered = allUsersData?.data?.filter((u) => ids.includes(u.id));
    setModalUsers(filtered);
  } else {
    setModalUsers([]);
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-32 left-4 z-40">
        <Button
          className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg p-3 backdrop-blur-sm border border-gray-700 transition-colors duration-200 relative"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FiMenu size={20} />
          {unreadCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5">
              <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 pt-32 px-4">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? "block" : "hidden"} lg:block w-72 mr-4 z-30`}>
          <aside className="sticky top-32 h-fit bg-black/95 border border-gray-800 shadow-xl rounded-2xl backdrop-blur-sm p-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-2">CRYPTO HUB</h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-white to-gray-400 rounded-full"></div>
            </div>
            <ul className="flex flex-col gap-3">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname.includes(item.path);
                return (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <Button
                        onClick={() => setIsSidebarOpen(false)}
                        className={`w-full flex items-center justify-start gap-3 text-base font-medium px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                          isActive
                            ? "bg-gray-900/80 text-white border border-gray-700"
                            : "bg-transparent text-gray-400 hover:bg-gray-900/50 hover:text-white border border-transparent hover:border-gray-700"
                        }`}
                      >
                        <div className="relative">
                          <IconComponent
                            className={`w-5 h-5 ${
                              isActive ? "text-white" : "text-gray-500 group-hover:text-white"
                            }`}
                          />
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

            <div className="mt-8 border-t border-gray-800 pt-4 min-h-[160px]">
              {user && userFromDb && !userFromDbLoading && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    {userFromDb?.profileImage ? (
                      <img
                        src={userFromDb.profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {userFromDb?.firstName?.[0]?.toUpperCase()}
                        {userFromDb?.lastName?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium text-sm">
                        {userFromDb?.firstName} {userFromDb?.lastName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        @{userFromDb?.firstName?.toLowerCase()}
                        {userFromDb?.lastName?.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 mt-4">
                    <div className="text-center">
                      <p className="text-white font-semibold">{userFromDb?.posts?.length ?? 0}</p>
                      <p>Posts</p>
                    </div>
                    <div className="text-center cursor-pointer" onClick={() => openModal("followers")}>
                      <p className="text-white font-semibold">{userFromDb?.followers?.length ?? 0}</p>
                      <p>Followers</p>
                    </div>
                    <div className="text-center cursor-pointer" onClick={() => openModal("following")}>
                      <p className="text-white font-semibold">{userFromDb?.following?.length ?? 0}</p>
                      <p>Following</p>
                    </div>
                  </div>

                  <p className="text-sm mt-4 text-gray-400">Rewards: {currentRewards}</p>

{/* Daily Rewards Button */}
<Button
  onClick={() => {
    setIsSidebarOpen(false);
    router.push("/daily-rewards"); // ✅ adjust if your route is /cryptohub/daily-rewards
  }}
  className="group bg-white text-black hover:bg-gray-800 hover:text-white px-4 py-3 mt-4 rounded-xl font-medium text-sm transition-all duration-300 w-full flex items-center justify-center gap-2 hover:shadow-lg"
>
  <Gift className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
  Daily Rewards
</Button>

                  {/* Delete Account Button + Confirmation Popup */}
                  <Button
                    onClick={() => setDeleteIsModalOpen(true)} // 👈 open confirmation modal
                    className="group bg-white text-black hover:bg-red-600 hover:text-white px-4 py-3 mt-4 rounded-xl font-medium text-sm transition-all duration-300 w-full flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <Trash2Icon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    Delete Account
                  </Button>
                  <Button
                    onClick={handleLogOut}
                    className="group bg-white text-black hover:bg-red-600 hover:text-white mt-4 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 w-full flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <GrLogin className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">{children}</main>
      </div>

      {/* Confirmation Modal */}
                    {isDeleteModalOpen && (
                      <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] max-w-md shadow-lg text-center">
                          <h2 className="text-xl font-semibold text-white mb-3">
                            Are you sure you want to delete your account?
                          </h2>
                          <p className="text-gray-400 text-sm mb-6">
                            ⚠️ This process is <span className="text-red-500 font-medium">irreversible</span> and will permanently remove all your data.
                          </p>

                          <div className="flex justify-center gap-4">
                            <Button
                              onClick={() => setDeleteIsModalOpen(false)}
                              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={async () => {
                                await deleteAccount();
                                setDeleteIsModalOpen(false);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                            >
                              Yes, Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
    <div className="bg-gray-900 rounded-lg p-6 w-96 relative">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-2 text-white hover:text-red-500"
      >
        ✕
      </button>

      <h2 className="text-lg font-bold mb-4 capitalize">{modalType}</h2>

      {allUsersLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : modalUsers.length > 0 ? (
        <ul className="space-y-3">
          {modalUsers.map((u) => (
            <li key={u.id} className="flex items-center gap-3">
              {u.profileImage ? (
                <img
                  src={u.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {u.firstName?.[0]}
                  {u.lastName?.[0]}
                </div>
              )}
              <span className="text-white">{u.firstName} {u.lastName}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No {modalType} yet.</p>
      )}
    </div>
  </div>
)}


      <AffiliateLinksBar />
    </div>
  );
};

export default CryptoLayout;
