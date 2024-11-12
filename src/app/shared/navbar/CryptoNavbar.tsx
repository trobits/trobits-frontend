
// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// interface CryptoData {
//   name: string;
//   price: number;
// }

// // Default data for cache
// const defaultCache: Record<string, CryptoData[]> = {
//   Price: [
//     { name: "BTC", price: 75858 },
//     { name: "ETH", price: 2901.97 },
//     { name: "USDT", price: 1 },
//     { name: "SOL", price: 199.51 },
//     { name: "BNB", price: 596.14 },
//   ],
//   Trending: [
//     { name: "BTC", price: 75853 },
//     { name: "USDT", price: 1.001 },
//     { name: "ETH", price: 2901.92 },
//     { name: "FDUSD", price: 1 },
//     { name: "USDC", price: 0.999427 },
//   ],
//   "Recently Added": [
//     { name: "OME", price: 0.00004861 },
//     { name: "0DOG", price: 0.00672315 },
//     { name: "ZAD", price: 0.00000122 },
//     { name: "ZOC", price: 0.00019625 },
//     { name: "WOLF", price: 2.32771e-7 },
//   ],
//   "Most Visited": [
//     { name: "BTC", price: 75858 },
//     { name: "ETH", price: 2901.97 },
//     { name: "USDT", price: 1 },
//     { name: "SOL", price: 199.51 },
//     { name: "BNB", price: 596.14 },
//   ],
// };

// // Map of endpoint URLs by category
// const endpointMap: Record<string, string> = {
//   Price:
//     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false",
//   Trending:
//     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=5&page=1&sparkline=false",
//   "Recently Added":
//     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_asc&per_page=5&page=1&sparkline=false",
//   "Most Visited":
//     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false",
// };

// export default function CryptoNavbar() {
//   const [ selectedOption, setSelectedOption ] = useState<keyof typeof endpointMap>(
//     "Price"
//   );
//   const [ cryptoData, setCryptoData ] = useState<CryptoData[]>(defaultCache[ selectedOption ]);
//   const [ isLoading, setIsLoading ] = useState<boolean>(false);
//   const [ cache, setCache ] = useState<Record<string, CryptoData[]>>(defaultCache);

//   // Fetch crypto data based on selected option if not in cache
//   useEffect(() => {
//     const loadCryptoData = async () => {
//       // Check if data is already cached
//       if (cache[ selectedOption ]) {
//         setCryptoData(cache[ selectedOption ]);
//         return;
//       }

//       setIsLoading(true);
//       try {
//         const response = await axios.get(endpointMap[ selectedOption ]);
//         const fetchedData: CryptoData[] = response.data
//           .slice(0, 5)
//           .map((item: any) => ({
//             name: item?.symbol?.toUpperCase() ?? "N/A",
//             price: item?.current_price ?? 0,
//           }));

//         // Update the cache with fetched data for the selected option only
//         setCache((prevCache) => ({
//           ...prevCache,
//           [ selectedOption ]: fetchedData,
//         }));
//         setCryptoData(fetchedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setCryptoData(cache[ selectedOption ]); // Fall back to default data if fetch fails
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadCryptoData();
//   }, [ selectedOption, cache ]);

//   return (
//     <nav className="w-full bg-gray-900 text-white px-10">
//       <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-6 items-center">

//         {/* Dropdown Menu for sorting options */}
//         <div className="col-span-1 border-r border-gray-700">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-between text-white hover:bg-gray-800 border px-4 py-2"
//               >
//                 {selectedOption} <ChevronDown className="ml-2 h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="bg-black text-white">
//               {Object.keys(endpointMap).map((option) => (
//                 <DropdownMenuItem
//                   key={option}
//                   onClick={() =>
//                     setSelectedOption(option as keyof typeof endpointMap)
//                   }
//                 >
//                   {option}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Display Crypto Prices for larger screens */}
//         <div className="hidden md:grid md:grid-cols-5 col-span-5">
//           {isLoading ? (
//             <div className="col-span-5 text-center py-4">Loading...</div>
//           ) : (
//             cryptoData.map((crypto) => (
//               <div
//                 key={crypto.name}
//                 className="flex items-center justify-between px-4 py-2 border-r border-gray-700 last:border-r-0"
//               >
//                 <span className="font-bold text-teal-400">{crypto.name}</span>
//                 <span>
//                   {crypto.price.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 5,
//                   })}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Dropdown for crypto prices on small screens */}
//         <div className="md:hidden col-span-5">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-between text-white hover:bg-gray-800 px-4 py-2"
//               >
//                 Crypto Prices <ChevronDown className="ml-2 h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="bg-black text-white">
//               {isLoading ? (
//                 <DropdownMenuItem>Loading...</DropdownMenuItem>
//               ) : (
//                 cryptoData.map((crypto) => (
//                   <DropdownMenuItem key={crypto.name}>
//                     <span className="font-bold text-teal-400 mr-2">
//                       {crypto.name}:
//                     </span>
//                     <span>
//                       {crypto.price.toLocaleString(undefined, {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 5,
//                       })}
//                     </span>
//                   </DropdownMenuItem>
//                 ))
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>


//       </div>
//     </nav>
//   );
// }







"use client";

import React, { useEffect} from "react";





export default function CryptoNavbar() {


  useEffect(() => {
    const tickerTapeScript = document.createElement("script");
    tickerTapeScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    tickerTapeScript.async = true;
    tickerTapeScript.innerHTML = JSON.stringify({
      symbols: [
        { description: "BTC", proName: "BINANCE:BTCUSD" },
        { description: "ETH", proName: "BINANCE:ETHUSD" },
        { description: "SOL", proName: "BINANCE:SOLUSD" },
        { description: "BNB", proName: "BINANCE:BNBUSD" },
        { description: "DOGE", proName: "BINANCE:DOGEUSD" },
        { description: "XRP", proName: "BINANCE:XRPUSD" },
        { description: "ADA", proName: "BINANCE:ADAUSD" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      largeChartUrl: "https://www.trobits.com",
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    const luncScript = document.createElement("script");
    luncScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    luncScript.async = true;
    luncScript.innerHTML = JSON.stringify({
      symbol: "CRYPTO:LUNCUSD",
      width: "100%",
      isTransparent: true,
      colorTheme: "dark",
      locale: "en",
      largeChartUrl: "https://www.trobits.com",
    });

    const tickerTapeContainer = document.querySelector(".tradingview-ticker-tape");
    const luncContainer = document.querySelector(".tradingview-lunc");

    if (tickerTapeContainer) {
      tickerTapeContainer.appendChild(tickerTapeScript);
    }

    if (luncContainer) {
      luncContainer.appendChild(luncScript);
    }

    // return () => {
    //   if (tickerTapeContainer) {
    //     tickerTapeContainer?.removeChild(tickerTapeScript);
    //   }
    //   if (luncContainer) {
    //     luncContainer?.removeChild(luncScript);
    //   }
    // };
  }, []);

  return (
    <nav className="w-full bg-[#00000075] text-white px-10">
      <div className="max-w-screen-3xl mx-auto flex items-center">
        <div className="tradingview-ticker-tape flex-shrink-0 w-full"></div>
      </div>
    </nav>
  );
}