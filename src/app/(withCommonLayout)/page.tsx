"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import Slider from "@/components/HomePages/Slider/Slider";
import NewsCompo from "@/components/NewsPart/NewsCompo";
import React from "react";
// import Footer from "../shared/Footer/Footer";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";

const Profile = () => {
  return (
    <div>
      <CryptoNavbar />
      <CryptoData />
      <Slider />
      <NewsCompo />
      <Footer/>
    </div>
  );
};

export default Profile;
