"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import Slider from "@/components/HomePages/Slider/Slider";
import NewsCompo from "@/components/NewsPart/NewsCompo";
import React from "react";

const Profile = () => {
  return (
    <div>
      <CryptoData />
      <Slider />
      <NewsCompo />
    </div>
  );
};

export default Profile;
