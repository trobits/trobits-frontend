"use client";
import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Flame } from "lucide-react";
import Link from "next/link";

// Types for better TypeScript support
interface CryptoData {
  coin: string;
  burns: number;
  burns30Day: number;
}

interface CoinColumnProps {
  cryptoData: CryptoData;
  index: number;
  isLast: boolean;
}

interface BurnData {
  [key: string]: {
    dailyBurn: number;
    lifetimeBurn: number;
  };
}

// Individual Coin Column Component
const   CoinColumn: React.FC<CoinColumnProps> = ({ cryptoData, index, isLast }) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const { coin, burns, burns30Day } = cryptoData;

  const formatNumber = (value: number | string): string => {
    if (!value) return "0";
    return Number(value).toLocaleString();
  };

  const getTradingViewSymbol = (coin: string): string => {
    const symbols: Record<string, string> = {
      'SHIB': 'CRYPTO:SHIBUSD',
      'LUNC': 'CRYPTO:LUNCUSD',
      'PEPE': 'CRYPTO:PEPEUSD',
      'FLOKI': 'CRYPTO:FLOKIUSD',
      'BONK': 'CRYPTO:BONKUSD'
    };
    return symbols[coin.toUpperCase()] || 'CRYPTO:BTCUSD';
  };

  useEffect(() => {
    if (widgetRef.current && !widgetRef.current.hasChildNodes()) {
      const script = document.createElement("script");
      script.src =
          "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: getTradingViewSymbol(coin),
        width: "100%",
        height: 60,
        isTransparent: true,
        colorTheme: "dark",
        locale: "en",
        showSymbolLogo: true,
      });
      widgetRef.current.appendChild(script);

    }

  }, [coin, index]);


  return (
      <>
        <div className="flex-1 p-4 hover:bg-gray-900/20 transition-all duration-300 group">
          {/* Price Widget */}
          <div className="mb-6">
            <div  className=" custom-scale bg-gray-900/40 border border-gray-800/50 rounded-xl p-3 !text-[10px]">
              <div  ref={widgetRef}  />
            </div>
          </div>

          {/* Burn Stats */}
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-700/20 border border-slate-600/30 rounded-xl p-4 space-y-4 hover:border-slate-500/40 transition-all duration-300">
            {/* 1 Day Burn */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">
                  1 Day Burn
                </span>
              </div>
              <div className="text-center text-lg font-bold text-white">
                {formatNumber(burns)}
              </div>
            </div>

            {/* Lifetime Burn */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">
                  Lifetime Burn
                </span>
              </div>
              <div className="text-center text-lg font-bold text-white">
                {formatNumber(burns30Day)}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <div className="space-y-2">
              <Link
                  href={`/${coin.toLowerCase()}`}
                  className="block w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold py-2 px-3 rounded-xl text-center transition-all duration-300 hover:scale-105 text-sm shadow-lg hover:shadow-slate-500/25"
              >
                Details
              </Link>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        {!isLast && <div className="w-px bg-gray-800/50 my-4" />}
      </>
  );
};

const CryptoData: React.FC = () => {
  const [burnData, setBurnData] = useState<BurnData>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBurnData = async (): Promise<void> => {
    // Replace with your actual API key and sheet ID
    const apiKey = "AIzaSyC_pYUok9r2PD5PmIYyWV4ZCvHy8y_Iug0";
    const sheetId = "10V4FpmrdcoQBCv-TXABSiNgqXx3dSj63qKqw06-3nFY";
    const range = "A:Z";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.values || data.values.length < 2) {
        console.error("No data found in sheet");
        return;
      }

      const headers: string[] = data.values[0];
      const rows: string[][] = data.values.slice(1).filter((row: string[]) => row.length > 1);

      // Find column indices for each coin
      const coinIndices: Record<string, number> = {
        'SHIB': headers.findIndex((h: string) => h.toUpperCase().includes('SHIB')),
        'LUNC': headers.findIndex((h: string) => h.toUpperCase().includes('LUNC')),
        'PEPE': headers.findIndex((h: string) => h.toUpperCase().includes('PEPE')),
        'FLOKI': headers.findIndex((h: string) => h.toUpperCase().includes('FLOKI')),
        'BONK': headers.findIndex((h: string) => h.toUpperCase().includes('BONK'))
      };

      const processedData: BurnData = {};

      // Process each coin
      Object.entries(coinIndices).forEach(([coin, colIndex]) => {
        if (colIndex === -1) {
          // If coin not found in sheet, set default values
          processedData[coin] = {
            dailyBurn: 0,
            lifetimeBurn: 0
          };
          return;
        }

        const coinData = rows
            .map((row: string[]) => parseInt(row[colIndex]?.replace(/,/g, "") || "0"))
            .filter((value: number) => value > 0);

        processedData[coin] = {
          dailyBurn: coinData.length > 0 ? coinData[coinData.length - 1] : 0,
          lifetimeBurn: coinData.reduce((sum: number, value: number) => sum + value, 0)
        };
      });

      setBurnData(processedData);
    } catch (error) {
      console.error("Failed to fetch burn data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBurnData();
  }, []);

  if (loading) {
    return (
        <section className="">
          <div className="flex justify-center items-center">
            <div className="">
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-slate-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-gray-400 text-lg">Loading crypto data...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
  }

  const coins: string[] = ['SHIB', 'LUNC', 'PEPE', 'FLOKI', 'BONK'];

  const cardData: CryptoData[] = coins.map((coin: string) => ({
    coin,
    burns: burnData[coin]?.dailyBurn || 0,
    burns30Day: burnData[coin]?.lifetimeBurn || 0
  }));

  return (
      <section className="">
        <div className="flex justify-center items-center">
          <div className="">
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex divide-x divide-gray-800/30">
                {cardData.map((card: CryptoData, index: number) => (
                    <CoinColumn
                        key={card.coin}
                        cryptoData={card}
                        index={index}
                        isLast={index === cardData.length - 1}
                    />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default CryptoData;