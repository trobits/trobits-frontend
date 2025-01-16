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
      <div style={{ width: "100%", height: "500px", overflow: "hidden" }}>
        <iframe
          data-aa="2376212"
          src="//ad.a-ads.com/2376212?size=728x90"
          style={{
            width: "728px",
            height: "90px",
            border: "0px",
            padding: "0",
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
          title="Ad 728x90"
        ></iframe>

        {/* Second Ad */}
        <iframe
          data-aa="2376213"
          src="//ad.a-ads.com/2376213?size=300x250"
          style={{
            width: "300px",
            height: "250px",
            border: "0px",
            padding: "0",
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
          title="Ad 300x250"
        ></iframe>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
