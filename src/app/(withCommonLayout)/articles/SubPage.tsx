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
} from "lucide-react";
import globalGlobe from "../../../assets/pngGlobe.png";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "@/components/Shared/Loading";
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
}

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
    <div ref={adContainerRef} className="w-full flex justify-center my-8">
      <ins
        className={adClass}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
      ></ins>
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // RTK Query hook
  const {
    data: allBlogsData,
    isLoading,
    isFetching,
  } = useGetAllBlogsQuery({
    page: currentPage,
    limit,
  });

  // First-time load
  if (isLoading) {
    return <Loading />;
  }

  const allBlogs: Article[] = allBlogsData?.data || [];
  const totalPages = allBlogsData?.meta?.totalPages || 0;

  // Filter & sort
  let filteredAndSortedArticles = [...allBlogs];
  if (searchQuery) {
    filteredAndSortedArticles = filteredAndSortedArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (selectedSection !== "all") {
    if (selectedSection === "popular") {
      filteredAndSortedArticles = filteredAndSortedArticles.filter(
        (article) => article.likeCount > 5
      );
    }
    if (selectedSection === "featured") {
      filteredAndSortedArticles = filteredAndSortedArticles.filter(
        (article) => article.comments.length > 3
      );
    }
  }
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
    { id: "all", label: "All Articles", icon: Grid },
    { id: "latest", label: "Latest", icon: Clock },
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
    <div className="min-h-screen bg-black text-white px-20 relative">
      {/* Overlay spinner on refetch */}
      {isFetching && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}

      {/* Hero Section */}
      {simpleHeader ? (
        <div className="text-center pt-16 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trobits Articles
          </h2>
          {/* Decorative line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent w-64" />
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden pt-16">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-500 text-sm font-medium uppercase tracking-wider">
                  LIVE FEED
                </span>
                <span className="text-gray-400 text-sm">
                  {filteredAndSortedArticles.length} articles
                </span>
              </div>
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold text-white">
                  Articles
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl">
                  Deep insights into crypto markets, blockchain technology, and
                  the future of digital finance.
                </p>
              </div>
              
              {/* Decorative line */}
              <div className="flex items-center mt-8">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent w-64" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-row justify-between items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:min-w-[20vw] pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700/80 focus:border-gray-700/80 transition-all duration-200"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    selectedSection === section.id
                      ? "bg-white text-black shadow-lg"
                      : "bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-gray-900/80 hover:border-gray-700/80 hover:text-white"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid/List */}
      <div className="container mx-auto px-6 pb-16">
        {filteredAndSortedArticles.length > 0 ? (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                : "space-y-4"
            }`}
          >
            {filteredAndSortedArticles.map((article, index) => (
              <React.Fragment key={article.id}>
                <div
                  className={`group transform transition-all duration-300 ${
                    viewMode === "list" ? "w-full" : ""
                  }`}
                >
                  <NewsCard articleData={article} viewMode={viewMode} />
                </div>
                {(index + 1) % 8 === 0 && adIndex < adClasses.length && (
                  <div className={viewMode === "grid" ? "col-span-full" : ""}>
                    <AdBanner adClass={adClasses[adIndex++]} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-400">
                No articles found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="container mx-auto px-6 pb-16">
          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-6">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-100 hover:scale-105 shadow-lg"
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {(() => {
                  const maxVisiblePages = 5;
                  let startPage, endPage;
                  
                  if (totalPages <= maxVisiblePages) {
                    startPage = 1;
                    endPage = totalPages;
                  } else {
                    const halfVisible = Math.floor(maxVisiblePages / 2);
                    
                    if (currentPage <= halfVisible) {
                      startPage = 1;
                      endPage = maxVisiblePages;
                    } else if (currentPage + halfVisible >= totalPages) {
                      startPage = totalPages - maxVisiblePages + 1;
                      endPage = totalPages;
                    } else {
                      startPage = currentPage - halfVisible;
                      endPage = currentPage + halfVisible;
                    }
                  }
                  
                  const pageNumbers = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(i);
                  }
                  
                  return pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-2xl font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-white text-black shadow-lg"
                          : "bg-gray-900/50 border border-gray-800/50 text-gray-300 hover:bg-gray-900/80 hover:border-gray-700/80 hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ));
                })()}
              </div>
              
              <button
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-100 hover:scale-105 shadow-lg"
                }`}
              >
                Next
              </button>
            </div>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubPage;