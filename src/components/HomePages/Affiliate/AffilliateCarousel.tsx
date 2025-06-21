import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PrintrendyCard,
  GeminiCard,
  UrsimeCard,
} from "@/components/AffiliateLinks";

const CardCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pauseScroll, setPauseScroll] = useState(false);
  const hoverLeftRef = useRef(false);
  const hoverRightRef = useRef(false);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseScroll && scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [pauseScroll]);

  // Manual hover scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        if (hoverLeftRef.current) {
          scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        } else if (hoverRightRef.current) {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-10">
      {/* Left Scroll Button */}
      <button
        onMouseEnter={() => {
          setPauseScroll(true);
          hoverLeftRef.current = true;
        }}
        onMouseLeave={() => {
          setPauseScroll(false);
          hoverLeftRef.current = false;
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-gray-800/60 backdrop-blur-md border border-gray-700 hover:bg-gray-700/80 hover:scale-110 transition"
      >
        <ChevronLeft className="text-white w-5 h-5" />
      </button>

      {/* Right Scroll Button */}
      <button
        onMouseEnter={() => {
          setPauseScroll(true);
          hoverRightRef.current = true;
        }}
        onMouseLeave={() => {
          setPauseScroll(false);
          hoverRightRef.current = false;
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-gray-800/60 backdrop-blur-md border border-gray-700 hover:bg-gray-700/80 hover:scale-110 transition"
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar scroll-smooth flex gap-6 px-10 py-4"
        onMouseEnter={() => setPauseScroll(true)}
        onMouseLeave={() => setPauseScroll(false)}
      >
        {/* Repeat your cards */}
        <div className="flex-shrink-0 w-72">
          <GeminiCard />
        </div>
        <div className="flex-shrink-0 w-72">
          <UrsimeCard />
        </div>
        <div className="flex-shrink-0 w-72">
          <PrintrendyCard />
        </div>
        <div className="flex-shrink-0 w-72">
          <GeminiCard />
        </div>
        <div className="flex-shrink-0 w-72">
          <UrsimeCard />
        </div>
        <div className="flex-shrink-0 w-72">
          <PrintrendyCard />
        </div>
        <div className="flex-shrink-0 w-72">
          <GeminiCard />
        </div>
        <div className="flex-shrink-0 w-72">
          <UrsimeCard />
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
