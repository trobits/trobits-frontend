"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import Slider from "@/components/HomePages/Slider/Slider";
import React from "react";
// import Footer from "../shared/Footer/Footer";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";
import CryptoInfo from "@/components/HomePages/cryptoInfo/CryptoInfo";
import SubPage from "./articles/SubPage";
import CryptoGames from "@/components/HomePages/CryptoGames/index";
import { BackgroundGradient } from "@/components/ui/backgroundGradient";

import BurnChartWithCalculator from "@/components/HomePages/Slider/GraphSlider";
import { GridBackground } from "@/components/ui/gridBackground";
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
    <div>
      <CryptoNavbar />

      <div className="relative z-20 pt-20">
        <div className="w-[95vw] max-w-6xl mx-auto px-4 py-4 mt-6 -mb-36">
          <GeminiCard compact />
        </div>
      </div>




      <GridBackground>
        <CryptoData />
      </GridBackground>
      <div className="w-[95vw] max-w-6xl mx-auto px-4 py-6">
  <div className="bg-gray-900/40 border border-gray-700/50 rounded-2xl p-4">
    <CardCarousel />
  </div>
</div>



     
      <CryptoInfo />




      <div className="relative z-20 pt-0">
        <div className="w-[95vw] max-w-6xl mx-auto px-4 py-4 mt-6 mb-12">
          <PrintrendyCard compact />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-2 sm:px-4 lg:px-12">
        {/* Main content area (wider) */}
        <div className="lg:col-span-10">
          <SubPage simpleHeader />
        </div>

        {/* Side cards area (narrower) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-2">
            <GeminiCard />
          </div>
          <div className="p-2">
            <PrintrendyCard />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
