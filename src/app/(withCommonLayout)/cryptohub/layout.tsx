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
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";

const CryptoLayout = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  // Get user from Redux and fetch full user info
  const user = useAppSelector((state) => state.auth.user);
  const { data: userFromDbData, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const userFromDb = userFromDbData?.data;

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
    {
      name: "CryptoChat",
      path: "/cryptohub/cryptochat",
      icon: FaHashtag,
    },
    {
      name: "Feed",
      path: "/cryptohub/feed",
      icon: MdOutlineDynamicFeed,
    },
    {
      name: "Expert Videos",
      path: "/cryptohub/videoPost",
      icon: MdOutlineDynamicFeed,
    },
    {
      name: "My Spot",
      path: "/cryptohub/myspot",
      icon: FaUser,
    },
    {
      name: "Notifications",
      path: "/cryptohub/notifications",
      icon: IoMdNotifications,
    },
  ];

  return (
    console.log("User id:", user?.id),
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white relative pt-24">
        {/* Fixed Sidebar */}
        <aside
            className={`fixed left-10 top-30 w-72 h-[calc(100vh-10rem)] z-30 bg-slate-900/95 border border-slate-700/50 shadow-xl text-white flex flex-col justify-between rounded-2xl backdrop-blur-sm overflow-hidden transition-transform duration-300 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
        >
          {/* Main Nav */}
          <nav className="flex-1 w-full flex flex-col pt-8">
            <div className="px-6 mb-8">
              <h2 className="text-2xl font-bold tracking-wide text-cyan-300 mb-2">
                CRYPTO HUB
              </h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>

            <ul className="flex flex-col gap-3 w-full px-4">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = pathname.includes(item.path);

                return (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <Button
                            onClick={() => setIsSidebarOpen(false)}
                            className={`w-full flex items-center justify-start gap-3 text-base font-medium px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                                isActive
                                    ? "bg-slate-800/80 text-cyan-300 border border-cyan-500/30"
                                    : "bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-slate-700/50"
                            }`}
                        >
                          <IconComponent className={`w-5 h-5 transition-colors duration-200 ${
                              isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"
                          }`} />
                          <span className="transition-colors duration-200">{item.name}</span>

                          {/* Subtle active indicator */}
                          {isActive && (
                              <div className="absolute right-3 w-2 h-2 bg-cyan-400 rounded-full"></div>
                          )}
                        </Button>
                      </Link>
                    </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile Section */}
          {user && (
            <div className="px-4 pb-4">
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700/50">
                {userFromDbLoading ? (
                  <div className="flex items-center gap-3 mb-3 animate-pulse">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                    <div>
                      <div className="h-4 bg-slate-700 rounded w-24 mb-1" />
                      <div className="h-3 bg-slate-800 rounded w-16" />
                    </div>
                  </div>
                ) : userFromDb && user ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      {userFromDb?.profileImage ? (
                        <img
                          src={userFromDb.profileImage}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {userFromDb.firstName?.[0]?.toUpperCase()}{userFromDb.lastName?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">{userFromDb.firstName} {userFromDb.lastName}</p>
                        <p className="text-slate-400 text-xs">@{userFromDb.firstName?.toLowerCase()}{userFromDb.lastName?.toLowerCase()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-white font-semibold text-sm">{userFromDb.posts?.length ?? 0}</p>
                        <p className="text-slate-400 text-xs">Posts</p>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{userFromDb.following?.length ?? 0}</p>
                        <p className="text-slate-400 text-xs">Following</p>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{userFromDb.followers?.length ?? 0}</p>
                        <p className="text-slate-400 text-xs">Followers</p>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Logout Button */}
              <Link href="/">
                <Button
                    onClick={handleLogOut}
                    className="group bg-white text-slate-900 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 w-full flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <GrLogin className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                  Logout
                </Button>
              </Link>
            </div>
          )}
        </aside>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden fixed top-32 left-4 z-40">
          <Button
              className="bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg p-3 backdrop-blur-sm border border-slate-700/50 transition-colors duration-200"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu size={20} />
          </Button>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
            <div
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        {/* Main Content */}
        <main className="lg:ml-80 lg:mr-12  ml-0 min-h-screen">
            {children}
        </main>
      </div>
  );
};

export default CryptoLayout;