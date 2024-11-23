/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Post } from "../Cryptohub/TopicDetails";
import { useAppSelector } from "@/redux/hooks";
import { useCreateCommentMutation, useGetAllPostsQuery, useToggleDisLikeOnCommentMutation, useToggleLikeOnCommentMutation } from "@/redux/features/api/postApi";
import toast from "react-hot-toast";
import AnimatedButton from "../Shared/AnimatedButton";
import Image from "next/image";

interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
}

interface IComment {
    id: string;
    content: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    authorId: string;
    postId: string;
    likers: string[];
    dislikers: string[];
    likeCount: number;
    dislikeCount: number;
    author: IUser; // Nested author object
}

export interface IPost {
    id: string;
    content: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    authorId: string;
    image?: string;
    likeCount: number;
    likers: string[];
    topicId: string;
    author: IUser; // Nested author object
    comments: IComment[]; // Array of comments
}



export default function CommentsModal({ post, onClose }: { post: Partial<Post>, onClose: () => void }) {
    const [ newComment, setNewComment ] = useState("");
    const [ createComment, { isLoading: createCommentLoading } ] = useCreateCommentMutation();
    const user: IUser = useAppSelector((state) => state.auth.user);
    const { refetch } = useGetAllPostsQuery("");
    const comments = post?.comments as IComment[];

    const [ toggleCommentLike, { isLoading: toggleCommentLikeLoading } ] = useToggleLikeOnCommentMutation();
    const [ toggleCommentDisLike, { isLoading: toggleCommentDisLikeLoading } ] = useToggleDisLikeOnCommentMutation();




    const handleToggleCommentLike = async (mode: "like" | "disLike", commentId: string) => {
        if (!user) {
            toast.error("Please Login first!")
            return;
        }
        try {
            const authorId = user.id;
            const id = commentId;
            if (mode === "like") {
                const response = await toggleCommentLike(
                    {
                        authorId,
                        id
                    }
                )
                onClose();
            }
            if (mode === "disLike") {
                const response = await toggleCommentDisLike(
                    {
                        authorId,
                        id
                    }
                )
                onClose();
            }

        } catch (error) {
        }

    }



    const handleCommentSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please Login first!")
            return;
        }
        try {
            if (newComment.trim()) {
                const authorId = user?.id;
                const content = newComment.trim();
                const postId = post?.id;
                const response = await createComment({ authorId, content, postId })
                if (response?.error) {
                    const errorMessage = (response as { error: { data: { message: string } } })?.error?.data?.message || "Failed to create a new post!"
                    toast.error(errorMessage)
                    return
                }
                onClose();
                refetch();
                toast.success("Comment added successfully.")
            }
        } catch (error) {
            // toast.error("Something went wrong! try again.")
        }
    };


    return (
        <div className="fixed left-10 inset-0 bg-[#0000009f] flex items-center justify-center z-50 p-8">
            <div className="bg-gray-800 w-full max-w-lg rounded-lg p-6 relative text-white">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Comments</h2>

                {/* Comment Input Section */}
                <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mb-4">
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
                        {createCommentLoading ? <AnimatedButton loading={createCommentLoading} /> : "Send"}
                    </button>
                </form>

                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {comments?.map((comment) => (
                        <div key={comment?.id} className="flex items-start gap-3 bg-gray-700 p-3 rounded-lg">

                            {
                                comment?.author?.profileImage ? <div className=" w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                                    <Image width={500} height={500} src={comment?.author?.profileImage} alt="profile image" className=" w-full rounded-full">
                                    </Image>
                                </div>
                                    :
                                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                                        <span className="text-lg font-bold">
                                            {comment?.author?.firstName?.[ 0 ]}
                                        </span>
                                    </div>

                            }

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

                                <div className="flex items-center gap-4 mt-2 text-gray-400">


                                    <button
                                        onClick={() => handleToggleCommentLike("like", comment?.id)}
                                        className="flex mr-3 items-center justify-center gap-1 hover:text-gray-200">
                                        <ThumbsUp fill={comment?.dislikers?.includes(user?.id) ? "" : ""}
                                            className="mr-1" /> <span className=" font-bold text-xl">{comment?.likeCount}</span>
                                    </button>
                                    <button
                                        onClick={() => handleToggleCommentLike("disLike", comment.id)}
                                        className="flex items-center justify-center gap-1 hover:text-gray-200">
                                        <ThumbsDown fill={comment?.dislikers?.includes(user?.id) ? "" : ""}
                                            className="mr-1" /> <span className=" font-bold text-xl pb-1">{comment?.dislikeCount}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
