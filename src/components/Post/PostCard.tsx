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

    // Handle comment modal open
    const handleOpenCommentModal = () => {
        setIsOpenCommentModal(true);
    };
    // Handle like toggle with optimistic UI update
    const handleLikeToggle = async () => {
        if (!user?.id) {
            toast.error("Please Login first!");
            return;
        }

        const authorId = user.id;
        const isLiked = currentPost.likers.includes(authorId);
        const newLikeCount = isLiked ? currentPost.likeCount - 1 : currentPost.likeCount + 1;

        // Optimistic update to UI
        setCurrentPost((prevPost) => ({
            ...prevPost,
            likers: isLiked
                ? prevPost.likers.filter((likerId) => likerId !== authorId)
                : [ ...prevPost.likers, authorId ],
            likeCount: newLikeCount,
        }));

        try {
            // Call the API to toggle the like
            const response = await toggleLike({ authorId, id: currentPost.id });
            // If the API call fails, revert the optimistic update
            if (response.error) {
                setCurrentPost(post); // Revert back to the original state
                toast.error("Failed to like the post.");
            }
            refetch()
        } catch (error) {
            setCurrentPost(post); // Revert back to the original state if there is an error
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
                    {currentPost.author?.profileImage ? (
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                            <Image
                                width={500}
                                height={500}
                                src={currentPost.author.profileImage}
                                alt="profile image"
                                className="w-full rounded-full"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                            <span className="text-lg font-bold">
                                {currentPost.author?.firstName?.[ 0 ]}
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <h3 className="text-sm md:font-semibold">
                            {currentPost.author?.firstName} {currentPost.author?.lastName}
                        </h3>
                        <p className="text-sm text-gray-400">
                            @{currentPost.author?.firstName} {currentPost.author?.lastName}
                        </p>
                        <p className="text-sm text-white">
                            Posted: &nbsp;{postCreatedDate}
                        </p>
                    </div>
                </div>
                <Link href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`}>
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



// "use client";
// import Image from "next/image";
// import { Button } from "../ui/button";
// import { useState } from "react";
// import { useGetAllPostsQuery, useToggleLikeMutation, useAddCommentMutation } from "@/redux/features/api/postApi";
// import { useAppSelector } from "@/redux/hooks";
// import { Heart, MessageCircle } from "lucide-react";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { format } from 'date-fns';
// import { Post, User } from "../Cryptohub/TopicDetails"; // Assuming you have types for these
// import CommentsModal from "./CommentModal";

// // Define types for Post and User
// interface Post {
//     id: string;
//     content: string;
//     createdAt: string;
//     likeCount: number;
//     commentCount: number;
//     likers: string[];  // Array of user IDs who liked the post
//     comments: Comment[];
//     image?: string;
//     video?: string;
//     author?: Author;
//     topicId: string;
// }

// interface Comment {
//     content: string;
//     authorId: string;
//     authorName: string;
//     postId: string;
// }

// interface Author {
//     profileImage?: string;
//     firstName: string;
//     lastName: string;
//     id: string;
// }

// interface User {
//     id: string;
//     firstName: string;
//     lastName: string;
//     profileImage?: string;
// }

// const PostCard = ({ post }: { post: Post }) => {
//     const { refetch } = useGetAllPostsQuery("");
//     const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false);
//     const [ currentPost, setCurrentPost ] = useState<Post>(post);
//     const [ toggleLike, { isLoading: toggleLikeLoading } ] = useToggleLikeMutation();
//     const [ addComment, { isLoading: isAddingComment } ] = useAddCommentMutation();
//     const user = useAppSelector((state) => state.auth.user); // Assuming the user is saved in Redux

//     // Handle comment modal open
//     const handleOpenCommentModal = () => {
//         setIsOpenCommentModal(true);
//     };

//     // Handle like toggle with optimistic UI update
//     const handleLikeToggle = async () => {
//         if (!user) {
//             toast.error("Please Login first!");
//             return;
//         }

//         const authorId = user.id;
//         const isLiked = currentPost.likers.includes(authorId);
//         const newLikeCount = isLiked ? currentPost.likeCount - 1 : currentPost.likeCount + 1;

//         // Optimistic update to UI
//         setCurrentPost((prevPost) => ({
//             ...prevPost,
//             likers: isLiked
//                 ? prevPost.likers.filter((likerId) => likerId !== authorId)
//                 : [ ...prevPost.likers, authorId ],
//             likeCount: newLikeCount,
//         }));

//         try {
//             // Call the API to toggle the like
//             const response = await toggleLike({ authorId, id: currentPost.id });
//             if (response.error) {
//                 setCurrentPost(post); // Revert back to the original state
//                 toast.error("Failed to like the post.");
//             }

//             refetch();
//         } catch (error) {
//             setCurrentPost(post); // Revert back to the original state if there is an error
//             toast.error("Failed to like the post.");
//         }
//     };

//     const postCreatedDate = post?.createdAt ? format(new Date(post.createdAt), 'dd MMMM yyyy') : '';

//     // Handle add comment and optimistic UI update
//     const handleAddComment = async (newComment: string) => {
//         if (!user) {
//             toast.error("Please Login first!");
//             return;
//         }

//         const newCommentData: Comment = {
//             content: newComment,
//             authorId: user.id,
//             authorName: user.firstName,
//             postId: currentPost.id,
//         };

//         // Optimistically update comments
//         setCurrentPost((prevPost) => ({
//             ...prevPost,
//             comments: [ ...prevPost.comments, newCommentData ],
//             commentCount: prevPost.commentCount + 1,
//         }));

//         try {
//             // Call the API to add the comment
//             const response = await addComment(newCommentData);
//             if (response.error) {
//                 throw new Error("Failed to add comment");
//             }

//             refetch();
//         } catch (error) {
//             // If the API call fails, revert the optimistic update
//             setCurrentPost(post); // Revert back to original state
//             toast.error("Failed to add comment.");
//         }
//     };

//     return (
//         <div
//             key={currentPost.id}
//             className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white
//                   ${currentPost.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
//         >
//             {/* Author Information */}
//             <div className="flex justify-between w-full items-center mb-4">
//                 <div className="flex">
//                     {currentPost.author?.profileImage ? (
//                         <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                             <Image
//                                 width={500}
//                                 height={500}
//                                 src={currentPost.author.profileImage}
//                                 alt="profile image"
//                                 className="w-full rounded-full"
//                             />
//                         </div>
//                     ) : (
//                         <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                             <span className="text-lg font-bold">
//                                 {currentPost.author?.firstName?.[ 0 ]}
//                             </span>
//                         </div>
//                     )}
//                     <div className="flex flex-col">
//                         <h3 className="text-sm md:font-semibold">
//                             {currentPost.author?.firstName} {currentPost.author?.lastName}
//                         </h3>
//                         <p className="text-sm text-gray-400">
//                             @{currentPost.author?.firstName} {currentPost.author?.lastName}
//                         </p>
//                         <p className="text-sm text-white">Posted: &nbsp;{postCreatedDate}</p>
//                     </div>
//                 </div>
//                 <Link href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`}>
//                     <Button className="px-1 py-1 md:px-3 mx:py-2 md:font-bold bg-cyan-600 text-white">
//                         Details
//                     </Button>
//                 </Link>
//             </div>

//             {/* Post Content */}
//             <p className="font-bold text-lg mb-4">
//                 {currentPost.content?.length > 50
//                     ? `${currentPost.content.slice(0, 80)}...`
//                     : currentPost.content}
//             </p>

//             {/* Post Image (conditionally rendered) */}
//             {currentPost.image && (
//                 <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
//                     <Link
//                         href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`}
//                         className="cursor-pointer"
//                     >
//                         <Image
//                             src={currentPost.image}
//                             alt="Post Image"
//                             width={600}
//                             height={400}
//                             className="w-full h-full object-cover rounded-lg mb-4"
//                         />
//                     </Link>
//                 </div>
//             )}

//             {/* Post Video (conditionally rendered) */}
//             {currentPost?.video && (
//                 <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
//                     <Link
//                         href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`}
//                         className="cursor-pointer"
//                     >
//                         <video
//                             src={`https://${currentPost.video}`}
//                             width={600}
//                             height={400}
//                             className="w-full h-full object-cover rounded-lg mb-4"
//                             controls
//                         />
//                     </Link>
//                 </div>
//             )}

//             {/* Interaction Buttons */}
//             <div className="flex items-center justify-between text-gray-400 mt-auto">
//                 <div
//                     onClick={handleOpenCommentModal}
//                     className="flex items-center space-x-2 cursor-pointer"
//                 >
//                     <MessageCircle className="w-5 h-5" />
//                     <span>{currentPost.commentCount}</span>
//                 </div>
//                 <button
//                     disabled={toggleLikeLoading}
//                     onClick={handleLikeToggle}
//                     className="flex items-center space-x-2 cursor-pointer"
//                 >
//                     <Heart
//                         fill={currentPost.likers.includes(user?.id) ? "red" : ""}
//                         className={`w-5 h-5 transform transition-transform duration-200 ${toggleLikeLoading ? "scale-125" : ""
//                             }`}
//                     />
//                     <span>{currentPost.likeCount}</span>
//                 </button>
//             </div>

//             {isOpenCommentModal && (
//                 <CommentsModal
//                     post={currentPost}
//                     onClose={() => setIsOpenCommentModal(false)}
//                     onAddComment={handleAddComment}
//                 />
//             )}
//         </div>
//     );
// };

// export default PostCard;





// "use client";
// import Image from "next/image";
// import { Post } from "../Cryptohub/TopicDetails";
// import { Button } from "../ui/button";
// import { useState } from "react";
// import { useToggleLikeMutation } from "@/redux/features/api/postApi";
// import { useAppSelector } from "@/redux/hooks";
// import { Heart, MessageCircle } from "lucide-react";
// import CommentsModal, { IPost } from "./CommentModal";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { format } from 'date-fns';

// const PostCard = ({ post }: { post: Post }) => {
//     const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false);
//     const [ currentPost, setCurrentPost ] = useState(post);
//     const [ localComments, setLocalComments ] = useState(post.comments || []);
//     const [ toggleLike, { isLoading: toggleLikeLoading } ] = useToggleLikeMutation();
//     const user = useAppSelector((state) => state.auth.user);

//     const handleOpenCommentModal = () => {
//         setIsOpenCommentModal(true);
//     };

//     // Optimistic like toggle
//     const handleLikeToggle = async () => {
//         if (!user) {
//             toast.error("Please Login first!");
//             return;
//         }

//         const authorId = user.id;
//         const isLiked = currentPost.likers.includes(authorId);
//         const newLikeCount = isLiked ? currentPost.likeCount - 1 : currentPost.likeCount + 1;

//         setCurrentPost((prevPost) => ({
//             ...prevPost,
//             likers: isLiked
//                 ? prevPost.likers.filter((likerId) => likerId !== authorId)
//                 : [ ...prevPost.likers, authorId ],
//             likeCount: newLikeCount,
//         }));

//         try {
//             const response = await toggleLike({ authorId, id: currentPost.id });
//             if (response.error) {
//                 setCurrentPost(post);
//                 toast.error("Failed to like the post.");
//             }
//         } catch (error) {
//             setCurrentPost(post);
//             toast.error("Failed to like the post.");
//         }
//     };

//     // Optimistic comment add
//     const handleAddComment = async (newComment: string) => {
//         if (!user) {
//             toast.error("Please Login to comment.");
//             return;
//         }

//         const newCommentData = {
//             id: Date.now().toString(), // Temporary ID for optimistic update
//             content: newComment,
//             authorId: user.id,
//             author: {
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 profileImage: user.profileImage,
//             },
//             createdAt: new Date().toISOString(),
//         };

//         setLocalComments((prevComments) => [ ...prevComments, newCommentData ]);

//         try {
//             const response = await addCommentAPI({ postId: currentPost.id, content: newComment });
//             if (response.error) {
//                 setLocalComments((prevComments) =>
//                     prevComments.filter((comment) => comment.id !== newCommentData.id)
//                 );
//                 toast.error("Failed to add comment.");
//             }
//         } catch (error) {
//             setLocalComments((prevComments) =>
//                 prevComments.filter((comment) => comment.id !== newCommentData.id)
//             );
//             toast.error("Failed to add comment.");
//         }
//     };

//     const postCreatedDate = post?.createdAt ? format(new Date(post.createdAt), 'dd MMMM yyyy') : '';

//     return (
//         <div
//             key={currentPost.id}
//             className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white
//                          ${currentPost.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
//         >
//             <div className="flex justify-between w-full items-center mb-4">
//                 <div className="flex">
//                     {currentPost.author?.profileImage ? (
//                         <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                             <Image
//                                 width={500}
//                                 height={500}
//                                 src={currentPost.author.profileImage}
//                                 alt="profile image"
//                                 className="w-full rounded-full"
//                             />
//                         </div>
//                     ) : (
//                         <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                             <span className="text-lg font-bold">
//                                 {currentPost.author?.firstName?.[ 0 ]}
//                             </span>
//                         </div>
//                     )}
//                     <div className="flex flex-col">
//                         <h3 className="text-sm md:font-semibold">
//                             {currentPost.author?.firstName} {currentPost.author?.lastName}
//                         </h3>
//                         <p className="text-sm text-gray-400">
//                             @{currentPost.author?.firstName} {currentPost.author?.lastName}
//                         </p>
//                         <p className="text-sm text-white">
//                             Posted: &nbsp;{postCreatedDate}
//                         </p>
//                     </div>
//                 </div>
//                 <Link href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`}>
//                     <Button className="px-1 py-1 md:px-3 mx:py-2 md:font-bold bg-cyan-600 text-white">
//                         Details
//                     </Button>
//                 </Link>
//             </div>

//             <p className="font-bold text-lg mb-4">
//                 {currentPost.content?.length > 50 ? `${currentPost.content.slice(0, 80)}...` : currentPost.content}
//             </p>

//             {currentPost.image && (
//                 <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
//                     <Link href={`/cryptohub/cryptochat/${currentPost.topicId}/${currentPost.id}`} className="cursor-pointer">
//                         <Image
//                             src={currentPost.image}
//                             alt="Post Image"
//                             width={600}
//                             height={400}
//                             className="w-full h-full object-cover rounded-lg mb-4"
//                         />
//                     </Link>
//                 </div>
//             )}

//             <div className="flex items-center justify-between text-gray-400 mt-auto">
//                 <div onClick={handleOpenCommentModal} className="flex items-center space-x-2 cursor-pointer">
//                     <MessageCircle className="w-5 h-5" />
//                     <span>{localComments.length}</span>
//                 </div>
//                 <button disabled={toggleLikeLoading} onClick={handleLikeToggle} className="flex items-center space-x-2 cursor-pointer">
//                     <Heart
//                         fill={currentPost.likers.includes(user?.id) ? "red" : ""}
//                         className={`w-5 h-5 transform transition-transform duration-200 ${toggleLikeLoading ? "scale-125" : ""}`}
//                     />
//                     <span>{currentPost.likeCount}</span>
//                 </button>
//             </div>

//             {isOpenCommentModal && (
//                 <CommentsModal
//                     post={currentPost as Partial<IPost>}
//                     comments={localComments}
//                     onClose={() => setIsOpenCommentModal(false)}
//                     onAddComment={handleAddComment} // Pass down the handler
//                 />
//             )}
//         </div>
//     );
// };

// export default PostCard;
