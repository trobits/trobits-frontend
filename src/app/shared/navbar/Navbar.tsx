"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navItems } from "@/components/Constant/Navbar.constant";
import Logo from "@/components/Shared/Logo";
import VideoModal from "@/components/VideoModal/VideoModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBasicsDropdownOpen, setIsBasicsDropdownOpen] = useState(false); // New state for "Basics" dropdown

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleBasicsDropdown = () => {
    setIsBasicsDropdownOpen(!isBasicsDropdownOpen);
  };

  return (
    <nav className="bg-black">
      <div className="w-full px-8 sm:px-6 lg:px-20">
        <div className="flex items-center justify-evenly h-24">
          <div className="flex-shrink-0 my-2">
            <Logo/>
          </div>
          <div className="hidden md:flex flex-grow justify-around ml-10">
            {navItems.map((item) => {
              if (item.name === "Learn") {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 flex items-center"
                    >
                      {item.name}
                      <ChevronDown className="ml-1" />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-black text-white rounded-md shadow-lg z-10">
                        <Link
                          href="/learnType/cryptoTips"
                          className="block px-4 py-2 text-sm"
                        >
                          Crypto tips
                        </Link>
                        <Link
                          href="/learnType/cryptoBasic"
                          className="block px-4 py-2 text-sm"
                        >
                          Crypto basics
                        </Link>
                      </div>
                    )}
                  </div>
                );
              } else if (item.name === "Basics") {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={toggleBasicsDropdown}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 flex items-center"
                    >
                      {item.name}
                      <ChevronDown className="ml-1" />
                    </button>
                    {isBasicsDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-black text-white rounded-md shadow-lg z-10">
                        <button
                          onClick={handleOpenModal}
                          className="block px-4 py-2 text-sm"
                        >
                          Demo Video
                        </button>
                        <Link
                          href="/howitworks"
                          className="block px-4 py-2 text-sm"
                        >
                          How It Works
                        </Link>
                        <Link
                          href="/aboutus"
                          className="block px-4 py-2 text-sm"
                        >
                          About Us
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
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      item.name === "Home"
                        ? "text-teal-400"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) =>
              item.name === "Learn" ? (
                <div key={item.name}>
                  <button
                    onClick={toggleDropdown}
                    className="px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white flex items-center"
                  >
                    {item.name}
                    <ChevronDown className="ml-1" />
                  </button>
                  {isDropdownOpen && (
                    <div className="space-y-1">
                      <Link
                        href="/learnType/cryptoTips"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                      >
                        Crypto Tips
                      </Link>
                      <Link
                        href="/learnType/cryptoBasic"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                      >
                        Crypto Basics
                      </Link>
                    </div>
                  )}
                </div>
              ) : item.name === "Basics" ? (
                <div key={item.name}>
                  <button
                    onClick={toggleBasicsDropdown}
                    className="px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white flex items-center"
                  >
                    {item.name}
                    <ChevronDown className="ml-1" />
                  </button>
                  {isBasicsDropdownOpen && (
                    <div className="space-y-1">
                      <Link
                        href="/basics/demoVideo"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                      >
                        Demo Video
                      </Link>
                      <Link
                        href="/basics/howItWorks"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                      >
                        How It Works
                      </Link>
                      <Link
                        href="/basics/aboutUs"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                      >
                        About Us
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.name === "Home"
                      ? "text-teal-400"
                      : "text-gray-300 hover:text-white"
                  }`}
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
