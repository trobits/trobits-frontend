/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  useReplyCommentMutation,
  useToggleDisLikeOnCommentMutation,
  useToggleLikeOnCommentMutation,
} from "@/redux/features/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { ThumbsDown, ThumbsUp, Reply } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface IUser {
  id: any;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  profileImage?: string;
  coverImage?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  followers?: any[];
  role: any;
  refreshToken?: string;
  posts: any[];
  comments: any;
}

export interface IPost {
  id: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  authorId: string;
  author: IUser;
  image?: string;
  likers?: string[];
  comments?: Comment[];
  topicId?: string;
  topic?: any;
}

export interface IComment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: IUser;
  postId: string;
  post: IPost;
  likers: string[];
  dislikers: string[];
  likeCount: number;
  dislikeCount: number;
  replyToId?: string | null;
  replies: IComment[];
}

const PostCommentCard = ({ comment }: { comment: IComment }) => {
  const user = useAppSelector((state) => state.auth.user);
  const [toggleCommentLike, { isLoading: toggleCommentLikeLoading }] =
    useToggleLikeOnCommentMutation();
  const [toggleCommentDisLike, { isLoading: toggleCommentDisLikeLoading }] =
    useToggleDisLikeOnCommentMutation();

  const [replyCommentMutation, { isLoading: replyCommentLoading }] =
    useReplyCommentMutation();

  // New state for reply functionality
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleToggleCommentLike = async (
    mode: "like" | "disLike",
    commentId: string
  ) => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    try {
      const authorId = user.id;
      const id = commentId;
      if (mode === "like") {
        await toggleCommentLike({ authorId, id });
      }
      if (mode === "disLike") {
        await toggleCommentDisLike({ authorId, id });
      }
    } catch (error: any) {
      toast.error("Failed to process like/dislike");
    }
  };

  const handleReplySubmit = async () => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    if (replyText.trim() === "") {
      toast.error("Reply cannot be empty");
      return;
    }

    const response = await replyCommentMutation({
      content: replyText,
      commentId: comment?.id,
    });

    if (response?.error) {
      toast.error("Failed to submit reply");
      return;
    }

    toast.success("Reply submitted successfully");
    setReplyText("");
    setShowReplies(true);
  };

  return (
    <div className="space-y-4">
      <div
        key={comment.id}
        className="flex items-start gap-3 bg-gray-700 p-3 rounded-lg"
      >
        {/* Profile Image */}
        {comment?.author?.profileImage ? (
          <Image
            width={500}
            height={500}
            src={comment?.author?.profileImage}
            alt="profile image"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-lg font-bold">
              {comment?.author?.firstName?.[0]}
            </span>
          </div>
        )}

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{comment?.author?.firstName}</p>
            <span className="text-xs text-gray-400">
              {new Date(comment?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-sm text-gray-300 mt-1">{comment?.content}</p>

          {/* Like and Dislike Buttons */}
          <div className="flex items-center gap-4 mt-2 text-gray-400">
            <button
              onClick={() => handleToggleCommentLike("like", comment?.id)}
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <ThumbsUp
                fill={comment?.likers.includes(user?.id) ? "blue" : ""}
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  toggleCommentLikeLoading ? "scale-125" : ""
                }`}
              />
              <span className="font-bold text-sm">{comment?.likeCount}</span>
            </button>
            <button
              onClick={() => handleToggleCommentLike("disLike", comment?.id)}
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <ThumbsDown
                fill={comment?.dislikers?.includes(user?.id) ? "" : ""}
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  toggleCommentDisLikeLoading ? "scale-125" : ""
                }`}
              />
              <span className="font-bold text-sm">{comment?.dislikeCount}</span>
            </button>
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <Reply className="w-5 h-5" />
              <span className="font-bold text-sm text-gray-200">
                Reply &nbsp;{" "}
                <span className="text-green-400 font-bold text-md">
                  ( &nbsp;{comment?.replies?.length || 0}&nbsp; replies &nbsp; )
                </span>
              </span>
            </button>
          </div>

          {/* Reply Input */}

          <div className="mt-3 flex items-center gap-2">
            <Image
              width={40}
              height={40}
              src={user?.profileImage || "https://via.placeholder.com/40"}
              alt="Your profile"
              className="w-8 h-8 rounded-full"
            />
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              disabled={replyCommentLoading}
              onClick={handleReplySubmit}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="ml-12 space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">Replies</h4>
          {comment?.replies?.length > 0 &&
            comment?.replies.map((replyComment) => (
              <div
                key={replyComment?.id}
                className="flex items-start gap-2 bg-gray-800 p-2 rounded-lg"
              >
                {replyComment?.author?.profileImage ? (
                  <Image
                    width={40}
                    height={40}
                    src={replyComment?.author?.profileImage}
                    alt={`${replyComment?.author?.firstName}'s profile`}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {replyComment?.author?.firstName[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">
                      {replyComment?.author?.firstName}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(replyComment?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {replyComment?.content}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-gray-400">


                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};


export default PostCommentCard;
