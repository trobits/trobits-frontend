"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import { useGetTopicByIdQuery } from "@/redux/features/api/topicApi"
import Loading from "../Shared/Loading"
import { useState } from "react"
import PostModal from "../Shared/PostModal"
import { useGetAllPostsByTopicQuery } from "@/redux/features/api/postApi"
import PostCard from "../Post/PostCard"
import { MessageCircle, Plus, TrendingUp, Clock, Users, Eye, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Author {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    author: Author
    likeCount: number;
    dislikeCount: number;
}

export interface Post {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    image: string;
    video: string;
    category: "IMAGE" | "VIDEO";
    likeCount: number;
    likers: string[];
    topicId: string;
    author: Author;
    comments: Comment[];
    viewCount: number;
}

export default function TopicDetailsPage({ topicId }: { topicId: string }) {
    const { data, isLoading: topicLoading } = useGetTopicByIdQuery(topicId);
    const [isOpenPostModal, setIsOpenPostModal] = useState(false)
    const { data: allPostsData, isLoading: allPostsLoading } = useGetAllPostsByTopicQuery(topicId)
    const [activeTab, setActiveTab] = useState("top")
    const router = useRouter()

    if (topicLoading || allPostsLoading) {
        return <Loading />
    }

    const topic = data?.data;
    const allPosts = (allPostsData?.data || []) as Post[];

    // Sort posts based on active tab
    const sortedPosts = [...allPosts].sort((a, b) => {
        if (activeTab === "top") {
            // Sort by engagement (likes + comments)
            const aEngagement = (a.likeCount || 0) + (a.comments?.length || 0);
            const bEngagement = (b.likeCount || 0) + (b.comments?.length || 0);
            return bEngagement - aEngagement;
        } else {
            // Sort by latest (createdAt)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    // Calculate stats
    const totalViews = allPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const totalLikes = allPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const totalComments = allPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

    return (
        <div className="min-h-screen w-full">
            <div className="max-w-5xl mx-auto px-4 py-6">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span>Back to Topics</span>
                </button>

                {/* Topic Header */}
                <div className="mb-8">
                    {topic?.image && (
                        <div className="relative mb-6 group">
                            <div className="relative aspect-[2.5/1] overflow-hidden rounded-2xl">
                                <Image
                                    width={1200}
                                    height={400}
                                    src={topic.image as string}
                                    alt="Topic banner"
                                    className="w-full h-full object-cover transition-transform duration-700"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Topic badge */}
                                <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-700/50">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm text-white font-medium">Discussion Topic</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Topic Info */}
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                {topic?.title}
                            </h1>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                {topic?.description}
                            </p>
                        </div>

                        {/* Topic Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 text-center hover:bg-slate-800/70 transition-colors duration-200">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <MessageCircle className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-sm text-slate-400 mb-1">Posts</p>
                                <p className="text-xl font-bold text-white">{allPosts.length}</p>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 text-center hover:bg-slate-800/70 transition-colors duration-200">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <TrendingUp className="w-5 h-5 text-red-400" />
                                </div>
                                <p className="text-sm text-slate-400 mb-1">Likes</p>
                                <p className="text-xl font-bold text-white">{totalLikes}</p>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 text-center hover:bg-slate-800/70 transition-colors duration-200">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Users className="w-5 h-5 text-green-400" />
                                </div>
                                <p className="text-sm text-slate-400 mb-1">Comments</p>
                                <p className="text-xl font-bold text-white">{totalComments}</p>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 text-center hover:bg-slate-800/70 transition-colors duration-200">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Eye className="w-5 h-5 text-purple-400" />
                                </div>
                                <p className="text-sm text-slate-400 mb-1">Views</p>
                                <p className="text-xl font-bold text-white">{totalViews}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                        <TabsList className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-1">
                            <TabsTrigger
                                value="top"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=inactive]:text-slate-400 transition-all duration-200 hover:text-white"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Top Posts
                            </TabsTrigger>
                            <TabsTrigger
                                value="latest"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=inactive]:text-slate-400 transition-all duration-200 hover:text-white"
                            >
                                <Clock className="w-4 h-4" />
                                Latest
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* New Post Button */}
                    <Button
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2 w-full sm:w-auto"
                        onClick={() => setIsOpenPostModal(true)}
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </Button>
                </div>

                {/* Post Modal */}
                {isOpenPostModal && (
                    <PostModal
                        topicId={topicId}
                        isOpen={isOpenPostModal}
                        onClose={() => setIsOpenPostModal(false)}
                    />
                )}

                {/* Posts List */}
                <div className="space-y-4">
                    {sortedPosts.length > 0 ? (
                        <div className="space-y-4">
                            {sortedPosts.map((post: Post, index) => (
                                <div
                                    key={post.id}
                                    className="opacity-0 animate-fade-in"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animationFillMode: 'forwards'
                                    }}
                                >
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto">
                                    <MessageCircle className="w-8 h-8 text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-300">No posts yet</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    Be the first to share your thoughts on this topic. Start the conversation!
                                </p>
                                <Button
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2 mx-auto mt-6"
                                    onClick={() => setIsOpenPostModal(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Create First Post
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    )
}