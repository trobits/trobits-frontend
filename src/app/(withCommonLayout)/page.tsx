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

      <div className="pt-20 ">
        <div className="w-[95vw] mx-auto px-4 py-4 mt-12 h-40 overflow-clip">
          <div className="w-full">
            <GeminiCard />
          </div>
        </div>
      </div>

      <GridBackground>
        <CryptoData />
      </GridBackground>
      <div className="w-[95vw] px-4 sm:px-8 py-6 -mx-4 sm:-mx-8">
        <CardCarousel />
      </div>

      <CryptoInfo />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <UrsimeCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-4 lg:px-12">
        <div className="lg:col-span-3">
          <SubPage simpleHeader />
        </div>

        <div className="space-y-4">
          <GeminiCard />
          <PrintrendyCard />
          <UrsimeCard />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
