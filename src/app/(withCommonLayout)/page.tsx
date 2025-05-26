"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import Slider from "@/components/HomePages/Slider/Slider";
import NewsCompo from "@/components/NewsPart/NewsCompo";
import React from "react";
// import Footer from "../shared/Footer/Footer";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";
import CryptoInfo from "@/components/HomePages/cryptoInfo/CryptoInfo";
import AffiliateLinksGrid from "@/components/AffiliateLinks/AffiliateLinksGrid";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Profile = () => {
  // const dispatch = useAppDispatch();

  return (
    <div>
      <CryptoNavbar />
      <CryptoData />

      <CryptoInfo />

      {/* Affiliate Links Section */}
      <div className="py-16 px-4">
        <AffiliateLinksGrid />
      </div>

      <Slider />
      <NewsCompo />
      

      <Footer />
    </div>
  );
};

export default Profile;
