/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import DummyBlogImage from "@/assets/dummy-blog.png";
import { Article } from "@/app/(withCommonLayout)/articles/SubPage";

interface NewsCardProps {
  articleData: Article;
  viewMode?: "grid" | "list";
}

const NewsCard = ({ articleData, viewMode = "grid" }: NewsCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to sanitize and limit content
  const getSanitizedContent = (htmlContent: string, limit: number) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;
    const textContent = tempElement.textContent || tempElement.innerText || "";
    return textContent.length > limit
      ? `${textContent.slice(0, limit)}...`
      : textContent;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isListView = viewMode === "list";

  return (
    <article
      className={`
        group relative bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm
        transition-all duration-500 ease-out hover:border-gray-700 hover:bg-gray-900/80
        hover:transform hover:shadow-2xl hover:shadow-black/20
        ${isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
        }
        ${isListView 
          ? "flex flex-row h-56 w-full rounded-2xl overflow-hidden" 
          : "flex flex-col w-[330px] h-[420px] rounded-2xl overflow-hidden"
        }
      `}
    >
      {/* Image Section */}
      <div className={`
        relative overflow-hidden bg-gray-800
        ${isListView 
          ? "w-96 h-full flex-shrink-0" 
          : "w-full h-56"
        }
      `}>
        {articleData?.image ? (
          <Image
            src={articleData.image}
            alt={articleData.title || "Article image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={isListView ? "384px" : "330px"}
          />
        ) : (
          <Image
            src={DummyBlogImage}
            alt="Article image"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={isListView ? "384px" : "330px"}
          />
        )}
        
        {/* Overlay gradient */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        `} />
        
        {/* Read More Button - Animated on Hover - Grid Mode Only */}
        {!isListView && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Link 
              href={`/articles/${articleData?.id}`}
              className={`
                flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20
                text-white font-semibold px-6 py-3 rounded-full
                transition-all duration-500 ease-out
                hover:bg-white/20 hover:border-white/30 hover:scale-105
                transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                shadow-lg hover:shadow-xl
              `}
            >
              <span className="text-sm">Read More</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`
        flex flex-col justify-between p-6
        ${isListView ? "flex-1 min-w-0" : "flex-1"}
      `}>
        {/* Header */}
        <div className="space-y-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-3 h-3" />
            <time className="text-xs font-medium">
              {formatDate(articleData?.createdAt)}
            </time>
          </div>

          {/* Title */}
          <h3 className={`
            font-bold text-white leading-tight
            transition-colors duration-300 group-hover:text-gray-100
            ${isListView 
              ? "text-xl line-clamp-2" 
              : "text-lg line-clamp-3"
            }
          `}>
            {articleData?.title || "Untitled Article"}
          </h3>

          {/* Content Preview */}
          <div className={`
            text-gray-400 leading-relaxed
            transition-colors duration-300 group-hover:text-gray-300
            ${isListView 
              ? "text-sm line-clamp-4" 
              : "text-sm line-clamp-5"
            }
          `}>
            {getSanitizedContent(
              articleData?.content || "", 
              isListView ? 250 : 200
            )}
          </div>
        </div>
      </div>

      {/* Read More Button for List Mode - Bottom Right of Card */}
      {isListView && (
        <div className="absolute bottom-4 right-4">
          <Link 
            href={`/articles/${articleData?.id}`}
            className={`
              flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20
              text-white font-semibold px-4 py-2 rounded-full
              transition-all duration-500 ease-out
              hover:bg-white/20 hover:border-white/30 hover:scale-105
              transform opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
              shadow-lg hover:shadow-xl
            `}
          >
            <span className="text-sm">Read More</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gray-600/50 transition-colors duration-500 pointer-events-none" />
    </article>
  );
};

export default NewsCard;