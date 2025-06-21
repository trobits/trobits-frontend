"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import NewsCard from "@/components/NewsPart/NewsCard";
import {
  Search,
  TrendingUp,
  Clock,
  Star,
  Loader2,
  Globe,
  Zap,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Newspaper,
} from "lucide-react";
import {
  useTrendingNews,
  useAllTickersNews,
  useSearchNews,
  CryptoArticle,
} from "@/hooks/useCryptoNews";
import { usePathname } from "next/navigation";
import Loading from "@/components/Shared/Loading";
import { BackgroundGradient } from "@/components/ui/backgroundGradient"; // Ensure this is imported


const InfiniteLoader: React.FC<{
  isLoading: boolean;
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}> = ({ isLoading, hasNextPage, currentPage, totalPages }) => {
  return (
      <div className="py-8">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="text-gray-400 text-sm">Loading more articles...</span>
              </div>
              <div className="text-xs text-gray-500">
                Loading page {currentPage + 1} of {totalPages}
              </div>
            </div>
        ) : (
            // Debug indicator - shows even when not loading
            <div className="text-center py-4">
              <div className="text-xs text-gray-600 bg-gray-800/50 rounded-lg px-4 py-2 inline-block">
                📍 Infinite Scroll Trigger • HasMore: {hasNextPage ? '✅' : '❌'} • Page: {currentPage}/{totalPages}
              </div>
            </div>
        )}
      </div>
  );
};

// Ad Banner Component
const AdBanner: React.FC<{ adClass: string }> = ({ adClass }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  const injectAdScript = useCallback(() => {
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
  }, [adClass]);

  useEffect(() => {
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
  }, [injectAdScript]);

  return (
      <div ref={adContainerRef} className="w-full flex justify-center my-12">
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8 text-center max-w-md">
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

interface SubPageProps {
  simpleHeader?: boolean;
}

interface FilterSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const SubPage: React.FC<SubPageProps> = ({ simpleHeader = false }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [dataSource, setDataSource] = useState<"crypto" | "trending">("trending");

  // Scroll refs for simple header mode
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pauseScroll, setPauseScroll] = useState<boolean>(false);
  const hoverLeftRef = useRef<boolean>(false);
  const hoverRightRef = useRef<boolean>(false);

  // Infinite scroll ref
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const pathName = usePathname();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto scroll logic for simple header
  useEffect(() => {
    if (!simpleHeader) return;

    const interval = setInterval(() => {
      if (!pauseScroll && scrollRef.current) {
        scrollRef.current.scrollBy({ left: 420, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pauseScroll, simpleHeader]);

  useEffect(() => {
    if (!simpleHeader) return;

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
  }, [simpleHeader]);

  // Determine which hook to use based on search and data source
  const searchKeywords = debouncedSearchQuery
      ? debouncedSearchQuery
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k)
      : [];

  const shouldUseSearch = searchKeywords.length > 0;
  const shouldUseTrending = dataSource === "trending" && !shouldUseSearch;

  // Debug: Log which hook should be used
  useEffect(() => {
    console.log('🔄 Hook selection:', {
      shouldUseSearch,
      shouldUseTrending,
      searchKeywords,
      dataSource
    });
  }, [shouldUseSearch, shouldUseTrending, searchKeywords, dataSource]);

  // Crypto news queries
  const {
    data: trendingData,
    isLoading: trendingLoading,
    isFetching: trendingFetching,
    error: trendingError,
    hasNextPage: trendingHasNext,
    fetchNextPage: trendingFetchNext,
    refetch: trendingRefetch,
    totalItems: trendingTotalItems,
    currentPage: trendingCurrentPage,
    totalPages: trendingTotalPages,
  } = useTrendingNews({
    enabled: shouldUseTrending,
    initialLimit: 25,
  });

  const {
    data: allTickersData,
    isLoading: allTickersLoading,
    isFetching: allTickersFetching,
    error: allTickersError,
    hasNextPage: allTickersHasNext,
    fetchNextPage: allTickersFetchNext,
    refetch: allTickersRefetch,
    totalItems: allTickersTotalItems,
    currentPage: allTickersCurrentPage,
    totalPages: allTickersTotalPages,
  } = useAllTickersNews({
    enabled: dataSource === "crypto" && !shouldUseSearch,
    initialLimit: 25,
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
    error: searchError,
    hasNextPage: searchHasNext,
    fetchNextPage: searchFetchNext,
    refetch: searchRefetch,
    totalItems: searchTotalItems,
    currentPage: searchCurrentPage,
    totalPages: searchTotalPages,
  } = useSearchNews(searchKeywords, {
    enabled: shouldUseSearch,
    initialLimit: 25,
  });

  // Determine current data and loading states
  let currentArticles: CryptoArticle[] = [];
  let isLoading = false;
  let isFetching = false;
  let error: string | null = null;
  let hasNextPage = false;
  let fetchNextPage: () => Promise<void> = async () => {};
  let refetch: () => Promise<void> = async () => {};
  let totalItems = 0;
  let currentPage = 1;
  let totalPages = 0;

  if (shouldUseSearch) {
    currentArticles = searchData;
    isLoading = searchLoading;
    isFetching = searchFetching;
    error = searchError;
    hasNextPage = searchHasNext;
    fetchNextPage = searchFetchNext;
    refetch = searchRefetch;
    totalItems = searchTotalItems;
    currentPage = searchCurrentPage;
    totalPages = searchTotalPages;
  } else if (shouldUseTrending) {
    currentArticles = trendingData;
    isLoading = trendingLoading;
    isFetching = trendingFetching;
    error = trendingError;
    hasNextPage = trendingHasNext;
    fetchNextPage = trendingFetchNext;
    refetch = trendingRefetch;
    totalItems = trendingTotalItems;
    currentPage = trendingCurrentPage;
    totalPages = trendingTotalPages;
  } else {
    currentArticles = allTickersData;
    isLoading = allTickersLoading;
    isFetching = allTickersFetching;
    error = allTickersError;
    hasNextPage = allTickersHasNext;
    fetchNextPage = allTickersFetchNext;
    refetch = allTickersRefetch;
    totalItems = allTickersTotalItems;
    currentPage = allTickersCurrentPage;
    totalPages = allTickersTotalPages;
  }

  // Debug logging
  useEffect(() => {
    console.log('📊 Current state:', {
      articlesCount: currentArticles.length,
      hasNextPage,
      isFetching,
      isLoading,
      currentPage,
      totalPages,
      totalItems,
      activeHook: shouldUseSearch ? 'search' : shouldUseTrending ? 'trending' : 'allTickers'
    });
  }, [currentArticles.length, hasNextPage, isFetching, isLoading, currentPage, totalPages, totalItems, shouldUseSearch, shouldUseTrending]);

  // Filter articles based on selected section
  let filteredArticles = [...currentArticles];

  if (selectedSection !== "all") {
    if (selectedSection === "popular") {
      filteredArticles = filteredArticles.filter(
          (article) => (article.tickers?.length || 0) > 0
      );
    }
    if (selectedSection === "latest") {
      filteredArticles = filteredArticles.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    if (selectedSection === "trending") {
      // Show articles with major tickers
      const majorTickers = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE'];
      filteredArticles = filteredArticles.filter(
          (article) => article.tickers?.some(ticker =>
              majorTickers.includes(ticker.toUpperCase())
          )
      );
    }
  }

  // Enhanced infinite scroll setup with debugging
  useEffect(() => {
    if (!loadMoreRef.current || simpleHeader) {
      console.log('⚠️ Infinite scroll not setup:', { hasRef: !!loadMoreRef.current, simpleHeader });
      return;
    }

    console.log('🔍 Setting up intersection observer...');

    const observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          console.log('👁️ Intersection observed:', {
            isIntersecting: first.isIntersecting,
            intersectionRatio: first.intersectionRatio,
            hasNextPage,
            isFetching,
            isLoading
          });

          if (first.isIntersecting && hasNextPage && !isFetching && !isLoading) {
            console.log('🚀 TRIGGERING fetchNextPage!');
            fetchNextPage();
          } else {
            console.log('⏸️ Not triggering fetchNextPage:', {
              intersecting: first.isIntersecting,
              hasNext: hasNextPage,
              fetching: isFetching,
              loading: isLoading
            });
          }
        },
        {
          threshold: 0.1,
          rootMargin: '100px' // Start loading 100px before the element is visible
        }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
      console.log('✅ Observer attached to loadMoreRef');
    }

    return () => {
      observer.disconnect();
      console.log('🧹 Observer disconnected');
    };
  }, [hasNextPage, isFetching, isLoading, fetchNextPage, simpleHeader]);

  // First-time load
  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <Loading />
        </div>
    );
  }

  const sections: FilterSection[] = [
    {
      id: "all",
      label: "All News",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "latest",
      label: "Latest",
      icon: Clock,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "trending",
      label: "Major Coins",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "popular",
      label: "With Tickers",
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

  return (
      <div className={`min-h-screen ${simpleHeader ? '' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'} relative`}>

        {/* Overlay spinner on refetch */}
        {isFetching && !isLoading && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40 pointer-events-none">
              <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-600/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {searchQuery ? 'Searching...' : 'Loading more articles...'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
        )}

        <div className="px-4 sm:px-6 lg:px-8 xl:px-20">
          {/* Hero Section */}
          {simpleHeader ? (
              <section className="container mx-auto mt-28 px-0">
  <div className="flex justify-center items-center">
    <div className="w-full max-w-6xl mx-auto px-6">
      <BackgroundGradient className="rounded-3xl bg-gradient-to-br from-slate-950/80 to-gray-900/80 border border-gray-800/60 hover:shadow-[0_0_40px_#38bdf8]/40 transition-all duration-300">
        <div className="bg-gray-900/50 border border-gray-800/40 rounded-3xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Latest Crypto News
            </h2>
            

            {/* Status indicator */}
            
          </div>

          {/* News Feed Container */}
          <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6">
            <div className="relative overflow-hidden">
              {/* Left Button */}
              <button
                onMouseEnter={() => {
                  setPauseScroll(true);
                  hoverLeftRef.current = true;
                }}
                onMouseLeave={() => {
                  setPauseScroll(false);
                  hoverLeftRef.current = false;
                }}
                className="group absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/80 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              {/* Right Button */}
              <button
                onMouseEnter={() => {
                  setPauseScroll(true);
                  hoverRightRef.current = true;
                }}
                onMouseLeave={() => {
                  setPauseScroll(false);
                  hoverRightRef.current = false;
                }}
                className="group absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/80 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Scrollable article strip */}
              <div
                ref={scrollRef}
                onMouseEnter={() => setPauseScroll(true)}
                onMouseLeave={() => setPauseScroll(false)}
                className="overflow-x-auto no-scrollbar scroll-smooth"
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  paddingBottom: "1rem",
                  paddingLeft: "3rem",
                  paddingRight: "3rem",
                  paddingTop: "0.5rem",
                }}
              >
                {filteredArticles.slice(0, 20).map((article, i) => (
                  <div
                    key={`${article.id}-${i}`}
                    className="flex-shrink-0 w-80"
                  >
                    <NewsCard articleData={article} viewMode="grid" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </BackgroundGradient>
    </div>
  </div>
</section>
          ) : (
              <div className="relative overflow-hidden pt-16 pb-8">
                <div className="relative">
                  <div className="max-w-4xl mx-auto text-center mt-20">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-semibold tracking-wider uppercase">
                    Live Feed
                  </span>
                      <span className="text-gray-400 text-sm">
                    {totalItems} articles
                  </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-6">
                      Crypto News Hub
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                      Real-time cryptocurrency news, market insights, and blockchain technology updates from trusted sources worldwide.
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
                          placeholder="Search crypto news, tickers (BTC, ETH, SHIB)..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                      />
                      {searchQuery && (
                          <button
                              onClick={() => setSearchQuery("")}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            ✕
                          </button>
                      )}
                    </div>

                    {/* Data Source Selector */}
                    <div className="flex bg-gray-700/50 border border-gray-600/30 rounded-2xl p-1">
                      <button
                          onClick={() => setDataSource("trending")}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                              dataSource === "trending"
                                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                                  : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                          }`}
                      >
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Trending
                      </button>
                      <button
                          onClick={() => setDataSource("crypto")}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                              dataSource === "crypto"
                                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                                  : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                          }`}
                      >
                        <Globe className="w-4 h-4 inline mr-2" />
                        All Crypto
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
                                className={`group relative flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
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

                    {/* Refresh Button */}
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30 rounded-2xl text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh articles"
                    >
                      <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Error Display */}
          {error && (
              <div className="mb-8">
                <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-6 text-center">
                  <h3 className="text-red-400 font-semibold mb-2">Error Loading News</h3>
                  <p className="text-gray-300 mb-4">{error}</p>
                  <button
                      onClick={() => refetch()}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
          )}

          {/* Articles Display */}
          <div className="mb-16">
            {filteredArticles.length > 0 ? (
                simpleHeader ? (
                    // Simple header articles are already rendered above in the container
                    null
                ) : (
                    <div className="space-y-6">
                      {filteredArticles.map((article, index) => (
                          <React.Fragment key={article.id}>
                            <div className="transform transition-all duration-300 hover:scale-[1.01]">
                              <NewsCard articleData={article} viewMode="list" />
                            </div>
                            {/* Insert ads every 8 articles */}
                            {(index + 1) % 8 === 0 && (
                                <AdBanner
                                    adClass={adClasses[(Math.floor(index / 8)) % adClasses.length]}
                                />
                            )}
                          </React.Fragment>
                      ))}

                      {/* Infinite scroll trigger - ALWAYS RENDER when not in simple header mode */}
                      <div ref={loadMoreRef} className="h-20">
                        <InfiniteLoader
                            isLoading={isFetching}
                            hasNextPage={hasNextPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                      </div>

                      {/* End of results message */}
                      {!hasNextPage && filteredArticles.length > 0 && (
                          <div className="text-center py-12">
                            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-8 max-w-md mx-auto">
                              <h3 className="text-lg font-semibold text-white mb-2">
                                You've reached the end!
                              </h3>
                              <p className="text-gray-400 text-sm mb-4">
                                {searchQuery
                                    ? `Found ${totalItems} articles for "${searchQuery}"`
                                    : `Showing all ${totalItems} latest articles`
                                }
                              </p>
                              <button
                                  onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:scale-105 transition-transform"
                              >
                                Back to Top
                              </button>
                            </div>
                          </div>
                      )}
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
                          {searchQuery ? 'No matching articles found' : 'No articles available'}
                        </h3>
                        <p className="text-gray-400">
                          {searchQuery
                              ? `Try different keywords or search terms`
                              : 'Please check back later for new crypto news'
                          }
                        </p>
                      </div>
                      {searchQuery && (
                          <button
                              onClick={() => setSearchQuery('')}
                              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium hover:scale-105 transition-transform"
                          >
                            Clear Search
                          </button>
                      )}
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default SubPage;