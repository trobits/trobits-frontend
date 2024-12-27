

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

interface CryptoData {
  coin: string;
  icon: StaticImageData;
  visits: string;
  burns: string;
  revenue: string;
  visits7Day: string;
  revenue7Day: string;
  burns7Day: string;
  visits30Day: string;
  revenue30Day: string;
  burns30Day: string;
}

interface TransparentCardProps {
  cryptoData: CryptoData;
  index: number;
}

const TransparentCard: React.FC<TransparentCardProps> = ({ cryptoData, index }) => {
  const {
    coin,
    icon,
    visits,
    burns,
    revenue,
    visits7Day,
    revenue7Day,
    burns7Day,
    visits30Day,
    revenue30Day,
    burns30Day,
  } = cryptoData;

  const intervals = ["1 Day", "7 Days", "30 Days"];
  const [selectedInterval, setSelectedInterval] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const getCurrentData = () => {
    const formatNumber = (value: string) => {
      // Convert value to number to remove leading zeros
      return Number(value).toString();
    };
  
    switch (intervals[selectedInterval]) {
      case "7 Days":
        return {
          visits: formatNumber(visits7Day),
          revenue: formatNumber(revenue7Day),
          burns: formatNumber(burns7Day),
        };
      case "30 Days":
        return {
          visits: formatNumber(visits30Day),
          revenue: formatNumber(revenue30Day),
          burns: formatNumber(burns30Day),
        };
      default:
        return {
          visits: formatNumber(visits),
          revenue: formatNumber(revenue),
          burns: formatNumber(burns),
        };
    }
  };
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsSliding(true); // Start sliding
      setTimeout(() => {
        setSelectedInterval((prev) => (prev + 1) % intervals.length); // Update interval index
        setIsSliding(false); // End sliding
      }, 100);
    }, 4000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: coin.toUpperCase() === "SHIB" ? "CRYPTO:SHIBUSD" : "CRYPTO:LUNCUSD",
      width: 350,
      isTransparent: true,
      colorTheme: "dark",
      locale: "en",
    });

    const container = document.getElementById(`tradingview-widget-${index}`);
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [coin, index]);

  const currentData = getCurrentData();

  return (
    <div className="border border-cyan-400 rounded-xl bg-black p-3 md:p-8 max-w-[290px] md:max-w-[450px] min-h-[450px] text-white shadow-lg backdrop-blur-md relative overflow-hidden">
      {/* TradingView Widget */}
      <div className="tradingview-widget-container mb-4 text-sm">
        <div id={`tradingview-widget-${index}`} className="tradingview-widget-container__widget"></div>
      </div>

      {/* Sliding Content */}
      <div className="relative w-full h-full overflow-hidden">
        <div
          className={`relative w-full transition-transform duration-300 ease-in-out transform ${
            isSliding ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
          }`}
        >
          <div className="flex gap-4 items-center">
            <Image src={icon} alt={`${coin} logo`} width={60} height={60} className="rounded-full" />
            <span className="ml-auto px-3 py-2 text rounded-3xl border border-cyan-400 bg-black">
              Interval - {intervals[selectedInterval]}
            </span>
          </div>

          {/* Prices Section */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span>Visits:</span>
              <span>{currentData.visits}</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue:</span>
              <span>{currentData.revenue}</span>
            </div>
            <div className="flex justify-between">
              <span>Burns:</span>
              <span>{currentData.burns}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interval Selector Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {intervals.map((interval, idx) => (
          <button
            key={interval}
            onClick={() => setSelectedInterval(idx)}
            className={`w-3 h-3 rounded-full ${
              selectedInterval === idx ? "bg-cyan-400" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TransparentCard;


// export default TransparentCard;
