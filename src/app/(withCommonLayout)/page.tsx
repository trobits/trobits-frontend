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
import {GridBackground} from "@/components/ui/gridBackground";
import { AffiliateLinks } from "@/components/AffiliateLinks";

// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Profile = () => {
  // const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen">
      <CryptoNavbar />
      <div>
        <GridBackground>
          <CryptoData />
        </GridBackground>
        
        <AffiliateLinks />
        
        <CryptoInfo />
        <CryptoGames />
        <div className="mt-20">
          <BurnChartWithCalculator />
        </div>
        <Slider />
        <div className="mt-20">
          <SubPage simpleHeader />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
