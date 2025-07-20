/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import NewsCard from "./NewsCard";
import { ArrowRight, Sparkles, TrendingUp, Globe } from "lucide-react";

interface CryptoArticle {
    id: string;
    title: string;
    text?: string;
    content?: string;
    source_name?: string;
    sourceName?: string;
    date: string;
    createdAt?: string;
    tickers?: string[];
    news_url?: string;
    sourceUrl?: string;
    image_url?: string;
    image?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    kind?: string;
    type?: 'crypto_news';
}

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
            />
        </div>
    );
};

export default function RecommendedArticles() {
    const [articles, setArticles] = useState<CryptoArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pathName = usePathname();

    // Fetch recommended crypto news articles
    useEffect(() => {
        const fetchRecommendedArticles = async () => {
            try {
                setLoading(true);
                console.log('Fetching recommended crypto news articles...');

                // Fetch from our all-tickers API
                const response = await fetch('/api/crypto-news/all-tickers?page=1&items_per_page=8');
                const data = await response.json();

                if (data.success && data.articles) {
                    // Transform articles to match our interface
                    const transformedArticles: CryptoArticle[] = data.articles.map((article: any) => ({
                        id: article.news_url || `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        title: article.title || 'Untitled Article',
                        text: article.text || '',
                        content: article.text || '',
                        source_name: article.source_name || 'Crypto News',
                        date: article.date || new Date().toISOString(),
                        createdAt: article.date || new Date().toISOString(),
                        tickers: Array.isArray(article.tickers) ? article.tickers : [],
                        news_url: article.news_url,
                        image_url: article.image_url || article.image,
                        image: article.image_url || article.image,
                        sentiment: article.sentiment || 'neutral',
                        type: 'crypto_news' as const
                    }));

                    setArticles(transformedArticles);
                    setError(null);
                } else {
                    setError('Failed to load articles');
                }
            } catch (err) {
                console.error('Error fetching recommended articles:', err);
                setError('Failed to load articles');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedArticles();
    }, []);

    // Handle loading state
    if (loading) {
        return (
            <section className="relative py-16 bg-black">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading recommended articles...</p>
                    </div>
                </div>
            </section>
        );
    }

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
                            Latest Crypto News
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        More Articles to Explore
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Stay updated with the latest cryptocurrency news, market analysis, and blockchain developments
                    </p>

                    {/* Decorative line */}
                    <div className="flex items-center justify-center mt-8">
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent w-64" />
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="mb-16">
                    {error ? (
                        <div className="text-center py-16">
                            <div className="space-y-4">
                                <Globe className="w-16 h-16 text-gray-600 mx-auto" />
                                <h3 className="text-2xl font-semibold text-gray-400">Unable to load articles</h3>
                                <p className="text-gray-500">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                            {articles.map((article, index) => (
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
                                <p className="text-gray-500">Check back later for new crypto news</p>
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
                                    Stay Updated with Crypto News
                                </h3>
                                <p className="text-gray-400">
                                    Access our complete collection of cryptocurrency news, market analysis, and blockchain insights
                                </p>
                            </div>

                            <Link href="/articles">
                                <Button className="
                                    group bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg
                                    hover:bg-gray-100 transition-all duration-300 hover:scale-105
                                    flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl
                                ">
                                    <span>Explore All News</span>
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </Button>
                            </Link>

                            {/* Stats */}
                            <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-gray-800/50">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{articles.length}+</div>
                                    <div className="text-sm text-gray-400">Articles</div>
                                </div>
                                <div className="w-px h-8 bg-gray-800" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">Live</div>
                                    <div className="text-sm text-gray-400">Updates</div>
                                </div>
                                <div className="w-px h-8 bg-gray-800" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">Real-time</div>
                                    <div className="text-sm text-gray-400">Data</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}