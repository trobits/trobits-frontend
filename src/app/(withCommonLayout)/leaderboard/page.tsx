"use client";
import { setPaths } from "@/redux/features/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const LeaderBoard = () => {
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

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
    // Cleanup function to restore the original overflow style
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  
  if (window) {
    if (previousPath !== "/leaderboard" && currentPath === "/leaderboard") {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }
  return (
    <div className="container mx-auto min-h-screen px-[5vw] 3xl:px-[1vw] pt-[16vh] 2xl:pt-[14vh]">
      <div className="w-full h-[100vh] p-5 bg-[#00000081] rounded-lg shadow-2xl">
        <div className="tradingview-widget-container h-full">
          <div className="tradingview-widget-container__widget w-full h-full rounded-lg overflow-hidden"></div>
          <div className="tradingview-widget-copyright text-center text-white mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;


