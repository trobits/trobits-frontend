import {
  useReplyCommentMutation,
  useToggleDisLikeOnCommentMutation,
  useToggleLikeOnCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/redux/features/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { ThumbsDown, ThumbsUp, Reply, Send, ChevronDown, ChevronUp, User, Edit3, Trash2, Check, X } from "lucide-react";
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

// Separate Reply Component for recursive rendering
const ReplyComponent: React.FC<{
  replyComment: IComment;
  depth: number;
  user: any;
  onToggleLike: (mode: "like" | "disLike", commentId: string) => Promise<void>;
  onReplySubmit: (content: string, commentId: string) => Promise<void>;
  onEditComment: (comment: IComment, isReply: boolean) => void;
  onDeleteComment: (commentId: string) => void;
  onSaveEdit: (commentId: string, content: string, isReply: boolean) => Promise<void>;
  onCancelEdit: (isReply: boolean) => void;
  canDeleteComment: (comment: IComment) => boolean;
  canEditComment: (comment: IComment) => boolean;
  formatDate: (date: Date) => string;
  editingReplyId: string | null;
  editingReplyContent: string;
  setEditingReplyContent: (content: string) => void;
  updateCommentLoading: boolean;
  toggleCommentLikeLoading: boolean;
  toggleCommentDisLikeLoading: boolean;
  replyCommentLoading: boolean;
}> = ({
  replyComment,
  depth,
  user,
  onToggleLike,
  onReplySubmit,
  onEditComment,
  onDeleteComment,
  onSaveEdit,
  onCancelEdit,
  canDeleteComment,
  canEditComment,
  formatDate,
  editingReplyId,
  editingReplyContent,
  setEditingReplyContent,
  updateCommentLoading,
  toggleCommentLikeLoading,
  toggleCommentDisLikeLoading,
  replyCommentLoading
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showNestedReplies, setShowNestedReplies] = useState(true);

  const isEditingThisReply = editingReplyId === replyComment.id;
  const replyLiked = replyComment?.likers?.includes(user?.id);
  const replyDisliked = replyComment?.dislikers?.includes(user?.id);

  const handleReplySubmit = async () => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    if (replyText.trim() === "") {
      toast.error("Reply cannot be empty");
      return;
    }

    await onReplySubmit(replyText, replyComment.id);
    setReplyText("");
    setShowReplyForm(false);
  };

  const renderCommentActions = () => {
    return (
      <div className="flex items-center gap-2">
        {canEditComment(replyComment) && (
          <button
            onClick={() => onEditComment(replyComment, true)}
            disabled={isEditingThisReply}
            className="text-slate-400 hover:text-blue-400 transition-colors duration-200 p-1"
            title="Edit comment"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
        {canDeleteComment(replyComment) && (
          <button
            onClick={() => onDeleteComment(replyComment.id)}
            className="text-slate-400 hover:text-red-400 transition-colors duration-200 p-1"
            title="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  const marginLeft = Math.min(depth * 20, 60); // Cap the indentation to prevent excessive nesting

  return (
    <div className="space-y-2" style={{ marginLeft: `${marginLeft}px` }}>
      <div className="bg-slate-800/40 border border-slate-600/30 rounded-lg p-3 hover:bg-slate-800/60 transition-colors duration-200">
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
              <div>
                <p className="font-semibold text-white text-sm">
                  {replyComment?.author?.firstName} {replyComment?.author?.lastName}
                </p>
                <span className="text-xs text-slate-400">
                  {formatDate(replyComment?.createdAt)}
                </span>
              </div>
              {renderCommentActions()}
            </div>
            
            {isEditingThisReply ? (
              <div className="space-y-2">
                <textarea
                  value={editingReplyContent}
                  onChange={(e) => setEditingReplyContent(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-600/50 border border-slate-500 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
                  rows={2}
                  placeholder="Edit your reply..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSaveEdit(replyComment.id, editingReplyContent, true)}
                    disabled={updateCommentLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg font-medium transition-colors duration-200 flex items-center gap-1 disabled:opacity-50 text-xs"
                  >
                    {updateCommentLoading ? (
                      <div className="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="w-2 h-2" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => onCancelEdit(true)}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 rounded-lg font-medium transition-colors duration-200 flex items-center gap-1 text-xs"
                  >
                    <X className="w-2 h-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-200 text-sm leading-relaxed mb-2">
                  {replyComment?.content}
                </p>

                {/* Reply Actions */}
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  {/* Like Button for Reply */}
                  <button
                    onClick={() => onToggleLike("like", replyComment?.id)}
                    disabled={toggleCommentLikeLoading}
                    className={`flex items-center gap-1 hover:text-blue-400 transition-colors duration-200 group ${
                      replyLiked ? "text-blue-400" : ""
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3 h-3 transition-all duration-200 group-hover:scale-110 ${
                        replyLiked ? "fill-blue-400" : ""
                      }`}
                    />
                    <span className="font-medium">{replyComment?.likeCount}</span>
                  </button>

                  {/* Dislike Button for Reply */}
                  <button
                    onClick={() => onToggleLike("disLike", replyComment?.id)}
                    disabled={toggleCommentDisLikeLoading}
                    className={`flex items-center gap-1 hover:text-red-400 transition-colors duration-200 group ${
                      replyDisliked ? "text-red-400" : ""
                    }`}
                  >
                    <ThumbsDown
                      className={`w-3 h-3 transition-all duration-200 group-hover:scale-110 ${
                        replyDisliked ? "fill-red-400" : ""
                      }`}
                    />
                    <span className="font-medium">{replyComment?.dislikeCount}</span>
                  </button>

                  {/* Reply Button */}
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="flex items-center gap-1 hover:text-green-400 transition-colors duration-200 group"
                  >
                    <Reply className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Reply</span>
                  </button>

                  {/* Show nested replies toggle */}
                  {replyComment?.replies?.length > 0 && (
                    <button
                      onClick={() => setShowNestedReplies(!showNestedReplies)}
                      className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-200 group"
                    >
                      {showNestedReplies ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      <span className="font-medium text-cyan-400">
                        {replyComment?.replies?.length} {replyComment?.replies?.length === 1 ? 'reply' : 'replies'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                  <div className="mt-3 p-2 bg-slate-900/50 rounded-lg border border-slate-600/30">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-600 flex-shrink-0">
                        {user?.profileImage ? (
                          <Image
                            width={24}
                            height={24}
                            src={user.profileImage}
                            alt="Your profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                            {user?.firstName?.[0] || <User className="w-2 h-2" />}
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
                          placeholder={`Reply to ${replyComment?.author?.firstName}...`}
                          className="flex-1 bg-slate-700/50 border border-slate-600 text-white px-2 py-1 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          disabled={replyCommentLoading || !replyText.trim()}
                          onClick={handleReplySubmit}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 disabled:cursor-not-allowed"
                        >
                          {replyCommentLoading ? (
                            <div className="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send className="w-2 h-2" />
                              Send
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recursively render nested replies */}
      {showNestedReplies && replyComment?.replies?.length > 0 && (
        <div className="space-y-2">
          {replyComment.replies.map((nestedReply) => (
            <ReplyComponent
              key={nestedReply.id}
              replyComment={nestedReply}
              depth={depth + 1}
              user={user}
              onToggleLike={onToggleLike}
              onReplySubmit={onReplySubmit}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              canDeleteComment={canDeleteComment}
              canEditComment={canEditComment}
              formatDate={formatDate}
              editingReplyId={editingReplyId}
              editingReplyContent={editingReplyContent}
              setEditingReplyContent={setEditingReplyContent}
              updateCommentLoading={updateCommentLoading}
              toggleCommentLikeLoading={toggleCommentLikeLoading}
              toggleCommentDisLikeLoading={toggleCommentDisLikeLoading}
              replyCommentLoading={replyCommentLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PostCommentCard = ({ comment, isTopLevel = true }: { comment: IComment; isTopLevel?: boolean }) => {
  const user = useAppSelector((state) => state.auth.user);
  const [toggleCommentLike, { isLoading: toggleCommentLikeLoading }] = useToggleLikeOnCommentMutation();
  const [toggleCommentDisLike, { isLoading: toggleCommentDisLikeLoading }] = useToggleDisLikeOnCommentMutation();
  const [replyCommentMutation, { isLoading: replyCommentLoading }] = useReplyCommentMutation();
  const [updateComment, { isLoading: updateCommentLoading }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: deleteCommentLoading }] = useDeleteCommentMutation();

  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

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

  const handleReplySubmit = async (content: string, commentId: string) => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    if (content.trim() === "") {
      toast.error("Reply cannot be empty");
      return;
    }

    const response = await replyCommentMutation({
      content: content.trim(),
      commentId: commentId,
    });

    if (response?.error) {
      toast.error("Failed to submit reply");
      return;
    }

    toast.success("Reply submitted successfully");
    setShowReplies(true);
  };

  const handleMainReplySubmit = async () => {
    await handleReplySubmit(replyText, comment.id);
    setReplyText("");
    setShowReplyForm(false);
  };

  const handleEditComment = (commentToEdit: IComment, isReply: boolean = false) => {
    if (isReply) {
      setEditingReplyId(commentToEdit.id);
      setEditingReplyContent(commentToEdit.content);
    } else {
      setEditingCommentId(commentToEdit.id);
      setEditingCommentContent(commentToEdit.content);
    }
  };

  const handleSaveEdit = async (commentId: string, content: string, isReply: boolean = false) => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      const response = await updateComment({
        id: commentId,
        content: content.trim(),
      });

      if (response?.error) {
        toast.error("Failed to update comment! Try again.");
      } else {
        toast.success("Comment updated successfully.");
        if (isReply) {
          setEditingReplyId(null);
          setEditingReplyContent("");
        } else {
          setEditingCommentId(null);
          setEditingCommentContent("");
        }
      }
    } catch (error) {
      toast.error("Something went wrong! Try again.");
    }
  };

  const handleCancelEdit = (isReply: boolean = false) => {
    if (isReply) {
      setEditingReplyId(null);
      setEditingReplyContent("");
    } else {
      setEditingCommentId(null);
      setEditingCommentContent("");
    }
  };

  const handleDeleteComment = async () => {
    if (!user || !commentToDelete) {
      toast.error("Please Login first!");
      return;
    }

    try {
      const response = await deleteComment({ 
        id: commentToDelete,
        authorId: user.id 
      });

      if (response?.error) {
        toast.error("Failed to delete comment! Try again.");
      } else {
        toast.success("Comment deleted successfully.");
        closeDeleteCommentModal();
      }
    } catch (error) {
      toast.error("Something went wrong! Try again.");
    }
  };

  const openDeleteCommentModal = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsDeleteCommentModalOpen(true);
  };

  const closeDeleteCommentModal = () => {
    setCommentToDelete(null);
    setIsDeleteCommentModalOpen(false);
  };

  const canDeleteComment = (commentToCheck: IComment) => {
    return user && (comment.authorId === user.id || commentToCheck.authorId === user.id);
  };

  const canEditComment = (commentToCheck: IComment) => {
    if (!user || commentToCheck.authorId !== user.id) return false;
    
    const commentDate = new Date(commentToCheck.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - commentDate.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
  };

  const renderCommentActions = (commentToRender: IComment, isReply: boolean = false) => {
    return (
      <div className="flex items-center gap-2 mt-2">
        {canEditComment(commentToRender) && (
          <button
            onClick={() => handleEditComment(commentToRender, isReply)}
            disabled={isReply ? editingReplyId === commentToRender.id : editingCommentId === commentToRender.id}
            className="text-slate-400 hover:text-blue-400 transition-colors duration-200 p-1"
            title="Edit comment"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
        {canDeleteComment(commentToRender) && (
          <button
            onClick={() => openDeleteCommentModal(commentToRender.id)}
            disabled={deleteCommentLoading}
            className="text-slate-400 hover:text-red-400 transition-colors duration-200 p-1"
            title="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
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
  const isEditingMainComment = editingCommentId === comment.id;

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
              <div className="w-full">
                <div className="flex justify-between items-center gap-2 min-w-full">
                  <p className="font-semibold text-white">
                    {comment?.author?.firstName} {comment?.author?.lastName}
                  </p>
                  {renderCommentActions(comment)}
                </div>
                <span className="text-xs text-slate-400">
                  {formatDate(comment?.createdAt)}
                </span>
              </div>
            </div>

            {isEditingMainComment ? (
              <div className="space-y-3 mb-3">
                <textarea
                  value={editingCommentContent}
                  onChange={(e) => setEditingCommentContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-600/50 border border-slate-500 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Edit your comment..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveEdit(comment.id, editingCommentContent)}
                    disabled={updateCommentLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-medium transition-colors duration-200 flex items-center gap-1 disabled:opacity-50 text-sm"
                  >
                    {updateCommentLoading ? (
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => handleCancelEdit()}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg font-medium transition-colors duration-200 flex items-center gap-1 text-sm"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-200 leading-relaxed mb-3">{comment?.content}</p>
              </>
            )}

            {!isEditingMainComment && (
              <>
                {/* Action Buttons */}
                <div className="flex items-center gap-4 text-slate-400 mt-3">
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
                              handleMainReplySubmit();
                            }
                          }}
                          placeholder="Write a reply..."
                          className="flex-1 bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          disabled={replyCommentLoading || !replyText.trim()}
                          onClick={handleMainReplySubmit}
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
              </>
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

          {comment?.replies.map((replyComment) => (
            <ReplyComponent
              key={replyComment.id}
              replyComment={replyComment}
              depth={0}
              user={user}
              onToggleLike={handleToggleCommentLike}
              onReplySubmit={handleReplySubmit}
              onEditComment={handleEditComment}
              onDeleteComment={openDeleteCommentModal}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              canDeleteComment={canDeleteComment}
              canEditComment={canEditComment}
              formatDate={formatDate}
              editingReplyId={editingReplyId}
              editingReplyContent={editingReplyContent}
              setEditingReplyContent={setEditingReplyContent}
              updateCommentLoading={updateCommentLoading}
              toggleCommentLikeLoading={toggleCommentLikeLoading}
              toggleCommentDisLikeLoading={toggleCommentDisLikeLoading}
              replyCommentLoading={replyCommentLoading}
            />
          ))}
        </div>
      )}

      {/* Delete Comment Confirmation Modal */}
      {isDeleteCommentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Delete Comment</h2>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this comment? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                disabled={deleteCommentLoading}
                type="button"
                onClick={closeDeleteCommentModal}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                disabled={deleteCommentLoading}
                type="button"
                onClick={handleDeleteComment}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200"
              >
                {deleteCommentLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCommentCard;