"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import {
  useDeletePostMutation,
  useGetAllPostsQuery,
  useIncreaseVideoViewCountMutation,
  useToggleLikeMutation,
  useUpdatePostMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/redux/features/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import {
  Heart,
  MessageCircle,
  Edit,
  Trash,
  MoreHorizontal,
  Play,
  Eye,
  Send,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Post } from "../Cryptohub/TopicDetails";

const PostCard = ({ post, refetch }: { post: Post, refetch }) => {
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [commentDropdowns, setCommentDropdowns] = useState<{[key: string]: boolean}>({});
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
  
  const [createComment, { isLoading: createCommentLoading }] = useCreateCommentMutation();
  const [deleteComment, { isLoading: deleteCommentLoading }] = useDeleteCommentMutation();
  const [updateComment, { isLoading: updateCommentLoading }] = useUpdateCommentMutation();
  const [toggleLike, { isLoading: toggleLikeLoading }] = useToggleLikeMutation();
  
  const user = useAppSelector((state) => state.auth.user);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [increaseVideoViewCount] = useIncreaseVideoViewCountMutation();
  const [updatePost, { isLoading: updateLoading }] = useUpdatePostMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deletePost, { isLoading: deletePostLoading }] = useDeletePostMutation();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Update currentPost when prop changes (important for refetch updates)
  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  const handleOpenEditModal = () => {
    setIsOpenEditModal(true);
    setShowDropdown(false);
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  const handleOpenDeleteModal = () => {
    setIsOpenDeleteModal(true);
    setShowDropdown(false);
  };

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const handleDeletePost = async () => {
    const deleteLoading = toast.loading("Deleting your post...");
    try {
      await deletePost(currentPost?.id).unwrap();
      toast.success("Post deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error("Failed to delete the post.");
    } finally {
      toast.dismiss(deleteLoading);
      handleCloseDeleteModal();
    }
  };

  const handleLikeToggle = async () => {
    if (!user?.id) {
      toast.error("Please Login first!");
      return;
    }

    const authorId = user?.id;
    const isLiked = currentPost?.likers?.includes(authorId);
    const newLikeCount = isLiked
      ? currentPost?.likeCount - 1
      : currentPost?.likeCount + 1;

    // Optimistic update
    const optimisticUpdate = {
      ...currentPost,
      likers: isLiked
        ? currentPost?.likers?.filter((likerId) => likerId !== authorId)
        : [...(currentPost?.likers || []), authorId],
      likeCount: newLikeCount,
    };

    setCurrentPost(optimisticUpdate);

    try {
      const response = await toggleLike({ authorId, id: currentPost?.id });
      if (response?.error) {
        // Revert on error
        setCurrentPost(currentPost);
        toast.error("Failed to like the post.");
      }
    } catch (error) {
      // Revert on error
      setCurrentPost(currentPost);
      toast.error("Failed to like the post.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!user?.id) {
      toast.error("Please Login first!");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await createComment({
        authorId: user.id,
        content: newComment.trim(),
        postId: currentPost.id,
      }).unwrap();

      if (response?.data) {
        // Optimistic update - add the new comment to local state
        const newCommentData = {
          id: response.data.id,
          content: newComment.trim(),
          createdAt: new Date().toISOString(),
          author: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
          },
          replyToId: null,
        };

        setCurrentPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newCommentData]
        }));

        toast.success("Comment added successfully!");
        setNewComment("");
        
        // Still call refetch to ensure data consistency
        refetch();
      } else {
        toast.error("Failed to add comment!");
      }
    } catch (error) {
      toast.error("Failed to add comment!");
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId || !user?.id) return;

    const deleteLoading = toast.loading("Deleting comment...");
    try {
      await deleteComment({
        id: deleteCommentId,
        authorId: user.id
      }).unwrap();
      
      // Optimistic update - remove comment from local state
      setCurrentPost(prev => ({
        ...prev,
        comments: prev.comments?.filter(comment => comment.id !== deleteCommentId) || []
      }));

      toast.success("Comment deleted successfully!");
      setDeleteCommentId(null);
      setIsDeleteCommentModalOpen(false);
      
      // Still call refetch to ensure data consistency
      refetch();
    } catch (error: any) {
      toast.error("Failed to delete comment.");
    } finally {
      toast.dismiss(deleteLoading);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editCommentContent.trim()) return;

    const updateLoading = toast.loading("Updating comment...");
    try {
      await updateComment({
        id: commentId,
        content: editCommentContent.trim(),
      }).unwrap();
      
      // Optimistic update - update comment in local state
      setCurrentPost(prev => ({
        ...prev,
        comments: prev.comments?.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: editCommentContent.trim() }
            : comment
        ) || []
      }));

      toast.success("Comment updated successfully!");
      setEditingCommentId(null);
      setEditCommentContent("");
      
      // Still call refetch to ensure data consistency
      refetch();
    } catch (error: any) {
      toast.error("Failed to update comment.");
    } finally {
      toast.dismiss(updateLoading);
    }
  };

  const startEditingComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditCommentContent(content);
    setCommentDropdowns({});
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const openDeleteCommentModal = (commentId: string) => {
    setDeleteCommentId(commentId);
    setIsDeleteCommentModalOpen(true);
    setCommentDropdowns({});
  };

  const closeDeleteCommentModal = () => {
    setDeleteCommentId(null);
    setIsDeleteCommentModalOpen(false);
  };

  const toggleCommentDropdown = (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCommentDropdowns(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const isCommentEditable = (commentCreatedAt: string): boolean => {
    const commentDate = new Date(commentCreatedAt);
    const now = new Date();
    const diffInHours = (now.getTime() - commentDate.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const canDeleteComment = (commentAuthorId: string): boolean => {
    return currentPost?.author?.id === user?.id || commentAuthorId === user?.id;
  };

  const canEditComment = (commentAuthorId: string, commentCreatedAt: string): boolean => {
    return commentAuthorId === user?.id && isCommentEditable(commentCreatedAt);
  };

  const toggleComments = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const handleUpdatePost = async (formData: FormData) => {
    const updateLoading = toast.loading("Updating your post...");
    if (currentPost?.category) {
      formData.append("category", currentPost?.category);
    }
    if (currentPost?.topicId) {
      formData.append("topicId", currentPost?.topicId);
    }
    try {
      const response = await updatePost({
        id: currentPost?.id,
        formData,
      }).unwrap();
      setCurrentPost(response?.data);
      toast.success("Post updated successfully!");
      handleCloseEditModal();
      refetch();
    } catch (error: any) {
      toast.error("Failed to update the post.");
    } finally {
      toast.dismiss(updateLoading);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedVideo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry?.isIntersecting) {
            if (currentPost?.video && videoRef?.current) {
              videoRef.current.muted = true;
              videoRef.current
                .play()
                .catch((err) => console.error("Autoplay failed:", err));

              increaseVideoViewCount(currentPost?.id)
                .unwrap()
                .then(() => {
                  setCurrentPost((prevPost) => ({
                    ...prevPost,
                    viewCount: (prevPost?.viewCount || 0) + 1,
                  }));
                })
                .catch((error) => {
                  console.error("Failed to increase view count:", error);
                });

              observer.unobserve(entry.target);
            } else if (currentPost?.image && imageRef?.current) {
              increaseVideoViewCount(currentPost?.id)
                .unwrap()
                .then(() => {
                  setCurrentPost((prevPost) => ({
                    ...prevPost,
                    viewCount: (prevPost?.viewCount || 0) + 1,
                  }));
                })
                .catch((error) => {
                  console.error("Failed to increase view count:", error);
                });

              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef?.current) {
      observer.observe(videoRef.current);
    }
    if (imageRef?.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (videoRef?.current) {
        observer.unobserve(videoRef.current);
      }
      if (imageRef?.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [currentPost?.id, currentPost?.video, currentPost?.image]);

  const postCreatedDate = post?.createdAt
    ? format(new Date(post?.createdAt), "MMM dd, yyyy")
    : "";
  const isLiked = currentPost?.likers?.includes(user?.id);

  return (
    <div
      className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 cursor-pointer"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const isInteractive =
          target.closest("button") ||
          target.closest("input") ||
          target.closest("video") ||
          target.closest("a") ||
          target.closest("textarea");

        if (!isInteractive && !showComments) {
          window.location.href = `/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`;
        }
      }}
    >
      {/* Author Information */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`}>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 hover:ring-2 hover:ring-cyan-400 transition-all duration-200">
              {currentPost?.author?.profileImage ? (
                <Image
                  width={48}
                  height={48}
                  src={currentPost?.author?.profileImage}
                  alt="profile image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {currentPost?.author?.firstName?.[0]}
                </div>
              )}
            </div>
          </Link>
          <div>
            <Link
              href={`/cryptohub/userProfile/${currentPost?.author?.id}`}
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              <h3 className="font-semibold text-white">
                {currentPost?.author?.firstName} {currentPost?.author?.lastName}
              </h3>
            </Link>
            <p className="text-sm text-slate-400">
              @{currentPost?.author?.firstName?.toLowerCase()}
              {currentPost?.author?.lastName?.toLowerCase()}
            </p>
            <p className="text-xs text-slate-500 mt-1">{postCreatedDate}</p>
          </div>
        </div>

        {/* Action Menu */}
        {currentPost?.author?.id === user?.id && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="text-slate-400 hover:text-white transition-colors duration-200 p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeleteModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-red-400 hover:bg-slate-700/50 transition-colors duration-200"
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{currentPost?.content}</p>
      </div>

      {/* Media Content */}
      {currentPost?.image && (
        <div className="mb-4 relative group">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              ref={imageRef}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/post_${currentPost?.id}.png`}
              alt="Post Image"
              width={600}
              height={400}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      )}

      {currentPost?.video && (
        <div className="mb-4 relative group">
          <div className="relative overflow-hidden rounded-xl">
            <video
              ref={videoRef}
              src={currentPost?.video}
              className="w-full h-auto object-cover"
              controls
              muted
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
              <div className="flex items-center gap-1 text-white text-xs">
                <Play className="w-3 h-3" />
                Video
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            disabled={toggleLikeLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleLikeToggle();
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors duration-200 group"
          >
            <Heart
              className={`w-5 h-5 transition-all duration-200 ${
                isLiked ? "fill-red-400 text-red-400" : "group-hover:scale-110"
              } ${toggleLikeLoading ? "scale-125" : ""}`}
            />
            <span className="text-sm font-medium">
              {currentPost?.likeCount || 0}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={toggleComments}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-200 group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">
              {currentPost?.comments?.length || 0}
            </span>
            {showComments ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>

          {/* Views (for video/image posts) */}
          {(currentPost?.video || currentPost?.image) && (
            <div className="flex items-center gap-2 text-slate-400">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">
                {currentPost?.viewCount || 0}
              </span>
            </div>
          )}
        </div>

        {/* Post Type Badge */}
        <div className="flex items-center gap-2">
          {currentPost?.category && (
            <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-full">
              {currentPost.category.toLowerCase()}
            </span>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-4">
          {/* Add Comment */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
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
                  {user?.firstName?.[0] || <User className="w-4 h-4" />}
                </div>
              )}
            </div>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 p-2 rounded-lg bg-slate-700/50 border border-slate-600 placeholder-slate-400 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCommentSubmit();
                }}
                disabled={createCommentLoading || !newComment.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 disabled:cursor-not-allowed"
              >
                {createCommentLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {currentPost?.comments?.length > 0 ? (
              currentPost.comments
                .filter((comment) => !comment?.replyToId)
                .slice(0, 3)
                .map((comment, index) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-600 flex-shrink-0">
                      {comment.author?.profileImage ? (
                        <Image
                          width={28}
                          height={28}
                          src={comment.author.profileImage}
                          alt="Commenter profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                          {comment.author?.firstName?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Comment Actions */}
                        {(canDeleteComment(comment.author?.id) || canEditComment(comment.author?.id, comment.createdAt)) && (
                          <div className="flex">
                            {canEditComment(comment.author?.id, comment.createdAt) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingComment(comment.id, comment.content);
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:text-white transition-colors duration-200"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            )}
                            {canDeleteComment(comment.author?.id) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteCommentModal(comment.id);
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:text-red-400 transition-colors duration-200"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {editingCommentId === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full p-2 text-sm bg-slate-600/50 border border-slate-500 rounded text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditComment(comment.id);
                              }}
                              disabled={updateCommentLoading}
                              className="px-2 py-1 text-xs bg-cyan-500 hover:bg-cyan-600 text-white rounded transition-colors duration-200"
                            >
                              {updateCommentLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEditingComment();
                              }}
                              className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-300 text-sm">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-slate-400 text-sm text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}

            {currentPost?.comments?.length > 3 && (
              <Link
                href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`}
                className="block text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium py-2 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                View all {currentPost.comments.length} comments
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isOpenEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Post</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdatePost(formData);
            }}>
              <textarea
                name="content"
                defaultValue={currentPost?.content}
                className="w-full p-3 mb-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                rows={4}
                placeholder="What's on your mind?"
              />

              {currentPost?.image && (
                <div className="mb-4">
                  <Image
                    src={selectedImage || currentPost?.image}
                    alt="Post Image"
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover rounded-xl mb-2"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white hover:file:bg-slate-600 transition-colors duration-200"
                    onChange={handleImageChange}
                  />
                </div>
              )}

              {currentPost?.video && (
                <div className="mb-4">
                  <video
                    src={selectedVideo || currentPost?.video}
                    controls
                    className="w-full h-48 object-cover rounded-xl mb-2"
                  />
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white hover:file:bg-slate-600 transition-colors duration-200"
                    onChange={handleVideoChange}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  disabled={updateLoading}
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  disabled={updateLoading}
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200"
                >
                  {updateLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isOpenDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Delete Post</h2>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                disabled={deletePostLoading}
                type="button"
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                disabled={deletePostLoading}
                type="button"
                onClick={handleDeletePost}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200"
              >
                {deletePostLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
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

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Click outside to close comment dropdowns */}
      {Object.values(commentDropdowns).some(Boolean) && (
        <div
          className="fixed inset-0 z-15"
          onClick={() => setCommentDropdowns({})}
        />
      )}
    </div>
  );
};

export default PostCard;