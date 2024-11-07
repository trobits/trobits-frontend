

"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useGetTopicByIdQuery } from "@/redux/features/api/topicApi"
import Loading from "../Shared/Loading"
import { useState } from "react"
import PostModal from "../Shared/PostModal"
import { useGetAllPostsByTopicQuery } from "@/redux/features/api/postApi"
import CommentsModal from "../Post/CommentModal"

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
    const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false)
    const [ currentPost, setCurrentPost ] = useState<Post | null>(null);
    const { data: allPostsData, isLoading: allPostsLoading } = useGetAllPostsByTopicQuery(topicId)
    if (topicLoading || allPostsLoading) {
        return <Loading />
    }

    const topic = data?.data;
    const allPosts = allPostsData?.data;

    const handleOpenCommentModal = (post: Post) => {
        setIsOpenCommentModal(true);
        setCurrentPost(post)
    }

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
                        <div
                            key={post.id}
                            className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white
                             ${post?.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
                        >
                            {/* Author Information */}
                            <div className="flex justify-between w-full items-center mb-4">
                                <div className=" flex">
                                    {/* conditionally render user profile image */}
                                    {
                                        post?.author?.profileImage ? <div className=" w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                                            <Image width={500} height={500} src={post?.author?.profileImage} alt="profile image" className=" w-full rounded-full">
                                            </Image>
                                        </div>
                                            :
                                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                                                <span className="text-lg font-bold">
                                                    {post?.author?.firstName?.[ 0 ]}
                                                </span>
                                            </div>

                                    }
                                    <div className="flex flex-col">
                                        <h3 className=" text-sm md:font-semibold">
                                            {post?.author?.firstName} {post?.author?.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            @{post?.author?.firstName} {post?.author?.lastName}
                                        </p>
                                    </div>
                                </div>
                                <Button className=" px-1 py-1 md:px-3 mx:py-2 md:font-bold bg-cyan-600 text-white">
                                    Details
                                </Button>
                            </div>

                            {/* Post Content */}
                            <p className="font-bold text-lg mb-4">{post?.content}</p>

                            {/* Post Image (conditionally rendered) */}

                            {post?.image && (
                                <div className=" h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
                                    <Image
                                        src={post?.image}
                                        alt="Post Image"
                                        width={600}
                                        height={400}
                                        className="w-full object-cover rounded-lg mb-4"
                                    />
                                </div>
                            )}

                            {/* Interaction Buttons */}
                            <div className="flex items-center justify-between text-gray-400 mt-auto">
                                <div
                                    onClick={() => handleOpenCommentModal(post)}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <MessageCircle className="w-5 h-5 " />
                                    <span>{post?.comments?.length}</span>
                                </div>
                                <div
                                onClick={handleLikeToggle}
                                 className="flex items-center space-x-2 cursor-pointer">
                                    <Heart className="w-5 h-5" />
                                    <span>{post?.likeCount}</span>
                                </div>
                            </div>
                            {isOpenCommentModal && <CommentsModal post={currentPost as Post} onClose={() => setIsOpenCommentModal(false)} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
