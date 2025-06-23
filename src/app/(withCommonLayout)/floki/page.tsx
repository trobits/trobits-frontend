"use client";

import React, { useEffect, useRef } from "react";
import { TrendingUp, DollarSign, BarChart3, Newspaper } from "lucide-react";

const FlokiHeader = () => (
    <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
            Floki Analytics
        </h1>
        <p className="text-gray-400 text-lg mb-6">
            Comprehensive FLOKI market analysis and insights
        </p>

        {/* FLOKI Data Button */}
        <div className="flex justify-center">
            <a
                href="/archive/floki"
                className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
            >
                🐕 FLOKI Data
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
            symbol: "CRYPTO:FLOKIUSD",
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
            symbol: "CRYPTO:FLOKIUSD",
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
    const feedRef = useRef(null);

    useEffect(() => {
        const feedScript = document.createElement("script");
        feedScript.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
        feedScript.async = true;
        feedScript.innerHTML = JSON.stringify({
            feedMode: "all_symbols",
            isTransparent: true,
            displayMode: "regular",
            width: "100%",
            height: 500,
            colorTheme: "dark",
            locale: "en",
            filter: "floki",
        });

        if (feedRef.current) {
            feedRef.current.innerHTML = "";
            feedRef.current.appendChild(feedScript);
        }
    }, []);

    return (
        <div className="bg-gray-950/80 border border-gray-800/60 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <Newspaper className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">News Feed</h3>
                    <p className="text-sm text-gray-400">Latest FLOKI updates</p>
                </div>
            </div>
            <div
                className="bg-black/50 border border-gray-800/40 rounded-xl overflow-hidden"
                ref={feedRef}
                style={{ height: "500px" }}
            />
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
            symbol: "CRYPTO:FLOKIUSD",
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
                            <FlokiHeader />

                            {/* Main Grid Layout */}
                            <div className="space-y-8">

                                {/* Top Row - Symbol Info & Technical Analysis */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <SymbolInfo />
                                    <TechnicalAnalysis />
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