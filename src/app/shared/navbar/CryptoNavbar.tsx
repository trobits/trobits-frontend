"use client";

import React, { useEffect, useRef } from "react";

export default function CryptoNavbar() {
  const tickerContainerRef = useRef(null);
  const widgetLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate loading
    if (widgetLoadedRef.current) return;

    const loadTradingViewWidget = () => {
      const container = tickerContainerRef.current;
      if (!container) return;

      // Clear any existing content
      container.innerHTML = '';

      // Create and configure the script
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { description: "BTC", proName: "BINANCE:BTCUSD" },
          { description: "ETH", proName: "BINANCE:ETHUSD" },
          { description: "SOL", proName: "BINANCE:SOLUSD" },
          { description: "BNB", proName: "BINANCE:BNBUSD" },
          { description: "DOGE", proName: "BINANCE:DOGEUSD" },
          { description: "XRP", proName: "BINANCE:XRPUSD" },
          { description: "ADA", proName: "BINANCE:ADAUSD" },
          { description: "SHIB", proName: "BINANCE:SHIBUSD" },
          { description: "LUNC", proName: "BINANCE:LUNCUSD" },
        ],
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: "adaptive",
        colorTheme: "dark",
        locale: "en",
      });

      // Add click handler to prevent navigation
      const handleClick = (e) => {
        if (e.target.tagName === "A") {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      container.addEventListener("click", handleClick, true);
      container.appendChild(script);
      widgetLoadedRef.current = true;

      return () => {
        container.removeEventListener("click", handleClick, true);
      };
    };

    const timeoutId = setTimeout(loadTradingViewWidget, 100);

    return () => {
      clearTimeout(timeoutId);
      widgetLoadedRef.current = false;
    };
  }, []);

  return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800/50">
        <div className="w-full ">
          <div className="min-w-full">
            <div className="w-full border border-blue-400/30 bg-gradient-to-br from-[#0c1220]/80 to-[#0a1a3a]/80 shadow-[0_0_20px_#00ffff15] p-[1px]">
              <div className="rounded-[11px] bg-[#0e152c]/90 backdrop-blur-sm p-1">
                <div
                    ref={tickerContainerRef}
                    className="tradingview-ticker-tape w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}