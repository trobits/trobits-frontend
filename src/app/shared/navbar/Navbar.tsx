/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navItems } from "@/components/Constant/Navbar.constant";
import Logo from "@/components/Shared/Logo";
import VideoModal from "@/components/VideoModal/VideoModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { clearUser } from "@/redux/features/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBasicsDropdownOpen, setIsBasicsDropdownOpen] = useState(false);
  const [isBurnArchiveDropdownOpen, setIsBurnArchiveDropdownOpen] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const {
    data: userFromDbData,
    isLoading: userFromDbLoading,
    refetch: refetchUserFromDb,
  } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userFromDb = userFromDbData?.data;
  const pathName = usePathname();

  if (userFromDbLoading) return null;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleDropdown = (dropdownSetter: any) => {
    setIsBasicsDropdownOpen(false);
    setIsBurnArchiveDropdownOpen(false);
    dropdownSetter((prev: any) => !prev);
  };

  const handleLogOut = async () => {
    await refetchUserFromDb();
    dispatch(clearUser());
    router.push("/");
  };

  const closeAllDropdowns = () => {
    setIsBasicsDropdownOpen(false);
    setIsBurnArchiveDropdownOpen(false);
  };

  return (
    <nav className="bg-[#00000085]">
      <div className="w-full px-4 lg:px-20">
        <div className="flex items-center justify-evenly h-24">
          <div className="flex-shrink-0 my-2">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-grow justify-around ml-10">
            {navItems.map((item) => {
              if (item.name === "Learn") {
                return (
                  <div key={item.name} className="relative">
                    <Link
                      href={"/learn"}
                      className={`px-3 py-2 rounded-md text-sm cursor-pointer font-medium flex items-center ${
                        pathName.includes(item.href)
                          ? "text-teal-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                      onClick={closeAllDropdowns}
                    >
                      {item.name}
                    </Link>
                  </div>
                );
              } else if (item.name === "Welcome") {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={() => toggleDropdown(setIsBasicsDropdownOpen)}
                      className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium flex items-center ${
                        isBasicsDropdownOpen || pathName.includes(item.href)
                          ? "text-teal-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1" />
                    </button>
                    {isBasicsDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-black text-white rounded-md shadow-lg z-10">
                        <button

                          onClick={() => {
                            handleOpenModal();
                            closeAllDropdowns();
                          }}
                          className="block cursor-pointer px-4 py-2 text-sm"
                        >
                          Demo Video
                        </button>
                        <Link
                          href="/howitworks"
                          className="block cursor-pointer px-4 py-2 text-sm"
                          onClick={closeAllDropdowns}
                        >
                          How It Works
                        </Link>
                        <Link
                          href="/aboutus"
                          className="block cursor-pointer px-4 py-2 text-sm"
                          onClick={closeAllDropdowns}
                        >
                          About Us
                        </Link>
                      </div>
                    )}
                  </div>
                );
              } else if (item.name === "Burn Archive") {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={() =>
                        toggleDropdown(setIsBurnArchiveDropdownOpen)
                      }
                      className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium flex items-center ${
                        isBurnArchiveDropdownOpen
                          ? "text-teal-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1" />
                    </button>
                    {isBurnArchiveDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-black text-white rounded-md shadow-lg z-10">
                        <Link
                          href="/archive/shiba"
                          className="block cursor-pointer px-4 py-2 text-sm"
                          onClick={closeAllDropdowns}
                        >
                          SHIB
                        </Link>
                        <Link
                          href="/archive/lunc"
                          className="block cursor-pointer px-4 py-2 text-sm"
                          onClick={closeAllDropdowns}
                        >
                          LUNC
                        </Link>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      pathName.includes(item.href)
                        ? "text-teal-400"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      closeAllDropdowns();
                    }}
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
          </div>

          {/* User Section */}
          {userFromDb && user ? (
            <Button
              onClick={() => {
                handleLogOut();
                closeAllDropdowns();
              }}
              className="bg-cyan-700 hover:scale-105 cursor-pointer hover:bg-cyan-600 px-3 py-2 mr-1 rounded-md text-white"
            >
              Logout
            </Button>
          ) : (
            <Link
              href={"/auth/login"}
              className="bg-cyan-700 hover:scale-105 cursor-pointer hover:bg-cyan-600 px-3 py-2 mr-1 rounded-md text-white"
              onClick={() => {
                setIsOpen(false);
                closeAllDropdowns();
              }}
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center cursor-pointer justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) =>
              item.name === "Learn" ? (
                <div key={item.name}>
                  <Link
                    href="/learn"
                    className={`block px-3 cursor-pointer py-2 rounded-md text-base font-medium ${
                      pathName.includes(item.href)
                        ? "text-teal-400"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      closeAllDropdowns();
                    }}
                  >
                    Learn
                  </Link>
                </div>
              ) : item.name === "Welcome" ? (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(setIsBasicsDropdownOpen)}
                    className={`px-3 py-2 cursor-pointer rounded-md text-base font-medium flex items-center ${
                      isBasicsDropdownOpen || pathName.includes(item.href)
                        ? "text-teal-400"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="ml-1" />
                  </button>
                  {isBasicsDropdownOpen && (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          handleOpenModal();
                          closeAllDropdowns();
                        }}
                        className="block px-3 py-2 cursor-pointer rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                      >
                        Demo Video
                      </button>
                      <Link
                        href="/howitworks"
                        className="block px-3 py-2 cursor-pointer rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                        onClick={() => {
                          setIsOpen(false);
                          closeAllDropdowns();
                        }}
                      >
                        How It Works
                      </Link>
                      <Link
                        href="/aboutus"
                        className="block px-3 py-2 cursor-pointer rounded-md text-base font-medium text-gray-300 hover                      bg-gray-700"
                      >
                        About Us
                      </Link>
                    </div>
                  )}
                </div>
              ) : item.name === "Burn Archive" ? (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(setIsBurnArchiveDropdownOpen)}
                    className={`px-3 py-2 rounded-md text-base font-medium flex items-center ${
                      isBurnArchiveDropdownOpen
                        ? "text-teal-400"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="ml-1" />
                  </button>
                  {isBurnArchiveDropdownOpen && (
                    <div className="space-y-1">
                      <Link
                        href="/archive/shiba"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                        onClick={() => {
                          setIsOpen(false);
                          closeAllDropdowns();
                        }}
                      >
                        SHIB
                      </Link>
                      <Link
                        href="/archive/lunc"
                        className="block px-3 py-2 cursor-pointer rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                        onClick={() => {
                          setIsOpen(false);
                          closeAllDropdowns();
                        }}
                      >
                        LUNC
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 cursor-pointer rounded-md text-base font-medium ${
                    pathName.includes(item.href)
                      ? "text-teal-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    closeAllDropdowns();
                  }}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </div>
      )}
      <VideoModal isOpen={isModalOpen} onClose={handleCloseModal} />
      
    </nav>
  );
}
