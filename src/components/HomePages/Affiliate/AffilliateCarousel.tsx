import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PrintrendyCard,
  GeminiCard,
  UrsimeCard,
  NordVPNCard,
  PreplyCard,
  FanaticsCard,
  RemitlyCard,
  StockMarketGuidesCard,
  TicketNetworkCard,
  CPRCareCard,
  GolfPartnerCard,
  Wwwm8xcomCard,

} from "@/components/AffiliateLinks";

const CardCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pauseScroll, setPauseScroll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hoverLeftRef = useRef(false);
  const hoverRightRef = useRef(false);

  // Card data for easier management
  const cards = [
    { id: 1, component: <GeminiCard /> },
    { id: 2, component: <UrsimeCard /> },
    { id: 3, component: <PrintrendyCard /> },
    { id: 4, component: <NordVPNCard /> },
    { id: 5, component: <PreplyCard /> },
    { id: 6, component: <FanaticsCard /> },
    { id: 7, component: <RemitlyCard /> },
    { id: 8, component: <StockMarketGuidesCard /> },
    { id: 9, component: <TicketNetworkCard /> },
    { id: 10, component: <CPRCareCard /> },
    { id: 11, component: <GolfPartnerCard /> },
    { id: 12, component: <Wwwm8xcomCard /> }
  ];

  const totalCards = cards.length;

  // Calculate scroll distance (33.333% of container width)
  const getScrollDistance = (): number => {
    if (scrollRef.current) {
      return scrollRef.current.clientWidth / 3;
    }
    return 0;
  };

  // Scroll to specific card
  const scrollToCard = (index: number): void => {
    if (scrollRef.current) {
      const scrollDistance = getScrollDistance() * index;
      scrollRef.current.scrollTo({ left: scrollDistance, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  // Move to next card
  const moveNext = (): void => {
    const nextIndex = currentIndex >= totalCards - 3 ? 0 : currentIndex + 1;
    scrollToCard(nextIndex);
  };

  // Move to previous card
  const movePrev = (): void => {
    const prevIndex = currentIndex <= 0 ? totalCards - 3 : currentIndex - 1;
    scrollToCard(prevIndex);
  };

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseScroll) {
        moveNext();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [pauseScroll, currentIndex]);

  // Manual hover scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (hoverLeftRef.current) {
        movePrev();
      } else if (hoverRightRef.current) {
        moveNext();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle scroll event to update current index
  const handleScroll = (): void => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = getScrollDistance();
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="relative">
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
        onClick={movePrev}
        className="absolute left-2 top-[40%] -translate-y-1/2 z-20 p-2 rounded-full bg-gray-800/60 backdrop-blur-md border border-gray-700 hover:bg-gray-700/80 hover:scale-110 transition-all duration-200"
        aria-label="Previous card"
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
        onClick={moveNext}
        className="absolute right-2 top-[40%] -translate-y-1/2 z-20 p-2 rounded-full bg-gray-800/60 backdrop-blur-md border border-gray-700 hover:bg-gray-700/80 hover:scale-110 transition-all duration-200"
        aria-label="Next card"
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>

      {/* Scrollable Cards Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar scroll-smooth flex"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseEnter={() => setPauseScroll(true)}
        onMouseLeave={() => setPauseScroll(false)}
        onScroll={handleScroll}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="flex-shrink-0"
            style={{
              width: 'calc(33.333% - 1rem)',
              marginLeft: index === 0 ? '2.5rem' : '0.5rem',
              marginRight: index === cards.length - 1 ? '2.5rem' : '0.5rem',
              scrollSnapAlign: 'start'
            }}
          >
            <div className="h-full">
              {card.component}
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalCards - 2 }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              currentIndex === index
                ? 'bg-white scale-125'
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;