/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import PostCard from "../Post/PostCard"
import { useAppSelector } from "@/redux/hooks"
import { useGetPostsByUserIdQuery } from "@/redux/features/api/postApi"
import Loading from "../Shared/Loading"
import { useRouter } from "next/navigation"
import { Post } from "./TopicDetails"
import { useGetUserByIdQuery } from "@/redux/features/api/authApi"

interface IUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    profileImage?: string;
    coverImage?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    followers?: string[];
    following?: string[];
    role: ("ADMIN" | "USER");
    refreshToken?: string;
    // posts: ObjectId[];
    // comments: ObjectId[];
}

export default function MyProfilePage() {
    const router = useRouter();
    const currentUser: Partial<IUser> = useAppSelector((state) => state.auth.user);
    const { data: updatedUserData, isLoading: updatedUserDataLoading } = useGetUserByIdQuery(currentUser.id as string);
    const { data: allPostsData, isLoading: allPostsDataLoading } = useGetPostsByUserIdQuery(currentUser.id)
    if (!currentUser) {
        router.push("/auth/login")
    }
    if (updatedUserDataLoading) {
        return <Loading />
    }
    const user: IUser = updatedUserData?.data;

    if (allPostsDataLoading) {
        return <Loading />
    }

    const allPosts: Post[] = allPostsData?.data || [];

    console.log({ user })
    console.log({ allPosts })

    return (
        <div className="w-full max-w-6xl mx-auto text-white">
            <div className="relative">
                {/* Banner Image */}
                <div className="h-48 md:h-64 relative overflow-hidden rounded-b-lg bg-gray-400">
                    {user?.coverImage &&
                        <Image
                            src={user.coverImage as string}
                            alt="Profile banner"
                            width={1200}
                            height={400}
                            className="object-cover w-full h-full"
                        />
                    }
                </div>

                {/* Profile Info Section */}
                <div className="px-4">
                    <div className="relative -mt-16 mb-4">
                        <div className="w-32 h-32 rounded-full border-4 border-background">
                            {user?.profileImage ?
                                <Image alt="image" src={user?.profileImage as string} width={200} height={400} className="w-full h-full bg-cover rounded-full text-white" />
                                :
                                <h2>{user?.firstName?.[ 0 ]}</h2>
                            }
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{user?.firstName + " " + user?.lastName}</h1>
                                <p className="text-muted-foreground">{user?.email}</p>
                            </div>
                            <Button className="bg-cyan-700 text-white" variant="outline">Edit</Button>
                        </div>

                        <div className="flex gap-4 text-sm">
                            <span><strong>{user?.followers?.length}</strong> Followers</span>
                            <span><strong>{user?.following?.length}</strong> Following</span>
                        </div>

                        <p className="text-sm">Joined 2024 November</p>
                    </div>
                </div>
                

                {/* Tabs Section */}
                <Tabs defaultValue="posts" className="mt-6 ">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none">
                        <TabsTrigger
                            value="posts"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent  text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-white  data-[state=active]:rounded-md"
                        >
                            Posts
                        </TabsTrigger>
                        <TabsTrigger
                            value="comments"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:rounded-md"
                        >
                            Comments
                        </TabsTrigger>
                        <TabsTrigger
                            value="reactions"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:rounded-md"
                        >
                            Reactions
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="mt-6">
                        <div className="space-y-6">
                            {allPosts.length > 0 ? (
                                allPosts.map((post) => <PostCard key={post.id} post={post} />)
                            ) : (
                                <p className="text-white">No posts</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="comments">
                        <div className="text-center py-8 text-muted-foreground">
                            No comments yet
                        </div>
                    </TabsContent>

                    <TabsContent value="reactions">
                        <div className="text-center py-8 text-muted-foreground">
                            No reactions yet
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}









