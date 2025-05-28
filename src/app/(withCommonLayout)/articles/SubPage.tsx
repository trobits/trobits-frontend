"use client";
import NewsCard from "@/components/NewsPart/NewsCard";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { Search, Filter, TrendingUp, Clock, Star, Grid, List, ChevronDown } from "lucide-react";
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

        const existingScript = document.querySelector(`script[data-ad-class="${adClass}"]`);
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

const SubPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSection, setSelectedSection] = useState("all");
    const [sortBy, setSortBy] = useState("latest");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);
    
    const limit = 20;
    const previousPath = useAppSelector((state) => state.auth.previousPath);
    const currentPath = useAppSelector((state) => state.auth.currentPath);
    const dispatch = useAppDispatch();
    const pathName = usePathname();

    React.useEffect(() => {
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage, 10));
        }
    }, []);

    React.useEffect(() => {
        if (typeof window !== "undefined" && previousPath !== "/articles" && currentPath === "/articles") {
            dispatch(setPaths(pathName));
            window.location.reload();
        }
    }, [previousPath, currentPath, dispatch, pathName]);

    const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery({
        page: currentPage,
        limit: limit,
    });

    // Handle loading state
    if (allBlogsDataLoading) {
        return <Loading />;
    }

    const allBlogs: Article[] = allBlogsData?.data || [];
    const totalPages = allBlogsData?.meta?.totalPages || 0;

    // Filter and sort articles
    let filteredAndSortedArticles = [...allBlogs]; // Create a copy first

    // Search filter
    if (searchQuery) {
        filteredAndSortedArticles = filteredAndSortedArticles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Section filter
    if (selectedSection !== "all") {
        switch (selectedSection) {
            case "popular":
                filteredAndSortedArticles = filteredAndSortedArticles.filter(article => article.likeCount > 5);
                break;
            case "featured":
                filteredAndSortedArticles = filteredAndSortedArticles.filter(article => article.comments.length > 3);
                break;
            default:
                break;
        }
    }

    // Sort articles
    switch (sortBy) {
        case "popular":
            filteredAndSortedArticles = filteredAndSortedArticles.sort((a, b) => b.likeCount - a.likeCount);
            break;
        case "oldest":
            filteredAndSortedArticles = filteredAndSortedArticles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
        case "latest":
        default:
            filteredAndSortedArticles = filteredAndSortedArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
    }

    const sections = [
        { id: "all", label: "All Articles", icon: Grid },
        { id: "latest", label: "Latest", icon: Clock }
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

    const handlePageChange = (newPage: number) => {
        localStorage.setItem('currentPage', newPage.toString());
        setCurrentPage(newPage);
        window.location.reload();
    };

    return (
        <div className="min-h-screen px-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden mt-16">
                <div className="container mx-auto px-6 py-16">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-500 text-sm font-medium">LIVE FEED</span>
                            <span className="text-gray-400 text-sm">{filteredAndSortedArticles.length} articles</span>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-7xl font-bold text-white">
                                Articles
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl">
                                Deep insights into crypto markets, blockchain technology, and the future of digital finance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-row justify-between items-center">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:min-w-[20vw] pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            {sections.map((section) => {
                                const IconComponent = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setSelectedSection(section.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                            transition-all duration-200 hover:scale-105
                                            ${selectedSection === section.id
                                                ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg"
                                                : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                                            }
                                        `}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-4">
                            {/* View Mode Toggle */}
                            <div className="flex bg-white/5 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`
                                        p-2 rounded-lg transition-all duration-200
                                        ${viewMode === "grid" 
                                            ? "bg-cyan-600 text-white" 
                                            : "text-gray-400 hover:text-white"
                                        }
                                    `}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`
                                        p-2 rounded-lg transition-all duration-200
                                        ${viewMode === "list" 
                                            ? "bg-cyan-600 text-white" 
                                            : "text-gray-400 hover:text-white"
                                        }
                                    `}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="container mx-auto px-6 pb-16">
                {filteredAndSortedArticles.length > 0 ? (
                    <div className={`
                        ${viewMode === "grid" 
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10" 
                            : "space-y-4"
                        }
                    `}>
                        {filteredAndSortedArticles.map((article, index) => (
                            <React.Fragment key={article.id}>
                                <div className={`
                                    group transform transition-all duration-300
                                    ${viewMode === "list" ? "w-full" : ""}
                                `}>
                                    <NewsCard articleData={article} viewMode={viewMode}/>
                                </div>
                                
                                {/* Insert ads every 8 articles */}
                                {(index + 1) % 8 === 0 && adIndex < adClasses.length && (
                                    <div className={viewMode === "grid" ? "col-span-full" : ""}>
                                        <AdBanner key={adClasses[adIndex]} adClass={adClasses[adIndex++]} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="space-y-4">
                            <div className="text-6xl">🔍</div>
                            <h3 className="text-2xl font-semibold text-gray-300">No articles found</h3>
                            <p className="text-gray-400">Try adjusting your search or filters</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="container mx-auto px-6 pb-16">
                    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            <button
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className={`
                                    px-6 py-3 rounded-xl font-medium transition-all duration-200
                                    ${currentPage === 1 
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                                        : "bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:scale-105 shadow-lg"
                                    }
                                `}
                            >
                                Previous
                            </button>
                            
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = Math.max(1, Math.min(currentPage - 2 + i, totalPages));
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`
                                                w-10 h-10 rounded-xl font-medium transition-all duration-200
                                                ${currentPage === page
                                                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg"
                                                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                                                }
                                            `}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`
                                    px-6 py-3 rounded-xl font-medium transition-all duration-200
                                    ${currentPage === totalPages 
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                                        : "bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:scale-105 shadow-lg"
                                    }
                                `}
                            >
                                Next
                            </button>
                        </div>
                        
                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-400">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
                        
                        {currentPage !== 1 && (
                            <div className="text-center mt-4">
                                <button 
                                    onClick={() => handlePageChange(1)}
                                    className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm"
                                >
                                    Back to First Page
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubPage;