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
import { GeminiCard } from "@/components/AffiliateLinks";

const AdBannerHeader = ({ adClass }: { adClass: string }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  const injectAdScript = () => {
    if (!adContainerRef.current) return;

    // Remove existing ad script if any
    const existingScript = document.querySelector(
        `script[data-ad-class="${adClass}"]`
    );
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
  }, [adClass]);

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
  const [isOpen, setIsOpen] = useState(false);
  const [isBasicsDropdownOpen, setIsBasicsDropdownOpen] = useState(false);
  const [isBurnArchiveDropdownOpen, setIsBurnArchiveDropdownOpen] =
      useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Scroll behavior - adjusted for CryptoNavbar
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        if (currentScrollY < 10) {
          // Always show at top
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
          // Scrolling down & past threshold (increased for CryptoNavbar)
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

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
  }, [pathName]);

  if (userFromDbLoading) return <p>Loading...</p>;

  const isHomePage = window.location.pathname === "/";

  return (
      <>
      {
        isHomePage &&
          <div className="w-[100vw] max-w-[1380px] flex flex-col items-center justify-between mx-auto px-4 py-4">
            <GeminiCard compact/>
          </div>
      }
        {/* Island Navbar - positioned below CryptoNavbar */}
        <nav
            id="main-navbar"
            className={`
          fixed ${isHomePage ? 'top-[130px]' : 'top-[10px]'} left-1/2 transform -translate-x-1/2 z-40 
          transition-all duration-500 ease-in-out
          ${
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
            }
        `}
        >
          <div
              className="
          bg-black/90 backdrop-blur-xl border border-white/10
          rounded-2xl px-6 py-3 shadow-2xl
          w-[95vw] max-w-[1350px]
        "
          >
            <div className="flex items-center justify-between md:gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Logo />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  if (item.name === "Learn") {
                    return (
                        <Link
                            key={item.name}
                            href={"/learn"}
                            className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        hover:bg-white/10 hover:scale-105
                        ${
                                (
                                    item.href === "/"
                                        ? pathName === "/"
                                        : pathName.includes(item.href)
                                )
                                    ? "text-teal-400 bg-teal-400/10"
                                    : "text-gray-300 hover:text-white"
                            }
                      `}
                            onClick={() => {
                              closeAllDropdowns();
                            }}
                        >
                          {item.name}
                        </Link>
                    );
                  } else if (item.name === "Welcome") {
                    return (
                        <div
                            key={item.name}
                            className="relative group"
                            onMouseEnter={() => setIsBasicsDropdownOpen(true)}
                            onMouseLeave={() => setIsBasicsDropdownOpen(false)}
                        >
                          <button
                              onClick={() => {
                                toggleDropdown(setIsBasicsDropdownOpen);
                              }}
                              className={`
                          px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1
                          transition-all duration-300 hover:bg-white/10 hover:scale-105
                          ${
                                  isBasicsDropdownOpen ||
                                  (item.href === "/"
                                      ? pathName === "/"
                                      : pathName.includes(item.href))
                                      ? "text-teal-400 bg-teal-400/10"
                                      : "text-gray-300 hover:text-white"
                              }
                        `}
                          >
                            {item.name}
                            <ChevronDown
                                className={`
                          w-4 h-4 transition-transform duration-300
                          ${isBasicsDropdownOpen ? "rotate-180" : "rotate-0"}
                        `}
                            />
                          </button>

                          <div
                              className={`
                        absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56
                        transition-all duration-300 origin-top
                        ${
                                  isBasicsDropdownOpen
                                      ? "opacity-100 visible scale-100 translate-y-0"
                                      : "opacity-0 invisible scale-95 -translate-y-2"
                              }
                      `}
                          >
                            <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 overflow-hidden">
                              <div className="space-y-1">
                                <button
                                    onClick={() => {
                                      handleOpenModal();
                                      closeAllDropdowns();
                                    }}
                                    className="group/item w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                                text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                flex items-center gap-3"
                                >
                                  <div
                                      className="w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/item:opacity-100
                                transition-opacity duration-300"
                                  ></div>
                                  Demo Video
                                </button>
                                <Link
                                    href="/howitworks"
                                    className="group/item block px-4 py-3 rounded-xl text-sm font-medium
                                text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                flex items-center gap-3"
                                    onClick={() => {
                                      closeAllDropdowns();
                                    }}
                                >
                                  <div
                                      className="w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/item:opacity-100
                                transition-opacity duration-300"
                                  ></div>
                                  How It Works
                                </Link>
                                <Link
                                    href="/aboutus"
                                    className="group/item block px-4 py-3 rounded-xl text-sm font-medium
                                text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                flex items-center gap-3"
                                    onClick={() => {
                                      closeAllDropdowns();
                                    }}
                                >
                                  <div
                                      className="w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/item:opacity-100
                                transition-opacity duration-300"
                                  ></div>
                                  About Us
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                    );
                  } else if (item.name === "Burn Archive") {
                    return (
                        <div
                            key={item.name}
                            className="relative group"
                            onMouseEnter={() => setIsBurnArchiveDropdownOpen(true)}
                            onMouseLeave={() => setIsBurnArchiveDropdownOpen(false)}
                        >
                          <button
                              onClick={() => {
                                toggleDropdown(setIsBurnArchiveDropdownOpen);
                              }}
                              className={`
                          px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1
                          transition-all duration-300 hover:bg-white/10 hover:scale-105
                          ${
                                  isBurnArchiveDropdownOpen
                                      ? "text-teal-400 bg-teal-400/10"
                                      : "text-gray-300 hover:text-white"
                              }
                        `}
                          >
                            {item.name}
                            <ChevronDown
                                className={`
                          w-4 h-4 transition-transform duration-300
                          ${
                                    isBurnArchiveDropdownOpen
                                        ? "rotate-180"
                                        : "rotate-0"
                                }
                        `}
                            />
                          </button>

                          <div
                              className={`
                        absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56
                        transition-all duration-300 origin-top
                        ${
                                  isBurnArchiveDropdownOpen
                                      ? "opacity-100 visible scale-100 translate-y-0"
                                      : "opacity-0 invisible scale-95 -translate-y-2"
                              }
                      `}
                          >
                            <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 overflow-hidden">
                              <div className="space-y-1">
                                <Link
                                    href="/archive/shiba"
                                    className="group/item block px-4 py-3 rounded-xl text-sm font-medium
                                text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                flex items-center gap-3"
                                    onClick={() => {
                                      closeAllDropdowns();
                                    }}
                                >
                                  <div
                                      className="w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/item:opacity-100
                                transition-opacity duration-300"
                                  ></div>
                                  SHIB
                                </Link>
                                <Link
                                    href="/archive/lunc"
                                    className="group/item block px-4 py-3 rounded-xl text-sm font-medium
                                text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                flex items-center gap-3"
                                    onClick={() => {
                                      closeAllDropdowns();
                                    }}
                                >
                                  <div
                                      className="w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/item:opacity-100
                                transition-opacity duration-300"
                                  ></div>
                                  LUNC
                                </Link>
                                <Link
                                    href="/archive/pepe"
                                    className="group/item block px-4 py-3 rounded-xl text-sm font-medium
                                text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                flex items-center gap-3"
                                    onClick={() => {
                                      closeAllDropdowns();
                                    }}
                                >
                                  <div
                                      className="w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/item:opacity-100
                                transition-opacity duration-300"
                                  ></div>
                                  PEPE
                                </Link>
                                <Link
                                    href="/archive/floki"
                                    className="group/item block px-4 py-3 rounded-xl text-sm font-medium
                                text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                flex items-center gap-3"
                                    onClick={() => {
                                      closeAllDropdowns();
                                    }}
                                >
                                  <div
                                      className="w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/item:opacity-100
                                transition-opacity duration-300"
                                  ></div>
                                  FLOKI
                                </Link>
                                <Link
                                    href="/archive/bonk"
                                    className="group/item block px-4 py-3 rounded-xl text-sm font-medium
                                text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                flex items-center gap-3"
                                    onClick={() => {
                                      closeAllDropdowns();
                                    }}
                                >
                                  <div
                                      className="w-2 h-2 rounded-full bg-teal-400 opacity-0 group-hover/item:opacity-100
                                transition-opacity duration-300"
                                  ></div>
                                  BONK
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                    );
                  } else {
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        hover:bg-white/10 hover:scale-105
                        ${
                                (
                                    item.href === "/"
                                        ? pathName === "/"
                                        : pathName.includes(item.href)
                                )
                                    ? "text-teal-400 bg-teal-400/10"
                                    : "text-gray-300 hover:text-white"
                            }
                      `}
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
              <div className="hidden md:block">
                {userFromDb && user ? (
                    <Button
                        onClick={() => {
                          handleLogOut();
                          closeAllDropdowns();
                        }}
                        className="
                    bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700
                    text-white px-6 py-2 rounded-xl font-medium
                    transition-all duration-200 hover:scale-105 shadow-lg
                  "
                    >
                      Logout
                    </Button>
                ) : (
                    <Link
                        href={"/auth/login"}
                        className="
                    bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700
                    text-white px-6 py-2 rounded-xl font-medium
                    transition-all duration-200 hover:scale-105 shadow-lg inline-block
                  "
                        onClick={() => {
                          setIsOpen(false);
                          closeAllDropdowns();
                        }}
                    >
                      Login
                    </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="
                  p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10
                  transition-all duration-200 hover:scale-105
                "
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                      <X className="w-6 h-6" aria-hidden="true" />
                  ) : (
                      <Menu className="w-6 h-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                  <div className="space-y-2">
                    {navItems.map((item) =>
                        item.name === "Learn" ? (
                            <div key={item.name}>
                              <Link
                                  href="/learn"
                                  className={`
                          block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                          ${
                                      (
                                          item.href === "/"
                                              ? pathName === "/"
                                              : pathName.includes(item.href)
                                      )
                                          ? "text-teal-400 bg-teal-400/10"
                                          : "text-gray-300 hover:text-white hover:bg-white/10"
                                  }
                        `}
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
                                  className={`
                          w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between
                          transition-all duration-200
                          ${
                                      isBasicsDropdownOpen || pathName.includes(item.href)
                                          ? "text-teal-400 bg-teal-400/10"
                                          : "text-gray-300 hover:text-white hover:bg-white/10"
                                  }
                        `}
                              >
                                {item.name}
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              {isBasicsDropdownOpen && (
                                  <div className="mt-2 ml-4 space-y-1">
                                    <button
                                        onClick={() => {
                                          handleOpenModal();
                                          closeAllDropdowns();
                                        }}
                                        className="block w-full text-left px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    >
                                      Demo Video
                                    </button>
                                    <Link
                                        href="/howitworks"
                                        className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                        onClick={() => {
                                          setIsOpen(false);
                                          closeAllDropdowns();
                                        }}
                                    >
                                      How It Works
                                    </Link>
                                    <Link
                                        href="/aboutus"
                                        className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
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
                                  className={`
                          w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between
                          transition-all duration-200
                          ${
                                      isBurnArchiveDropdownOpen
                                          ? "text-teal-400 bg-teal-400/10"
                                          : "text-gray-300 hover:text-white hover:bg-white/10"
                                  }
                        `}
                              >
                                {item.name}
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              {isBurnArchiveDropdownOpen && (
                                  <div className="mt-2 ml-4 space-y-1">
                                    <Link
                                        href="/archive/shiba"
                                        className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                        onClick={() => {
                                          setIsOpen(false);
                                          closeAllDropdowns();
                                        }}
                                    >
                                      SHIB
                                    </Link>
                                    <Link
                                        href="/archive/lunc"
                                        className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
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
                                className={`
                        block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                        ${
                                    pathName.includes(item.href)
                                        ? "text-teal-400 bg-teal-400/10"
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                }
                      `}
                                onClick={() => {
                                  setIsOpen(false);
                                  closeAllDropdowns();
                                }}
                            >
                              {item.name}
                            </Link>
                        )
                    )}

                    {/* Mobile User Section */}
                    <div className="pt-4 border-t border-white/10">
                      {userFromDb && user ? (
                          <Button
                              onClick={() => {
                                handleLogOut();
                                closeAllDropdowns();
                                setIsOpen(false);
                              }}
                              className="
                        w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700
                        text-white px-6 py-3 rounded-xl font-medium
                        transition-all duration-200 hover:scale-105 shadow-lg
                      "
                          >
                            Logout
                          </Button>
                      ) : (
                          <Link
                              href={"/auth/login"}
                              className="
                        block w-full text-center bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700
                        text-white px-6 py-3 rounded-xl font-medium
                        transition-all duration-200 hover:scale-105 shadow-lg
                      "
                              onClick={() => {
                                setIsOpen(false);
                                closeAllDropdowns();
                              }}
                          >
                            Login
                          </Link>
                      )}
                    </div>
                  </div>
                </div>
            )}
          </div>
        </nav>

        <VideoModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </>
  );
}