"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navItems } from "@/components/Constant/Navbar.constant";
import Logo from "@/components/Shared/Logo";
import VideoModal from "@/components/VideoModal/VideoModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { clearUser, setPaths } from "@/redux/features/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";
import Script from "next/script";

const AdBannerHeader = ({ adClass }: { adClass: string }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  const injectAdScript = () => {
    if (!adContainerRef.current) return;

    // Remove existing ad script if any
    const existingScript = document.querySelector(`script[data-ad-class="${adClass}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new ad script
    const script = document.createElement("script");
    script.innerHTML = `
      !function(e,n,c,t,o,r,d){
        !function e(n,c,t,o,r,m,d,s,a){
          s=c.getElementsByTagName(t)[0],
          (a=c.createElement(t)).async=!0,
          a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
          a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
          s.parentNode.insertBefore(a,s)
        }(window,document,"script","${adClass}",["cdn.bmcdn6.com"], 0, new Date().getTime())
      }();
    `;
    script.setAttribute("data-ad-class", adClass);
    document.body.appendChild(script);
  };

  useEffect(() => {
    injectAdScript(); // Inject on mount

    // Listen for page visibility changes (when navigating back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        injectAdScript(); // Re-inject ads on page activation
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ adClass ]);

  return (
    <div ref={adContainerRef}>
      <ins
        className={adClass}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
        key={adClass + Date.now()}
      ></ins>
    </div>
  );
};

export default function Navbar() {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isBasicsDropdownOpen, setIsBasicsDropdownOpen ] = useState(false);
  const [ isBurnArchiveDropdownOpen, setIsBurnArchiveDropdownOpen ] =
    useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ showAllLinks, setShowAllLinks ] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const paths = useAppSelector((state) => state.auth);
  const {
    data: userFromDbData,
    isLoading: userFromDbLoading,
    refetch: refetchUserFromDb,
  } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userFromDb = userFromDbData?.data;
  const pathName = usePathname();

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

  useEffect(() => {
    dispatch(setPaths(pathName));
  }, [ pathName ])

  if (userFromDbLoading) return <p>Loading...</p>;

  return (
    <>
      <nav className="bg-[#00000085] relative">
        {/* Ad Banner at the top of the navbar */}
        <div className="w-full px-4 lg:px-20">
          <div className={"flex justify-center items-center w-full"}>
            <AdBannerHeader adClass="67b29a8ee904d5920e70a203" />
          </div>
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
                        className={`px-3 py-2 rounded-md text-sm cursor-pointer font-medium flex items-center ${pathName.includes(item.href)
                          ? "text-teal-400"
                          : "text-gray-300 hover:text-white"
                          }`}
                        onClick={() => {
                          closeAllDropdowns();
                        }}
                      >
                        {item.name}
                      </Link>
                    </div>
                  );
                } else if (item.name === "Welcome") {
                  return (
                    <div key={item.name} className="relative">
                      <button
                        onClick={() => {
                          toggleDropdown(setIsBasicsDropdownOpen);
                        }}
                        className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium flex items-center ${isBasicsDropdownOpen || pathName.includes(item.href)
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
                            onClick={() => {
                              closeAllDropdowns();
                            }}
                          >
                            How It Works
                          </Link>
                          <Link
                            href="/aboutus"
                            className="block cursor-pointer px-4 py-2 text-sm"
                            onClick={() => {
                              closeAllDropdowns();
                            }}
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
                        onClick={() => {
                          toggleDropdown(setIsBurnArchiveDropdownOpen);
                        }}
                        className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium flex items-center ${isBurnArchiveDropdownOpen
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
                            onClick={() => {
                              closeAllDropdowns();
                            }}
                          >
                            SHIB
                          </Link>
                          <Link
                            href="/archive/lunc"
                            className="block cursor-pointer px-4 py-2 text-sm"
                            onClick={() => {
                              closeAllDropdowns();
                            }}
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
                      className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${pathName.includes(item.href)
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
                      className={`block px-3 cursor-pointer py-2 rounded-md text-base font-medium ${pathName.includes(item.href)
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
                      onClick={() => {
                        toggleDropdown(setIsBasicsDropdownOpen);
                      }}
                      className={`px-3 py-2 cursor-pointer rounded-md text-base font-medium flex items-center ${isBasicsDropdownOpen || pathName.includes(item.href)
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
                          className="block px-3 py-2 cursor-pointer rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
                          onClick={() => {
                            setIsOpen(false);
                            closeAllDropdowns();
                          }}
                        >
                          About Us
                        </Link>
                      </div>
                    )}
                  </div>
                ) : item.name === "Burn Archive" ? (
                  <div key={item.name}>
                    <button
                      onClick={() => {
                        toggleDropdown(setIsBurnArchiveDropdownOpen);
                      }}
                      className={`px-3 py-2 rounded-md text-base font-medium flex items-center ${isBurnArchiveDropdownOpen
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
                    className={`block px-3 py-2 cursor-pointer rounded-md text-base font-medium ${pathName.includes(item.href)
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
      
      {/* Affiliate Links Banner */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-3 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 animate-gradient"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.4)_0%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.2)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <div className="w-full px-4 lg:px-20 relative">
          <div className="flex flex-col gap-3">
            <div className="text-center mb-2">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 mb-2 flex items-center justify-center gap-2 group">
                <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🎁</span>
                Get Rewards Just for Shopping
              </h3>
              <p className="text-sm text-gray-200 max-w-2xl mx-auto">
                You buy. You benefit. We all win. We've partnered with top brands to bring you exclusive deals and cash-back opportunities.
              </p>
            </div>
            {/* First Row */}
            <div className="flex justify-between gap-3">
              <a href="https://www.coinbase.com/join/3QJQJQ?src=referral-link" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">💰</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Coinbase</span>
              </a>
              <a href="https://www.stockmarket.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">📈</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Stock Market</span>
              </a>
              <a href="https://safeshellvpn.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">🔒</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">SafeShell VPN</span>
              </a>
              <a href="https://www.bitget.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">💱</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Bitget</span>
              </a>
              <a href="https://www.binance.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">🪙</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Binance</span>
              </a>
              <a href="https://www.bybit.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">📊</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Bybit</span>
              </a>
            </div>
            {/* Second Row */}
            <div className="flex justify-between gap-3 mt-3">
              <a href="https://www.kucoin.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">💎</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">KuCoin</span>
              </a>
              <a href="https://www.okx.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">🔄</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">OKX</span>
              </a>
              <a href="https://www.gate.io" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">🚪</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Gate.io</span>
              </a>
              <a href="https://www.huobi.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">🔥</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Huobi</span>
              </a>
              <a href="https://www.kraken.com" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">🐙</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Kraken</span>
              </a>
              <a href="https://lycamobileusa.sjv.io/mOrak7" target="_blank" rel="noopener noreferrer" 
                className="group flex items-center justify-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap relative overflow-hidden w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="text-2xl mr-2 group-hover:animate-bounce">📱</span>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300">Lyca Mobile</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}