"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { useGetTopicByIdQuery } from "@/redux/features/api/topicApi"
import Loading from "../Shared/Loading"
import { useState } from "react"
import PostModal from "../Shared/PostModal"
import { useGetAllPostsByTopicQuery } from "@/redux/features/api/postApi"
import PostCard from "../Post/PostCard"
import { MessageCircle, Plus, TrendingUp, Clock, Users, Eye } from "lucide-react"

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

    if (topicLoading || allPostsLoading) {
        return <Loading />
    }

    const topic = data?.data;
    const allPosts = (allPostsData?.data || []) as Post[];

    // Calculate stats
    const totalViews = allPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const totalLikes = allPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const totalComments = allPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-6 py-8">
                
                {/* Topic Header */}
                <div className="mb-12">
                    {topic?.image && (
                        <div className="relative mb-8">
                            <div className="relative aspect-[3/1] overflow-hidden rounded-3xl">
                                <Image
                                    width={1200}
                                    height={400}
                                    src={topic.image as string}
                                    alt="Topic banner"
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                
                                {/* Floating topic badge */}
                                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-white" />
                                        <span className="text-sm text-white font-medium">Discussion Topic</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Topic Info */}
                    <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                {topic?.title}
                            </h1>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                                {topic?.description}
                            </p>
                        </div>
                        
                        {/* Topic Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-black/30 border border-gray-800/30 rounded-2xl p-4 text-center">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <MessageCircle className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-sm text-gray-400">Posts</p>
                                <p className="text-lg font-bold text-white">{allPosts.length}</p>
                            </div>
                            
                            <div className="bg-black/30 border border-gray-800/30 rounded-2xl p-4 text-center">
                                <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <TrendingUp className="w-5 h-5 text-red-400" />
                                </div>
                                <p className="text-sm text-gray-400">Likes</p>
                                <p className="text-lg font-bold text-white">{totalLikes}</p>
                            </div>
                            
                            <div className="bg-black/30 border border-gray-800/30 rounded-2xl p-4 text-center">
                                <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <Users className="w-5 h-5 text-green-400" />
                                </div>
                                <p className="text-sm text-gray-400">Comments</p>
                                <p className="text-lg font-bold text-white">{totalComments}</p>
                            </div>
                            
                            <div className="bg-black/30 border border-gray-800/30 rounded-2xl p-4 text-center">
                                <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <Eye className="w-5 h-5 text-purple-400" />
                                </div>
                                <p className="text-sm text-gray-400">Views</p>
                                <p className="text-lg font-bold text-white">{totalViews}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    {/* Tabs */}
                    <Tabs defaultValue="top" className="flex-1">
                        <TabsList className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-1">
                            <TabsTrigger
                                value="top"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-gray-400 transition-all duration-200"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Top Posts
                            </TabsTrigger>
                            <TabsTrigger
                                value="latest"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-gray-400 transition-all duration-200"
                            >
                                <Clock className="w-4 h-4" />
                                Latest
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* New Post Button */}
                    <Button
                        className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 flex items-center gap-2"
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
                <div className="space-y-6">
                    {allPosts.length ? (
                        allPosts.map((post: Post) => (
                            <div key={post.id} className="transform transition-all duration-300 hover:scale-[1.01]">
                                <PostCard post={post} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto">
                                    <MessageCircle className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-400">No posts yet</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Be the first to share your thoughts on this topic. Start the conversation!
                                </p>
                                <Button
                                    className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto mt-6"
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
        </div>
    )
}