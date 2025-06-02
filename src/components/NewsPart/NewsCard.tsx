/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, Heart, MessageCircle, Eye, TrendingUp } from "lucide-react";
import DummyBlogImage from "@/assets/dummy-blog.png";
import { Article } from "@/app/(withCommonLayout)/articles/SubPage";

interface NewsCardProps {
  articleData: Article;
  viewMode?: "grid" | "list";
}

const NewsCard = ({ articleData, viewMode = "grid" }: NewsCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  // Get time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(date);
  };

  const isListView = viewMode === "list";

  return (
      <article
          className={`
        group relative bg-gradient-to-br from-gray-800/40 via-gray-800/30 to-gray-900/40
        backdrop-blur-sm border border-gray-600/20 hover:border-gray-500/40
        transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-cyan-500/10
        hover:transform hover:-translate-y-1
        ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }
        ${isListView
              ? "flex flex-row h-64 w-full rounded-3xl overflow-hidden"
              : "flex flex-col max-w-sm h-[480px] rounded-3xl overflow-hidden"
          }
      `}
      >
        {/* Image Section */}
        <div className={`
        relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800
        ${isListView
            ? "w-80 h-full flex-shrink-0"
            : "w-full h-64"
        }
      `}>
          {!imageError && articleData?.image ? (
              <Image
                  src={articleData.image}
                  alt={articleData.title || "Article image"}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes={isListView ? "320px" : "384px"}
                  onError={() => setImageError(true)}
              />
          ) : (
              <Image
                  src={DummyBlogImage}
                  alt="Article image"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes={isListView ? "320px" : "384px"}
              />
          )}

          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Stats overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            {articleData.likeCount > 0 && (
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span className="text-white text-xs font-medium">{articleData.likeCount}</span>
                </div>
            )}
            {articleData.comments?.length > 0 && (
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <MessageCircle className="w-3 h-3 text-blue-400" />
                  <span className="text-white text-xs font-medium">{articleData.comments.length}</span>
                </div>
            )}
          </div>

          {/* Trending badge */}
          {articleData.likeCount > 10 && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-3 py-1">
                  <TrendingUp className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-bold">HOT</span>
                </div>
              </div>
          )}

          {/* Read More Button - Animated on Hover - Grid Mode Only */}
          {!isListView && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Link
                    href={`/articles/${articleData?.id}`}
                    className="
                flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20
                text-white font-semibold px-8 py-4 rounded-2xl
                transition-all duration-500 ease-out
                hover:bg-white/20 hover:border-white/30 hover:scale-110
                transform opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0
                shadow-xl hover:shadow-2xl
              "
                >
                  <span className="text-sm">Read Article</span>
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
          <div className="space-y-4">
            {/* Date and time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-3 h-3" />
                <time className="text-xs font-medium">
                  {getTimeAgo(articleData?.createdAt)}
                </time>
              </div>
              {!isListView && (
                  <div className="text-xs text-gray-500">
                    {formatDate(articleData?.createdAt)}
                  </div>
              )}
            </div>

            {/* Title */}
            <h3 className={`
            font-bold text-white leading-tight
            transition-colors duration-300 group-hover:text-cyan-200
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
                ? "text-sm line-clamp-3"
                : "text-sm line-clamp-4"
            }
          `}>
              {getSanitizedContent(
                  articleData?.content || "",
                  isListView ? 180 : 150
              )}
            </div>
          </div>

          {/* Footer */}
          {!isListView && (
              <div className="pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {articleData.likeCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{articleData.likeCount}</span>
                        </div>
                    )}
                    {articleData.comments?.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{articleData.comments.length}</span>
                        </div>
                    )}
                  </div>
                  <Link
                      href={`/articles/${articleData?.id}`}
                      className="
                  flex items-center gap-2 text-cyan-400 hover:text-cyan-300
                  transition-colors duration-300 text-xs font-medium
                "
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
          )}
        </div>

        {/* Read More Button for List Mode - Enhanced Position */}
        {isListView && (
            <div className="absolute bottom-6 right-6">
              <Link
                  href={`/articles/${articleData?.id}`}
                  className="
              flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-500
              text-white font-semibold px-6 py-3 rounded-2xl
              transition-all duration-500 ease-out
              hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25
              transform opacity-0 translate-x-6 group-hover:opacity-100 group-hover:translate-x-0
            "
              >
                <span className="text-sm">Read Article</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
        )}

        {/* Enhanced hover effect border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-cyan-500/50 group-hover:to-purple-500/50 transition-all duration-500 pointer-events-none" />

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />
      </article>
  );
};

export default NewsCard;