// "use client"
// import Image from "next/image"
// import { Post } from "../Cryptohub/TopicDetails"
// import { Button } from "../ui/button"
// import { useState } from "react"
// import { useToggleLikeMutation } from "@/redux/features/api/postApi"
// import { useAppSelector } from "@/redux/hooks"
// import { Heart, MessageCircle } from "lucide-react"
// import { IUser } from "../Cryptohub/Types"
// import CommentsModal, { IPost } from "./CommentModal"
// import Link from "next/link"
// import toast from "react-hot-toast"

// const PostCard = ({ post }: { post: Post }) => {
//     const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false)
//     const [ currentPost, setCurrentPost ] = useState<Post | null>(null);
//     const [ toggleLike, { isLoading: toggleLikeLoading } ] = useToggleLikeMutation();
//     const user: IUser = useAppSelector((state) => state.auth.user);





//     const handleOpenCommentModal = (post: Post) => {
//         setIsOpenCommentModal(true);
//         setCurrentPost(post)
//     }

//     const handleLikeToggle = async (post: Post) => {
//         if(!user){
//             toast.error("Please Login first!")
//             return;
//         }
//         const authorId = user?.id;
//         const id = post?.id;
//         const response = await toggleLike({
//             authorId,
//             id
//         })
//         console.log(response);
//     }

//     return (
//         <div
//             key={post?.id}
//             className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white
//                              ${post?.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
//         >
//             {/* Author Information */}
//             <div className="flex justify-between w-full items-center mb-4">
//                 <div className=" flex">
//                     {/* conditionally render user profile image */}
//                     {
//                         post?.author?.profileImage ? <div className=" w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">

//                             <Image width={500} height={500} src={post?.author?.profileImage} alt="profile image" className=" w-full rounded-full">
//                             </Image>
//                         </div>
//                             :
//                             <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                                 <span className="text-lg font-bold">
//                                     {post?.author?.firstName?.[ 0 ]}
//                                 </span>
//                             </div>

//                     }
//                     <div className="flex flex-col">
//                         <h3 className=" text-sm md:font-semibold">
//                             {post?.author?.firstName} {post?.author?.lastName}
//                         </h3>
//                         <p className="text-sm text-gray-400">
//                             @{post?.author?.firstName} {post?.author?.lastName}
//                         </p>
//                     </div>
//                 </div>
//                 <Link href={`/cryptohub/cryptochat/${post?.topicId}/${post?.id}`} >
//                     <Button className=" px-1 py-1 md:px-3 mx:py-2 md:font-bold bg-cyan-600 text-white">
//                         Details
//                     </Button>
//                 </Link>
//             </div>

//             {/* Post Content */}
//             <p className="font-bold text-lg mb-4">
//                 {post?.content?.length > 50 ? `${post?.content?.slice(0, 80)}...` : post.content}
//             </p>

//             {/* Post Image (conditionally rendered) */}

//             {post?.image && (
//                 <div className=" h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
//                     <Link href={`/cryptohub/cryptochat/${post?.topicId}/${post?.id}`} className="cursor-pointer">
//                         <Image
//                             src={post?.image}
//                             alt="Post Image"
//                             width={600}
//                             height={400}
//                             className="w-full h-full object-cover rounded-lg mb-4"
//                         />
//                     </Link>
//                 </div>
//             )}


//             {/* Interaction Buttons */}
//             <div className="flex items-center justify-between text-gray-400 mt-auto">
//                 {/* Comments Section */}
//                 <div
//                     onClick={() => handleOpenCommentModal(post)}
//                     className="flex items-center space-x-2 cursor-pointer"
//                 >
//                     <MessageCircle className="w-5 h-5" />
//                     <span>{post?.comments?.length}</span>
//                 </div>

//                 {/* Like Section */}
//                 <div
//                     onClick={() => handleLikeToggle(post)}
//                     className="flex items-center space-x-2 cursor-pointer"
//                 >
//                     <Heart
//                         fill={post?.likers?.includes(user?.id) ? "red" : ""}
//                         className={`w-5 h-5 transform transition-transform duration-200 ${toggleLikeLoading ? "scale-125" : ""
//                             }`}
//                     />
//                     <span>{post?.likeCount}</span>
//                 </div>
//             </div>


//             {isOpenCommentModal && <CommentsModal post={currentPost as Partial<IPost>} onClose={() => setIsOpenCommentModal(false)} />}
//         </div>
//     )
// }

// export default PostCard










"use client";
import Image from "next/image";
import { Post } from "../Cryptohub/TopicDetails";
import { Button } from "../ui/button";
import { useState } from "react";
import { useToggleLikeMutation } from "@/redux/features/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { Heart, MessageCircle } from "lucide-react";
import CommentsModal, { IPost } from "./CommentModal";
import Link from "next/link";
import toast from "react-hot-toast";

const PostCard = ({ post }: { post: Post }) => {
    const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false);
    const [ currentPost, setCurrentPost ] = useState<Post | null>(post);
    const [ toggleLike, { isLoading: toggleLikeLoading } ] = useToggleLikeMutation();
    const user = useAppSelector((state) => state.auth.user);

    // Handle comment modal open
    const handleOpenCommentModal = (post: Post) => {
        setIsOpenCommentModal(true);
        setCurrentPost(post);
    };

    // Handle like toggle with optimistic UI update
    const handleLikeToggle = async (post: Post) => {
        if (!user) {
            toast.error("Please Login first!");
            return;
        }

        const authorId = user?.id;
        const id = post?.id;

        // Optimistic UI update: Update the local post data immediately
        const isLiked = post.likers.includes(authorId);
        const newLikeCount = isLiked ? post.likeCount - 1 : post.likeCount + 1;
        const updatedPost = {
            ...post,
            likers: isLiked
                ? post.likers.filter((likerId) => likerId !== authorId)
                : [ ...post.likers, authorId ],
            likeCount: newLikeCount,
        };

        // Update the post immediately (optimistic UI)
        setCurrentPost(updatedPost);

        try {
            // Call the API to toggle the like
            const response = await toggleLike({ authorId, id });

            // If the API call fails, revert the optimistic update
            if (response.error) {
                setCurrentPost(post); // Revert back to the original state
                toast.error("Failed to like the post.");
            }
        } catch (error) {
            setCurrentPost(post); // Revert back to the original state if there is an error
            console.log(error);
            toast.error("Failed to like the post.");
        }
    };

    return (
        <div
            key={post?.id}
            className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white
                             ${post?.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
        >
            {/* Author Information */}
            <div className="flex justify-between w-full items-center mb-4">
                <div className="flex">
                    {/* Profile Image */}
                    {post?.author?.profileImage ? (
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                            <Image
                                width={500}
                                height={500}
                                src={post?.author?.profileImage}
                                alt="profile image"
                                className="w-full rounded-full"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                            <span className="text-lg font-bold">{post?.author?.firstName?.[ 0 ]}</span>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <h3 className="text-sm md:font-semibold">
                            {post?.author?.firstName} {post?.author?.lastName}
                        </h3>
                        <p className="text-sm text-gray-400">
                            @{post?.author?.firstName} {post?.author?.lastName}
                        </p>
                    </div>
                </div>

                <Link href={`/cryptohub/cryptochat/${post?.topicId}/${post?.id}`}>
                    <Button className="px-1 py-1 md:px-3 mx:py-2 md:font-bold bg-cyan-600 text-white">
                        Details
                    </Button>
                </Link>
            </div>

            {/* Post Content */}
            <p className="font-bold text-lg mb-4">
                {post?.content?.length > 50 ? `${post?.content?.slice(0, 80)}...` : post.content}
            </p>

            {/* Post Image (conditionally rendered) */}
            {post?.image && (
                <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
                    <Link href={`/cryptohub/cryptochat/${post?.topicId}/${post?.id}`} className="cursor-pointer">
                        <Image
                            src={post?.image}
                            alt="Post Image"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover rounded-lg mb-4"
                        />
                    </Link>
                </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex items-center justify-between text-gray-400 mt-auto">
                {/* Comments Section */}
                <div
                    onClick={() => handleOpenCommentModal(post)}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post?.comments?.length}</span>
                </div>

                {/* Like Section */}
                <div
                    onClick={() => handleLikeToggle(post)}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <Heart
                        fill={post?.likers?.includes(user?.id) ? "red" : ""}
                        className={`w-5 h-5 transform transition-transform duration-200 ${toggleLikeLoading ? "scale-125" : ""}`}
                    />
                    <span>{post?.likeCount}</span>
                </div>
            </div>

            {isOpenCommentModal && (
                <CommentsModal post={currentPost as Partial<IPost>} onClose={() => setIsOpenCommentModal(false)} />
            )}
        </div>
    );
};

export default PostCard;
