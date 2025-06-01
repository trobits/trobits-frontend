/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "../Shared/Loading";
import { Article } from "@/app/(withCommonLayout)/articles/SubPage";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { setPaths } from "@/redux/features/slices/authSlice";
import NewsCard from "./NewsCard";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

const adClasses = [
    "67b00b6de904d5920e690b84",
    "67b3b8a41b3a7f15c72fcc94",
    "67b3b9181b3a7f15c72fce5d",
    "67b3b9469a62fcbf1eeb65df",
    "67b3c7949a62fcbf1eeb83a6",
    "67b3c7d89a62fcbf1eeb842e",
];

const AdBanner = ({ adClass }: { adClass: string }) => {
    const adContainerRef = useRef<HTMLDivElement>(null);

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

export default function RecommendedArticles() {
    const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery({
        page: localStorage.getItem('currentPage') || 1,
        limit: 8,
    });

    const previousPath = useAppSelector((state) => state.auth.previousPath);
    const currentPath = useAppSelector((state) => state.auth.currentPath);
    const dispatch = useAppDispatch();
    const pathName = usePathname();
    
    useEffect(() => {
        if (!((previousPath?.split("/").includes("articles")) && (previousPath?.split("/").length === 3)) && ((currentPath?.split("/").includes("articles")) && (currentPath?.split("/").length === 3)) || previousPath !== currentPath) {
            dispatch(setPaths(pathName));
            window.location.reload();
        }
    }, [currentPath, dispatch, pathName, previousPath]);

    // Handle loading state
    if (allBlogsDataLoading) {
        return <Loading />;
    }

    const allBlogs: Article[] = allBlogsData?.data || [];

    return (
        <section className="relative py-16 bg-black">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }} />
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-white" />
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Curated Content
                        </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Recommended Articles
                    </h2>
                    
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Discover the latest insights and trends in cryptocurrency and blockchain technology
                    </p>
                    
                    {/* Decorative line */}
                    <div className="flex items-center justify-center mt-8">
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent w-64" />
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="mb-16">
                    {allBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                            {allBlogs.map((article, index) => (
                                <React.Fragment key={article.id}>
                                    <div className="transform transition-all duration-500 hover:scale-[1.02]">
                                        <NewsCard articleData={article} viewMode="grid" />
                                    </div>
                                    
                                    {/* Show an ad after every 4 articles */}
                                    {(index + 1) % 4 === 0 && index < adClasses.length && (
                                        <div className="col-span-full">
                                            <AdBanner key={adClasses[Math.floor(index / 4)]} adClass={adClasses[Math.floor(index / 4)]} />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="space-y-4">
                                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto" />
                                <h3 className="text-2xl font-semibold text-gray-400">No articles available</h3>
                                <p className="text-gray-500">Check back later for new content</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
                        <div className="space-y-6">
                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl" />
                                    <div className="relative w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-white">
                                    Explore More Content
                                </h3>
                                <p className="text-gray-400">
                                    Dive deeper into our extensive collection of cryptocurrency articles and insights
                                </p>
                            </div>
                            
                            <Link href="/articles">
                                <Button className="
                                    group bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg
                                    hover:bg-gray-100 transition-all duration-300 hover:scale-105
                                    flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl
                                ">
                                    <span>View All Articles</span>
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            
                            {/* Stats */}
                            <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-gray-800/50">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{allBlogs.length}+</div>
                                    <div className="text-sm text-gray-400">Articles</div>
                                </div>
                                <div className="w-px h-8 bg-gray-800" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">Daily</div>
                                    <div className="text-sm text-gray-400">Updates</div>
                                </div>
                                <div className="w-px h-8 bg-gray-800" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">Expert</div>
                                    <div className="text-sm text-gray-400">Insights</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}