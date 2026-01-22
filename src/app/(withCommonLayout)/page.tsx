"use client";
import CryptoData from "@/components/HomePages/CryptoData";
import React, { useEffect, useMemo, useState } from "react";
import CryptoNavbar from "../shared/navbar/CryptoNavbar";
import Footer from "../shared/Footer/Footer";
import SubPage from "./articles/SubPage";
import DOMPurify from "dompurify";

import HeroSection from "@/components/HomePages/HeroSection";
import {
  FanaticsCard,
  RemitlyCard,
  TikTokCard,
  NexoCard,
  TesterupCard,
} from "@/components/AffiliateLinks";

import CardCarousel from "@/components/HomePages/Affiliate/AffilliateCarousel";

function HomepageArticleSection() {
  const [article, setArticle] = useState<{ title: string; body: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/homepage-article`)
      .then(async (res) => {
        if (!res.ok) throw new Error("No article found");
        return res.json();
      })
      .then((data) => {
        setArticle({ title: data.title, body: data.body });
        setLoading(false);
      })
      .catch(() => {
        setError("No homepage article found.");
        setLoading(false);
      });
  }, []);

  const sanitizedHtml = useMemo(() => {
    const html = article?.body || "";

    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "blockquote",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "hr",
        "a",
        "img",
        "span",
        "code",
        "pre",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "style"],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/)/i,
    });
  }, [article?.body]);

  if (loading) {
    return (
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 sm:p-6">
        <div className="text-gray-400">Loading homepage article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 sm:p-6">
        <div className="text-gray-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 sm:p-6 max-h-[50vh] overflow-auto">
      <div className="space-y-4">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {article.title}
        </h2>

        {/* Body: render sanitized HTML */}
        <div
          className="
            text-gray-200 text-sm sm:text-base
            leading-relaxed
            space-y-3
            [&_p]:mb-3
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-5 [&_h1]:mb-3
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-5 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
            [&_li]:my-1
            [&_a]:text-teal-300 [&_a:hover]:text-teal-200 [&_a]:underline
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:text-gray-300 [&_blockquote]:my-4

            /* ✅ FIX: don’t force images to full width */
            [&_img]:block
            [&_img]:mx-auto
            [&_img]:max-w-full
            [&_img]:max-w-[720px]
            [&_img]:max-h-[420px]
            [&_img]:object-contain
            [&_img]:rounded-2xl
            [&_img]:border
            [&_img]:border-gray-700/60
            [&_img]:my-4

            [&_pre]:bg-gray-900 [&_pre]:border [&_pre]:border-gray-700 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-auto [&_pre]:my-4
            [&_code]:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
          "
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    </div>
  );
}

const Profile = () => {
  return (
    <div className="container mx-auto min-h-screen px-4 sm:px-6 lg:px-[5vw] 3xl:px-[1vw] space-y-12 sm:space-y-16 lg:space-y-20">
      {/* Navigation */}
      <CryptoNavbar />

      {/* Hero Section - with reduced top spacing after navbar */}
      <div className="pt-2 sm:pt-4 lg:pt-6 flex items-center justify-center">
        <HeroSection />
      </div>

      {/* Crypto Data Section */}
      <CryptoData />

      {/* Market Card Carousel Section - Increased spacing above and below */}
      <div className="flex items-center justify-center py-10">
        <CardCarousel />
      </div>

      {/* News Carousel Section - Full Width */}
      <div className="w-full">
        <SubPage simpleHeader />
      </div>

      {/* Article + Vertical Affiliate Section - Responsive Layout */}
      <div className="flex flex-col lg:flex-row w-full gap-5 justify-center">
        {/* Article Content - Main content area */}
        <div className="w-full lg:w-[100%] xl:w-[90%] 2xl:w-[72%] flex flex-col gap-5">
          {/* Mobile: Show GeminiCard here */}
          <div className="block lg:hidden">
            <TesterupCard />
          </div>

          {/* Article Content */}
          <HomepageArticleSection />
        </div>

        {/* Vertical Affiliate cards - Hidden on mobile, shown on desktop */}
        <div className="hidden xl:flex lg:w-[12%] flex-col gap-4 scale-95 max-h-[530px]">
          <TikTokCard />
          <NexoCard />
        </div>
      </div>

      {/* Mobile: Show affiliate cards in horizontal scroll at bottom */}
      <div className="block lg:hidden">
        <h3 className="text-white text-lg font-semibold mb-4">Recommended Services</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex-shrink-0 w-64">
            <RemitlyCard />
          </div>
          <div className="flex-shrink-0 w-64">
            <TikTokCard />
          </div>
          <div className="flex-shrink-0 w-64">
            <FanaticsCard />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
