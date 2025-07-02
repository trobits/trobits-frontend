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
import { Search, Video } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import AnimatedButton from "@/components/Shared/AnimatedButton";
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";
import { usePathname } from "next/navigation";
import { setPaths } from "@/redux/features/slices/authSlice";

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
  verified: boolean;
  otp?: string;
  otpExpiry?: Date;
  refreshToken?: string;
  comments: Comment[];
  posts?: any[];
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useMemo(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Component() {
  const [createPost, { isLoading: createPostLoading }] =
    useCreatePostMutation();
  const user = useAppSelector((state) => state.auth.user);
  const { data: allVideoPost, isLoading: allVideoPostLoading } =
    useGetAllVideoPostQuery("");
  const allPosts: Post[] = allVideoPost?.data.length ? allVideoPost.data : [];
  const [postContent, setPostContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const { data: userFromDbData, isLoading: userFromDbLoading } =
    useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  if (typeof window !== "undefined") {
    if (
      previousPath !== "/cryptohub/videoPost" &&
      currentPath === "/cryptohub/videoPost"
    ) {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }

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

  if (allVideoPostLoading || userFromDbLoading) return <Loading />;

  const userFromDb: User = userFromDbData?.data;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    if (selectedFile) formData.append("video", selectedFile);

    const createPostLoadingToast = toast.loading("Creating new post...");
    try {
      const response = await createPost(formData);
      if ((response as any)?.error) {
        toast.error("Failed to create a new post!");
        return;
      }
      toast.success("New post created successfully!");
      setPostContent("");
      setSelectedFile(null);
      setVideoPreview(null);
    } finally {
      toast.dismiss(createPostLoadingToast);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4 rounded-3xl shadow-xl mt-0">
      {userFromDb?.recommended && (
        <div className="w-full mb-8 max-w-4xl mx-auto p-6 bg-[#111111cc] rounded-2xl border border-gray-600/30 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full p-4 bg-[#00000060] text-white rounded-xl resize-none border border-gray-700 focus:ring focus:ring-cyan-500 transition-all duration-300"
              rows={3}
              placeholder="Share your ideas here!"
            ></textarea>
            <div className="flex items-center justify-between">
              <label
                htmlFor="fileInput"
                className="text-gray-400 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <Video className="text-white" /> Upload Video
                <input
                  id="fileInput"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 transition-all text-white font-semibold px-6 py-2 rounded-xl shadow-md"
              >
                {createPostLoading ? (
                  <AnimatedButton
                    className="px-6 py-2"
                    loading={createPostLoading}
                  />
                ) : (
                  "Post"
                )}
              </button>
            </div>
            {videoPreview && (
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-gray-400">Preview:</span>
                <video
                  className="w-64 h-36 object-cover rounded-xl border border-gray-600"
                  src={videoPreview}
                  controls
                ></video>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="flex gap-10 flex-wrap justify-center px-2">
        <div className="flex-1 max-w-4xl">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            For You
          </h1>

          <div className="relative mb-6">
            <Input
              placeholder="Search posts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c1c] text-gray-300 placeholder-gray-500 text-sm rounded-lg border border-gray-500 py-1.5 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="rounded-2xl overflow-hidden">
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="text-center text-white font-semibold">
                No posts found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
