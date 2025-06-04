import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

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

const TransparentCard: React.FC<TransparentCardProps> = ({
  cryptoData,
  index,
}) => {
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

  const intervals = ["1 Day", "Lifetime"];
  const [selectedInterval, setSelectedInterval] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const getCurrentData = () => {
    const formatNumber = (value: string) => Number(value).toLocaleString();

    switch (intervals[selectedInterval]) {
      case "Lifetime":
        return {
          burns: formatNumber(burns30Day),
          visits: formatNumber(visits30Day),
          revenue: formatNumber(revenue30Day),
        };
      default:
        return {
          burns: formatNumber(burns),
          visits: formatNumber(visits),
          revenue: formatNumber(revenue),
        };
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setSelectedInterval((prev) => (prev + 1) % intervals.length);
        setIsSliding(false);
      }, 100);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol:
        coin.toUpperCase() === "SHIB" ? "CRYPTO:SHIBUSD" : "CRYPTO:LUNCUSD",
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
    <div className="bg-gray-900/80 border border-gray-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-[320px] md:max-w-[500px] md:w-[450px] min-h-[400px] text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-gray-700/70 group">
      {/* TradingView Widget */}
      <div className="tradingview-widget-container mb-4 text-sm">
        <div
          id={`tradingview-widget-${index}`}
          className="tradingview-widget-container__widget"
        ></div>
      </div>

      {/* Header with coin info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500" />
            {/* <Image
              src={icon}
              alt={`${coin} logo`}
              width={50}
              height={50}
              className="relative rounded-full border border-gray-700 group-hover:border-gray-600 transition-all duration-300"
            /> */}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{coin}</h3>
            <p className="text-sm text-gray-400">Cryptocurrency</p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-400">Live</span>
        </div>
      </div>

      {/* TradingView Widget */}
      {/* <div className="tradingview-widget-container mb-6 bg-black/30 rounded-2xl p-4 border border-gray-800/30">
        <div
          id={`tradingview-widget-${index}`}
          className="tradingview-widget-container__widget"
        ></div>
      </div> */}

      {/* Interval Selector */}
      <div className="flex bg-gray-800/50 rounded-2xl p-1 mb-6">
        {intervals.map((interval, idx) => (
          <button
            key={interval}
            onClick={() => setSelectedInterval(idx)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedInterval === idx
                ? "bg-white text-black shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            {interval}
          </button>
        ))}
      </div>

      {/* Data Section */}
      {/* Data Section */}
      <div className="relative overflow-hidden mb-6">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSliding
              ? "transform translate-x-4 opacity-0"
              : "transform translate-x-0 opacity-100"
          }`}
        >
          <div className="space-y-4">
            {[
              {
                label: "Total Burns",
                value: currentData.burns,
                iconColor: "red",
              },
              {
                label: "Total Visits",
                value: currentData.visits,
                iconColor: "blue",
              },
              {
                label: "Total Revenue",
                value: `$${currentData.revenue}`,
                iconColor: "green",
              },
            ].map(({ label, value, iconColor }, idx) => (
              <div
                key={idx}
                className="bg-black/30 border border-gray-800/30 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-${iconColor}-600/20 rounded-xl flex items-center justify-center`}
                  >
                    <TrendingUp className={`w-6 h-6 text-${iconColor}-400`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{label}</p>
                    <p className="text-xl font-bold text-white">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {cryptoData.coin === "SHIB" ? (
          <>
            <Link
              href="/archive/shiba"
              className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-2xl text-center hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm"
            >
              SHIB Burn
            </Link>
            <Link
              href="/shiba"
              className="flex-1 bg-gray-800 border border-gray-700 text-white font-semibold py-3 px-4 rounded-2xl text-center hover:bg-gray-700 transition-all duration-300 hover:scale-105 text-sm"
            >
              Details
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/archive/lunc"
              className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-2xl text-center hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm"
            >
              LUNC Burn
            </Link>
            <Link
              href="/lunc"
              className="flex-1 bg-gray-800 border border-gray-700 text-white font-semibold py-3 px-4 rounded-2xl text-center hover:bg-gray-700 transition-all duration-300 hover:scale-105 text-sm"
            >
              Details
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TransparentCard;
