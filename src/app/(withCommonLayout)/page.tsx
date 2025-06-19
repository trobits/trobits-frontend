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

// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Profile = () => {
  // const dispatch = useAppDispatch();

  return (
    <div>
      <CryptoNavbar />

      {/* Printrendy above grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <GeminiCard />
      </div>

      <GridBackground>
        <CryptoData />
      </GridBackground>

      {/* Gemini below grid */}
      {/* Multiple affiliate cards in a single row */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GeminiCard />
          <UrsimeCard />
        </div>
      </div>

      <CryptoInfo />

      {/* Ursime after CryptoInfo */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <UrsimeCard />
      </div>

      {/* Full-width wrapper with inner constrained content */}
      <div className="w-full bg-slate-900/40 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-12">
          {/* Left: SubPage */}
          <div className="lg:col-span-2">
            <SubPage simpleHeader />
          </div>

          {/* Right: All 3 stacked cards */}
          <div className="space-y-4">
            <GeminiCard />
            <PrintrendyCard />
            <UrsimeCard />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
