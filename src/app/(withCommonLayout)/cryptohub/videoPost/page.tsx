/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useState, useMemo, FormEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import {
    useCreatePostMutation,
    useGetAllVideoPostQuery,
    useIncreaseVideoViewCountMutation,
} from "@/redux/features/api/postApi";
import Loading from "@/components/Shared/Loading";
import PostCard from "@/components/Post/PostCard";
import { Post } from "@/components/Cryptohub/TopicDetails";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { Video } from "lucide-react";
import AnimatedButton from "@/components/Shared/AnimatedButton";
import AuthGuard from "@/components/Auth/AuthGuard";
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";


export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    coverImage?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    followers: string[];
    following: string[];
    recommended: boolean;
    // role: Role;
    verified: boolean;
    otp?: string;
    otpExpiry?: Date;
    refreshToken?: string;
    // posts: Post[];
    comments: Comment[];
}


function useDebounce(value: string, delay: number) {
    const [ debouncedValue, setDebouncedValue ] = useState(value);

    useMemo(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [ value, delay ]);

    return debouncedValue;
}

export default function Component() {
    const [ createPost, { isLoading: createPostLoading } ] = useCreatePostMutation();
    const user = useAppSelector((state) => state.auth.user);
    const { data: allVideoPost, isLoading: allVideoPostLoading } = useGetAllVideoPostQuery("");
    const allPosts: Post[] = allVideoPost?.data.length ? allVideoPost.data : [];
    const [ postContent, setPostContent ] = useState<string>("");
    const [ selectedFile, setSelectedFile ] = useState<File | null>(null);
    const [ videoPreview, setVideoPreview ] = useState<string | null>(null);
    const { data: userFromDbData, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id, { skip: !user?.id });


    // State for search query
    const [ searchQuery, setSearchQuery ] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const filteredPosts = useMemo(() => {
        return allPosts.filter((post: Post) =>
            post.author.firstName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            post.author.lastName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
    }, [ debouncedSearchQuery, allPosts ]);

    if (allVideoPostLoading) {
        return <Loading />;
    }

    // Handle post video change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[ 0 ];
        if (file) {
            setSelectedFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handlePostSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("authorId", user?.id);
        formData.append("content", postContent);
        formData.append("category", "VIDEO");
        if (selectedFile) {
            formData.append("video", selectedFile);
        }
        const createPostLoadingToast = toast.loading("Creating new post...");
        try {
            const response = await createPost(formData);
            if (response.error) {
                toast.error("Failed to create a new post!");
                return;
            }
            toast.success("New post created successfully!");
            setPostContent("");
            setSelectedFile(null);
            setVideoPreview(null);
        } catch (error) {
        } finally {
            toast.dismiss(createPostLoadingToast);
        }
    };

    if (userFromDbLoading) {
        return <Loading />
    }

    const userFromDb: User = userFromDbData?.data;

    
    return (
        <div>
            {/* Post Option */}

            {/* only recommended user can post video */}
            {
                userFromDb?.recommended &&

                <div className="w-full mb-8 max-w-[75rem] mx-auto p-4 bg-[#00000088] rounded-lg shadow-lg flex flex-col space-y-4">
                    <form onSubmit={handlePostSubmit}>
                        <div className="flex items-start space-x-3">
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="w-full p-3 bg-[#00000060] text-white rounded-lg resize-none outline-none focus:ring focus:ring-blue-300"
                                rows={3}
                                placeholder="Share your ideas here!"
                            ></textarea>
                        </div>

                        <div className="flex mt-4 items-center justify-between">
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer bg-cyan-700 px-3 py-2 rounded flex items-center"
                            >
                                <Video className="text-white" />
                                <h1 className=" text-white font-bold ml-3"> Upload Video</h1>
                                <input
                                    id="fileInput"
                                    name="fileInput"
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
                            >
                                {createPostLoading ? (
                                    <AnimatedButton className="w-full px-10 py-5" loading={createPostLoading} />
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                        {videoPreview && (
                            <div className="mt-4 flex items-center">
                                <p className="text-sm text-gray-400 mr-4">Selected file:</p>
                                <video
                                    className="w-64 h-36 object-cover rounded-lg border border-gray-500"
                                    src={videoPreview}
                                    controls
                                ></video>
                            </div>
                        )}
                    </form>
                </div>
            }
            {/* Main Content */}
            <div className="flex gap-4 flex-1 p-4 flex-wrap justify-center min-h-screen bg-[#00000027]">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-4">For You</h1>

                    {/* Search Box */}
                    <div className="relative mb-4 w-full max-w-[47rem] mx-auto">
                        <Input
                            placeholder="Search posts"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-12 py-2 bg-[#00000088] text-white placeholder:text-gray-400 rounded-lg focus:ring-primary/30 border-4 p-2 border-cyan-600"
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
                            <Search className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Filtered Posts */}
                    <div className="space-y-6">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
                        ) : (
                            <div className="text-white font-bold text-center">No posts found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
