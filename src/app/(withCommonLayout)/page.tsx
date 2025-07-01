"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import Slider from "@/components/HomePages/Slider/Slider";
import React from "react";
// import Footer from "../shared/Footer/Footer";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";
import CryptoInfo from "@/components/HomePages/cryptoInfo/CryptoInfo";
import SubPage from "./articles/SubPage";
import HeroSection from "@/components/HomePages/HeroSection";
import CryptoGames from "@/components/HomePages/CryptoGames/index";
import {BackgroundGradient} from "@/components/ui/backgroundGradient";

import BurnChartWithCalculator from "@/components/HomePages/Slider/GraphSlider";
import {GridBackground} from "@/components/ui/gridBackground";
import {
    PrintrendyCard,
    GeminiCard,
    UrsimeCard,
} from "@/components/AffiliateLinks";

import CardCarousel from "@/components/HomePages/Affiliate/AffilliateCarousel";

// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Profile = () => {
    // const dispatch = useAppDispatch();

    return (
        <div className="container mx-auto min-h-screen px-[5vw] 3xl:px-[1vw]">
            <CryptoNavbar/>

            <div className="pt-[10vh]">
                <div className="">
                    <HeroSection/>
                </div>
            </div>


            <GridBackground>
                <CryptoData/>
            </GridBackground>

            <div className="">
                <div className="">
                    <CardCarousel/>
                </div>
            </div>

            <div className="pt-10">
                <div className="">
                    <PrintrendyCard compact/>
                </div>
            </div>

            <div className="">
                {/* Main content area (wider) */}
                <div className="lg:col-span-10">
                    <SubPage simpleHeader/>
                </div>

                {/* Side cards area (narrower) */}
                <div className="lg:col-span-2 space-y-4 pt-10">
                    <div className="p-2">
                        <GeminiCard/>
                    </div>
                    <div className="p-2">
                        <PrintrendyCard/>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default Profile;
