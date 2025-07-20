"use client";
import React from "react";
import { Flame, TrendingUp, MessageCircle } from "lucide-react";
import { useGetAllTopicQuery } from "@/redux/features/api/topicApi";
import Loading from "../Shared/Loading";
import Image from "next/image";
import { ITopic } from "../Cryptohub/Types";
import Link from "next/link";

const TrendingTopic = () => {
    const { data: allTopicData, isLoading: allTopicDataLoading } = useGetAllTopicQuery("");

    if (allTopicDataLoading) return <Loading />;

    const allTopics: ITopic[] = allTopicData?.data || [];

    return (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Trending Topics</h3>
                    <p className="text-xs text-slate-400">Popular discussions</p>
                </div>
            </div>

            {/* Topics List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
                {allTopics.length > 0 ? (
                    allTopics.slice(0, 6).map((topic, index) => (
                        <Link
                            key={topic.id}
                            href={`/cryptohub/cryptochat/${topic.id}`}
                            className="block group"
                        >
                            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/40 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-600/30">
                                {/* Topic Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-700">
                                        {topic.image ? (
                                            <Image
                                                height={40}
                                                width={40}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                alt="topic"
                                                src={topic.image}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                                {topic?.title?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Trending indicator */}
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-2.5 h-2.5 text-white" />
                                    </div>
                                </div>

                                {/* Topic Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors duration-200 truncate">
                                        {topic.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <MessageCircle className="w-3 h-3" />
                                            <span>{Math.floor(Math.random() * 50) + 10} posts</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>#{index + 1}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow indicator */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Flame className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-400 text-sm">No trending topics found</p>
                        <p className="text-slate-500 text-xs mt-1">Be the first to start a discussion!</p>
                    </div>
                )}
            </div>

            {/* View All Link */}
            {allTopics.length > 6 && (
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <Link
                        href="/cryptohub/cryptochat"
                        className="block text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium py-2 transition-colors duration-200"
                    >
                        View All Topics ({allTopics.length})
                    </Link>
                </div>
            )}
        </div>
    );
};

export default TrendingTopic;