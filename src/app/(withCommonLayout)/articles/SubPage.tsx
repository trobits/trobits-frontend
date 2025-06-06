"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "@/components/NewsPart/NewsCard";
import Image from "next/image";
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Grid,
  List,
  ChevronDown,
  Loader2,
  Globe,
  Zap,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import {
  useTrendingNews,
  useMixedArticles,
  useAllTickersNews,
  useSearchNews,
} from "@/hooks/useCryptoNews";
import { IComment } from "@/components/Post/PostCommentCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { setPaths } from "@/redux/features/slices/authSlice";

export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  likeCount: number;
  likers: string[];
  comments: IComment[];
  sourceUrl?: string;
  sourceName?: string;
  tickers?: string[];
  sentiment?: string;
  type?: "crypto_news" | "blog_post";
}

// Enhanced Loading Component
const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Animated Globe */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-spin">
          <div className="absolute inset-2 rounded-full bg-gray-900"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Loading Articles</h3>
        <p className="text-gray-400 text-sm">
          Fetching the latest crypto news...
        </p>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

// Reusable Ad Component
const AdBanner = ({ adClass }: { adClass: string }) => {
  const adContainerRef = React.useRef<HTMLDivElement>(null);

  const injectAdScript = () => {
    if (!adContainerRef.current) return;

    const existingScript = document.querySelector(
      `script[data-ad-class="${adClass}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

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

  React.useEffect(() => {
    injectAdScript();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        injectAdScript();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [adClass]);

  return (
    <div ref={adContainerRef} className="w-full flex justify-center my-12">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8 text-center">
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Sponsored Content
          </h3>
          <p className="text-gray-400 text-sm">Advertisement</p>
        </div>
        <ins
          className={adClass}
          style={{ display: "inline-block", width: "1px", height: "1px" }}
        ></ins>
      </div>
    </div>
  );
};

//using simpleHeader prop to load the necessary header for homepage
interface SubPageProps {
  simpleHeader?: boolean;
}

const SubPage: React.FC<SubPageProps> = ({ simpleHeader = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [dataSource, setDataSource] = useState<"database" | "crypto" | "mixed">(
    "mixed"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // start
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [pauseScroll, setPauseScroll] = useState(false);

  //time logic
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const [isHoveringRight, setIsHoveringRight] = useState(false);

  //refs
  const hoverLeftRef = React.useRef(false);
  const hoverRightRef = React.useRef(false);

  // Auto scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseScroll && scrollRef.current) {
        scrollRef.current.scrollBy({ left: 420, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pauseScroll]);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (scrollRef.current) {
        if (hoverLeftRef.current) {
          scrollRef.current.scrollBy({ left: -450, behavior: "smooth" });
        } else if (hoverRightRef.current) {
          scrollRef.current.scrollBy({ left: 450, behavior: "smooth" });
        }
      }
    }, 1000);

    return () => clearInterval(scrollInterval);
  }, []);

  // end
  const limit = 20;
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  // Load saved page from localStorage on mount
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  // Persist currentPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  // Maintain previous/current path logic (only reload on BACK navigation)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      previousPath !== "/articles" &&
      currentPath === "/articles"
    ) {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }, [previousPath, currentPath, dispatch, pathName]);

  // Database articles query
  const {
    data: databaseData,
    isLoading: dbLoading,
    isFetching: dbFetching,
  } = useGetAllBlogsQuery(
    {
      page: currentPage,
      limit,
    },
    {
      skip: dataSource === "crypto",
    }
  );

  // Crypto news queries
  const searchKeywords = searchQuery
    ? searchQuery
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)
    : [];

  const {
    data: cryptoTrendingData,
    isLoading: cryptoTrendingLoading,
    isFetching: cryptoTrendingFetching,
    refetch: refetchCrypto,
  } = useTrendingNews({
    page: currentPage,
    limit,
    enabled: dataSource === "crypto" && !searchQuery,
  });

  const {
    data: cryptoSearchData,
    isLoading: cryptoSearchLoading,
    isFetching: cryptoSearchFetching,
  } = useSearchNews(searchKeywords, {
    page: currentPage,
    limit,
    enabled: dataSource === "crypto" && !!searchQuery,
  });

  const {
    data: mixedData,
    isLoading: mixedLoading,
    isFetching: mixedFetching,
  } = useMixedArticles(databaseData?.data || [], {
    page: currentPage,
    limit: Math.ceil(limit / 2),
    enabled: dataSource === "mixed",
  });

  // Determine current data and loading states
  let currentArticles: Article[] = [];
  let isLoading = false;
  let isFetching = false;
  let totalPages = 0;

  if (dataSource === "database") {
    currentArticles = databaseData?.data || [];
    isLoading = dbLoading;
    isFetching = dbFetching;
    totalPages = databaseData?.meta?.totalPages || 0;
  } else if (dataSource === "crypto") {
    if (searchQuery) {
      currentArticles = cryptoSearchData || [];
      isLoading = cryptoSearchLoading;
      isFetching = cryptoSearchFetching;
    } else {
      currentArticles = cryptoTrendingData || [];
      isLoading = cryptoTrendingLoading;
      isFetching = cryptoTrendingFetching;
    }
    totalPages = Math.ceil(currentArticles.length / limit) || 1;
  } else {
    // mixed
    currentArticles = mixedData || [];
    isLoading = mixedLoading;
    isFetching = mixedFetching;
    totalPages = Math.ceil(currentArticles.length / limit) || 1;
  }

  const refetch = () => {
    if (dataSource === "crypto") {
      refetchCrypto();
    }
    // For database, the RTK Query will handle refetch automatically
    // For mixed, we can trigger both
  };

  // First-time load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Loading />
      </div>
    );
  }

  // Filter & sort the current articles
  let filteredAndSortedArticles = [...currentArticles];

  // Apply search filter (for database articles only, crypto search is handled by API)
  if (searchQuery && dataSource !== "crypto") {
    filteredAndSortedArticles = filteredAndSortedArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply section filters
  if (selectedSection !== "all") {
    if (selectedSection === "popular") {
      filteredAndSortedArticles = filteredAndSortedArticles.filter(
        (article) => article.likeCount > 5
      );
    }
    if (selectedSection === "featured") {
      filteredAndSortedArticles = filteredAndSortedArticles.filter(
        (article) => article.comments && article.comments.length > 3
      );
    }
  }

  // Apply sorting
  switch (sortBy) {
    case "popular":
      filteredAndSortedArticles.sort((a, b) => b.likeCount - a.likeCount);
      break;
    case "oldest":
      filteredAndSortedArticles.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "latest":
    default:
      filteredAndSortedArticles.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  const sections = [
    {
      id: "all",
      label: "All Articles",
      icon: Grid,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "latest",
      label: "Latest",
      icon: Clock,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "popular",
      label: "Popular",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "featured",
      label: "Featured",
      icon: Star,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const adClasses = [
    "67b00b6de904d5920e690b84",
    "67b3b8a41b3a7f15c72fcc94",
    "67b3b9181b3a7f15c72fce5d",
    "67b3b9469a62fcbf1eeb65df",
    "67b3c7949a62fcbf1eeb83a6",
    "67b3c7d89a62fcbf1eeb842e",
  ];
  let adIndex = 0;

  // Handle page changes without full reload
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
      {/* Overlay spinner on refetch */}
      {isFetching && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-600/50 rounded-2xl p-8">
            <div className="flex items-center space-x-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Updating Articles
                </h3>
                <p className="text-gray-400 text-sm">Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 xl:px-20">
        {/* Hero Section */}
        {simpleHeader ? (
          <div className="text-center py-8">
            <h2 className="text-3xl md:text-7xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-6">
              Trobits Articles
            </h2>
          </div>
        ) : (
          <div className="relative overflow-hidden pt-16 pb-8 ">
            <div className="relative">
              <div className="max-w-4xl mx-auto text-center mt-20">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-semibold tracking-wider uppercase">
                    Live Feed
                  </span>
                  <span className="text-gray-400 text-sm">
                    {filteredAndSortedArticles.length} articles
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-6">
                  Crypto Articles
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Deep insights into crypto markets, blockchain technology, and
                  the future of digital finance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Search & Filter Section */}
        {!simpleHeader && (
          <div className="mb-12">
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-600/30 rounded-3xl p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                  />
                </div>

                {/* Data Source Selector */}
                <div className="flex bg-gray-700/50 border border-gray-600/30 rounded-2xl p-1">
                  <button
                    onClick={() => setDataSource("mixed")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      dataSource === "mixed"
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                    }`}
                  >
                    Mixed
                  </button>
                  <button
                    onClick={() => setDataSource("crypto")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      dataSource === "crypto"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                    }`}
                  >
                    Crypto News
                  </button>
                  <button
                    onClick={() => setDataSource("database")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      dataSource === "database"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                    }`}
                  >
                    Articles
                  </button>
                </div>

                {/* Filter Sections */}
                <div className="flex flex-wrap gap-3">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                        className={`group relative flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                          selectedSection === section.id
                            ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-cyan-500/25`
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {section.label}
                        {selectedSection === section.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* View Mode & Refresh */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => refetch()}
                    className="p-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30 rounded-2xl text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                    title="Refresh articles"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <div className="flex bg-gray-700/50 border border-gray-600/30 rounded-2xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        viewMode === "list"
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid/List */}
        {/* Articles Display */}
        <div className="mb-16">
          {filteredAndSortedArticles.length > 0 ? (
            simpleHeader ? (
              <div className="relative overflow-hidden bg-gray-800/30 border border-gray-600/30 rounded-3xl p-6 mb-12">
                {/* Left Button */}
                <button
                  onMouseEnter={() => {
                    setPauseScroll(true);
                    setIsHoveringLeft(true);
                    hoverLeftRef.current = true;
                  }}
                  onMouseLeave={() => {
                    setPauseScroll(false);
                    setIsHoveringLeft(false);
                    hoverLeftRef.current = false;
                  }}
                  className="group absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                  {/* Icon */}
                  <ChevronLeft className="relative z-10 w-8 h-8 text-white transition-colors duration-300" />
                </button>

                {/* Right Button */}
                <button
                  onMouseEnter={() => {
                    setPauseScroll(true);
                    setIsHoveringRight(true);
                    hoverRightRef.current = true;
                  }}
                  onMouseLeave={() => {
                    setPauseScroll(false);
                    setIsHoveringRight(false);
                    hoverRightRef.current = false;
                  }}
                  className="group absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                  {/* Icon */}
                  <ChevronRight className="relative z-10 w-8 h-8 text-white transition-colors duration-300" />
                </button>

                {/* Scrollable article strip */}
                <div
                  ref={scrollRef}
                  onMouseEnter={() => setPauseScroll(true)}
                  onMouseLeave={() => setPauseScroll(false)}
                  className="overflow-x-auto no-scrollbar scroll-smooth"
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    gap: "1.5rem",
                    paddingBottom: "1rem",
                    paddingLeft: "0.5rem",
                  }}
                >
                  {[...Array(45)].map((_, i) => {
                    const article =
                      filteredAndSortedArticles[
                        i % filteredAndSortedArticles.length
                      ];
                    return (
                      <div
                        key={`${article.id}-${i}`}
                        className="inline-block w-[calc(100%/4-1.5rem)] min-w-[250px] max-w-[350px] flex-shrink-0"
                      >
                        <NewsCard articleData={article} viewMode="grid" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "space-y-6"
                }`}
              >
                {filteredAndSortedArticles.map((article, index) => (
                  <React.Fragment key={article.id}>
                    <div
                      className={`group transform transition-all duration-500 hover:scale-[1.02] ${
                        viewMode === "list" ? "w-full" : ""
                      }`}
                    >
                      <NewsCard articleData={article} viewMode={viewMode} />
                    </div>
                    {(index + 1) % 8 === 0 && adIndex < adClasses.length && (
                      <div
                        className={viewMode === "grid" ? "col-span-full" : ""}
                      >
                        <AdBanner adClass={adClasses[adIndex++]} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-24">
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-600/30 rounded-3xl p-12 max-w-lg mx-auto">
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
                    <Search className="w-12 h-12 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      No articles found
                    </h3>
                    <p className="text-gray-400">
                      Try adjusting your search or filters to find what you're
                      looking for
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {!simpleHeader && totalPages > 1 && (
          <div className="pb-16">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-600/30 rounded-3xl p-8">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                  }`}
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(
                      1,
                      Math.min(currentPage - 2 + i, totalPages)
                    );
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-12 h-12 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                  }`}
                >
                  Next
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>

              <div className="text-center mt-6">
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              {currentPage !== 1 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-6 py-3 rounded-2xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white transition-all duration-300 text-sm font-medium"
                  >
                    Back to First Page
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubPage;
