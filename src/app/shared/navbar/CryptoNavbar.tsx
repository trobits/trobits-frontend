"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const cryptoData = [
  { name: "BTC", price: 68456.2 },
  { name: "ETH", price: 2515.12 },
  { name: "BNB", price: 592.1 },
  { name: "SOL", price: 176.94 },
  { name: "XRP", price: 0.51671 },
  
];

export default function CryptoNavbar() {
  const [selectedOption, setSelectedOption] = React.useState("Price");

  return (
    <nav className="w-full bg-gray-900 text-white px-10">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-6 items-center">
        {/* Dropdown Menu for sorting options */}
        <div className="col-span-1 border-r border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:bg-gray-800 border px-4 py-2"
              >
                {selectedOption} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-white">
              <DropdownMenuItem onClick={() => setSelectedOption("Price")}>
                Price
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedOption("Recently Added")}
              >
                Recently Added
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedOption("Trending")}>
                Trending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedOption("Most Visited")}
              >
                Most Visited
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Crypto Prices for larger screens */}
        <div className="hidden md:grid md:grid-cols-5 col-span-5">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.name}
              className="flex items-center justify-between px-4 py-2 border-r border-gray-700 last:border-r-0"
            >
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
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:bg-gray-800 px-4 py-2"
              >
                Crypto Prices <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-white">
              {cryptoData.map((crypto) => (
                <DropdownMenuItem key={crypto.name}>
                  <span className="font-bold text-teal-400 mr-2">
                    {crypto.name}:
                  </span>
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
