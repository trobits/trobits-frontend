// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import * as React from "react";
// import { ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useState,useEffect } from "react";

// const cryptoDummyData = [
//   { name: "BTC", price: 68456.2 },
//   { name: "ETH", price: 2515.12 },
//   { name: "BNB", price: 592.1 },
//   { name: "SOL", price: 176.94 },
//   { name: "XRP", price: 0.51671 },

// ];

// export default function CryptoNavbar() {
//   const [selectedOption, setSelectedOption] = useState("Price");


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
//               <DropdownMenuItem onClick={() => setSelectedOption("Price")}>
//                 Price
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => setSelectedOption("Recently Added")}
//               >
//                 Recently Added
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSelectedOption("Trending")}>
//                 Trending
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => setSelectedOption("Most Visited")}
//               >
//                 Most Visited
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Crypto Prices for larger screens */}
//         <div className="hidden md:grid md:grid-cols-5 col-span-5">
//           {cryptoDummyData.map((crypto) => (
//             <div
//               key={crypto.name}
//               className="flex items-center justify-between px-4 py-2 border-r border-gray-700 last:border-r-0"
//             >
//               <span className="font-bold text-teal-400">{crypto.name}</span>
//               <span>
//                 {crypto.price.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 5,
//                 })}
//               </span>
//             </div>
//           ))}
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
//               {cryptoDummyData.map((crypto) => (
//                 <DropdownMenuItem key={crypto.name}>
//                   <span className="font-bold text-teal-400 mr-2">
//                     {crypto.name}:
//                   </span>
//                   <span>
//                     {crypto.price.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 5,
//                     })}
//                   </span>
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </nav>
//   );
// }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import * as React from "react";
// import { ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useState, useEffect } from "react";

// // Replace this with a fetch function that retrieves data from the API
// const fetchData = async (option: string) => {
//   // Simulate API data fetching logic for Cryptohopper or replace with actual API call
//   const dataMap: Record<string, { name: string; price: number }[]> = {
//     Price: [
//       { name: "BTC", price: 68456.2 },
//       { name: "ETH", price: 2515.12 },
//       { name: "BNB", price: 592.1 },
//       { name: "SOL", price: 176.94 },
//       { name: "XRP", price: 0.51671 },
//     ],
//     "Recently Added": [
//       { name: "DOGE", price: 0.25 },
//       { name: "ADA", price: 2.5 },
//       { name: "DOT", price: 35 },
//       { name: "UNI", price: 23 },
//       { name: "LTC", price: 190 },
//     ],
//     Trending: [
//       { name: "SHIB", price: 0.0000765 },
//       { name: "MATIC", price: 1.4 },
//       { name: "LINK", price: 24 },
//       { name: "AAVE", price: 350 },
//       { name: "SUSHI", price: 14 },
//     ],
//     "Most Visited": [
//       { name: "BTC", price: 65000 },
//       { name: "ETH", price: 2600 },
//       { name: "BNB", price: 600 },
//       { name: "ADA", price: 2.8 },
//       { name: "SOL", price: 180 },
//     ],
//   };
//   return dataMap[ option ] || dataMap[ "Price" ];
// };

// export default function CryptoNavbar() {
//   const [ selectedOption, setSelectedOption ] = useState("Price");
//   const [ cryptoData, setCryptoData ] = useState<{ name: string; price: number }[]>([]);

//   // Fetch data whenever the selectedOption changes
//   useEffect(() => {
//     const loadCryptoData = async () => {
//       const data = await fetchData(selectedOption);
//       setCryptoData(data);
//     };
//     loadCryptoData();
//   }, [ selectedOption ]);

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
//               <DropdownMenuItem onClick={() => setSelectedOption("Price")}>
//                 Price
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSelectedOption("Recently Added")}>
//                 Recently Added
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSelectedOption("Trending")}>
//                 Trending
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSelectedOption("Most Visited")}>
//                 Most Visited
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Crypto Prices for larger screens */}
//         <div className="hidden md:grid md:grid-cols-5 col-span-5">
//           {cryptoData.map((crypto) => (
//             <div
//               key={crypto.name}
//               className="flex items-center justify-between px-4 py-2 border-r border-gray-700 last:border-r-0"
//             >
//               <span className="font-bold text-teal-400">{crypto.name}</span>
//               <span>
//                 {crypto.price.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 5,
//                 })}
//               </span>
//             </div>
//           ))}
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
//               {cryptoData.map((crypto) => (
//                 <DropdownMenuItem key={crypto.name}>
//                   <span className="font-bold text-teal-400 mr-2">{crypto.name}:</span>
//                   <span>
//                     {crypto.price.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 5,
//                     })}
//                   </span>
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </nav>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CryptoData {
  name: string;
  price: number;
}

// Map of endpoint URLs by category
const endpointMap: Record<string, string> = {
  Price: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false",
  Trending: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=5&page=1&sparkline=false",
  "Recently Added": "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_asc&per_page=5&page=1&sparkline=false",
  "Most Visited": "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false",
};

export default function CryptoNavbar() {
  const [ selectedOption, setSelectedOption ] = useState<keyof typeof endpointMap>("Price");
  const [ cryptoData, setCryptoData ] = useState<CryptoData[]>([]);

  // Fetch crypto data based on selected option
  useEffect(() => {
    const loadCryptoData = async () => {
      try {
        const response = await axios.get(endpointMap[ selectedOption ]);
        const formattedData: CryptoData[] = response.data.slice(0, 5).map((item: any) => ({
          name: item?.symbol?.toUpperCase() ?? "N/A",
          price: item?.current_price ?? 0,
        }));
        setCryptoData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCryptoData([]); // Set empty data if an error occurs
      }
    };
    loadCryptoData();
  }, [ selectedOption ]);

  return (
    <nav className="w-full bg-gray-900 text-white px-10">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-6 items-center">
        {/* Dropdown Menu for sorting options */}
        <div className="col-span-1 border-r border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-white hover:bg-gray-800 border px-4 py-2">
                {selectedOption} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-white">
              {Object.keys(endpointMap).map((option) => (
                <DropdownMenuItem key={option} onClick={() => setSelectedOption(option as keyof typeof endpointMap)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Display Crypto Prices for larger screens */}
        <div className="hidden md:grid md:grid-cols-5 col-span-5">
          {cryptoData.map((crypto) => (
            <div key={crypto.name} className="flex items-center justify-between px-4 py-2 border-r border-gray-700 last:border-r-0">
              <span className="font-bold text-teal-400">{crypto.name}</span>
              <span>
                {crypto.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 5,
                })}
              </span>
            </div>
          ))}
        </div>

        {/* Dropdown for crypto prices on small screens */}
        <div className="md:hidden col-span-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-white hover:bg-gray-800 px-4 py-2">
                Crypto Prices <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-white">
              {cryptoData.map((crypto) => (
                <DropdownMenuItem key={crypto.name}>
                  <span className="font-bold text-teal-400 mr-2">{crypto.name}:</span>
                  <span>
                    {crypto.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 5,
                    })}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
