"use client"

import React, { useState, useMemo, FormEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import {
  useCreatePostMutation,
  useGetAllImagePostQuery,
} from "@/redux/features/api/postApi";
import Loading from "@/components/Shared/Loading";
import PostCard from "@/components/Post/PostCard";
import { Post } from "@/components/Cryptohub/TopicDetails";
import { Search, Video, Smile, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Images } from "lucide-react";
import AnimatedButton from "@/components/Shared/AnimatedButton";
import TrendingTopic from "@/components/Cards/TrendingTopic";
import VerifiedAccounts from "@/components/Cards/VerifiedAccounts";
import RecommendedAccounts from "@/components/Cards/RecommendedAccounts";
import UserSearch from "@/components/Cryptohub/UserSearch";
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";
import { User } from "../videoPost/page";
import { usePathname } from "next/navigation";
import { setPaths } from "@/redux/features/slices/authSlice";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useMemo(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const FeedPage = () => {
  const [createPost, { isLoading: createPostLoading }] = useCreatePostMutation();
  const user = useAppSelector((state) => state.auth.user);
  const { data: allImagePost, isLoading: allImagePostLoading } = useGetAllImagePostQuery("");
  const allPosts: Post[] = allImagePost?.data.length ? allImagePost.data : [];
  const [postContent, setPostContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: userFromDbData, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id, { skip: !user?.id });

  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(
        (post: Post) =>
            post.author.firstName
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()) ||
            post.author.lastName
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, allPosts]);

  if (typeof window !== "undefined") {
    if (
        previousPath !== "/cryptohub/feed" &&
        currentPath === "/cryptohub/feed"
    ) {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }

  if (allImagePostLoading || userFromDbLoading) return <Loading />;

  const userFromDb: User = userFromDbData?.data;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("authorId", user?.id);
    formData.append("content", postContent);
    formData.append("category", "IMAGE");
    if (selectedFile) formData.append("image", selectedFile);

    const createPostLoadingToast = toast.loading("Creating new post...");
    try {
      const response = await createPost(formData);
      if ((response as any)?.error) {
        toast.error(
            (response as any)?.error?.data?.message ||
            "Failed to create a new post!"
        );
        return;
      }
      toast.success("New post created successfully!");
      setPostContent("");
      setSelectedFile(null);
      setImagePreview(null);
    } finally {
      toast.dismiss(createPostLoadingToast);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-gradient-x">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-3 animate-slide-in-left">
              <div className="sticky top-6 space-y-6">
                {/* User Profile Card */}
                {user && (
                  <a href={userFromDb?.id ? `/cryptohub/userProfile/${userFromDb.id}` : undefined} className="block">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 group cursor-pointer">
                      <div className="flex items-center space-x-4 mb-4">
                        {userFromDb?.profileImage ? (
                          <img
                            src={userFromDb.profileImage}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500 group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                            {(userFromDb?.firstName?.[0]?.toUpperCase() || "U") + (userFromDb?.lastName?.[0]?.toUpperCase() || "")}
                          </div>
                        )}
                        {userFromDb && (
                          <div>
                            <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors duration-300">
                              {userFromDb.firstName || "User"} {userFromDb.lastName || ""}
                            </h3>
                            <p className="text-slate-400 text-sm">@{userFromDb.firstName?.toLowerCase() || "user"}{userFromDb.lastName?.toLowerCase() || ""}</p>
                          </div>
                        )}
                      </div>
                      {userFromDb && (
                      <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="hover:scale-110 transition-transform duration-300">
                      <p className="text-white font-bold">{userFromDb.posts?.length ?? 0}</p>
                      <p className="text-slate-400 text-xs">Posts</p>
                      </div>
                      <div className="hover:scale-110 transition-transform duration-300">
                      <p className="text-white font-bold">{userFromDb.following?.length || 0}</p>
                      <p className="text-slate-400 text-xs">Following</p>
                      </div>
                      <div className="hover:scale-110 transition-transform duration-300">
                      <p className="text-white font-bold">{userFromDb.followers?.length || 0}</p>
                      <p className="text-slate-400 text-xs">Followers</p>
                      </div>
                      </div>
                      )}
                    </div>
                  </a>
                )}

                {/* User Search */}
                <UserSearch />
                {/* Trending Topics */}
                <div className="hover:scale-[1.02] transition-transform duration-500 hover:shadow-lg hover:shadow-cyan-500/20 rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  <TrendingTopic />
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-6 animate-fade-in-up">
              {/* Header */}
              <div className="mb-6 animate-slide-in-down">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2 animate-shimmer">
                  For You
                </h1>
                <p className="text-slate-400 animate-fade-in">Discover the latest in crypto community</p>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6 group animate-slide-in-up">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors duration-300" />
                <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 focus:scale-[1.02] hover:bg-slate-800/70"
                />
              </div>

              {/* Create Post */}
              {userFromDb?.recommended && (
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6 hover:border-cyan-500/30 transition-all duration-500 group animate-slide-in-up" style={{ animationDelay: "300ms" }}>
                    <form onSubmit={handlePostSubmit} className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {userFromDb?.firstName?.[0] || "U"}
                        </div>
                        <div className="flex-1">
                      <textarea
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full bg-transparent text-white placeholder-slate-400 resize-none focus:outline-none text-lg transition-all duration-300 focus:scale-[1.01]"
                          rows={3}
                      />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <label
                              htmlFor="fileInput"
                              className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-all duration-300 cursor-pointer hover:scale-105"
                          >
                            <Images className="w-5 h-5" />
                            <span className="text-sm">Photo</span>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                          </label>
                          <button type="button" className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
                            <Video className="w-5 h-5" />
                            <span className="text-sm">Video</span>
                          </button>
                          <button type="button" className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-105">
                            <Smile className="w-5 h-5" />
                            <span className="text-sm">Emoji</span>
                          </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!postContent.trim()}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed bg-[length:200%_200%] hover:animate-gradient-x"
                        >
                          {createPostLoading ? (
                              <AnimatedButton className="px-6 py-2" loading={createPostLoading} />
                          ) : (
                              "Post"
                          )}
                        </button>
                      </div>

                      {imagePreview && (
                          <div className="mt-4 flex items-center gap-4 animate-fade-in">
                            <span className="text-sm text-gray-400">Preview:</span>
                            <img
                                className="w-20 h-20 object-cover rounded-xl border border-gray-600 hover:scale-110 transition-transform duration-300"
                                src={imagePreview}
                                alt="Selected Preview"
                            />
                          </div>
                      )}
                    </form>
                  </div>
              )}

              {/* Posts Feed */}
              <div className="space-y-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => (
                        <div
                            key={post.id}
                            className="animate-fade-in-up hover:scale-[1.01] transition-transform duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <PostCard post={post} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 animate-fade-in">
                      <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-gentle">
                        <MessageCircle className="w-10 h-10 text-slate-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-300 mb-2">No posts found</h3>
                      <p className="text-slate-500">Start following people to see their posts here</p>
                    </div>
                )}
              </div>

              {/* Load More */}
              <div className="text-center mt-8 animate-fade-in-up">
                <button className="bg-slate-800/50 hover:bg-slate-700/50 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50 hover:scale-105 hover:shadow-lg">
                  Load More Posts
                </button>
              </div>
            </div>

            {/* Right Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-3 animate-slide-in-right">
              <div className="sticky top-6 space-y-6">
                {/* Recommended Accounts */}
                <div className="hover:scale-[1.02] transition-transform duration-500 hover:shadow-lg hover:shadow-cyan-500/20 rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                  <RecommendedAccounts />
                </div>

                {/* Verified Accounts */}
                <div className="hover:scale-[1.02] transition-transform duration-500 hover:shadow-lg hover:shadow-cyan-500/20 rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                  <VerifiedAccounts />
                </div>

                {/* Quick Stats */}
                {/* <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                  <h3 className="text-white font-bold mb-4">Community Stats</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Total Members", value: "25.4K", color: "text-white" },
                      { label: "Online Now", value: "2.1K", color: "text-green-400" },
                      { label: "Posts Today", value: "1.2K", color: "text-cyan-400" }
                    ].map((stat, index) => (
                        <div key={index} className="flex justify-between items-center hover:scale-105 transition-transform duration-300">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className={`${stat.color} font-bold`}>{stat.value}</span>
                        </div>
                    ))}
                  </div>
                </div> */}

                {/* Footer Links */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: "1000ms" }}>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {["About", "Help", "Terms", "Privacy"].map((link, index) => (
                        <a
                            key={index}
                            href="#"
                            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-105"
                        >
                          {link}
                        </a>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-4">© 2024 CryptoHub</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
        .animate-slide-in-down { animation: slide-in-down 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        
        .hover\\:animate-gradient-x:hover { animation: gradient-x 1s ease infinite; }
      `}</style>
      </div>
  );
};

export default FeedPage;