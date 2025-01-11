"use client";
import React, { useEffect } from "react";

const LeaderBoard = () => {
  useEffect(() => {
    // Disable scrolling on the body
    document.body.style.overflow = "hidden";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: "dark",
      locale: "en",
      largeChartUrl: "https://trobits.com/leaderboard",
      isTransparent: true,
    });

    const widgetContainer = document?.querySelector(
      ".tradingview-widget-container__widget"
    );
    if (widgetContainer) {
      widgetContainer?.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center min-h-screen bg-[#00000000] fixed mt-5  left-0 w-full h-full">
      <div className="w-full max-w-[95rem] h-[85vh] p-5 bg-[#00000081] rounded-lg shadow-2xl">
        <div className="tradingview-widget-container h-full">
          <div className="tradingview-widget-container__widget w-full h-full rounded-lg overflow-hidden"></div>
          <div className="tradingview-widget-copyright text-center text-white mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;




// "use client";
// import React, { useEffect } from "react";

// const LeaderBoard = () => {

//   useEffect(() => {
//     // Disable scrolling on the body
//     document.body.style.overflow = "hidden";

//     // Load the CryptoHopper widget script
//     const script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = "https://www.cryptohopper.com/widgets/js/script";
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       // Re-enable scrolling on the body and cleanup script
//       document.body.style.overflow = "auto";
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div className="flex justify-center min-h-screen bg-[#00000000] fixed mt-5 left-0 w-full h-full">
//       <div className="w-full max-w-[95rem] h-[85vh] p-5 bg-[#00000081] rounded-lg shadow-2xl">
//         <div className="cryptohopper-web-widget-container h-full">
//           <div
//             className="cryptohopper-web-widget w-full h-full rounded-lg overflow-auto"
//             data-id="1"
//             data-price_format="2"
//             data-table_title="Crypto Market"
//             data-table_columns="rank,name,price_usd,market_cap_usd,available_supply,percent_change_24h"
//             data-table_style="dark"
//             data-realtime="on"
//             data-table_length="50"
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaderBoard;

