
import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import axios from "axios";

interface CryptoData {
  coin: string;
  icon: StaticImageData;
  visits: string;
  burns: string;
  revenue: string;
}

interface TransparentCardProps {
  cryptoData: CryptoData;
  index: number;
}

const TransparentCard: React.FC<TransparentCardProps> = ({ cryptoData, index }) => {

  const { coin, icon, visits, burns, revenue } = cryptoData;
  const [ , setIsLoading ] = useState(true);
  const [ selectedInterval, setSelectedInterval ] = useState("24 Hours");
  const [ animationClass, setAnimationClass ] = useState("");
  const [ data, setData ] = useState<{ price: string; visits?: string; revenue?: string; burns?: string } | null>(null);

  const intervals = [ "24 Hours", "7 Day", "1 Month" ];

  // Fetch live data for the specific coin
  const fetchData = async () => {

    setIsLoading(true);

    try {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
        params: {
          symbol: `${coin.toUpperCase()}USDT`,
        },
      });
      setData({
        price: response.data?.price || "N/A",
        visits: visits,
        revenue: revenue,
        burns: burns,
      });
    } catch (error) {
      console.error("Error fetching data", error);
      setData({ price: "N/A" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [ selectedInterval, coin ]);

  useEffect(() => {
    // Set up TradingView widget based on the specific coin
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
      if (container) container.innerHTML = "";
    };
  }, [ index, coin ]);

  const handleIntervalChange = (interval: string) => {
    if (interval !== selectedInterval) {
      setAnimationClass("slide-in");
      setTimeout(() => {
        setSelectedInterval(interval);
        setAnimationClass("");
      }, 300);
    }
  };




  return (
    <div className="border border-cyan-400 rounded-xl bg-black p-3 md:p-8 max-w-[290px] md:max-w-[450px] min-h-[450px] text-white shadow-lg backdrop-blur-md relative">
      <div className="tradingview-widget-container mb-4 text-sm ">
        <div id={`tradingview-widget-${index}`} className="tradingview-widget-container__widget  overflow-hidden"></div>
      </div>

      {/* Sliding Content */}
      <div className="overflow-hidden relative">
        <div className={`content-container ${animationClass}`}>
          <div className="flex gap-4 items-center">
            <Image src={icon} alt={`${coin} logo`} width={60} height={60} className="rounded-full" />
            <span className="ml-auto px-3 py-2 text rounded-3xl border border-cyan-400 bg-black">
              Interval - {selectedInterval.charAt(0).toUpperCase() + selectedInterval.slice(1)}
            </span>
          </div>

          {/* Prices Section */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span>{coin.toUpperCase()}:</span>
              <span>{data?.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Visits:</span>
              <span>{data?.visits ?? "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue:</span>
              <span>{data?.revenue ?? "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Burns:</span>
              <span>{data?.burns ?? "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interval Selector Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {intervals.map((interval) => (
          <button
            key={interval}
            onClick={() => handleIntervalChange(interval)}
            className={`w-3 h-3 rounded-full ${selectedInterval === interval ? "bg-cyan-400" : "bg-gray-500"}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TransparentCard;
