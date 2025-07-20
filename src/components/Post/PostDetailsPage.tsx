"use client";

import Image from "next/image";
import { useState } from "react";
import Loading from "@/components/Shared/Loading";
import {
  useGetPostsByIdQuery,
  useCreateCommentMutation,
  useToggleLikeMutation,
} from "@/redux/features/api/postApi";
import { Heart, MessageCircle, ArrowLeft, Send, Play, Eye, User } from "lucide-react";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/Shared/AnimatedButton";
import { useAppSelector } from "@/redux/hooks";
import { IUser } from "../Cryptohub/Types";
import PostCommentCard, { IComment } from "./PostCommentCard";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [newComment, setNewComment] = useState("");
  const [createComment, { isLoading: createCommentLoading }] = useCreateCommentMutation();
  const [likeToggleMutation, { isLoading: likeToggleLoading }] = useToggleLikeMutation();
  const user: IUser = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  if (postLoading) {
    return <Loading />;
  }

  const post: Post = data?.data;
  const isLiked = post?.likers?.includes(user?.id);

  const handleCommentSubmit = async () => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment!");
      return;
    }

    try {
      const authorId = user?.id;
      const content = newComment.trim();
      const postId = post?.id;
      const response = await createComment({ authorId, content, postId });

      if (response?.error) {
        toast.error("Failed to create a new comment! Try again.");
      } else {
        toast.success("Comment added successfully.");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Something went wrong! Try again.");
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    const authorId = user?.id;
    const id = post?.id;
    await likeToggleMutation({ authorId, id });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
      <div className="min-h-screen w-full">
        <div className="max-w-4xl mx-auto px-4 py-6">

          {/* Back Button */}
          <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Discussion</span>
          </button>

          {/* Post Content */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden mb-6">

            {/* Author Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-4">
                <Link href={`/cryptohub/userProfile/${post?.author?.id}`}>
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-700 hover:ring-2 hover:ring-cyan-400 transition-all duration-200">
                    {post?.author?.profileImage ? (
                        <Image
                            width={56}
                            height={56}
                            src={post?.author?.profileImage}
                            alt="profile image"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                          {post?.author?.firstName?.[0]}
                        </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1">
                  <Link
                      href={`/cryptohub/userProfile/${post?.author?.id}`}
                      className="hover:text-cyan-400 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {post?.author?.firstName} {post?.author?.lastName}
                    </h3>
                  </Link>
                  <p className="text-slate-400">
                    @{post?.author?.firstName?.toLowerCase()}{post?.author?.lastName?.toLowerCase()}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatDate(post?.createdAt)}
                  </p>
                </div>

                {/* Post Type Badge */}
                <div className="flex items-center gap-2">
                  {post?.category && (
                      <span className="text-xs px-3 py-1 bg-slate-700/50 text-slate-400 rounded-full">
                    {post.category.toLowerCase()}
                  </span>
                  )}
                </div>
              </div>
            </div>

            {/* Post Content Text */}
            <div className="p-6">
              <p className="text-white text-lg leading-relaxed mb-6">
                {post?.content}
              </p>

              {/* Media Content */}
              {post?.image && (
                  <div className="relative group mb-6">
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                          width={800}
                          height={600}
                          src={post?.image}
                          alt="Post image"
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
              )}

              {post?.video && (
                  <div className="relative group mb-6">
                    <div className="relative overflow-hidden rounded-xl">
                      <video
                          src={post?.video}
                          className="w-full h-auto object-cover"
                          controls
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Play className="w-4 h-4" />
                          Video Post
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between py-4 border-t border-slate-700/50">
                <div className="flex items-center gap-6">
                  {/* Like Button */}
                  <button
                      disabled={likeToggleLoading}
                      onClick={handleLikeToggle}
                      className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors duration-200 group"
                  >
                    <Heart
                        className={`w-6 h-6 transition-all duration-200 ${
                            isLiked ? "fill-red-400 text-red-400" : "group-hover:scale-110"
                        } ${likeToggleLoading ? "scale-125" : ""}`}
                    />
                    <span className="font-medium">{post?.likeCount}</span>
                  </button>

                  {/* Comments Count */}
                  <div className="flex items-center gap-2 text-slate-400">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium">{post?.comments?.length || 0}</span>
                  </div>

                  {/* Views (for video/image posts) */}
                  {(post?.video || post?.image) && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Eye className="w-6 h-6" />
                        <span className="font-medium">{post?.viewCount || 0}</span>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">

            {/* Comments Header */}
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">
                Comments ({post?.comments?.length || 0})
              </h2>
            </div>

            {/* Add Comment Form */}
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
                  {user?.profileImage ? (
                      <Image
                          width={40}
                          height={40}
                          src={user.profileImage}
                          alt="Your profile"
                          className="w-full h-full object-cover"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {user?.firstName?.[0] || <User className="w-5 h-5" />}
                      </div>
                  )}
                </div>

                <div className="flex-1 flex gap-3">
                  <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCommentSubmit();
                        }
                      }}
                      className="flex-1 p-3 rounded-xl bg-slate-700/50 border border-slate-600 placeholder-slate-400 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                      onClick={handleCommentSubmit}
                      disabled={createCommentLoading || !newComment.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    {createCommentLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Post
                        </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {post?.comments?.length > 0 ? (
                  post.comments
                      .filter(comment => !comment?.replyToId)
                      .map((comment: IComment, index) => (
                          <div
                              key={comment?.id}
                              className="opacity-0 animate-fade-in"
                              style={{
                                animationDelay: `${index * 100}ms`,
                                animationFillMode: 'forwards'
                              }}
                          >
                            <PostCommentCard comment={comment} />
                          </div>
                      ))
              ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">No comments yet</h3>
                    <p className="text-slate-500">Be the first to share your thoughts!</p>
                  </div>
              )}
            </div>
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
  );
}