"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BadgeCheck, Heart, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useGetTopicByIdQuery } from "@/redux/features/api/topicApi"
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation"

export default function TopicDetailsPage({ topicId }: { topicId: string }) {
    const { data, isLoading: topicLoading } = useGetTopicByIdQuery(topicId);

    if (topicLoading) {
        return <LoadingAnimation />
    }
    const topic = data?.data;

    return (
        <div className="min-h-screen bg-[#0a0a0f75]">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="relative overflow-hidden">
                    <div className="aspect-[3/2] overflow-hidden rounded-b-xl">
                        <Image
                            width={600}
                            height={800}
                            src={(topic?.image as string)}
                            alt="Profile banner"
                            className="w-full h-full mt-4 rounded-md object-cover"
                        />
                    </div>
                    
                </div>
                <div className="p-4 rounded-md  bg-[#00000096]">
                    <h1 className="text-2xl font-bold text-white">{topic?.title}</h1>
                    <p className="text-white">{topic?.description}</p>
                </div>
                <div className=" flex justify-end">
                    <Button
                        className=" bg-cyan-600 px-8 mt-4 hover:bg-cyan-700 text-white"
                    >
                       New Post
                    </Button>
                </div>
                

                {/* Tabs */}
                <div className="px-4">
                    <Tabs defaultValue="top" className="mt-4">
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
                    <div className="space-y-4 mt-6">
                        {[
                            { name: "test", comments: 0, likes: 1 },
                            { name: "frs", comments: 0, likes: 0 }
                        ].map((user, index) => (
                            <Card key={index} className="bg-transparent border-cyan-400/30 p-4">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback>{user.name[ 0 ].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-white">{user.name}</span>
                                            <BadgeCheck className="h-4 w-4 fill-blue-400 text-white" />
                                            <span className="text-gray-400">@{user.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{user.comments}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="h-4 w-4" />
                                                <span>{user.likes}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        + Follow
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}