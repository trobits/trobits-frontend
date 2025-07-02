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

            <div className="pt-[14vh] flex items-center justify-center">
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

            <div className="flex flex-row w-full">
                {/* Main content area (wider) */}
                <div className="max-w-[80%]">
                    <SubPage simpleHeader/>
                </div>

                {/* Side cards area (narrower) */}
                <div className="pt-10 w-[20%]">
                    <div className="p-2">
                        <GeminiCard/>
                    </div>
                    <div className="p-2">
                        <PrintrendyCard/>
                    </div>
                </div>
            </div>

            <div className="pt-10">
                <div className="">
                    <PrintrendyCard compact/>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default Profile;
