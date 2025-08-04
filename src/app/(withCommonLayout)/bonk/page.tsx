"use client";

import React, { useEffect, useRef } from "react";
import { TrendingUp, DollarSign, BarChart3, Newspaper } from "lucide-react";
import { NordVPNCard, FanaticsCard, NexoCard, TikTokCard } from "@/components/AffiliateLinks";

const BonkHeader = () => (
    <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
            Bonk Analytics
        </h1>
        <p className="text-gray-400 text-lg mb-6">
            Comprehensive BONK market analysis and insights
        </p>

        {/* BONK Data Button */}
        <div className="flex justify-center">
            <a
                href="/archive/bonk"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
                BONK Burn
            </a>
        </div>
    </div>
);

const PriceGraph = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: "CRYPTO:BONKUSD",
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            allow_symbol_change: true,
            calendar: false,
            support_host: "https://www.tradingview.com",
        });

        if (chartRef.current) {
            chartRef.current.innerHTML = "";
            chartRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="bg-gray-950/80 border border-gray-800/60 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center border border-green-500/20">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Price Chart</h3>
                    <p className="text-sm text-gray-400">Advanced trading view</p>
                </div>
            </div>
            <div
                className="bg-black/50 border border-gray-800/40 rounded-xl overflow-hidden"
                ref={chartRef}
                style={{ height: "500px", width: "100%" }}
            >
                <div
                    className="tradingview-widget-container__widget"
                    style={{ height: "100%", width: "100%" }}
                />
            </div>
        </div>
    );
};

const SymbolInfo = () => {
    const infoRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbol: "CRYPTO:BONKUSD",
            width: "100%",
            locale: "en",
            colorTheme: "dark",
            isTransparent: true,
        });

        if (infoRef.current) {
            infoRef.current.innerHTML = "";
            infoRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="bg-gray-950/80 border border-gray-800/60 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl flex items-center justify-center border border-orange-500/20">
                    <DollarSign className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Market Info</h3>
                    <p className="text-sm text-gray-400">Real-time statistics</p>
                </div>
            </div>
            <div
                className="bg-black/50 border border-gray-800/40 rounded-xl overflow-hidden"
                ref={infoRef}
                style={{ height: "400px" }}
            >
                <div className="tradingview-widget-container__widget" />
            </div>
        </div>
    );
};

const ArticleFeed = () => {
    const [articles, setArticles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/crypto-news/coinDetailNews?coin=BONK&page=1&items=20`);
                if (!res.ok) throw new Error("Failed to fetch BONK news");
                const data = await res.json();
                setArticles(data.articles || []);
            } catch (err: any) {
                setError(err.message || "Error fetching news");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
            <div className="bg-gray-950/80 border border-gray-800/60 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Newspaper className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">News Feed</h3>
                        <p className="text-sm text-gray-400">Latest BONK updates</p>
                    </div>
                </div>
                <div className="bg-black/50 border border-gray-800/40 rounded-xl overflow-y-auto" style={{ height: "500px" }}>
                    {loading && <div className="text-gray-400 p-6">Loading news...</div>}
                    {error && <div className="text-red-400 p-6">{error}</div>}
                    {!loading && !error && articles.length === 0 && (
                        <div className="text-gray-400 p-6">No news found.</div>
                    )}
                    <ul className="divide-y divide-gray-800">
                        {articles.map((article, idx) => (
                            <li key={idx} className="flex gap-4 p-4 hover:bg-gray-800/40 transition-all">
                                {article.image_url && (
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                                    />
                                )}
                                <div className="flex-1">
                                    <a
                                        href={article.news_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-semibold text-blue-300 hover:underline"
                                    >
                                        {article.title}
                                    </a>
                                    <div className="text-gray-400 text-sm mt-1 mb-2">
                                        {article.source_name} &middot; {new Date(article.date).toLocaleString()}
                                    </div>
                                    <div className="text-gray-300 text-sm line-clamp-3">
                                        {article.text}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
};


const TechnicalAnalysis = () => {
    const analysisRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            interval: "1m",
            width: "100%",
            isTransparent: true,
            height: 400,
            symbol: "CRYPTO:BONKUSD",
            showIntervalTabs: true,
            locale: "en",
            colorTheme: "dark",
        });

        if (analysisRef.current) {
            analysisRef.current.innerHTML = "";
            analysisRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="bg-gray-950/80 border border-gray-800/60 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/30 to-amber-500/30 rounded-xl flex items-center justify-center border border-yellow-500/20">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Technical Analysis</h3>
                    <p className="text-sm text-gray-400">Market indicators</p>
                </div>
            </div>
            <div
                className="bg-black/50 border border-gray-800/40 rounded-xl overflow-hidden"
                ref={analysisRef}
                style={{ height: "400px" }}
            >
                <div className="tradingview-widget-container__widget" />
            </div>
        </div>
    );
};

export default function Page() {
    return (
        <div className="min-h-screen bg-black">
            <section className="container mx-auto mt-32 px-0">
                <div className="flex justify-center items-center">
                    <div className="w-full max-w-7xl mx-auto px-6">
                        <div className="bg-gray-950/60 backdrop-blur-sm border border-gray-800/70 rounded-3xl p-8 shadow-2xl">

                            {/* Header */}
                            <BonkHeader />

                            {/* Main Grid Layout */}
                            <div className="space-y-8">

                                {/* Top Row - Symbol Info & Technical Analysis */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <SymbolInfo />
                                    <TechnicalAnalysis />
                                </div>

                                {/* Horizontal Ad Section */}
                                <div className="flex flex-row justify-center gap-6 my-4">
                                    <div className="max-w-[350px] w-full">
                                        <NordVPNCard />
                                    </div>
                                    <div className="max-w-[350px] w-full">
                                        <NexoCard />
                                    </div>
                                    <div className="max-w-[350px] w-full">
                                        <TikTokCard />
                                    </div>
                                </div>

                                {/* Price Chart - Full Width */}
                                <PriceGraph />

                                {/* News Feed - Full Width */}
                                <ArticleFeed />

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}