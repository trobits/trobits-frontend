/* eslint-disable @typescript-eslint/no-unused-vars */


"use client";
import Image from "next/image";
// import { Post } from "../Cryptohub/TopicDetails";
import { Button } from "../ui/button";
import { useState } from "react";
import { useGetAllPostsQuery, useToggleLikeMutation } from "@/redux/features/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { Heart, MessageCircle } from "lucide-react";
// import CommentsModal, { IPost } from "./CommentModal";
import Link from "next/link";
import toast from "react-hot-toast";
import { format } from 'date-fns';
import { Post } from "../Cryptohub/TopicDetails";
import CommentsModal from "./CommentModal";

const PostCard = ({ post }: { post: Post }) => {
    const { refetch } = useGetAllPostsQuery("");
    const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false);
    const [ currentPost, setCurrentPost ] = useState(post);
    const [ toggleLike, { isLoading: toggleLikeLoading } ] = useToggleLikeMutation();
    const user = useAppSelector((state) => state.auth.user);

    
    const handleOpenCommentModal = () => {
        setIsOpenCommentModal(true);
    };
   
    const handleLikeToggle = async () => {
        if (!user?.id) {
            toast.error("Please Login first!");
            return;
        }

        const authorId = user.id;
        const isLiked = currentPost.likers.includes(authorId);
        const newLikeCount = isLiked ? currentPost.likeCount - 1 : currentPost.likeCount + 1;

       
        setCurrentPost((prevPost) => ({
            ...prevPost,
            likers: isLiked
                ? prevPost.likers.filter((likerId) => likerId !== authorId)
                : [ ...prevPost.likers, authorId ],
            likeCount: newLikeCount,
        }));

        try {
           
            const response = await toggleLike({ authorId, id: currentPost.id });
            
            if (response.error) {
                setCurrentPost(post); 
                toast.error("Failed to like the post.");
            }
            refetch()
        } catch (error) {
            setCurrentPost(post); 
            toast.error("Failed to like the post.");
        }
    };

    const postCreatedDate = post?.createdAt ? format(new Date(post.createdAt), 'dd MMMM yyyy') : '';
    return (
        <div
            key={currentPost.id}
            className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white
                         ${currentPost.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
        >
            {/* Author Information */}
            <div className="flex justify-between w-full items-center mb-4">
                <div className="flex">
                    {currentPost?.author?.profileImage ? (
                        <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`}>
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                                <Image
                                    width={500}
                                    height={500}
                                    src={currentPost?.author?.profileImage}
                                    alt="profile image"
                                    className="w-full rounded-full"
                                />
                            </div>
                        </Link>
                    ) : (
                        <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`}>
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                                <span className="text-lg font-bold">
                                    {currentPost?.author?.firstName?.[ 0 ]}
                                </span>
                            </div>
                        </Link>

                    )}
                    <div className="flex flex-col">
                        <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`}
                        className=" hover:text-cyan-500 transition-all"
                        >
                            <h3 className="text-sm md:font-semibold">
                                {currentPost.author?.firstName} {currentPost?.author?.lastName}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-400">
                            @{currentPost.author?.firstName} {currentPost?.author?.lastName}
                        </p>
                        <p className="text-sm text-white">
                            Posted: &nbsp;{postCreatedDate}
                        </p>
                    </div>

                    {/* <Button variant={"default"} className={` bg-cyan-600 text-white font-bold`}>Follow</Button> */}
                </div>
                <Link href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`}>
                    <Button className="px-1 py-1 md:px-3 mx:py-2 md:font-bold bg-cyan-600 text-white">
                        Details
                    </Button>
                </Link>
            </div>

            {/* Post Content */}
            <p className="font-bold text-lg mb-4">
                {currentPost.content?.length > 50 ? `${currentPost.content.slice(0, 80)}...` : currentPost.content}
            </p>

            {/* Post Image (conditionally rendered) */}
            {currentPost.image && (
                <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
                    <Link href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`} className="cursor-pointer">
                        <Image
                            src={currentPost.image}
                            alt="Post Image"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover rounded-lg mb-4"
                        />
                    </Link>
                </div>
            )}

            {
                currentPost?.video &&
                <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
                    <Link href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`} className="cursor-pointer">
                        <video
                            src={`https://${currentPost.video}`}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover rounded-lg mb-4"
                            controls
                        />
                    </Link>
                </div>
            }

            {/* Interaction Buttons */}
            <div className="flex items-center justify-between text-gray-400 mt-auto">
                {/* <div onClick={handleOpenCommentModal} className="flex items-center space-x-2 cursor-pointer">
                    <MessageCircle className="w-5 h-5" />
                    <span>{currentPost.comments.length}</span>
                </div> */}
                <Link href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`} className="flex items-center space-x-2 cursor-pointer">
                    <MessageCircle className="w-5 h-5" />
                    <span>{currentPost.comments.length}</span>
                </Link>
                <button disabled={toggleLikeLoading} onClick={handleLikeToggle} className="flex items-center space-x-2 cursor-pointer">
                    <Heart
                        fill={currentPost.likers.includes(user?.id) ? "red" : ""}
                        className={`w-5 h-5 transform transition-transform duration-200 ${toggleLikeLoading ? "scale-125" : ""}`}
                    />
                    <span>{currentPost.likeCount}</span>
                </button>
            </div>

            {/* {isOpenCommentModal && (
                <CommentsModal post={currentPost} onClose={() => setIsOpenCommentModal(false)} />
            )} */}
        </div>
    );
};

export default PostCard;
