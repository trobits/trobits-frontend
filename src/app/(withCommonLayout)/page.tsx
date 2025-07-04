"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import React from "react";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";
import SubPage from "./articles/SubPage";
import HeroSection from "@/components/HomePages/HeroSection";
import {GridBackground} from "@/components/ui/gridBackground";
import {
    PrintrendyCard,
    GeminiCard, UrsimeCard,NordVPNCard
} from "@/components/AffiliateLinks";

import CardCarousel from "@/components/HomePages/Affiliate/AffilliateCarousel";

const Profile = () => {
    return (
        <div className="container mx-auto min-h-screen px-[5vw] 3xl:px-[1vw] space-y-20">
            {/* Navigation */}
            <CryptoNavbar/>

            {/* Hero Section - with top spacing after navbar */}
            <div className="pt-[12vh]">
                <HeroSection/>
            </div>

            {/* Crypto Data Section */}
            <CryptoData/>

            {/* Market Card Carousel Section */}
            <CardCarousel/>

            {/* Horizontal Affiliate Link */}
            <div className="w-full">
                <PrintrendyCard compact/>
            </div>

            {/* SubPage + Vertical Affiliate Section */}
            <div className="flex flex-row w-full gap-5">
                {/* Main SubPage content (80%) */}
                <div className="w-[80%] flex flex-col gap-5 -mt-11">
                    <SubPage simpleHeader/>
                    <GeminiCard/>
                    <div className='bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6'>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">One Big Market/Trobits Article</h2>
                            <div className="text-gray-300 space-y-3">
                                <p>This is a featured article section that showcases important market analysis, Trobits
                                    updates, or trending cryptocurrency news. This section takes up 80% of the width and
                                    provides detailed content.</p>
                                <p>The article content can include market insights, burn statistics, partnership
                                    announcements, or educational content about cryptocurrency burning mechanisms.</p>
                                <p>This layout provides a prominent space for high-value content while maintaining the
                                    affiliate monetization structure on the side.</p>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                                <span className="text-sm text-gray-400">Published: Today</span>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm text-gray-400">5 min read</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Vertical Affiliate card (20%) */}
                <div className="w-[20%] flex flex-col gap-10">
                    <GeminiCard/>
                    <PrintrendyCard/>
                    <UrsimeCard/>
                    <NordVPNCard/>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default Profile;