"use client";
import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Flame } from "lucide-react";
import Link from "next/link";

// Individual Coin Column Component
const CoinColumn = ({ cryptoData, index, isLast }) => {
  const widgetRef = useRef(null);
  const { coin, burns, burns30Day } = cryptoData;

  const formatNumber = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString();
  };

  const getTradingViewSymbol = (coin) => {
    const symbols = {
      'SHIB': 'CRYPTO:SHIBUSD',
      'LUNC': 'CRYPTO:LUNCUSD',
      'PEPE': 'CRYPTO:PEPEUSD',
      'FLOKI': 'CRYPTO:FLOKIUSD',
      'BONK': 'CRYPTO:BONKUSD'
    };
    return symbols[coin.toUpperCase()] || 'CRYPTO:BTCUSD';
  };

  const getCoinStyles = (coin) => {
    const styles = {
      'SHIB': {
        cardBg: 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20',
        flameColor: 'text-orange-400',
        flameBg: 'text-orange-300',
        trendColor: 'text-red-400',
        trendBg: 'text-red-300',
        buttonBg: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
      },
      'LUNC': {
        cardBg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20',
        flameColor: 'text-blue-400',
        flameBg: 'text-blue-300',
        trendColor: 'text-cyan-400',
        trendBg: 'text-cyan-300',
        buttonBg: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
      },
      'PEPE': {
        cardBg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20',
        flameColor: 'text-green-400',
        flameBg: 'text-green-300',
        trendColor: 'text-emerald-400',
        trendBg: 'text-emerald-300',
        buttonBg: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
      },
      'FLOKI': {
        cardBg: 'bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20',
        flameColor: 'text-yellow-400',
        flameBg: 'text-yellow-300',
        trendColor: 'text-amber-400',
        trendBg: 'text-amber-300',
        buttonBg: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600'
      },
      'BONK': {
        cardBg: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20',
        flameColor: 'text-pink-400',
        flameBg: 'text-pink-300',
        trendColor: 'text-rose-400',
        trendBg: 'text-rose-300',
        buttonBg: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
      }
    };
    return styles[coin.toUpperCase()] || styles['SHIB'];
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
        fontSize: "10",
      });
      widgetRef.current.appendChild(script);
    }
  }, [coin, index]);

  const styles = getCoinStyles(coin);

  return (
      <>
        <div className="flex-1 p-4 hover:bg-gray-900/20 transition-all duration-300 group">
          {/* Price Widget */}
          <div className="mb-6">
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-3">
              <div ref={widgetRef} className="w-full h-[90px]" />
            </div>
          </div>

          {/* Burn Stats */}
          <div className={`${styles.cardBg} rounded-xl p-4 space-y-4`}>
            {/* 1 Day Burn */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flame className={`w-4 h-4 ${styles.flameColor}`} />
                <span className={`text-sm font-medium ${styles.flameBg}`}>
                1 Day Burn
              </span>
              </div>
              <div className="text-center text-lg font-bold text-white">
                {formatNumber(burns) || "0"}
              </div>
            </div>

            {/* Lifetime Burn */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className={`w-4 h-4 ${styles.trendColor}`} />
                <span className={`text-sm font-medium ${styles.trendBg}`}>
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
            <div className="space-y-2">
              <Link
                  href={`/${coin.toLowerCase()}`}
                  className={`block w-full ${styles.buttonBg} text-white font-semibold py-2 px-3 rounded-xl text-center transition-all duration-300 hover:scale-105 text-sm`}
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

export default function CryptoData() {
  const [burnData, setBurnData] = useState({});
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const fetchBurnData = async () => {
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

      const headers = data.values[0];
      const rows = data.values.slice(1).filter((row) => row.length > 1);

      // Find column indices for each coin
      const coinIndices = {
        'SHIB': headers.findIndex(h => h.toUpperCase().includes('SHIB')),
        'LUNC': headers.findIndex(h => h.toUpperCase().includes('LUNC')),
        'PEPE': headers.findIndex(h => h.toUpperCase().includes('PEPE')),
        'FLOKI': headers.findIndex(h => h.toUpperCase().includes('FLOKI')),
        'BONK': headers.findIndex(h => h.toUpperCase().includes('BONK'))
      };

      const processedData = {};

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
            .map(row => parseInt(row[colIndex]?.replace(/,/g, "") || "0"))
            .filter(value => value > 0);

        processedData[coin] = {
          dailyBurn: coinData.length > 0 ? coinData[coinData.length - 1] : 0,
          lifetimeBurn: coinData.reduce((sum, value) => sum + value, 0)
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
        <section className="container mx-auto mt-28 px-0">
          <div className="flex justify-center items-center">
            <div className="w-full max-w-7xl mx-auto px-6">
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-gray-400 text-lg">Loading crypto data...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
  }

  const coins = ['SHIB', 'LUNC', 'PEPE', 'FLOKI', 'BONK'];

  const cardData = coins.map(coin => ({
    coin,
    burns: burnData[coin]?.dailyBurn || 0,
    burns30Day: burnData[coin]?.lifetimeBurn || 0
  }));

  return (
      <section className="container mx-auto mt-28 px-0">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl overflow-hidden">
              <div className="flex divide-x divide-gray-800/30">
                {cardData.map((card, index) => (
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
}