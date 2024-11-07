

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

interface Author {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
}

interface Comment {
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
    likeCount: number;
    likers: string[];
    topicId: string;
    author: Author;
    comments: Comment[];
}



export default function TopicDetailsPage({ topicId }: { topicId: string }) {
    const { data, isLoading: topicLoading } = useGetTopicByIdQuery(topicId);
    const [ isOpenPostModal, setIsOpenPostModal ] = useState(false)
    const { data: allPostsData, isLoading: allPostsLoading } = useGetAllPostsByTopicQuery(topicId)

    if (topicLoading || allPostsLoading) {
        return <Loading />
    }

    const topic = data?.data;
    const allPosts = (allPostsData?.data || []) as Post[];


    return (
        <div className="min-h-screen bg-[#0a0a0f75]">
            <div className="max-w-5xl mx-auto px-4">
                {/* Topic Header */}
                <div className="relative overflow-hidden mb-6">
                    <div className="aspect-[3/2] overflow-hidden rounded-xl">
                        <Image
                            width={600}
                            height={800}
                            src={topic?.image as string}
                            alt="Profile banner"
                            className="w-full h-full mt-4 rounded-xl object-cover"
                        />
                    </div>
                    <div className="p-6 bg-[#00000096] rounded-xl mt-4 text-white text-center">
                        <h1 className="text-3xl font-bold">{topic?.title}</h1>
                        <p className="text-lg mt-2">{topic?.description}</p>
                    </div>
                </div>

                {/* New Post Button */}
                <div className="flex justify-end mb-6">
                    <Button
                        className="bg-cyan-600 px-8 py-2 hover:bg-cyan-700 text-white"
                        onClick={() => setIsOpenPostModal(true)}
                    >
                        New Post
                    </Button>
                </div>

                {isOpenPostModal && (
                    <PostModal
                        topicId={topicId}
                        isOpen={isOpenPostModal}
                        onClose={() => setIsOpenPostModal(false)}
                    />
                )}

                {/* Tabs */}
                <Tabs defaultValue="top" className="mb-6">
                    <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start h-auto p-0 gap-6">
                        <TabsTrigger
                            value="top"
                            className="text-cyan-400 border-b-2 border-cyan-400 px-4 rounded-md pb-2 data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent"
                        >
                            Top
                        </TabsTrigger>
                        <TabsTrigger
                            value="latest"
                            className="text-gray-500 border-b-2 border-transparent px-4 rounded-md pb-2 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-400"
                        >
                            Latest
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Posts List */}
                <div className="space-y-6">
                    {allPosts.map((post: Post) => (
                        <PostCard key={post?.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    )
}
