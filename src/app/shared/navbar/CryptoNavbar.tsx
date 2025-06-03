"use client";

import React, { useEffect, useRef } from "react";

export default function CryptoNavbar() {
  const tickerInitialized = useRef(false);
  const luncInitialized = useRef(false);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (e.target.tagName === "A") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (!tickerInitialized.current) {
      const tickerTapeScript = document.createElement("script");
      tickerTapeScript.id = "tickerTapeScript";
      tickerTapeScript.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
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
        displayMode: "adaptive",
        colorTheme: "dark",
        locale: "en",
      });

      const tickerTapeContainer = document.querySelector(
        ".tradingview-ticker-tape"
      );
      if (tickerTapeContainer) {
        tickerTapeContainer.appendChild(tickerTapeScript);
        tickerInitialized.current = true;
        tickerTapeContainer.addEventListener("click", handleClick, true);
      }
    }

    if (!luncInitialized.current) {
      const luncScript = document.createElement("script");
      luncScript.id = "luncScript";
      luncScript.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
      luncScript.async = true;
      luncScript.innerHTML = JSON.stringify({
        symbol: "CRYPTO:LUNCUSD",
        width: "100%",
        isTransparent: true,
        colorTheme: "dark",
        locale: "en",
      });

      const luncContainer = document.querySelector(".tradingview-lunc");
      if (luncContainer) {
        luncContainer.appendChild(luncScript);
        luncInitialized.current = true;
      }
    }

    return () => {
      const tickerTapeContainer = document.querySelector(
        ".tradingview-ticker-tape"
      );
      if (tickerTapeContainer) {
        tickerTapeContainer.removeEventListener("click", handleClick, true);
      }
      tickerInitialized.current = false;
      luncInitialized.current = false;
    };
  }, []);

  return (
    <nav className="w-full px-10 mt-24 z-10 relative animate-slidefade">
      <div className="max-w-screen-3xl mx-auto items-center">
        <div className="w-full flex-shrink-0 rounded-2xl border border-blue-400 bg-gradient-to-br from-[#0c1220] to-[#0a1a3a] shadow-[0_0_30px_#00ffff33] p-[2px]">
          <div className="rounded-[15px] bg-[#0e152c] p-2">
            <div className="tradingview-ticker-tape w-full"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
