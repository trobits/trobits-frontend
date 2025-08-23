import { NordVPNCard, StockMarketGuidesCard, FanaticsCard, TesterupCard, GeminiCard, SocialCatfishCard, TikTokCard } from "@/components/AffiliateLinks";

const AffiliateLinksBar = () => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-4 px-2 py-3 bg-gray-900/80 border-t border-b border-gray-800 shadow-md overflow-x-auto">
      <div className="flex-1 max-w-xs min-w-[200px] h-40">
        <StockMarketGuidesCard compact />
      </div>
      <div className="flex-1 max-w-xs min-w-[200px] h-40">
        <SocialCatfishCard />
      </div>
      <div className="flex-1 max-w-xs min-w-[200px] h-40">
        <GeminiCard compact />
      </div>
       <div className="flex-1 max-w-xs min-w-[200px] h-40">
        <FanaticsCard compact />
      </div>
      
      
    </div>
  );
};

export default AffiliateLinksBar;
