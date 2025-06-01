"use client";
import {
  useGetSingleArticleQuery,
  useLikeToggleMutation,
} from "@/redux/features/api/articleApi";
import Image from "next/image";
import Loading from "../Shared/Loading";
import DummyImage from "@/assets/dummy-blog.png";
import { Article } from "@/app/(withCommonLayout)/articles/SubPage";
import { HeartIcon, MessageCircle, Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import PostCommentCard from "../Post/PostCommentCard";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { IUser } from "../Cryptohub/Types";
import toast from "react-hot-toast";
import { useCreateCommentMutation } from "@/redux/features/api/postApi";
import { Button } from "../ui/button";
import Link from "next/link";

const adClasses = [
  "67d2cfc79eb53572455e13e3",
  "67d2d0779eb53572455e1516",
  "67d2d0c56f9479aa015d006a",
];

function ArticleDetailsPage({ articleId }: { articleId: string }) {
  const { data: articleData, isLoading: articleLoading } =
    useGetSingleArticleQuery(articleId);
  const user: IUser | null = useAppSelector((state) => state.auth.user);
  const [toggleLikeMutation, { isLoading: toggleLikeLoading }] =
    useLikeToggleMutation();

  const article: Article | undefined = articleData?.data;

  // State for optimistic updates
  const [likeCount, setLikeCount] = useState(article?.likeCount || 0);
  const [likers, setLikers] = useState<string[]>(article?.likers || []);

  const [newComment, setNewComment] = useState("");
  const [createComment, { isLoading: createCommentLoading }] =
    useCreateCommentMutation();

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }

    const userId = user.id;
    const isLiked = likers.includes(userId);

    // Optimistically update the UI
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setLikers((prev) =>
      isLiked ? prev.filter((id) => id !== userId) : [...prev, userId]
    );

    try {
      await toggleLikeMutation({ authorId: userId, id: article?.id });
    } catch (error: any) {
      // Rollback on failure
      toast.error("Failed to update like status.");
      setLikeCount(article?.likeCount || 0); // Revert to original count
      setLikers(article?.likers || []); // Revert to original likers
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    try {
      if (newComment.trim()) {
        const response = await createComment({
          authorId: user.id,
          content: newComment.trim(),
          articleId: article?.id,
        });

        if (response?.error) {
          toast.error("Failed to create a new comment! Try again.");
        } else {
          toast.success("Comment added successfully.");
          setNewComment(""); // Clear the input
        }
      }
    } catch {
      toast.error("Something went wrong! Try again.");
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (articleLoading) {
    return <Loading />;
  }

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
            <span className="text-sm font-medium">Back to Articles</span>
          </Link>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors duration-200">
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
                src={article?.image || DummyImage}
                alt={article?.title || "Article image"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating stats on image */}
              <div className="absolute bottom-6 right-6 flex gap-3">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2">
                  <HeartIcon className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">{likeCount}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">{article?.comments?.length || 0}</span>
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
                    {article?.createdAt ? formatDate(article.createdAt) : 'Unknown date'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Author</span>
                </div>
                <div className="text-sm">
                  {Math.ceil((article?.content?.length || 0) / 1000)} min read
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
                {article?.title}
              </h1>

              {/* Article Content */}
              <div 
                className="prose prose-lg prose-invert max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-em:text-gray-300
                  prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-600 prose-blockquote:pl-6 prose-blockquote:italic
                  prose-ul:text-gray-300 prose-ol:text-gray-300
                  prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: article?.content || "" }}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-800">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLikeToggle}
                    disabled={toggleLikeLoading}
                    className={`
                      flex items-center gap-3 px-6 py-3 rounded-xl font-medium
                      transition-all duration-200 hover:scale-105
                      ${likers.includes(user?.id || "")
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                      }
                      ${toggleLikeLoading ? "opacity-75 cursor-not-allowed" : ""}
                    `}
                  >
                    <HeartIcon 
                      className={`w-5 h-5 transition-transform duration-200 ${toggleLikeLoading ? 'animate-pulse' : ''}`}
                      fill={likers.includes(user?.id || "") ? "currentColor" : "none"}
                    />
                    <span>{likers.includes(user?.id || "") ? "Liked" : "Like"}</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      {likeCount}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors duration-200">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="mt-12 bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12">
            
            {/* Comments Header */}
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                Comments
              </h2>
              <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">
                {article?.comments?.length || 0}
              </span>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Share your thoughts..."
                  value={newComment}
                  required
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-6 py-4 bg-black/50 border border-gray-800 rounded-2xl 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-white/20 focus:border-gray-600 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={createCommentLoading || !newComment.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 
                    bg-white text-black rounded-xl font-medium text-sm
                    hover:bg-gray-100 transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createCommentLoading ? "Sending..." : "Post"}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {article?.comments?.length && article?.comments?.length > 0 ? (
                article?.comments?.map((comment) => (
                  <div key={comment?.id} className="bg-black/30 border border-gray-800/50 rounded-2xl p-6">
                    <PostCommentCard comment={comment} />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No comments yet</h3>
                  <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
                </div>
              )}
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