"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react"; // ChevronDown icon for dropdown
import { navItems } from "@/components/Constant/Navbar.constant";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for controlling dropdown

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-black ">
      <div className="w-full px-8 sm:px-6 lg:px-20">
        <div className="flex items-center justify-evenly h-24">
          <div className="flex-shrink-0">
            <Link href="/" className="flex flex-col">
              <div className="flex justify-center items-center">
                <span className="text-orange-500 text-3xl font-bold">T</span>
                <span className="text-white text-xl ml-2">Trobits</span>
              </div>
              <span className="text-white text-xs ml-2">EARN 2 BURN</span>
            </Link>
          </div>
          <div className="hidden md:flex flex-grow justify-around ml-10">
            {navItems.map((item) =>
              item.name === "Learn" ? (
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
                        className="block px-4 py-2 text-sm  "
                      >
                        Crypto tips
                      </Link>
                      <Link
                        href="/learnType/cryptoBasic"
                        className="block px-4 py-2 text-sm "
                      >
                        Crypto basics
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
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
              )
            )}
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
                        crypto Tips
                      </Link>
                      <Link
                        href="/learnType/cryptoBasic"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                      >
                        crypto Basic
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
    </nav>
  );
}
