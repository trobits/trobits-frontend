


"use client";

import React, { useEffect } from "react";

export default function CryptoNavbar() {
  useEffect(() => {
    // Check if the ticker tape script is already added
    if (!document.querySelector("#tickerTapeScript")) {
      const tickerTapeScript = document.createElement("script");
      tickerTapeScript.id = "tickerTapeScript"; // Set an ID to avoid duplicate additions
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

      const tickerTapeContainer = document.querySelector(".tradingview-ticker-tape");

      if (tickerTapeContainer) {
        tickerTapeContainer.appendChild(tickerTapeScript);
      }
    }

    // Check if the LUNC script is already added
    if (!document.querySelector("#luncScript")) {
      const luncScript = document.createElement("script");
      luncScript.id = "luncScript"; // Set an ID to avoid duplicate additions
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

      const luncContainer = document.querySelector(".tradingview-lunc");

      if (luncContainer) {
        luncContainer.appendChild(luncScript);
      }
    }

  }, []);

  return (
    <nav className="w-full bg-[#00000075] text-white px-10">
      <div className="max-w-screen-3xl mx-auto flex items-center">
        <div className="tradingview-ticker-tape flex-shrink-0 w-full"></div>
      </div>
    </nav>
  );
}
