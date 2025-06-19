"use client";
import React, { useEffect, useRef } from "react";
import { TrendingUp, Flame } from "lucide-react";
import Link from "next/link";
import shibaInu from "../../assets/icons/shiba-inu.png";
import Lunc from "../../assets/icons/lunc.png";
import {
  useGetLuncInformationQuery,
  useGetShibaInformationQuery,
} from "@/redux/features/api/currencyApi";
import Loading from "../Shared/Loading";
import { BackgroundGradient } from "@/components/ui/backgroundGradient";

// Individual Coin Column Component
const CoinColumn = ({ cryptoData, index, isLast }) => {
  const widgetRef = useRef(null);
  const { coin, burns, burns30Day } = cryptoData;

  const formatNumber = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString();
  };

  useEffect(() => {
    if (widgetRef.current && !widgetRef.current.hasChildNodes()) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol:
          coin.toUpperCase() === "SHIB" ? "CRYPTO:SHIBUSD" : "CRYPTO:LUNCUSD",
        width: "100%",
        height: 60,
        isTransparent: true,
        colorTheme: "dark",
        locale: "en",
        showSymbolLogo: true,
        fontSize: "10",
      });
      widgetRef.current.appendChild(script);
    }
  }, [coin, index]);

  return (
    <>
      <div className="flex-1 p-4 hover:bg-gray-900/20 transition-all duration-300 group">
        {/* Coin Header */}
        {/* <div className="flex items-center justify-center mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
              coin === "SHIB"
                ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400"
                : "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400"
            }`}
          >
            {coin}
          </div>
        </div> */}

        {/* Coin Name & Status
          <div className="text-center mb-4">
            <h3 className="text-white font-semibold text-sm mb-1">
              {coin === 'SHIB' ? 'Shiba Inu' : 'Terra Luna Classic'}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Live</span>
            </div>
          </div> */}

        {/* Price Widget */}
        <div className="mb-6">
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-3">
            <div ref={widgetRef} className="w-full h-[50px]" />
          </div>
        </div>

        {/* Burn Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">
                1 Day Burn
              </span>
            </div>
            <div className="text-center text-lg font-bold text-white">
              {formatNumber(burns) || "0"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Lifetime Burn
              </span>
            </div>
            <div className="text-center text-lg font-bold text-white">
              {formatNumber(burns30Day) || "0"}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {coin === "SHIB" ? (
            <div className="space-y-2">
              <Link
                href="/archive/shiba"
                className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-3 rounded-xl text-center transition-all duration-300 hover:scale-105 text-sm"
              >
                🔥 SHIB Burn
              </Link>
              <Link
                href="/shiba"
                className="block w-full bg-gray-800 border border-gray-700 text-white font-semibold py-2 px-3 rounded-xl text-center hover:bg-gray-700 transition-all duration-300 hover:scale-105 text-sm"
              >
                Details
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/archive/lunc"
                className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-3 rounded-xl text-center transition-all duration-300 hover:scale-105 text-sm"
              >
                🔥 LUNC Burn
              </Link>
              <Link
                href="/lunc"
                className="block w-full bg-gray-800 border border-gray-700 text-white font-semibold py-2 px-3 rounded-xl text-center hover:bg-gray-700 transition-all duration-300 hover:scale-105 text-sm"
              >
                Details
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Divider */}
      {!isLast && <div className="w-px bg-gray-800/50 my-4" />}
    </>
  );
};

export default function CryptoData() {
  const { data: shibaInformation, isLoading: shibaDataLoading } =
    useGetShibaInformationQuery("");
  const { data: luncInformation, isLoading: luncDataLoading } =
    useGetLuncInformationQuery("");

  if (shibaDataLoading || luncDataLoading) {
    return <Loading />;
  }

  const shibaData = shibaInformation?.data;
  const luncData = luncInformation?.data;

  const cardData = [
    {
      coin: "SHIB",
      shibPrice: "0.000016939",
      luncPrice: "0",
      interval: "1 Day",
      icon: shibaInu,
      visits: shibaData?.visits,
      revenue: shibaData?.revenue,
      burns: shibaData?.burns,
      visits7Day: shibaData?.visits7Day,
      revenue7Day: shibaData?.revenue7Day,
      burns7Day: shibaData?.burns7Day,
      visits30Day: shibaData?.visits30Day,
      revenue30Day: shibaData?.revenue30Day,
      burns30Day: shibaData?.burns30Day,
    },
    {
      coin: "LUNC",
      icon: Lunc,
      shibPrice: "0",
      luncPrice: "0.000090378",
      interval: "7 Days",
      visits: luncData?.visits,
      revenue: luncData?.revenue,
      burns: luncData?.burns,
      visits7Day: luncData?.visits7Day,
      revenue7Day: luncData?.revenue7Day,
      burns7Day: luncData?.burns7Day,
      visits30Day: luncData?.visits30Day,
      revenue30Day: luncData?.revenue30Day,
      burns30Day: luncData?.burns30Day,
    },
    {
      coin: "SHIB",
      shibPrice: "0.000016939",
      luncPrice: "0",
      interval: "1 Day",
      icon: shibaInu,
      visits: shibaData?.visits,
      revenue: shibaData?.revenue,
      burns: shibaData?.burns,
      visits7Day: shibaData?.visits7Day,
      revenue7Day: shibaData?.revenue7Day,
      burns7Day: shibaData?.burns7Day,
      visits30Day: shibaData?.visits30Day,
      revenue30Day: shibaData?.revenue30Day,
      burns30Day: shibaData?.burns30Day,
    },
    {
      coin: "LUNC",
      icon: Lunc,
      shibPrice: "0",
      luncPrice: "0.000090378",
      interval: "7 Days",
      visits: luncData?.visits,
      revenue: luncData?.revenue,
      burns: luncData?.burns,
      visits7Day: luncData?.visits7Day,
      revenue7Day: luncData?.revenue7Day,
      burns7Day: luncData?.burns7Day,
      visits30Day: luncData?.visits30Day,
      revenue30Day: luncData?.revenue30Day,
      burns30Day: luncData?.burns30Day,
    },
    {
      coin: "SHIB",
      shibPrice: "0.000016939",
      luncPrice: "0",
      interval: "1 Day",
      icon: shibaInu,
      visits: shibaData?.visits,
      revenue: shibaData?.revenue,
      burns: shibaData?.burns,
      visits7Day: shibaData?.visits7Day,
      revenue7Day: shibaData?.revenue7Day,
      burns7Day: shibaData?.burns7Day,
      visits30Day: shibaData?.visits30Day,
      revenue30Day: shibaData?.revenue30Day,
      burns30Day: shibaData?.burns30Day,
    },
  ];

  return (
    <section className="container mx-auto mt-28 px-0">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-7xl mx-auto px-6">
          <BackgroundGradient className="rounded-3xl bg-black">
            <div className="overflow-hidden">
              <div className="flex divide-x divide-gray-800/30">
                {cardData.map((card, index) => (
                  <CoinColumn
                    key={index}
                    cryptoData={card}
                    index={index}
                    isLast={index === cardData.length - 1}
                  />
                ))}
              </div>
            </div>
          </BackgroundGradient>
        </div>
      </div>
    </section>
  );
}
