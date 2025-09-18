"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import React, { useEffect, useState } from "react";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";
import SubPage from "./articles/SubPage";
import HeroSection from "@/components/HomePages/HeroSection";
import {
     FanaticsCard, RemitlyCard,
     TikTokCard,
     NexoCard,
     TesterupCard,
     
} from "@/components/AffiliateLinks";

import CardCarousel from "@/components/HomePages/Affiliate/AffilliateCarousel";

function HomepageArticleSection() {
    const [article, setArticle] = useState<{ title: string; body: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1//homepage-article`)
            .then(async (res) => {
                
                if (!res.ok) throw new Error("No article found");
                return res.json();
            })
            .then((data) => {
                setArticle({ title: data.title, body: data.body });
                setLoading(false);
            })
            .catch(() => {
                setError("No homepage article found.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className='bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 sm:p-6'>
                <div className="text-gray-400">Loading homepage article...</div>
            </div>
        );
    }
    if (error || !article) {
        return (
            <div className='bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 sm:p-6'>
                <div className="text-gray-400">{error}</div>
            </div>
        );
    }
    return (
        <div className='bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 sm:p-6 max-h-[50vh] overflow-auto'>
            <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {article.title}
                </h2>
                <div className="text-gray-300 space-y-3 text-sm sm:text-base">
                    {article.body.split(/\n+/).map((para, idx) => (
                        <p key={idx}>{para}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

const Profile = () => {
    return (
        <div className="container mx-auto min-h-screen px-4 sm:px-6 lg:px-[5vw] 3xl:px-[1vw] space-y-12 sm:space-y-16 lg:space-y-20">
            {/* Navigation */}
            <CryptoNavbar/>

            {/* Hero Section - with reduced top spacing after navbar */}
            <div className="pt-2 sm:pt-4 lg:pt-6 flex items-center justify-center">
                <HeroSection/>
            </div>

            {/* Crypto Data Section */}
            <CryptoData/>

            {/* Market Card Carousel Section - Increased spacing above and below */}
            <div className="flex items-center justify-center py-10">
                <CardCarousel/>
            </div>

            {/* Horizontal Affiliate Link */}
            {/* <div className="w-full">
                <SocialCatfishCard compact/>
            </div> */}

            {/* News Carousel Section - Full Width */}
            <div className="w-full">
                <SubPage simpleHeader/>
            </div>

            {/* Article + Vertical Affiliate Section - Responsive Layout */}
            <div className="flex flex-col lg:flex-row w-full gap-5 justify-center">
                {/* Article Content - Main content area */}
                <div className="w-full lg:w-[100%] xl:w-[90%] 2xl:w-[72%] flex flex-col gap-5">
                    {/* Mobile: Show GeminiCard here */}
                    <div className="block lg:hidden">
                        <TesterupCard/>
                    </div>

                    {/* Article Content */}
                    <HomepageArticleSection />
                </div>

                {/* Vertical Affiliate cards - Hidden on mobile, shown on desktop */}
                <div className="hidden xl:flex lg:w-[12%] flex-col gap-4 scale-95 max-h-[530px]">
                    <TikTokCard/>
                    <NexoCard/>
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
                        <TikTokCard/>
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