"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import React from "react";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";
import SubPage from "./articles/SubPage";
import HeroSection from "@/components/HomePages/HeroSection";
import {GridBackground} from "@/components/ui/gridBackground";
import {
    
    GeminiCard,  NordVPNCard,
     FanaticsCard, RemitlyCard
} from "@/components/AffiliateLinks";

import CardCarousel from "@/components/HomePages/Affiliate/AffilliateCarousel";

const Profile = () => {
    return (
        <div className="container mx-auto min-h-screen px-4 sm:px-6 lg:px-[5vw] 3xl:px-[1vw] space-y-12 sm:space-y-16 lg:space-y-20">
            {/* Navigation */}
            <CryptoNavbar/>

            {/* Hero Section - with responsive top spacing after navbar */}
            <div className="pt-8 sm:pt-16 lg:pt-[12vh] flex items-center justify-center">
                <HeroSection/>
            </div>

            {/* Crypto Data Section */}
            <CryptoData/>

            {/* Market Card Carousel Section */}
            <CardCarousel/>

            {/* Horizontal Affiliate Link */}
            <div className="w-full">
                <GeminiCard compact/>
            </div>

            {/* SubPage + Vertical Affiliate Section - Responsive Layout */}
            <div className="flex flex-col lg:flex-row w-full gap-5">
                {/* Main SubPage content - Full width on mobile, 80% on desktop */}
                <div className="w-full lg:w-[80%] flex flex-col gap-5 lg:-mt-11">
                    <SubPage simpleHeader/>

                    {/* Mobile: Show GeminiCard here */}
                    <div className="block lg:hidden">
                        <GeminiCard/>
                    </div>

                    {/* Article Content */}
                    <div className='bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 sm:p-6'>
                        <div className="space-y-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                                SHIB and LUNC: Community-Driven Comebacks in a Changing Market
                            </h2>
                            <div className="text-gray-300 space-y-3 text-sm sm:text-base">
                                <p>
                                    <strong>Shiba Inu (SHIB)</strong> and <strong>Terra Classic (LUNC)</strong> continue to capture the attention of crypto traders and enthusiasts in 2025. Despite their contrasting origins — one as a meme token and the other from a collapsed ecosystem — both coins are seeing renewed interest due to strong community backing and ambitious burn mechanisms.
                                </p>

                                <p>
                                    SHIB's recent integration into Shibarium, its Layer 2 blockchain, has driven up on-chain activity. Over 410 trillion SHIB tokens have been burned since inception, with the community accelerating weekly burns to reduce the circulating supply and boost scarcity-driven demand.
                                </p>

                                <p>
                                    LUNC, once part of the infamous Terra ecosystem collapse, is finding new life through community governance. The recent 1.2% tax burn proposal and validator upgrades have helped restore some confidence. Active development efforts are also targeting interoperability and ecosystem revival.
                                </p>

                                <p>
                                    While both coins face volatility, their value now stems more from sustained ecosystem development and community-driven utility than hype alone — a sign of maturity in the meme and recovery coin space.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-4 border-t border-gray-700/50">
                                <span className="text-sm text-gray-400">Published: Today</span>
                                <span className="hidden sm:inline text-sm text-gray-400">•</span>
                                <span className="text-sm text-gray-400">4 min read</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Affiliate cards - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:flex lg:w-[20%] flex-col gap-3">
                    <GeminiCard/>
                    <RemitlyCard/>
                    <GeminiCard/>
                    <FanaticsCard/>
                </div>
            </div>

            {/* Mobile: Show affiliate cards in horizontal scroll at bottom */}
            <div className="block lg:hidden">
                <h3 className="text-white text-lg font-semibold mb-4">Recommended Services</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex-shrink-0 w-64">
                        <RemitlyCard/>
                    </div>
                    <div className="flex-shrink-0 w-64">
                        <GeminiCard/>
                    </div>
                    <div className="flex-shrink-0 w-64">
                        <FanaticsCard/>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default Profile;