"use client";

import React, { useEffect, useRef } from "react";

// ✅ Ad Banner using <div> to avoid ref typing issues
function AdBannerF() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://cdn.bmcdn6.com/js/67c24fd7aa72d3d47fc083ad.js?v=" +
      new Date().getTime();

    if (adRef.current) {
      adRef.current.innerHTML = "";
      adRef.current.appendChild(script);
    }

    return () => {
      if (adRef.current) adRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div
        ref={adRef}
        className="67c24fd7aa72d3d47fc083ad"
        style={{ display: "block", width: "300px", height: "250px" }}
      />
    </div>
  );
}

const LuncHeader = () => (
  <h1 className="text-5xl font-extrabold mb-4 text-center text-blue-400">
    Terra Classic
  </h1>
);

const PriceGraph = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "CRYPTO:LUNCUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    if (chartRef.current) {
      chartRef.current.innerHTML = "";
      chartRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      className="tradingview-widget-container border border-blue-500 rounded"
      ref={chartRef}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      />
    </div>
  );
};

const SymbolInfo = () => {
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "CRYPTO:LUNCUSD",
      width: "100%",
      locale: "en",
      colorTheme: "light",
      isTransparent: false,
    });

    if (infoRef.current) {
      infoRef.current.innerHTML = "";
      infoRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      className="w-full h-[450px] bg-white rounded shadow border border-blue-400"
      ref={infoRef}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
};

const ArticleFeed = () => {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const feedScript = document.createElement("script");
    feedScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    feedScript.async = true;
    feedScript.innerHTML = JSON.stringify({
      feedMode: "all_symbols",
      isTransparent: false,
      displayMode: "regular",
      width: "100%",
      height: 550,
      colorTheme: "light",
      locale: "en",
      filter: "terra-luna",
    });

    if (feedRef.current) {
      feedRef.current.innerHTML = "";
      feedRef.current.appendChild(feedScript);
    }
  }, []);

  return (
    <div className="w-full h-[550px] bg-white rounded shadow border border-blue-400">
      <div
        className="tradingview-widget-container"
        ref={feedRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

const CryptoCalendar = () => {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.cryptohopper.com/widgets/js/script";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="rounded shadow p-2 border border-blue-500"
      ref={calendarRef}
      style={{ backgroundColor: "#f0f8ff", color: "#003366" }}
    >
      <div
        className="cryptohopper-web-widget"
        data-id="6"
        data-text_color="#003366"
        data-background_color="#f0f8ff"
        data-coins="terra-luna"
        data-numcoins="1000"
      />
    </div>
  );
};

export default function Page() {
  return (
    <div className="p-4 space-y-4 bg-[#00000077] text-white min-h-screen">
      <LuncHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SymbolInfo />
        <PriceGraph />
      </div>

      <AdBannerF />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 flex flex-col space-y-4">
          <CryptoCalendar />
        </div>
        <div className="md:col-span-2">
          <ArticleFeed />
        </div>
      </div>
    </div>
  );
}

