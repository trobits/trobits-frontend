"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import Slider from "@/components/HomePages/Slider/Slider";
import NewsCompo from "@/components/NewsPart/NewsCompo";
import React from "react";
// import Footer from "../shared/Footer/Footer";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";
import CryptoInfo from "@/components/HomePages/cryptoInfo/CryptoInfo";

const Profile = () => {
  return (
    <div>
      <CryptoNavbar />
      <CryptoData />

      <CryptoInfo />

      <Slider />
      <NewsCompo />
      <iframe
        src="//ads.coinserom.com/publisher?adsunit=34373235&size=300x250"
        style={{
          width: "300px",
          height: "250px",
          border: "0px",
          padding: "0",
          backgroundColor: "transparent",
          overflow: "auto",
        }}
      ></iframe>

      <iframe
        <!-- Bidvertiser2097768 -->
      ></iframe>
      
      <Footer />
    </div>
  );
};

export default Profile;
