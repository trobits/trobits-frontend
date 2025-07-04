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
    GeminiCard, UrsimeCard,NordVPNCard,
    CPRCareCard,FanaticsCard
} from "@/components/AffiliateLinks";

import CardCarousel from "@/components/HomePages/Affiliate/AffilliateCarousel";

const Profile = () => {
    return (
        <div className="container mx-auto min-h-screen px-[5vw] 3xl:px-[1vw] space-y-20">
            {/* Navigation */}
            <CryptoNavbar/>

            {/* Hero Section - with top spacing after navbar */}
            <div className="pt-[12vh] flex items-center justify-center">
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
                            <h2 className="text-2xl font-bold text-white">SHIB and LUNC: Community-Driven Comebacks in a Changing Market</h2>
                            <div className="text-gray-300 space-y-3">
                            <p><strong>Shiba Inu (SHIB)</strong> and <strong>Terra Classic (LUNC)</strong> continue to capture the attention of crypto traders and enthusiasts in 2025. Despite their contrasting origins — one as a meme token and the other from a collapsed ecosystem — both coins are seeing renewed interest due to strong community backing and ambitious burn mechanisms.</p>

                            <p>SHIB's recent integration into Shibarium, its Layer 2 blockchain, has driven up on-chain activity. Over 410 trillion SHIB tokens have been burned since inception, with the community accelerating weekly burns to reduce the circulating supply and boost scarcity-driven demand.</p>

                            <p>LUNC, once part of the infamous Terra ecosystem collapse, is finding new life through community governance. The recent 1.2% tax burn proposal and validator upgrades have helped restore some confidence. Active development efforts are also targeting interoperability and ecosystem revival.</p>

                            <p>While both coins face volatility, their value now stems more from sustained ecosystem development and community-driven utility than hype alone — a sign of maturity in the meme and recovery coin space.</p>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                            <span className="text-sm text-gray-400">Published: Today</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-400">4 min read</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Affiliate card (20%) */}
                <div className="w-[20%] flex flex-col gap-3">
                    <CPRCareCard/>
                    <FanaticsCard/>
                    <UrsimeCard/>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default Profile;