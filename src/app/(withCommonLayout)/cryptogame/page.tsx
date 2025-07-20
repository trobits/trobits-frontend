"use client";

import React from "react";
import CryptoGames from "@/components/HomePages/CryptoGames/index";
import CryptoNavbar from "@/app/shared/navbar/CryptoNavbar";
import Footer from "@/app/shared/Footer/Footer";

const CryptoGamesPage = () => {
  return (
    <div>
      <CryptoNavbar />
      <CryptoGames />
      <Footer />
    </div>
  );
};

export default CryptoGamesPage;
