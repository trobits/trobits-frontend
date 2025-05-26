/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import Loading from "@/components/Shared/Loading";
import {
  useGetPostsByIdQuery,
  useCreateCommentMutation,
  useToggleLikeMutation,
} from "@/redux/features/api/postApi";
import { Heart, HeartIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/Shared/AnimatedButton";
import { useAppSelector } from "@/redux/hooks";
import { IUser } from "../Cryptohub/Types";
import PostCommentCard, { IComment } from "./PostCommentCard";
import { Button } from "../ui/button";

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
  author: Author;
  likeCount: number;
  dislikeCount: number;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  video: string;
  category: "IMAGE" | "VIDEO";
  image: string;
  likeCount: number;
  likers: string[];
  topicId: string;
  author: Author;
  comments: IComment[];
  viewCount: number;
}

export default function PostDetailsPage({ postId }: { postId: string }) {
  const { data, isLoading: postLoading } = useGetPostsByIdQuery(postId);
  const [ newComment, setNewComment ] = useState("");
  const [ createComment, { isLoading: createCommentLoading } ] =
    useCreateCommentMutation();
  const [ likeToggleMutation, { isLoading: likeToggleLoading } ] =
    useToggleLikeMutation();
  const user: IUser = useAppSelector((state) => state.auth.user);

  if (postLoading) {
    return <Loading />;
  }

  const post: Post = data?.data;

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    try {
      if (newComment.trim()) {
        const authorId = user?.id;
        const content = newComment.trim();
        const postId = post?.id;
        const response = await createComment({ authorId, content, postId });

        if (response?.error) {
          toast.error("Failed to create a new comment! Try again.");
        } else {
          toast.success("Comment added successfully.");
          setNewComment(""); // Clear the input
        }
      }
    } catch (error) {
      toast.error("Something went wrong! Try again.");
    }
  };

  const handleLikeToggle = async (post: Post) => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    const authorId = user?.id;
    const id = post?.id;
    const response = await likeToggleMutation({
      authorId,
      id,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f75] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Post Image and Content */}
        <div className="relative overflow-hidden mb-6">
          {post?.image && (
            <div className="aspect-[3/2] overflow-hidden rounded-xl">
              <Image
                width={600}
                height={800}
                src={post?.image as string}
                alt="Post banner"
                className="w-full h-full mt-4 rounded-xl object-cover"
              />
            </div>
          )}
          {post?.video && (
            <div className="aspect-[3/2] overflow-hidden rounded-xl">
              <video
                src={`${post.video}`}
                width={600}
                height={400}
                className="w-full h-full mt-4 rounded-xl object-cover"
                controls
              />
            </div>
          )}

          <div className="p-6 bg-[#00000096] rounded-xl mt-4 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">
              {post?.content.slice(0, 50)}
              {post?.content.length > 50 ? "..." : ""}
            </h1>
            <p className="text-lg mt-2">{post?.content}</p>
          </div>
        </div>
        {post?.video &&


          <div className="flex justify-between ml-5  ">
            <div className="inline text-white font-bold">
              Views:{post?.viewCount}
            </div>
            {/* like section */}
            <div className=" flex justify-end mt-4">
              <Button className="bg-cyan-700 px-8">
                <div
                  onClick={() => handleLikeToggle(post)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <h2 className=" mr-4">Like</h2>
                  <HeartIcon
                    scale={2}
                    size={12}
                    fill={post?.likers?.includes(user?.id) ? "red" : ""}
                    className={`w-12 h-12 transform transition-transform duration-200 ${likeToggleLoading ? "scale-125" : ""
                      }`}
                  />
                  <span>{post?.likeCount}</span>
                </div>
              </Button>
            </div>
          </div>
        }
        {/* Comments Section */}
        <div className="bg-gray-800 rounded-xl p-6 mt-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>

          {/* Comment Input Section */}
          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center gap-2 mb-6"
          >
            <input
              type="text"
              placeholder="Leave a comment..."
              value={newComment}
              required
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {createCommentLoading ? (
                <AnimatedButton loading={createCommentLoading} />
              ) : (
                "Send"
              )}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments?.length > 0 ? (
              post.comments?.map((comment: IComment) => {
                if (comment?.replyToId) {
                  return;
                }
                return (
                  <PostCommentCard
                    key={comment?.id}
                    comment={comment as IComment}
                  />
                );
              })
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
