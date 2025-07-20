import {
  useReplyCommentMutation,
  useToggleDisLikeOnCommentMutation,
  useToggleLikeOnCommentMutation,
} from "@/redux/features/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { ThumbsDown, ThumbsUp, Reply, Send, ChevronDown, ChevronUp, User } from "lucide-react";
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
  const [toggleCommentLike, { isLoading: toggleCommentLikeLoading }] = useToggleLikeOnCommentMutation();
  const [toggleCommentDisLike, { isLoading: toggleCommentDisLikeLoading }] = useToggleDisLikeOnCommentMutation();
  const [replyCommentMutation, { isLoading: replyCommentLoading }] = useReplyCommentMutation();

  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleToggleCommentLike = async (mode: "like" | "disLike", commentId: string) => {
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
    setShowReplyForm(false);
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLiked = comment?.likers?.includes(user?.id);
  const isDisliked = comment?.dislikers?.includes(user?.id);

  return (
      <div className="space-y-4">
        <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/40 transition-colors duration-200">
          {/* Main Comment */}
          <div className="flex items-start gap-3">
            {/* Profile Image */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-600 flex-shrink-0">
              {comment?.author?.profileImage ? (
                  <Image
                      width={40}
                      height={40}
                      src={comment?.author?.profileImage}
                      alt="profile image"
                      className="w-full h-full object-cover"
                  />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {comment?.author?.firstName?.[0]}
                  </div>
              )}
            </div>

            {/* Comment Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-white">
                    {comment?.author?.firstName} {comment?.author?.lastName}
                  </p>
                  <span className="text-xs text-slate-400">
                  {formatDate(comment?.createdAt)}
                </span>
                </div>
              </div>

              <p className="text-slate-200 leading-relaxed mb-3">{comment?.content}</p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 text-slate-400">
                {/* Like Button */}
                <button
                    onClick={() => handleToggleCommentLike("like", comment?.id)}
                    disabled={toggleCommentLikeLoading}
                    className={`flex items-center gap-1 hover:text-blue-400 transition-colors duration-200 group ${
                        isLiked ? "text-blue-400" : ""
                    }`}
                >
                  <ThumbsUp
                      className={`w-4 h-4 transition-all duration-200 group-hover:scale-110 ${
                          isLiked ? "fill-blue-400" : ""
                      } ${toggleCommentLikeLoading ? "scale-125" : ""}`}
                  />
                  <span className="text-sm font-medium">{comment?.likeCount}</span>
                </button>

                {/* Dislike Button */}
                <button
                    onClick={() => handleToggleCommentLike("disLike", comment?.id)}
                    disabled={toggleCommentDisLikeLoading}
                    className={`flex items-center gap-1 hover:text-red-400 transition-colors duration-200 group ${
                        isDisliked ? "text-red-400" : ""
                    }`}
                >
                  <ThumbsDown
                      className={`w-4 h-4 transition-all duration-200 group-hover:scale-110 ${
                          isDisliked ? "fill-red-400" : ""
                      } ${toggleCommentDisLikeLoading ? "scale-125" : ""}`}
                  />
                  <span className="text-sm font-medium">{comment?.dislikeCount}</span>
                </button>

                {/* Reply Button */}
                <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="flex items-center gap-1 hover:text-green-400 transition-colors duration-200 group"
                >
                  <Reply className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium">Reply</span>
                </button>

                {/* Show Replies Button */}
                {comment?.replies?.length > 0 && (
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-200 group"
                    >
                      {showReplies ? (
                          <ChevronUp className="w-4 h-4" />
                      ) : (
                          <ChevronDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium text-cyan-400">
                    {comment?.replies?.length} {comment?.replies?.length === 1 ? 'reply' : 'replies'}
                  </span>
                    </button>
                )}
              </div>

              {/* Reply Form */}
              {showReplyForm && (
                  <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-600 flex-shrink-0">
                        {user?.profileImage ? (
                            <Image
                                width={32}
                                height={32}
                                src={user.profileImage}
                                alt="Your profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                              {user?.firstName?.[0] || <User className="w-3 h-3" />}
                            </div>
                        )}
                      </div>

                      <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleReplySubmit();
                              }
                            }}
                            placeholder="Write a reply..."
                            className="flex-1 bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                            disabled={replyCommentLoading || !replyText.trim()}
                            onClick={handleReplySubmit}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 disabled:cursor-not-allowed"
                        >
                          {replyCommentLoading ? (
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                              <>
                                <Send className="w-3 h-3" />
                                Send
                              </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Replies Section */}
        {showReplies && comment?.replies?.length > 0 && (
            <div className="ml-8 space-y-3">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Reply className="w-4 h-4" />
                Replies to {comment?.author?.firstName}
              </h4>

              {comment?.replies.map((replyComment, index) => (
                  <div
                      key={replyComment?.id}
                      className="bg-slate-800/40 border border-slate-600/30 rounded-lg p-3 hover:bg-slate-800/60 transition-colors duration-200"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-600 flex-shrink-0">
                        {replyComment?.author?.profileImage ? (
                            <Image
                                width={32}
                                height={32}
                                src={replyComment?.author?.profileImage}
                                alt={`${replyComment?.author?.firstName}'s profile`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                              {replyComment?.author?.firstName[0]}
                            </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-white text-sm">
                            {replyComment?.author?.firstName} {replyComment?.author?.lastName}
                          </p>
                          <span className="text-xs text-slate-400">
                      {formatDate(replyComment?.createdAt)}
                    </span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                          {replyComment?.content}
                        </p>
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