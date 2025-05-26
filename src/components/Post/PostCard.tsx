/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// "use client";
// import Image from "next/image";
// import { Button } from "../ui/button";
// import { useEffect, useRef, useState } from "react";
// import { useDeletePostMutation, useGetAllPostsQuery, useIncreaseVideoViewCountMutation, useToggleLikeMutation, useUpdatePostMutation } from "@/redux/features/api/postApi";
// import { useAppSelector } from "@/redux/hooks";
// import { Heart, MessageCircle, Edit } from "lucide-react";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { format } from 'date-fns';
// import { Post } from "../Cryptohub/TopicDetails";
// import CommentsModal from "./CommentModal";

// const PostCard = ({ post }: { post: Post }) => {
//     const { refetch } = useGetAllPostsQuery("");
//     const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false);
//     const [ isOpenEditModal, setIsOpenEditModal ] = useState(false);
//     const [ currentPost, setCurrentPost ] = useState(post);
//     const [ toggleLike, { isLoading: toggleLikeLoading } ] = useToggleLikeMutation();
//     const user = useAppSelector((state) => state.auth.user);
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const [ increaseVideoViewCount ] = useIncreaseVideoViewCountMutation();
//     const [ updatePost, { isLoading: updateLoading } ] = useUpdatePostMutation();
//     const [ selectedImage, setSelectedImage ] = useState<string | null>(null); // For image preview
//     const [ deletePost, { isLoading: deletePostLoading } ] = useDeletePostMutation();

//     const [ selectedVideo, setSelectedVideo ] = useState<string | null>(null); // For video preview

//     const handleOpenCommentModal = () => {
//         setIsOpenCommentModal(true);
//     };

//     const handleOpenEditModal = () => {
//         setIsOpenEditModal(true);
//         // Reset selected image and video when modal opens
//         setSelectedImage(null);
//         setSelectedVideo(null);
//     };

//     const handleCloseEditModal = () => {
//         setIsOpenEditModal(false);
//     };

//     const handleLikeToggle = async () => {
//         if (!user?.id) {
//             toast.error("Please Login first!");
//             return;
//         }

//         const authorId = user?.id;
//         const isLiked = currentPost?.likers?.includes(authorId);
//         const newLikeCount = isLiked ? currentPost?.likeCount - 1 : currentPost?.likeCount + 1;

//         setCurrentPost((prevPost) => ({
//             ...prevPost,
//             likers: isLiked
//                 ? prevPost?.likers?.filter((likerId) => likerId !== authorId)
//                 : [ ...prevPost?.likers, authorId ],
//             likeCount: newLikeCount,
//         }));

//         try {
//             const response = await toggleLike({ authorId, id: currentPost?.id });

//             if (response?.error) {
//                 setCurrentPost(post);
//                 toast.error("Failed to like the post.");
//             }
//         } catch (error) {
//             setCurrentPost(post);
//             toast.error("Failed to like the post.");
//         }
//     };

//     const handleUpdatePost = async (formData: FormData) => {
//         const updateLoading = toast.loading("Updating your post...");
//         try {
//             const response = await updatePost({ id: currentPost?.id, formData }).unwrap();
//             console.log(response?.data);
//             setCurrentPost(response?.data);
//             toast.success("Post updated successfully!");
//             handleCloseEditModal();
//             refetch();
//         } catch (error: any) {
//             toast.error("Failed to update the post.");
//         } finally {
//             toast.dismiss(updateLoading);
//         }
//     };

//     // Handle image selection for preview
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[ 0 ];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setSelectedImage(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Handle video selection for preview
//     const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[ 0 ];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setSelectedVideo(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry?.isIntersecting && currentPost?.video && videoRef?.current) {
//                         videoRef.current.muted = true;
//                         videoRef.current.play().catch((err) => console.error("Autoplay failed:", err));

//                         increaseVideoViewCount(currentPost?.id)
//                             .unwrap()
//                             .then(() => {
//                                 setCurrentPost((prevPost) => ({
//                                     ...prevPost,
//                                     viewCount: prevPost?.viewCount + 1,
//                                 }));
//                             })
//                             .catch((error) => {
//                                 console.error("Failed to increase view count:", error);
//                             });

//                         observer.unobserve(entry.target);
//                     }
//                 });
//             },
//             {
//                 threshold: 0.5,
//             }
//         );

//         if (videoRef?.current) {
//             observer.observe(videoRef.current);
//         }

//         return () => {
//             if (videoRef?.current) {
//                 observer.unobserve(videoRef.current);
//             }
//         };
//     }, [ currentPost?.id, currentPost?.video ]);

//     const postCreatedDate = post?.createdAt ? format(new Date(post?.createdAt), 'dd MMMM yyyy') : '';

//     return (
//         <div
//             key={currentPost?.id}
//             className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white ${currentPost?.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
//         >
//             {/* Author Information */}
//             <div className="flex justify-between w-full items-center mb-4">
//                 <div className="flex">
//                     {currentPost?.author?.profileImage ? (
//                         <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`}>
//                             <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                                 <Image
//                                     width={500}
//                                     height={500}
//                                     src={currentPost?.author?.profileImage}
//                                     alt="profile image"
//                                     className="w-full rounded-full"
//                                 />
//                             </div>
//                         </Link>
//                     ) : (
//                         <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`}>
//                             <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                                 <span className="text-lg font-bold">
//                                     {currentPost?.author?.firstName?.[ 0 ]}
//                                 </span>
//                             </div>
//                         </Link>
//                     )}
//                     <div className="flex flex-col">
//                         <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`} className="hover:text-cyan-500 transition-all">
//                             <h3 className="text-sm md:font-semibold">
//                                 {currentPost?.author?.firstName} {currentPost?.author?.lastName}
//                             </h3>
//                         </Link>
//                         <p className="text-sm text-gray-400">
//                             @{currentPost?.author?.firstName} {currentPost?.author?.lastName}
//                         </p>
//                         <p className="text-sm text-white">
//                             Posted: &nbsp;{postCreatedDate}
//                         </p>
//                     </div>
//                 </div>
//                 {currentPost?.author?.id === user?.id && (
//                     <button onClick={handleOpenEditModal} className="text-gray-400 hover:text-cyan-500 transition-all">
//                         <Edit className="w-5 h-5" />
//                     </button>
//                 )}
//             </div>

//             {/* Post Content */}
//             <p className="font-bold text-lg mb-4">
//                 {currentPost?.content?.length > 50 ? `${currentPost?.content?.slice(0, 80)}...` : currentPost?.content}
//             </p>

//             {/* Video Post */}
//             {currentPost?.video && (
//                 <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
//                     <Link href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`} className="cursor-pointer">
//                         <video
//                             ref={videoRef}
//                             src={currentPost?.video}
//                             width={600}
//                             height={400}
//                             className="w-full h-full object-cover rounded-lg mb-4"
//                             controls
//                             muted
//                         />
//                     </Link>
//                 </div>
//             )}

//             {/* Interaction Buttons */}
//             <div className="flex items-center justify-between text-gray-400 mt-auto">
//                 <Link href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`} className="flex items-center space-x-2 cursor-pointer">
//                     <MessageCircle className="w-5 h-5" />
//                     <span>{currentPost?.comments?.length}</span>
//                 </Link>

//                 <div className="font-bold text-white">{currentPost?.video ? `Views: ${currentPost?.viewCount}` : ""}</div>
//                 <button disabled={toggleLikeLoading} onClick={handleLikeToggle} className="flex items-center space-x-2 cursor-pointer">
//                     <Heart
//                         fill={currentPost?.likers?.includes(user?.id) ? "red" : ""}
//                         className={`w-5 h-5 transform transition-transform duration-200 ${toggleLikeLoading ? "scale-125" : ""}`}
//                     />
//                     <span>{currentPost?.likeCount}</span>
//                 </button>
//             </div>

//             {/* Edit Modal */}
//             {isOpenEditModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
//                         <h2 className="text-xl font-bold mb-4">Edit Post</h2>
//                         <form onSubmit={(e) => {
//                             e.preventDefault();
//                             const formData = new FormData(e.currentTarget);
//                             handleUpdatePost(formData);
//                         }}>
//                             <textarea
//                                 name="content"
//                                 defaultValue={currentPost?.content}
//                                 className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
//                                 rows={4}
//                             />
//                             {currentPost?.image && (
//                                 <div className="mb-4">
//                                     {/* Show selected image or current image */}
//                                     <Image
//                                         src={selectedImage || currentPost?.image}
//                                         alt="Post Image"
//                                         width={500}
//                                         height={300}
//                                         className="w-full h-48 object-cover rounded-lg"
//                                     />
//                                     <input
//                                         type="file"
//                                         name="image"
//                                         accept="image/*"
//                                         className="mt-2"
//                                         onChange={handleImageChange}
//                                     />
//                                 </div>
//                             )}
//                             {currentPost?.video && (
//                                 <div className="mb-4">
//                                     {/* Show selected video or current video */}
//                                     <video
//                                         src={selectedVideo || currentPost?.video}
//                                         controls
//                                         className="w-full h-48 object-cover rounded-lg"
//                                     />
//                                     <input
//                                         type="file"
//                                         name="video"
//                                         accept="video/*"
//                                         className="mt-2"
//                                         onChange={handleVideoChange}
//                                     />
//                                 </div>
//                             )}
//                             <div className="flex justify-end">
//                                 <button
//                                     disabled={updateLoading}
//                                     type="button"
//                                     onClick={handleCloseEditModal}
//                                     className="mr-2 px-4 py-2 bg-gray-600 rounded-lg text-white"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     disabled={updateLoading}
//                                     type="submit"
//                                     className="px-4 py-2 bg-cyan-500 rounded-lg text-white"
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PostCard;




// "use client";
// import Image from "next/image";
// import { Button } from "../ui/button";
// import { useEffect, useRef, useState } from "react";
// import { useDeletePostMutation, useGetAllPostsQuery, useIncreaseVideoViewCountMutation, useToggleLikeMutation, useUpdatePostMutation } from "@/redux/features/api/postApi";
// import { useAppSelector } from "@/redux/hooks";
// import { Heart, MessageCircle, Edit, Trash } from "lucide-react";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { format } from 'date-fns';
// import { Post } from "../Cryptohub/TopicDetails";
// import CommentsModal from "./CommentModal";

// const PostCard = ({ post }: { post: Post }) => {
//     const { refetch } = useGetAllPostsQuery("");
//     const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false);
//     const [ isOpenEditModal, setIsOpenEditModal ] = useState(false);
//     const [ isOpenDeleteModal, setIsOpenDeleteModal ] = useState(false); // For delete confirmation
//     const [ currentPost, setCurrentPost ] = useState(post);
//     const [ toggleLike, { isLoading: toggleLikeLoading } ] = useToggleLikeMutation();
//     const user = useAppSelector((state) => state.auth.user);
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const [ increaseVideoViewCount ] = useIncreaseVideoViewCountMutation();
//     const [ updatePost, { isLoading: updateLoading } ] = useUpdatePostMutation();
//     const [ selectedImage, setSelectedImage ] = useState<string | null>(null); // For image preview
//     const [ deletePost, { isLoading: deletePostLoading } ] = useDeletePostMutation();
//     const [ selectedVideo, setSelectedVideo ] = useState<string | null>(null); // For video preview

//     const handleOpenCommentModal = () => {
//         setIsOpenCommentModal(true);
//     };

//     const handleOpenEditModal = () => {
//         setIsOpenEditModal(true);
//         // Reset selected image and video when modal opens
//         setSelectedImage(null);
//         setSelectedVideo(null);
//     };

//     const handleCloseEditModal = () => {
//         setIsOpenEditModal(false);
//     };

//     const handleOpenDeleteModal = () => {
//         setIsOpenDeleteModal(true); // Open delete confirmation modal
//     };

//     const handleCloseDeleteModal = () => {
//         setIsOpenDeleteModal(false); // Close delete confirmation modal
//     };

//     const handleDeletePost = async () => {
//         const deleteLoading = toast.loading("Deleting your post...");
//         try {
//             await deletePost(currentPost?.id).unwrap();
//             toast.success("Post deleted successfully!");
//             refetch(); // Refetch posts after deletion
//         } catch (error: any) {
//             toast.error("Failed to delete the post.");
//         } finally {
//             toast.dismiss(deleteLoading);
//             handleCloseDeleteModal(); // Close the delete confirmation modal
//         }
//     };

//     const handleLikeToggle = async () => {
//         if (!user?.id) {
//             toast.error("Please Login first!");
//             return;
//         }

//         const authorId = user?.id;
//         const isLiked = currentPost?.likers?.includes(authorId);
//         const newLikeCount = isLiked ? currentPost?.likeCount - 1 : currentPost?.likeCount + 1;

//         setCurrentPost((prevPost) => ({
//             ...prevPost,
//             likers: isLiked
//                 ? prevPost?.likers?.filter((likerId) => likerId !== authorId)
//                 : [ ...prevPost?.likers, authorId ],
//             likeCount: newLikeCount,
//         }));

//         try {
//             const response = await toggleLike({ authorId, id: currentPost?.id });

//             if (response?.error) {
//                 setCurrentPost(post);
//                 toast.error("Failed to like the post.");
//             }
//         } catch (error) {
//             setCurrentPost(post);
//             toast.error("Failed to like the post.");
//         }
//     };
//     console.log({post})

//     const handleUpdatePost = async (formData: FormData) => {
//         const updateLoading = toast.loading("Updating your post...");
//         try {
//             const response = await updatePost({ id: currentPost?.id, formData }).unwrap();
//             console.log(response?.data);
//             setCurrentPost(response?.data);
//             toast.success("Post updated successfully!");
//             handleCloseEditModal();
//             refetch();
//         } catch (error: any) {
//             toast.error("Failed to update the post.");
//         } finally {
//             toast.dismiss(updateLoading);
//         }
//     };

//     // Handle image selection for preview
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[ 0 ];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setSelectedImage(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Handle video selection for preview
//     const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[ 0 ];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setSelectedVideo(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry?.isIntersecting && currentPost?.video && videoRef?.current) {
//                         videoRef.current.muted = true;
//                         videoRef.current.play().catch((err) => console.error("Autoplay failed:", err));

//                         increaseVideoViewCount(currentPost?.id)
//                             .unwrap()
//                             .then(() => {
//                                 setCurrentPost((prevPost) => ({
//                                     ...prevPost,
//                                     viewCount: prevPost?.viewCount + 1,
//                                 }));
//                             })
//                             .catch((error) => {
//                                 console.error("Failed to increase view count:", error);
//                             });

//                         observer.unobserve(entry.target);
//                     }
//                 });
//             },
//             {
//                 threshold: 0.5,
//             }
//         );

//         if (videoRef?.current) {
//             observer.observe(videoRef.current);
//         }

//         return () => {
//             if (videoRef?.current) {
//                 observer.unobserve(videoRef.current);
//             }
//         };
//     }, [ currentPost?.id, currentPost?.video ]);

//     const postCreatedDate = post?.createdAt ? format(new Date(post?.createdAt), 'dd MMMM yyyy') : '';

//     return (
//         <div
//             key={currentPost?.id}
//             className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white ${currentPost?.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
//         >
//             {/* Author Information */}
//             <div className="flex justify-between w-full items-center mb-4">
//                 <div className="flex">
//                     {currentPost?.author?.profileImage ? (
//                         <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`}>
//                             <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                                 <Image
//                                     width={500}
//                                     height={500}
//                                     src={currentPost?.author?.profileImage}
//                                     alt="profile image"
//                                     className="w-full rounded-full"
//                                 />
//                             </div>
//                         </Link>
//                     ) : (
//                         <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`}>
//                             <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
//                                 <span className="text-lg font-bold">
//                                     {currentPost?.author?.firstName?.[ 0 ]}
//                                 </span>
//                             </div>
//                         </Link>
//                     )}
//                     <div className="flex flex-col">
//                         <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`} className="hover:text-cyan-500 transition-all">
//                             <h3 className="text-sm md:font-semibold">
//                                 {currentPost?.author?.firstName} {currentPost?.author?.lastName}
//                             </h3>
//                         </Link>
//                         <p className="text-sm text-gray-400">
//                             @{currentPost?.author?.firstName} {currentPost?.author?.lastName}
//                         </p>
//                         <p className="text-sm text-white">
//                             Posted: &nbsp;{postCreatedDate}
//                         </p>
//                     </div>
//                 </div>
//                 {currentPost?.author?.id === user?.id && (
//                     <div className="flex items-center gap-2">
//                         <button onClick={handleOpenEditModal} className="text-gray-400 hover:text-cyan-500 transition-all">
//                             <Edit className="w-5 h-5" />
//                         </button>
//                         <button onClick={handleOpenDeleteModal} className="text-gray-400 hover:text-red-500 transition-all">
//                             <Trash className="w-5 h-5" />
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Post Content */}
//             <p className="font-bold text-lg mb-4">
//                 {currentPost?.content?.length > 50 ? `${currentPost?.content?.slice(0, 80)}...` : currentPost?.content}
//             </p>

//             {/* Video Post */}
//             {currentPost?.video && (
//                 <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
//                     <Link href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`} className="cursor-pointer">
//                         <video
//                             ref={videoRef}
//                             src={currentPost?.video}
//                             width={600}
//                             height={400}
//                             className="w-full h-full object-cover rounded-lg mb-4"
//                             controls
//                             muted
//                         />
//                     </Link>
//                 </div>
//             )}

//             {/* Interaction Buttons */}
//             <div className="flex items-center justify-between text-gray-400 mt-auto">
//                 <Link href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`} className="flex items-center space-x-2 cursor-pointer">
//                     <MessageCircle className="w-5 h-5" />
//                     <span>{currentPost?.comments?.length}</span>
//                 </Link>

//                 <div className="font-bold text-white">{currentPost?.video ? `Views: ${currentPost?.viewCount}` : ""}</div>
//                 <button disabled={toggleLikeLoading} onClick={handleLikeToggle} className="flex items-center space-x-2 cursor-pointer">
//                     <Heart
//                         fill={currentPost?.likers?.includes(user?.id) ? "red" : ""}
//                         className={`w-5 h-5 transform transition-transform duration-200 ${toggleLikeLoading ? "scale-125" : ""}`}
//                     />
//                     <span>{currentPost?.likeCount}</span>
//                 </button>
//             </div>

//             {/* Edit Modal */}
//             {isOpenEditModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
//                         <h2 className="text-xl font-bold mb-4">Edit Post</h2>
//                         <form onSubmit={(e) => {
//                             e.preventDefault();
//                             const formData = new FormData(e.currentTarget);
//                             handleUpdatePost(formData);
//                         }}>
//                             <textarea
//                                 name="content"
//                                 defaultValue={currentPost?.content}
//                                 className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
//                                 rows={4}
//                             />
//                             {currentPost?.image && (
//                                 <div className="mb-4">
//                                     {/* Show selected image or current image */}
//                                     <Image
//                                         src={selectedImage || currentPost?.image}
//                                         alt="Post Image"
//                                         width={500}
//                                         height={300}
//                                         className="w-full h-48 object-cover rounded-lg"
//                                     />
//                                     <input
//                                         type="file"
//                                         name="image"
//                                         accept="image/*"
//                                         className="mt-2"
//                                         onChange={handleImageChange}
//                                     />
//                                 </div>
//                             )}
//                             {currentPost?.video && (
//                                 <div className="mb-4">
//                                     {/* Show selected video or current video */}
//                                     <video
//                                         src={selectedVideo || currentPost?.video}
//                                         controls
//                                         className="w-full h-48 object-cover rounded-lg"
//                                     />
//                                     <input
//                                         type="file"
//                                         name="video"
//                                         accept="video/*"
//                                         className="mt-2"
//                                         onChange={handleVideoChange}
//                                     />
//                                 </div>
//                             )}
//                             <div className="flex justify-end">
//                                 <button
//                                     disabled={updateLoading}
//                                     type="button"
//                                     onClick={handleCloseEditModal}
//                                     className="mr-2 px-4 py-2 bg-gray-600 rounded-lg text-white"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     disabled={updateLoading}
//                                     type="submit"
//                                     className="px-4 py-2 bg-cyan-500 rounded-lg text-white"
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {isOpenDeleteModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
//                         <h2 className="text-xl font-bold mb-4">Delete Post</h2>
//                         <p className="text-gray-400 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
//                         <div className="flex justify-end">
//                             <button
//                                 disabled={deletePostLoading}
//                                 type="button"
//                                 onClick={handleCloseDeleteModal}
//                                 className="mr-2 px-4 py-2 bg-gray-600 rounded-lg text-white"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 disabled={deletePostLoading}
//                                 type="button"
//                                 onClick={handleDeletePost}
//                                 className="px-4 py-2 bg-red-500 rounded-lg text-white"
//                             >
//                                 {deletePostLoading ? "Deleting..." : "Delete"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PostCard;








"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useDeletePostMutation, useGetAllPostsQuery, useIncreaseVideoViewCountMutation, useToggleLikeMutation, useUpdatePostMutation } from "@/redux/features/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { Heart, MessageCircle, Edit, Trash } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { format } from 'date-fns';
import { Post } from "../Cryptohub/TopicDetails";
import CommentsModal from "./CommentModal";

const PostCard = ({ post }: { post: Post }) => {
    const { refetch } = useGetAllPostsQuery("");
    const [ isOpenCommentModal, setIsOpenCommentModal ] = useState(false);
    const [ isOpenEditModal, setIsOpenEditModal ] = useState(false);
    const [ isOpenDeleteModal, setIsOpenDeleteModal ] = useState(false); // For delete confirmation
    const [ currentPost, setCurrentPost ] = useState(post);
    const [ toggleLike, { isLoading: toggleLikeLoading } ] = useToggleLikeMutation();
    const user = useAppSelector((state) => state.auth.user);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null); // Ref for image element
    const [ increaseVideoViewCount ] = useIncreaseVideoViewCountMutation();
    const [ updatePost, { isLoading: updateLoading } ] = useUpdatePostMutation();
    const [ selectedImage, setSelectedImage ] = useState<string | null>(null); // For image preview
    const [ deletePost, { isLoading: deletePostLoading } ] = useDeletePostMutation();
    const [ selectedVideo, setSelectedVideo ] = useState<string | null>(null); // For video preview

    const handleOpenCommentModal = () => {
        setIsOpenCommentModal(true);
    };

    const handleOpenEditModal = () => {
        setIsOpenEditModal(true);
        // Reset selected image and video when modal opens
        setSelectedImage(null);
        setSelectedVideo(null);
    };

    const handleCloseEditModal = () => {
        setIsOpenEditModal(false);
    };

    const handleOpenDeleteModal = () => {
        setIsOpenDeleteModal(true); // Open delete confirmation modal
    };

    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false); // Close delete confirmation modal
    };

    const handleDeletePost = async () => {
        const deleteLoading = toast.loading("Deleting your post...");
        try {
            await deletePost(currentPost?.id).unwrap();
            toast.success("Post deleted successfully!");
            refetch(); // Refetch posts after deletion
        } catch (error: any) {
            toast.error("Failed to delete the post.");
        } finally {
            toast.dismiss(deleteLoading);
            handleCloseDeleteModal(); // Close the delete confirmation modal
        }
    };

    const handleLikeToggle = async () => {
        if (!user?.id) {
            toast.error("Please Login first!");
            return;
        }

        const authorId = user?.id;
        const isLiked = currentPost?.likers?.includes(authorId);
        const newLikeCount = isLiked ? currentPost?.likeCount - 1 : currentPost?.likeCount + 1;

        setCurrentPost((prevPost) => ({
            ...prevPost,
            likers: isLiked
                ? prevPost?.likers?.filter((likerId) => likerId !== authorId)
                : [ ...prevPost?.likers, authorId ],
            likeCount: newLikeCount,
        }));

        try {
            const response = await toggleLike({ authorId, id: currentPost?.id });

            if (response?.error) {
                setCurrentPost(post);
                toast.error("Failed to like the post.");
            }
        } catch (error) {
            setCurrentPost(post);
            toast.error("Failed to like the post.");
        }
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
            const response = await updatePost({ id: currentPost?.id, formData }).unwrap();
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

    // Handle image selection for preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[ 0 ];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle video selection for preview
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[ 0 ];
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
                            // Handle video post
                            videoRef.current.muted = true;
                            videoRef.current.play().catch((err) => console.error("Autoplay failed:", err));

                            increaseVideoViewCount(currentPost?.id)
                                .unwrap()
                                .then(() => {
                                    setCurrentPost((prevPost) => ({
                                        ...prevPost,
                                        viewCount: prevPost?.viewCount + 1,
                                    }));
                                })
                                .catch((error) => {
                                    console.error("Failed to increase view count:", error);
                                });

                            observer.unobserve(entry.target);
                        } else if (currentPost?.image && imageRef?.current) {
                            // Handle image post
                            increaseVideoViewCount(currentPost?.id)
                                .unwrap()
                                .then(() => {
                                    setCurrentPost((prevPost) => ({
                                        ...prevPost,
                                        viewCount: prevPost?.viewCount + 1,
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
            {
                threshold: 0.5,
            }
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
    }, [ currentPost?.id, currentPost?.video, currentPost?.image ]);

    const postCreatedDate = post?.createdAt ? format(new Date(post?.createdAt), 'dd MMMM yyyy') : '';

    return (
        <div
            key={currentPost?.id}
            className={`bg-gray-800 max-w-3xl mx-auto rounded-lg overflow-hidden p-3 md:p-6 shadow-lg text-white ${currentPost?.image ? "h-[25rem] md:h-[40rem]" : "pb-6"} flex flex-col`}
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
                        <Link href={`/cryptohub/userProfile/${currentPost?.author?.id}`} className="hover:text-cyan-500 transition-all">
                            <h3 className="text-sm md:font-semibold">
                                {currentPost?.author?.firstName} {currentPost?.author?.lastName}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-400">
                            @{currentPost?.author?.firstName} {currentPost?.author?.lastName}
                        </p>
                        <p className="text-sm text-white">
                            Posted: &nbsp;{postCreatedDate}
                        </p>
                    </div>
                </div>
                {currentPost?.author?.id === user?.id && (
                    <div className="flex items-center gap-2">
                        <button onClick={handleOpenEditModal} className="text-gray-400 hover:text-cyan-500 transition-all">
                            <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={handleOpenDeleteModal} className="text-gray-400 hover:text-red-500 transition-all">
                            <Trash className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Post Content */}
            <p className="font-bold text-lg mb-4">
                {currentPost?.content?.length > 50 ? `${currentPost?.content?.slice(0, 80)}...` : currentPost?.content}
            </p>

            {/* Image Post */}
            {currentPost?.image && (
                <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
                    <Link href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`} className="cursor-pointer">
                        <Image
                            ref={imageRef}
                            src={currentPost?.image}
                            alt="Post Image"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover rounded-lg mb-4"
                        />
                    </Link>
                </div>
            )}

            {/* Video Post */}
            {currentPost?.video && (
                <div className="h-[20] md:h-[27rem] overflow-hidden rounded-md mb-2">
                    <Link href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`} className="cursor-pointer">
                        <video
                            ref={videoRef}
                            src={currentPost?.video}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover rounded-lg mb-4"
                            controls
                            muted
                        />
                    </Link>
                </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex items-center justify-between text-gray-400 mt-auto">
                <Link href={`/cryptohub/cryptochat/${currentPost?.topicId}/${currentPost?.id}`} className="flex items-center space-x-2 cursor-pointer">
                    <MessageCircle className="w-5 h-5" />
                    <span>{currentPost?.comments?.length}</span>
                </Link>
                {currentPost?.video &&
                    <div className="font-bold text-white">{currentPost?.video || currentPost?.image ? `Views: ${currentPost?.viewCount}` : ""}</div>
                }
                <button disabled={toggleLikeLoading} onClick={handleLikeToggle} className="flex items-center space-x-2 cursor-pointer">
                    <Heart
                        fill={currentPost?.likers?.includes(user?.id) ? "red" : ""}
                        className={`w-5 h-5 transform transition-transform duration-200 ${toggleLikeLoading ? "scale-125" : ""}`}
                    />
                    <span>{currentPost?.likeCount}</span>
                </button>
            </div>

            {/* Edit Modal */}
            {isOpenEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleUpdatePost(formData);
                        }}>
                            <textarea
                                name="content"
                                defaultValue={currentPost?.content}
                                className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
                                rows={4}
                            />
                            {currentPost?.image && (
                                <div className="mb-4">
                                    {/* Show selected image or current image */}
                                    <Image
                                        src={selectedImage || currentPost?.image}
                                        alt="Post Image"
                                        width={500}
                                        height={300}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="mt-2"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            )}
                            {currentPost?.video && (
                                <div className="mb-4">
                                    {/* Show selected video or current video */}
                                    <video
                                        src={selectedVideo || currentPost?.video}
                                        controls
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <input
                                        type="file"
                                        name="video"
                                        accept="video/*"
                                        className="mt-2"
                                        onChange={handleVideoChange}
                                    />
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button
                                    disabled={updateLoading}
                                    type="button"
                                    onClick={handleCloseEditModal}
                                    className="mr-2 px-4 py-2 bg-gray-600 rounded-lg text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={updateLoading}
                                    type="submit"
                                    className="px-4 py-2 bg-cyan-500 rounded-lg text-white"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isOpenDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Delete Post</h2>
                        <p className="text-gray-400 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="flex justify-end">
                            <button
                                disabled={deletePostLoading}
                                type="button"
                                onClick={handleCloseDeleteModal}
                                className="mr-2 px-4 py-2 bg-gray-600 rounded-lg text-white"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={deletePostLoading}
                                type="button"
                                onClick={handleDeletePost}
                                className="px-4 py-2 bg-red-500 rounded-lg text-white"
                            >
                                {deletePostLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;