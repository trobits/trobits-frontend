"use client";

import React, { useEffect, useRef } from "react";

export default function CryptoNavbar() {
  const widgetRef = useRef(null);
  const widgetLoadedRef = useRef(false);

  useEffect(() => {
    if (widgetLoadedRef.current) return;

    const container = widgetRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Create widget container div
    const widgetInner = document.createElement("div");
    widgetInner.className = "tradingview-widget-container__widget";
    container.appendChild(widgetInner);

    // Add copyright
    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    copyright.innerHTML = `<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>`;
    container.appendChild(copyright);

    // Inject the script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "CRYPTO:BTCUSD", title: "BTC" },
        { proName: "CRYPTO:ETHUSD", title: "ETH" },
        { proName: "CRYPTO:XRPUSD", title: "XRP" },
        { proName: "CRYPTO:BNBUSD", title: "BNB" },
        { proName: "CRYPTO:SOLUSD", title: "SOL" },
        { proName: "CRYPTO:SHIBUSD", title: "SHIB" },
        { proName: "CRYPTO:PEPEUSD", title: "PEPE" },
        { proName: "CRYPTO:BONKUSD", title: "BONK" },
        { proName: "CRYPTO:FLOKIUSD", title: "FLOKI" },
        { proName: "CRYPTO:LUNCUSD", title: "LUNC" },
      ],
      colorTheme: "dark",
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      displayMode: "adaptive",
    });
    widgetInner.appendChild(script);

    widgetLoadedRef.current = true;

    return () => {
      widgetLoadedRef.current = false;
      container.innerHTML = '';
    };
  }, []);

  return (
      <div className="fixed  bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800/50">
        <div className="tradingview-widget-container w-full" ref={widgetRef} />
      </div>
  );
}
