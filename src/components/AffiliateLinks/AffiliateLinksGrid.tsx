"use client";

import React from "react";
import { affiliateLinks, AffiliateLink } from "@/components/Constant/affiliateLinks.constant";
import { useTrackAffiliateClickMutation } from "@/redux/features/api/affiliateApi";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-hot-toast";
import { ExternalLink, Gift } from "lucide-react";

interface AffiliateLinksGridProps {
  className?: string;
}

const AffiliateLinksGrid: React.FC<AffiliateLinksGridProps> = ({ className = "" }) => {
  const [trackClick] = useTrackAffiliateClickMutation();
  const user = useAppSelector((state) => state.auth.user);

  const handleAffiliateClick = async (affiliate: AffiliateLink) => {
    // Only track clicks for logged-in users
    if (!user?.id) {
      toast.error("Please login to access affiliate links and earn rewards!");
      return;
    }

    try {
      // Track the click in MongoDB
      await trackClick({
        userId: user.id,
        affiliateId: affiliate.id,
        affiliateName: affiliate.name,
        affiliateUrl: affiliate.url,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date(),
        sessionId: `${user.id}_${Date.now()}`,
      }).unwrap();

      // Show success message
      toast.success(`🎉 Click tracked! You may earn rewards from ${affiliate.name}`);

      // Open the affiliate link in a new tab
      window.open(affiliate.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to track affiliate click:", error);
      // Still open the link even if tracking fails
      window.open(affiliate.url, "_blank", "noopener,noreferrer");
      toast.error("Link opened, but tracking failed. Please try again.");
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Get Rewards Just for Shopping</h2>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          You buy. You benefit. We all win. We've partnered with top brands to bring you exclusive deals and cash-back opportunities.
        </p>
      </div>

      {/* Affiliate Links Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 max-w-7xl mx-auto">
        {affiliateLinks.map((affiliate) => (
          <div
            key={affiliate.id}
            onClick={() => handleAffiliateClick(affiliate)}
            className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600"
            style={{
              background: `linear-gradient(135deg, ${affiliate.color}15, transparent)`,
            }}
          >
            {/* Icon/Logo Placeholder */}
            <div 
              className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: affiliate.color }}
            >
              {affiliate.name.charAt(0)}
            </div>

            {/* Affiliate Name */}
            <h3 className="text-white text-sm font-semibold text-center mb-1 group-hover:text-gray-100">
              {affiliate.name}
            </h3>

            {/* Category */}
            <p className="text-gray-400 text-xs text-center mb-2">
              {affiliate.category}
            </p>

            {/* External Link Icon */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">
          💡 <span className="text-purple-400">Pro Tip:</span> Login to track your clicks and earn rewards from successful purchases!
        </p>
      </div>
    </div>
  );
};

export default AffiliateLinksGrid; 