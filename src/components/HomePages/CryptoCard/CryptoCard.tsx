

// import React, { useState, useEffect } from "react";
// import Image, { StaticImageData } from "next/image";

// interface CryptoData {
//   coin: string;
//   icon: StaticImageData;
//   visits: string;
//   burns: string;
//   revenue: string;
//   visits7Day: string;
//   revenue7Day: string;
//   burns7Day: string;
//   visits30Day: string;
//   revenue30Day: string;
//   burns30Day: string;
// }

// interface TransparentCardProps {
//   cryptoData: CryptoData;
//   index: number;
// }

// const TransparentCard: React.FC<TransparentCardProps> = ({ cryptoData, index }) => {
//   const {
//     coin,
//     icon,
//     visits,
//     burns,
//     revenue,
//     visits7Day,
//     revenue7Day,
//     burns7Day,
//     visits30Day,
//     revenue30Day,
//     burns30Day,
//   } = cryptoData;

//   const [ selectedInterval, setSelectedInterval ] = useState("1 Day");

//   // Default data to show
//   const [ data, setData ] = useState({
//     visits: visits,
//     revenue: revenue,
//     burns: burns,
//   });

//   const intervals = [ "1 Day", "7 Days", "30 Days" ];

//   const handleIntervalChange = (interval: string) => {
//     setSelectedInterval(interval);
//     switch (interval) {
//       case "7 Days":
//         setData({
//           visits: visits7Day,
//           revenue: revenue7Day,
//           burns: burns7Day,
//         });
//         break;
//       case "30 Days":
//         setData({
//           visits: visits30Day,
//           revenue: revenue30Day,
//           burns: burns30Day,
//         });
//         break;
//       case "1 Day":
//       default:
//         setData({
//           visits: visits,
//           revenue: revenue,
//           burns: burns,
//         });
//         break;
//     }
//   };

//   // Dynamically load TradingView widget
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
//     script.async = true;
//     script.innerHTML = JSON.stringify({
//       symbol: coin.toUpperCase() === "SHIB" ? "CRYPTO:SHIBUSD" : "CRYPTO:LUNCUSD",
//       width: 350,
//       isTransparent: true,
//       colorTheme: "dark",
//       locale: "en",
//     });

//     // Unique container for each widget
//     const container = document.getElementById(`tradingview-widget-${index}`);
//     if (container) {
//       container.innerHTML = ""; // Clear any previous content
//       container.appendChild(script);
//     }

//     return () => {
//       // Cleanup: Remove the widget on unmount
//       if (container) {
//         container.innerHTML = "";
//       }
//     };
//   }, [ coin, index ]); // Re-run effect only if `coin` or `index` changes

//   return (
//     <div className="border border-cyan-400 rounded-xl bg-black p-3 md:p-8 max-w-[290px] md:max-w-[450px] min-h-[450px] text-white shadow-lg backdrop-blur-md relative">
//       {/* TradingView Widget */}
//       <div className="tradingview-widget-container mb-4 text-sm ">
//         <div id={`tradingview-widget-${index}`} className="tradingview-widget-container__widget overflow-hidden"></div>
//       </div>

//       {/* Sliding Content */}
//       <div className="overflow-hidden relative">
//         <div className="content-container">
//           <div className="flex gap-4 items-center">
//             <Image src={icon} alt={`${coin} logo`} width={60} height={60} className="rounded-full" />
//             <span className="ml-auto px-3 py-2 text rounded-3xl border border-cyan-400 bg-black">
//               Interval - {selectedInterval}
//             </span>
//           </div>

//           {/* Prices Section */}
//           <div className="mt-6 space-y-3">
//             <div className="flex justify-between">
//               <span>Visits:</span>
//               <span>{data.visits ?? "N/A"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Revenue:</span>
//               <span>{data.revenue ?? "N/A"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Burns:</span>
//               <span>{data.burns ?? "N/A"}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Interval Selector Dots */}
//       <div className="flex justify-center mt-4 gap-2">
//         {intervals.map((interval) => (
//           <button
//             key={interval}
//             onClick={() => handleIntervalChange(interval)}
//             className={`w-3 h-3 rounded-full ${selectedInterval === interval ? "bg-cyan-400" : "bg-gray-500"}`}
//           ></button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TransparentCard;






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

  const intervals = [ "1 Day", "7 Days", "30 Days" ];
  const [ selectedInterval, setSelectedInterval ] = useState(0); 
  const [ isSliding, setIsSliding ] = useState(false);

  const getCurrentData = () => {
    switch (intervals[ selectedInterval ]) {
      case "7 Days":
        return { visits: visits7Day, revenue: revenue7Day, burns: burns7Day };
      case "30 Days":
        return { visits: visits30Day, revenue: revenue30Day, burns: burns30Day };
      default:
        return { visits, revenue, burns };
    }
  };

  const [ currentData, setCurrentData ] = useState(getCurrentData());

 
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsSliding(true); // Start sliding
      setTimeout(() => {
        const nextIndex = (selectedInterval + 1) % intervals.length;
        setSelectedInterval(nextIndex); 
        setCurrentData(getCurrentData()); 
        setIsSliding(false); 
      }, 100); 
    }, 4000);

    return () => clearInterval(intervalId); 
  }, [ selectedInterval ]);

  
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
  }, [ coin, index ]);

  return (
    <div className="border border-cyan-400 rounded-xl bg-black p-3 md:p-8 max-w-[290px] md:max-w-[450px] min-h-[450px] text-white shadow-lg backdrop-blur-md relative overflow-hidden">
      {/* TradingView Widget */}
      <div className="tradingview-widget-container mb-4 text-sm">
        <div id={`tradingview-widget-${index}`} className="tradingview-widget-container__widget"></div>
      </div>

      {/* Sliding Content */}
      <div className="relative w-full h-full overflow-hidden">
        <div
          className={`relative w-full transition-transform duration-300 ease-in-out transform ${isSliding ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
            }`}
        >
          <div className="flex gap-4 items-center">
            <Image src={icon} alt={`${coin} logo`} width={60} height={60} className="rounded-full" />
            <span className="ml-auto px-3 py-2 text rounded-3xl border border-cyan-400 bg-black">
              Interval - {intervals[ selectedInterval ]}
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
            onClick={() => {
              setSelectedInterval(idx);
              setCurrentData(getCurrentData());
            }}
            className={`w-3 h-3 rounded-full ${selectedInterval === idx ? "bg-cyan-400" : "bg-gray-500"
              }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TransparentCard;
