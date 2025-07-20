"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import NewsCard from "@/components/NewsPart/NewsCard";
import {
  Search,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe,
} from "lucide-react";
import {
  useTrendingNews,
  useAllTickersNews,
  useSearchNews,
  CryptoArticle,
} from "@/hooks/useCryptoNews";
import { usePathname } from "next/navigation";
import Loading from "@/components/Shared/Loading";
import { FanaticsCard, NordVPNCard } from "@/components/AffiliateLinks";

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
            <div className="text-center py-4">
              <div className="text-xs text-gray-600 bg-gray-800/50 rounded-lg px-4 py-2 inline-block">
                📍 Infinite Scroll Trigger • HasMore: {hasNextPage ? '✅' : '❌'} • Page: {currentPage}/{totalPages}
              </div>
            </div>
        )}
      </div>
  );
};

// Vertical Ad Placeholder Component
const VerticalAdPlaceholder: React.FC = () => {
  return (
      <div className="sticky top-4 bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center h-fit">
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">AD</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Advertisement</h3>
            <p className="text-gray-400 text-sm">Sponsored Content</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 h-96 flex items-center justify-center">
            <span className="text-gray-500 text-sm">300 x 600 Ad Space</span>
          </div>
          <div className="text-xs text-gray-600">
            Ad placement area
          </div>
        </div>
      </div>
      
  );
};

interface SubPageProps {
  simpleHeader?: boolean;
}

const SubPage: React.FC<SubPageProps> = ({ simpleHeader = false }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [dataSource, setDataSource] = useState<"crypto" | "trending">("trending");

  // Carousel state and refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(4);

  // Infinite scroll ref
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const pathName = usePathname();

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1280) setCardsPerView(4); // xl
      else if (window.innerWidth >= 1024) setCardsPerView(3); // lg
      else if (window.innerWidth >= 768) setCardsPerView(2); // md
      else setCardsPerView(1); // sm
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Determine which hook to use based on search and data source
  const searchKeywords = debouncedSearchQuery
      ? debouncedSearchQuery
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k)
      : [];

  const shouldUseSearch = searchKeywords.length > 0;
  const shouldUseTrending = dataSource === "trending" && !shouldUseSearch;

  // Crypto news queries - For simple header, only use trending with limit of 10
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
    enabled: simpleHeader || shouldUseTrending,
    initialLimit: simpleHeader ? 10 : 25,
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
    enabled: !simpleHeader && dataSource === "crypto" && !shouldUseSearch,
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
    enabled: !simpleHeader && shouldUseSearch,
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

  if (simpleHeader) {
    // For simple header, always use trending data only
    currentArticles = trendingData.slice(0, 10); // Ensure max 10 articles
    isLoading = trendingLoading;
    isFetching = trendingFetching;
    error = trendingError;
    hasNextPage = false; // No pagination for simple header
    fetchNextPage = async () => {};
    refetch = trendingRefetch;
    totalItems = Math.min(trendingTotalItems, 10);
    currentPage = trendingCurrentPage;
    totalPages = 1; // Only one page for simple header
  } else if (shouldUseSearch) {
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

  // Filter articles (no section filtering needed anymore)
  let filteredArticles = [...currentArticles];

  // Carousel functionality
  const totalSlides = Math.max(0, filteredArticles.length - cardsPerView + 1);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setCurrentSlide(0); // Loop back to start
    }
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      setCurrentSlide(totalSlides - 1); // Loop to end
    }
  }, [currentSlide, totalSlides]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !simpleHeader || filteredArticles.length <= cardsPerView) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, simpleHeader, nextSlide, filteredArticles.length, cardsPerView]);

  // Enhanced infinite scroll setup with debugging
  useEffect(() => {
    if (!loadMoreRef.current || simpleHeader) {
      return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first.isIntersecting && hasNextPage && !isFetching && !isLoading) {
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '100px'
        }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetching, isLoading, fetchNextPage, simpleHeader]);

  // First-time load
  if (isLoading) {
    return (
        <div className="min-h-screen bg-black">
          <Loading />
        </div>
    );
  }

  return (
      <div className={`${simpleHeader ? 'h-[550px] mb-20' : 'min-h-screen bg-black'} relative`}>

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

        <div className="px-0 sm:px-0 lg:px-0 xl:px-0">
          {/* Simple Header - Clean Carousel */}
          {simpleHeader ? (
              <section className="w-full mt-8">
                <div className="relative">
                  {/* Carousel Container */}
                  <div
                      className="relative overflow-hidden h-[550px] rounded-2xl pb-12"
                      onMouseEnter={() => setIsAutoPlaying(false)}
                      onMouseLeave={() => setIsAutoPlaying(true)}
                  >
                    {/* Navigation Buttons */}
                    {filteredArticles.length > cardsPerView && (
                        <>
                          <button
                              onClick={prevSlide}
                              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 group"
                          >
                            <ChevronLeft className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors" />
                          </button>

                          <button
                              onClick={nextSlide}
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 group"
                          >
                            <ChevronRight className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors" />
                          </button>
                        </>
                    )}

                    {/* Articles Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex transition-transform duration-500 ease-out pb-8"
                        style={{
                          transform: `translateX(-${currentSlide * (133 / cardsPerView)}%)`,
                        }}
                    >
                      {filteredArticles.map((article, index) => (
                          <div
                              key={`${article.id}-${index}`}
                              className="flex-shrink-0 px-2 py-3"
                              style={{ width: `${133 / cardsPerView}%` }}
                          >
                            <div className="h-full">
                              <div className="w-full max-w-sm mx-auto h-48">
                                <NewsCard articleData={article} viewMode="grid" />
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>

                    {/* Pagination Dots - Positioned at bottom with proper spacing */}
                    {filteredArticles.length > cardsPerView && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                          {Array.from({ length: totalSlides }, (_, index) => (
                              <button
                                  key={index}
                                  onClick={() => goToSlide(index)}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      index === currentSlide
                                          ? 'bg-cyan-400 w-6'
                                          : 'bg-white/30 hover:bg-white/50'
                                  }`}
                              />
                          ))}
                        </div>
                    )}

                    {/* Loading State for Carousel */}
                    {filteredArticles.length === 0 && (
                        <div className="flex items-center justify-center h-52 bg-gray-900/20 rounded-2xl">
                          <div className="text-center space-y-4">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                            <p className="text-gray-400">Loading trending news...</p>
                          </div>
                        </div>
                    )}
                  </div>

                  {/* Article count indicator - Positioned below carousel */}
                  {filteredArticles.length > 0 && (
                      <div className="text-center mt-2">
                      <span className="text-xs text-gray-500">
                        {filteredArticles.length} trending articles
                      </span>
                      </div>
                  )}
                </div>
              </section>
          ) : (
              // Full Page Header
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

          {/* Enhanced Search & Data Source Section - Only for full page */}
          {!simpleHeader && (
              <div className="mb-12">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                          type="text"
                          placeholder="Search crypto news, tickers (BTC, ETH, SHIB)..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
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
                    <div className="flex bg-gray-800/50 border border-gray-600/30 rounded-2xl p-1">
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

                    {/* Refresh Button */}
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 rounded-2xl text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Main Content Layout - News + Ad - Only for full page */}
          {!simpleHeader && (
              <div className="flex gap-8 mb-16">
                {/* News Section - Scrollable */}
                <div className="flex-1">
                  {filteredArticles.length > 0 ? (
                      <div className="max-h-[800px] overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        {filteredArticles.map((article, index) => (
                            <div key={article.id} className="transform transition-all duration-300 hover:scale-[1.01]">
                              <NewsCard articleData={article} viewMode="list" />
                            </div>
                        ))}

                        {/* Infinite scroll trigger */}
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
                              <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8 max-w-md mx-auto">
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
                  ) : (
                      <div className="text-center py-24">
                        <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-12 max-w-lg mx-auto">
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

                {/* Vertical Ad Section */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-5">
                  <div className="max-h-[350px]">
                    <NordVPNCard />
                  </div>
                  <div className="max-h-[350px]">
                    <FanaticsCard />
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default SubPage;