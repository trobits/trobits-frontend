/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Post } from "../Cryptohub/TopicDetails";
import { useAppSelector } from "@/redux/hooks";
import { IUser } from "../Cryptohub/Types";
import { useCreateCommentMutation } from "@/redux/features/api/postApi";
import toast from "react-hot-toast";
import AnimatedButton from "../Shared/AnimatedButton";
import Image from "next/image";

interface Comment {
    id: string;
    author: string;
    text: string;
    date: string;
    likes: number;
    dislikes: number;
}



export default function CommentsModal({ post, onClose }: { post: Post, onClose: () => void }) {
    const [ newComment, setNewComment ] = useState("");
    const [ createComment, { isLoading: createCommentLoading } ] = useCreateCommentMutation();
    const user: IUser = useAppSelector((state) => state.auth.user);

    const handleCommentSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (newComment.trim()) {
                const authorId = user.id;
                const content = newComment.trim();
                const postId = post.id;
                const response = await createComment({ authorId, content, postId })
                if (response?.error) {
                    toast.error("Failed to create a new comment!Try again.")
                }
                onClose();
                toast.success("Comment added successfully.")
            }
        } catch (error) {
            toast.error("Something went wrong! try again.")
        }
    };

    return (
        <div className="fixed inset-0 bg-[#00000027] flex items-center justify-center z-50 p-4">
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
                    {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3 bg-gray-700 p-3 rounded-lg">

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
                                    <p className="font-semibold">{comment.author.firstName}</p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{comment.content}</p>

                                <div className="flex items-center gap-4 mt-2 text-gray-400">
                                    <button className="flex mr-3 items-center justify-center gap-1 hover:text-gray-200">
                                        <ThumbsUp className=" mr-1" /> <span className=" font-bold text-xl">{comment.likeCount}</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-1 hover:text-gray-200">
                                        <ThumbsDown className=" mr-1" /> <span className=" font-bold text-xl pb-1">{comment.dislikeCount}</span>
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
