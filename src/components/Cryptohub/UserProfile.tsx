/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState } from 'react';
import Image from "next/image";
import PostCard from "../Post/PostCard";
import { useGetPostsByUserIdQuery } from "@/redux/features/api/postApi";
import Loading from "../Shared/Loading";
import { Post } from "./TopicDetails";
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";
import { format } from 'date-fns';
import ProfileEditModal from '../Profile/ProfileEditModal';
import { Button } from '../ui/button';

interface IUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    profileImage?: string;
    coverImage?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    followers?: string[];
    following?: string[];
    role: "ADMIN" | "USER";
    refreshToken?: string;
}

export default function UserProfile({ userId }: { userId: string }) {
    const { data: updatedUserData, isLoading: updatedUserDataLoading } = useGetUserByIdQuery(userId as string, { skip: !userId });
    const { data: allPostsData, isLoading: allPostsDataLoading } = useGetPostsByUserIdQuery(userId);
    const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);


    if (updatedUserDataLoading) {
        return <Loading />;
    }

    const user: IUser = updatedUserData?.data;
    if (allPostsDataLoading) {
        return <Loading />;
    }
    const allPosts: Post[] = allPostsData?.data || [];
    const joinedDate = user?.createdAt ? format(new Date(user.createdAt), 'dd MMMM yyyy') : '';

    return (

        <div className="w-full max-w-6xl mx-auto text-white p-2">
            <div className="relative">
                {/* Banner Image */}
                <div className={`h-48 md:h-72 relative overflow-hidden rounded-b-lg ${user?.coverImage ? "bg-none" : "bg-[#2afcbd28]"}`}>
                    {user?.coverImage && (
                        <Image
                            src={user.coverImage as string}
                            alt="Profile banner"
                            width={1200}
                            height={400}
                            className="object-cover w-full h-full m-2 rounded-md"
                        />
                    )}
                </div>

                {/* Profile Info Section */}
                <div className="px-4">
                    <div className="relative -mt-16 mb-4">
                        <div className="w-32 flex justify-center items-center h-32 rounded-full border-4 border-background">
                            {user?.profileImage ? (
                                <Image
                                    alt="image"
                                    src={user?.profileImage as string}
                                    width={200}
                                    height={400}
                                    className="w-full h-full bg-cover rounded-full text-white"
                                />
                            ) : (
                                <h2 className="rounded-full text-5xl bg-[#000000ce] w-full h-full text-center justify-center flex items-center text-white">
                                    {user?.firstName?.[ 0 ].toUpperCase()}
                                </h2>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {user?.firstName + " " + user?.lastName}
                                </h1>
                                <p className="text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 text-sm">
                            <span>
                                <strong>{user?.followers?.length}</strong> Followers
                            </span>
                            <span>
                                <strong>{user?.following?.length}</strong> Following
                            </span>
                        </div>

                        <p className="font-bold text-sm">Joined: {joinedDate}</p>
                    </div>
                </div>
                <div className=' flex justify-center'>
                    <h2 className=' text-3xl'>Posts</h2>
                </div>
                <div className="space-y-6 mt-12">
                    {allPosts.length > 0 ? (
                        allPosts.map((post) => <PostCard key={post.id} post={post} />)
                    ) : (
                        <p className="text-white">No posts</p>
                    )}
                </div>
            </div>

            {/* Profile Edit Modal */}
            {isEditModalOpen && (
                <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
            )}
        </div>

    );
}





// "use client";
// import { useState } from 'react';
// import Image from "next/image";
// import PostCard from "../Post/PostCard";
// import { useGetPostsByUserIdQuery } from "@/redux/features/api/postApi";
// import Loading from "../Shared/Loading";
// import { Post } from "./TopicDetails";
// import { useGetUserByIdQuery, useToggleFollowMutation } from "@/redux/features/api/authApi";
// import { format } from 'date-fns';
// import ProfileEditModal from '../Profile/ProfileEditModal';
// import toast from "react-hot-toast";
// import { useAppSelector } from '@/redux/hooks';

// interface IUser {
//     id: string;
//     email: string;
//     password: string;
//     firstName: string;
//     lastName?: string;
//     profileImage?: string;
//     coverImage?: string;
//     isDeleted?: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
//     followers?: string[];
//     following?: string[];
//     role: "ADMIN" | "USER";
//     refreshToken?: string;
// }

// export default function UserProfile({ userId }: { userId: string }) {
//     const { data: updatedUserData, isLoading: updatedUserDataLoading } = useGetUserByIdQuery(userId as string, { skip: !userId });
//     const { data: allPostsData, isLoading: allPostsDataLoading } = useGetPostsByUserIdQuery(userId);
//     const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);

//     const [ toggleFollow, { isLoading: followLoading } ] = useToggleFollowMutation();
//     const loggedInUser = useAppSelector((state) => state?.auth?.user);

//     if (updatedUserDataLoading) {
//         return <Loading />;
//     }

//     const user: IUser = updatedUserData?.data;
//     if (allPostsDataLoading) {
//         return <Loading />;
//     }
//     const allPosts: Post[] = allPostsData?.data || [];
//     const joinedDate = user?.createdAt ? format(new Date(user.createdAt), 'dd MMMM yyyy') : '';

//     const handleFollowToggle = async (followedId: string) => {
//         if (!loggedInUser) {
//             toast.error("You need to log in to follow users.");
//             return;
//         }

//         const followerId = loggedInUser?.id;


//         try {
//             const response = await toggleFollow({
//                 followerId,
//                 followedId,
//             });

//             if (response?.error) {
//                 toast.error("Failed to follow user! Try again.");
//                 return;
//             }

//         } catch (error) {

//         }
//     };

//     return (
//         <div className="w-full max-w-6xl mx-auto text-white p-2">
//             <div className="relative">
//                 {/* Banner Image */}
//                 <div className={`h-48 md:h-72 relative overflow-hidden rounded-b-lg ${user?.coverImage ? "bg-none" : "bg-[#2afcbd28]"}`}>
//                     {user?.coverImage && (
//                         <Image
//                             src={user.coverImage as string}
//                             alt="Profile banner"
//                             width={1200}
//                             height={400}
//                             className="object-cover w-full h-full m-2 rounded-md"
//                         />
//                     )}
//                 </div>

//                 {/* Profile Info Section */}
//                 <div className="px-4">
//                     <div className="relative -mt-16 mb-4">
//                         <div className="w-32 flex justify-center items-center h-32 rounded-full border-4 border-background">
//                             {user?.profileImage ? (
//                                 <Image
//                                     alt="image"
//                                     src={user?.profileImage as string}
//                                     width={200}
//                                     height={400}
//                                     className="w-full h-full bg-cover rounded-full text-white"
//                                 />
//                             ) : (
//                                 <h2 className="rounded-full text-5xl bg-[#000000ce] w-full h-full text-center justify-center flex items-center text-white">
//                                     {user?.firstName?.[ 0 ].toUpperCase()}
//                                 </h2>
//                             )}
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h1 className="text-2xl font-bold flex items-center gap-4">
//                                     {user?.firstName + " " + user?.lastName}
//                                     {
//                                         loggedInUser?.id !== user?.id &&
//                                         <button
//                                             onClick={() => handleFollowToggle(user?.id)}
//                                             disabled={followLoading}
//                                             className={`px-4 py-2 text-sm rounded-md ${user?.followers?.includes(loggedInUser)
//                                                 ? "bg-red-600 hover:bg-red-700 text-white"
//                                                 : "bg-indigo-600 hover:bg-indigo-700 text-white"
//                                                 }`}
//                                         >
//                                             {user?.followers?.includes(loggedInUser?.id) ? "Unfollow" : "Follow"}
//                                         </button>
//                                     }
//                                 </h1>
//                                 <p className="text-muted-foreground">{user?.email}</p>
//                             </div>
//                         </div>

//                         <div className="flex gap-4 text-sm">
//                             <span>
//                                 <strong>{user?.followers?.length}</strong> Followers
//                             </span>
//                             <span>
//                                 <strong>{user?.following?.length}</strong> Following
//                             </span>
//                         </div>

//                         <p className="font-bold text-sm">Joined: {joinedDate}</p>
//                     </div>
//                 </div>
//                 <div className="flex justify-center">
//                     <h2 className="text-3xl">Posts</h2>
//                 </div>
//                 <div className="space-y-6 mt-12">
//                     {allPosts.length > 0 ? (
//                         allPosts.map((post) => <PostCard key={post.id} post={post} />)
//                     ) : (
//                         <p className="text-white">No posts</p>
//                     )}
//                 </div>
//             </div>

//             {/* Profile Edit Modal */}
//             {isEditModalOpen && (
//                 <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
//             )}
//         </div>
//     );
// }









// "use client";
// import { useState } from 'react';
// import Image from "next/image";
// import PostCard from "../Post/PostCard";
// import { useGetPostsByUserIdQuery } from "@/redux/features/api/postApi";
// import Loading from "../Shared/Loading";
// import { Post } from "./TopicDetails";
// import { useGetUserByIdQuery, useToggleFollowMutation } from "@/redux/features/api/authApi";
// import { format } from 'date-fns';
// import ProfileEditModal from '../Profile/ProfileEditModal';
// import toast from "react-hot-toast";
// import { useAppSelector } from '@/redux/hooks';

// interface IUser {
//     id: string;
//     email: string;
//     password: string;
//     firstName: string;
//     lastName?: string;
//     profileImage?: string;
//     coverImage?: string;
//     isDeleted?: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
//     followers?: string[];
//     following?: string[];
//     role: "ADMIN" | "USER";
//     refreshToken?: string;
// }

// export default function UserProfile({ userId }: { userId: string }) {
//     const { data: updatedUserData, isLoading: updatedUserDataLoading } = useGetUserByIdQuery(userId as string, { skip: !userId });
//     const { data: allPostsData, isLoading: allPostsDataLoading } = useGetPostsByUserIdQuery(userId);
//     const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);

//     const [ toggleFollow, { isLoading: followLoading } ] = useToggleFollowMutation();
//     const loggedInUser = useAppSelector((state) => state?.auth?.user);
//     const user: IUser = updatedUserData?.data;
//     // Optimistic update state
//     const [ optimisticFollowState, setOptimisticFollowState ] = useState<string | null>(
//         user?.followers?.includes(loggedInUser?.id ) ? "unfollow" : "follow"
//     );
//     console.log(user?.followers?.includes(loggedInUser?.id));

//     if (updatedUserDataLoading) {
//         return <Loading />;
//     }


//     if (allPostsDataLoading) {
//         return <Loading />;
//     }
//     const allPosts: Post[] = allPostsData?.data || [];
//     const joinedDate = user?.createdAt ? format(new Date(user.createdAt), 'dd MMMM yyyy') : '';



//     const handleFollowToggle = async (followedId: string) => {
//         if (!loggedInUser) {
//             toast.error("You need to log in to follow users.");
//             return;
//         }

//         const followerId = loggedInUser?.id;

//         // Optimistically update the UI before sending the request
//         setOptimisticFollowState(optimisticFollowState === "follow" ? "unfollow" : "follow");

//         try {
//             const response = await toggleFollow({
//                 followerId,
//                 followedId,
//             });

//             if (response?.error) {
//                 toast.error("Failed to follow user! Try again.");
//                 // Revert back to previous state if error occurs
//                 setOptimisticFollowState(optimisticFollowState);
//                 return;
//             }

//         } catch (error) {
//             // Revert back to previous state if error occurs
//             setOptimisticFollowState(optimisticFollowState);
//         }
//     };

//     return (
//         <div className="w-full max-w-6xl mx-auto text-white p-2">
//             <div className="relative">
//                 {/* Banner Image */}
//                 <div className={`h-48 md:h-72 relative overflow-hidden rounded-b-lg ${user?.coverImage ? "bg-none" : "bg-[#2afcbd28]"}`}>
//                     {user?.coverImage && (
//                         <Image
//                             src={user.coverImage as string}
//                             alt="Profile banner"
//                             width={1200}
//                             height={400}
//                             className="object-cover w-full h-full m-2 rounded-md"
//                         />
//                     )}
//                 </div>

//                 {/* Profile Info Section */}
//                 <div className="px-4">
//                     <div className="relative -mt-16 mb-4">
//                         <div className="w-32 flex justify-center items-center h-32 rounded-full border-4 border-background">
//                             {user?.profileImage ? (
//                                 <Image
//                                     alt="image"
//                                     src={user?.profileImage as string}
//                                     width={200}
//                                     height={400}
//                                     className="w-full h-full bg-cover rounded-full text-white"
//                                 />
//                             ) : (
//                                 <h2 className="rounded-full text-5xl bg-[#000000ce] w-full h-full text-center justify-center flex items-center text-white">
//                                     {user?.firstName?.[ 0 ].toUpperCase()}
//                                 </h2>
//                             )}
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h1 className="text-2xl font-bold flex items-center gap-4">
//                                     {user?.firstName + " " + user?.lastName}
//                                     {
//                                         loggedInUser?.id !== user?.id &&
//                                         <button
//                                             onClick={() => handleFollowToggle(user?.id)}
//                                             disabled={followLoading}
//                                             className={`px-4 py-2 text-sm rounded-md 
//                                                 ${optimisticFollowState === "follow" ? "text-purple-500" : "text-cyan-500"}
//                                                 ${followLoading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
//                                             `}
//                                         >
//                                             {user?.followers === "follow" ? "Unfollow" : "Follow"}
//                                         </button>
//                                     }
//                                 </h1>
//                                 <p className="text-muted-foreground">{user?.email}</p>
//                             </div>
//                         </div>

//                         <div className="flex gap-4 text-sm">
//                             <span>
//                                 <strong>{user?.followers?.length}</strong> Followers
//                             </span>
//                             <span>
//                                 <strong>{user?.following?.length}</strong> Following
//                             </span>
//                         </div>

//                         <p className="font-bold text-sm">Joined: {joinedDate}</p>
//                     </div>
//                 </div>
//                 <div className="flex justify-center">
//                     <h2 className="text-3xl">Posts</h2>
//                 </div>
//                 <div className="space-y-6 mt-12">
//                     {allPosts.length > 0 ? (
//                         allPosts.map((post) => <PostCard key={post.id} post={post} />)
//                     ) : (
//                         <p className="text-white">No posts</p>
//                     )}
//                 </div>
//             </div>

//             {/* Profile Edit Modal */}
//             {isEditModalOpen && (
//                 <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
//             )}
//         </div>
//     );
// }
