"use client";
import Image from "next/image";
import DummyImage from "@/assets/dummy-blog.png";
import { Calendar, ArrowLeft, Share2, ExternalLink, Globe, Clock, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface CryptoArticle {
  id: string;
  title: string;
  content?: string;
  text?: string;
  source_name?: string;
  sourceName?: string;
  date: string;
  createdAt: string;
  tickers?: string[];
  news_url?: string;
  sourceUrl?: string;
  image_url?: string;
  image?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  kind?: string;
  type: 'crypto_news';
}

const adClasses = [
  "67d2cfc79eb53572455e13e3",
  "67d2d0779eb53572455e1516",
  "67d2d0c56f9479aa015d006a",
];

function ArticleDetailsPage({ articleId }: { articleId: string }) {
  const [article, setArticle] = useState<CryptoArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch article data from our crypto news API
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        console.log('Fetching crypto news article with ID:', articleId);

        const response = await fetch(`/api/crypto-news/article/${encodeURIComponent(articleId)}`);
        const data = await response.json();

        if (data.success && data.data) {
          setArticle(data.data);
          setError(null);
        } else {
          setError(data.error || 'Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  // Format date
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  // Get reading time estimate
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: `Check out this crypto news: ${article.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Loading state
  if (loading) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400">Loading crypto news article...</p>
          </div>
        </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-6">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
              <p className="text-gray-400 mb-6">
                {error || "The crypto news article you're looking for doesn't exist or may have been removed."}
              </p>
              <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to News
              </Link>
            </div>
          </div>
        </div>
    );
  }

  const articleContent = article.content || article.text || '';
  const readingTime = getReadingTime(articleContent);

  return (
      <div className="min-h-screen bg-black text-white">
        {/* Ad Banner */}
        <div className="w-full py-4">
          <div className="flex flex-wrap justify-center gap-2 mx-auto">
            {adClasses.map((adClass) => (
                <AdBanner key={adClass} adClass={adClass} />
            ))}
          </div>
        </div>

        {/* Navigation Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
                href="/articles"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Crypto News</span>
            </Link>

            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors duration-200"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <article className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden">

              {/* Hero Image */}
              <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
                <Image
                    src={article.image || article.image_url || DummyImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating info on image */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Source */}
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                      {article.source_name || article.sourceName || 'Crypto News'}
                    </span>
                    </div>

                    {/* Reading time */}
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-white">{readingTime} min read</span>
                    </div>

                    {/* Sentiment */}
                    {article.sentiment && article.sentiment !== 'neutral' && (
                        <div className={`flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 ${
                            article.sentiment === 'positive'
                                ? 'bg-green-600/60'
                                : 'bg-red-600/60'
                        }`}>
                          <TrendingUp className="w-4 h-4 text-white" />
                          <span className="text-sm font-medium text-white">
                        {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                      </span>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-8 md:p-12">

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                    {formatDate(article.date)}
                  </span>
                  </div>

                  {article.tickers && article.tickers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Related:</span>
                        <div className="flex gap-1">
                          {article.tickers.slice(0, 5).map((ticker) => (
                              <span
                                  key={ticker}
                                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium"
                              >
                          {ticker}
                        </span>
                          ))}
                          {article.tickers.length > 5 && (
                              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                          +{article.tickers.length - 5} more
                        </span>
                          )}
                        </div>
                      </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
                  {article.title}
                </h1>

                {/* Article Content */}
                <div className="prose prose-lg prose-invert max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-em:text-gray-300
                  prose-ul:text-gray-300 prose-ol:text-gray-300
                  prose-li:mb-2">

                  {/* Convert plain text content to readable paragraphs */}
                  {articleContent.split('\n').map((paragraph, index) => {
                    const trimmedParagraph = paragraph.trim();
                    if (!trimmedParagraph) return null;

                    return (
                        <p key={index} className="mb-6 text-gray-300 leading-relaxed text-lg">
                          {trimmedParagraph}
                        </p>
                    );
                  })}
                </div>

                {/* Tickers Section */}
                {article.tickers && article.tickers.length > 0 && (
                    <div className="mt-12 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                      <h3 className="text-lg font-semibold text-white mb-4">Related Cryptocurrencies</h3>
                      <div className="flex flex-wrap gap-2">
                        {article.tickers.map((ticker) => (
                            <span
                                key={ticker}
                                className="px-3 py-2 bg-blue-600/20 text-blue-400 rounded-xl font-medium border border-blue-600/30 hover:bg-blue-600/30 transition-colors"
                            >
                        {ticker}
                      </span>
                        ))}
                      </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-800">
                  <div className="flex items-center gap-4">
                    {article.news_url && (
                        <a
                            href={article.news_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium
                        transition-all duration-200 hover:bg-blue-700 hover:scale-105"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>Read Original Article</span>
                        </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="p-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors duration-200"
                        title="Share article"
                    >
                      <Share2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Info Note */}
            <div className="mt-8 p-6 bg-gray-900/30 border border-gray-800/30 rounded-2xl">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>
                This article is sourced from <strong className="text-white">
                {article.source_name || article.sourceName || 'external crypto news providers'}
                </strong>. Content is provided for informational purposes only.
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

const AdBanner = ({ adClass }: { adClass: string }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  const injectAdScript = () => {
    if (!adContainerRef.current) return;

    const existingScript = document.querySelector(`script[data-ad-class="${adClass}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.innerHTML = `
      !function(e,n,c,t,o,r,d){
        !function e(n,c,t,o,r,m,d,s,a){
          s=c.getElementsByTagName(t)[0],
          (a=c.createElement(t)).async=!0,
          a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
          a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
          s.parentNode.insertBefore(a,s)
        }(window,document,"script","${adClass}",["cdn.bmcdn6.com"], 0, new Date().getTime())
      }();
    `;
    script.setAttribute("data-ad-class", adClass);
    document.body.appendChild(script);
  };

  useEffect(() => {
    injectAdScript();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        injectAdScript();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [adClass]);

  return (
      <div ref={adContainerRef} className="w-full flex justify-center">
        <ins
            className={adClass}
            style={{ display: "inline-block", width: "1px", height: "1px" }}
        ></ins>
      </div>
  );
};

export default ArticleDetailsPage;