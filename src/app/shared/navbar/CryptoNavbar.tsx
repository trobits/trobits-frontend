/* eslint-disable @typescript-eslint/no-explicit-any */



// "use client";

// import React, { useEffect } from "react";

// export default function CryptoNavbar() {
//   useEffect(() => {
//     // Check if the ticker tape script is already added
//     if (!document.querySelector("#tickerTapeScript")) {
//       const tickerTapeScript = document.createElement("script");
//       tickerTapeScript.id = "tickerTapeScript"; // Set an ID to avoid duplicate additions
//       tickerTapeScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
//       tickerTapeScript.async = true;
//       tickerTapeScript.innerHTML = JSON.stringify({
//         symbols: [
//           { description: "BTC", proName: "BINANCE:BTCUSD" },
//           { description: "ETH", proName: "BINANCE:ETHUSD" },
//           { description: "SOL", proName: "BINANCE:SOLUSD" },
//           { description: "BNB", proName: "BINANCE:BNBUSD" },
//           { description: "DOGE", proName: "BINANCE:DOGEUSD" },
//           { description: "XRP", proName: "BINANCE:XRPUSD" },
//           { description: "ADA", proName: "BINANCE:ADAUSD" },
//         ],
//         showSymbolLogo: true,
//         isTransparent: true,
//         largeChartUrl: "https://www.trobits.com",
//         displayMode: "adaptive",
//         colorTheme: "dark",
//         locale: "en",
//       });

//       const tickerTapeContainer = document.querySelector(".tradingview-ticker-tape");

//       if (tickerTapeContainer) {
//         tickerTapeContainer.appendChild(tickerTapeScript);
//       }
//     }

//     // Check if the LUNC script is already added
//     if (!document.querySelector("#luncScript")) {
//       const luncScript = document.createElement("script");
//       luncScript.id = "luncScript"; // Set an ID to avoid duplicate additions
//       luncScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
//       luncScript.async = true;
//       luncScript.innerHTML = JSON.stringify({
//         symbol: "CRYPTO:LUNCUSD",
//         width: "100%",
//         isTransparent: true,
//         colorTheme: "dark",
//         locale: "en",
//         largeChartUrl: "https://www.trobits.com/",
//       });

//       const luncContainer = document.querySelector(".tradingview-lunc");

//       if (luncContainer) {
//         luncContainer.appendChild(luncScript);
//       }
//     }

//   }, []);

//   return (
//     <nav className="w-full bg-[#00000075] text-white px-10">
//       <div className="max-w-screen-3xl mx-auto flex items-center">
//         <div className="tradingview-ticker-tape flex-shrink-0 w-full"></div>
//       </div>
//     </nav>
//   );
// }









"use client";

import React, { useEffect, useRef } from "react";

export default function CryptoNavbar() {
  const tickerInitialized = useRef(false);
  const luncInitialized = useRef(false);

  useEffect(() => {
    // Define the event handler function
    const handleClick = (e:any) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (!tickerInitialized.current) {
      const tickerTapeScript = document.createElement("script");
      tickerTapeScript.id = "tickerTapeScript";
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
        displayMode: "adaptive",
        colorTheme: "dark",
        locale: "en",
      });

      const tickerTapeContainer = document.querySelector(".tradingview-ticker-tape");
      if (tickerTapeContainer) {
        tickerTapeContainer.appendChild(tickerTapeScript);
        tickerInitialized.current = true;

        // Add event listener
        tickerTapeContainer.addEventListener('click', handleClick, true);
      }
    }

    if (!luncInitialized.current) {
      const luncScript = document.createElement("script");
      luncScript.id = "luncScript";
      luncScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
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

    // Cleanup function
    return () => {
      const tickerTapeContainer = document.querySelector(".tradingview-ticker-tape");
      if (tickerTapeContainer) {
        // Remove event listener with the same function reference
        tickerTapeContainer.removeEventListener('click', handleClick, true);
      }
      tickerInitialized.current = false;
      luncInitialized.current = false;
    };
  }, []);

  return (
    <nav className="w-full bg-[#00000075] text-white px-10">
      <div className="max-w-screen-3xl mx-auto flex items-center">
        <div className="tradingview-ticker-tape flex-shrink-0 w-full"></div>
      </div>
    </nav>
  );
}