/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import React, { ReactNode, useState } from "react";
import { FaHashtag, FaUser } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { MdOutlineDynamicFeed } from "react-icons/md";
import { GrLogin } from "react-icons/gr";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Shared/Logo";
import { clearUser } from "@/redux/features/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

const CryptoLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const handleLogOut = () => {
    dispatch(clearUser());
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-sm">
      <div className="min-h-[calc(100vh-140px)] w-full  flex flex-col lg:flex-row bg-transparent rounded-b-md mt-24 ml-4 overflow-auto">
        {/* Fixed Sidebar */}
        <aside
          className={`fixed overflow-y-auto lg:w-72 w-72 max-h-[calc(100vh-9rem)] mt-8 bg-[#000000b9] border border-cyan-300/40 shadow-2xl text-white flex flex-col justify-start items-center fixed lg:relative z-20 lg:translate-x-0 transition-transform transform rounded-3xl backdrop-blur-xl ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } mx-2 my-4`}
        >
          {/* Navigation - Centered Vertically */}
          <nav className="flex-1 w-full flex flex-col justify-center items-center">
            {/* Title above buttons */}
            <h2 className="text-3xl font-extrabold tracking-wide text-cyan-300 drop-shadow-lg mb-28">
              CRYPTO HUB
            </h2>
            <ul className="flex flex-col gap-8 w-full px-6">
              <li>
                <Link href="/cryptohub/cryptochat" passHref>
                  <Button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center justify-center gap-2 text-lg font-semibold px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-300/30 shadow-md hover:scale-105 hover:bg-cyan-400/30 hover:text-cyan-200 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                      pathname.includes("/cryptohub/cryptochat")
                        ? "bg-cyan-600/60 text-white shadow-lg"
                        : ""
                    }`}
                  >
                    <FaHashtag className="text-cyan-300" />
                    CryptoChat
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/cryptohub/feed" passHref>
                  <Button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center justify-center gap-2 text-lg font-semibold px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-300/30 shadow-md hover:scale-105 hover:bg-cyan-400/30 hover:text-cyan-200 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                      pathname.includes("/cryptohub/feed")
                        ? "bg-cyan-600/60 text-white shadow-lg"
                        : ""
                    }`}
                  >
                    <MdOutlineDynamicFeed className="text-cyan-300" />
                    Feed
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/cryptohub/videoPost" passHref>
                  <Button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center justify-center gap-2 text-lg font-semibold px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-300/30 shadow-md hover:scale-105 hover:bg-cyan-400/30 hover:text-cyan-200 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                      pathname.includes("/cryptohub/videoPost")
                        ? "bg-cyan-600/60 text-white shadow-lg"
                        : ""
                    }`}
                  >
                    <MdOutlineDynamicFeed className="text-cyan-300" />
                    Expert Videos
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/cryptohub/myspot" passHref>
                  <Button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center justify-center gap-2 text-lg font-semibold px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-300/30 shadow-md hover:scale-105 hover:bg-cyan-400/30 hover:text-cyan-200 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                      pathname.includes("/cryptohub/myspot")
                        ? "bg-cyan-600/60 text-white shadow-lg"
                        : ""
                    }`}
                  >
                    <FaUser className="text-cyan-300" />
                    My Spot
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/cryptohub/notifications" passHref>
                  <Button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center justify-center gap-2 text-lg font-semibold px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-300/30 shadow-md hover:scale-105 hover:bg-cyan-400/30 hover:text-cyan-200 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                      pathname.includes("/cryptohub/notifications")
                        ? "bg-cyan-600/60 text-white shadow-lg"
                        : ""
                    }`}
                  >
                    <IoMdNotifications className="text-cyan-300" />
                    Notifications
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/" passHref>
                  <Button
                    type="button"
                    onClick={handleLogOut}
                    className="w-full flex items-center justify-center gap-2 text-lg font-semibold px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-300/30 shadow-md hover:scale-105 hover:bg-cyan-400/30 hover:text-cyan-200 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-cyan-400 focus:outline-none text-white"
                  >
                    <GrLogin className="text-cyan-300" />
                    Logout
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Sidebar Toggle Button for Mobile */}
        <div className="lg:hidden flex justify-start p-4">
          <Button
            className={`bg-teal-600 ${
              isSidebarOpen ? "hidden" : ""
            } text-white rounded-lg px-5`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu size={24} />
          </Button>
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-2 min-h-screen overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CryptoLayout;
