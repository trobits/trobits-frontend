/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import React, { ReactNode, useEffect, useState } from "react";
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
  const [scrollY, setScrollY] = useState<number>(0);
  const pathname = usePathname();

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-800 to-gray-700 text-white relative">
      {/* Fixed Sidebar */}
      <aside
        style={{
          top: `calc(8rem - ${Math.min(scrollY * 0.25, 60)}px)`, // dynamic scroll
        }}
        className={`fixed left-4 w-72 h-[calc(100vh-8.5em)] z-30 bg-[#000000b9] border border-cyan-300/40 shadow-2xl text-white flex flex-col justify-between items-center rounded-3xl backdrop-blur-xl overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Main Nav */}
        <nav className="flex-1 w-full flex flex-col items-center pt-10">
          <h2 className="text-3xl font-extrabold tracking-wide text-cyan-300 drop-shadow-lg mb-12">
            CRYPTO HUB
          </h2>
          <ul className="flex flex-col gap-6 w-full px-6">
            <li>
              <Link href="/cryptohub/cryptochat">
                <Button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center justify-start gap-2 text-lg font-semibold px-4 py-3 rounded-2xl transition-all duration-200 ease-in-out ${
                    pathname.includes("/cryptohub/cryptochat")
                      ? "bg-cyan-600/60 text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-teal-400"
                  }`}
                >
                  <FaHashtag className="text-cyan-300" />
                  CryptoChat
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/cryptohub/feed">
                <Button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center justify-start gap-2 text-lg font-semibold px-4 py-3 rounded-2xl transition-all duration-200 ease-in-out ${
                    pathname.includes("/cryptohub/feed")
                      ? "bg-cyan-600/60 text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-teal-400"
                  }`}
                >
                  <MdOutlineDynamicFeed className="text-cyan-300" />
                  Feed
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/cryptohub/videoPost">
                <Button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center justify-start gap-2 text-lg font-semibold px-4 py-3 rounded-2xl transition-all duration-200 ease-in-out ${
                    pathname.includes("/cryptohub/videoPost")
                      ? "bg-cyan-600/60 text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-teal-400"
                  }`}
                >
                  <MdOutlineDynamicFeed className="text-cyan-300" />
                  Expert Videos
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/cryptohub/myspot">
                <Button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center justify-start gap-2 text-lg font-semibold px-4 py-3 rounded-2xl transition-all duration-200 ease-in-out ${
                    pathname.includes("/cryptohub/myspot")
                      ? "bg-cyan-600/60 text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-teal-400"
                  }`}
                >
                  <FaUser className="text-cyan-300" />
                  My Spot
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/cryptohub/notifications">
                <Button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center justify-start gap-2 text-lg font-semibold px-4 py-3 rounded-2xl transition-all duration-200 ease-in-out ${
                    pathname.includes("/cryptohub/notifications")
                      ? "bg-cyan-600/60 text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-teal-400"
                  }`}
                >
                  <IoMdNotifications className="text-cyan-300" />
                  Notifications
                </Button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout CTA at bottom */}
        <div className="w-full px-6 pb-6">
          <Link href="/">
            <Button
              onClick={handleLogOut}
              className="
        group bg-white text-black px-9 py-6 rounded-3xl font-semibold text-base
        transition-all duration-300 hover:scale-105
        hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white
        hover:shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]
        flex items-center gap-2 w-full justify-center
      "
            >
              <GrLogin className="text-black group-hover:text-white" />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden absolute top-6 left-4 z-40">
        <Button
          className="bg-teal-600 text-white rounded-lg px-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FiMenu size={24} />
        </Button>
      </div>

      {/* Main Content */}
      <main className="lg:ml-80 ml-0 min-h-screen overflow-y-auto p-4 pt-28">
        {children}
      </main>
    </div>
  );
};

export default CryptoLayout;
