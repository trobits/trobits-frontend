/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PostCard from "../Post/PostCard";
import { useAppSelector } from "@/redux/hooks";
import { useGetPostsByUserIdQuery } from "@/redux/features/api/postApi";
import Loading from "../Shared/Loading";
import { useRouter } from "next/navigation";
import { Post } from "./TopicDetails";
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";
import { format } from 'date-fns';
import ProfileEditModal from '../Profile/ProfileEditModal';
import { Edit } from 'lucide-react';

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

export default function MyProfilePage() {
    const router = useRouter();
    const [ currentPage, setCurrentPage ] = useState(1);
    const limit = 15;
    const currentUser: Partial<IUser> = useAppSelector((state) => state.auth.user);
    const { data: updatedUserData, isLoading: updatedUserDataLoading } = useGetUserByIdQuery(currentUser.id as string, { skip: !currentUser?.id });


    const { data: allPostsData, isLoading: allPostsDataLoading } = useGetPostsByUserIdQuery({ id: currentUser.id, limit, page: currentPage });

    const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);


    if (!currentUser) {
        router.push("/auth/login");
    }


    if (updatedUserDataLoading) {
        return <Loading />;
    }

    const user: IUser = updatedUserData?.data;
    if (allPostsDataLoading) {
        return <Loading />;
    }

    const allPosts: Post[] = allPostsData?.data || [];
    const totalPages = allPostsData?.meta?.totalPages || 0;


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };


    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const joinedDate = user?.createdAt ? format(new Date(user.createdAt), 'dd MMMM yyyy') : '';

    return (
        <div className="w-full max-w-6xl mx-auto text-white">
            <div className="relative">
                {/* Banner Image */}
                <div className={`h-48 md:h-72 relative overflow-hidden rounded-b-lg bg-${user?.coverImage ? "" : "gray-400"}`}>
                    {user?.coverImage && (
                        <Image
                            src={user.coverImage as string}
                            alt="Profile banner"
                            width={1200}
                            height={400}
                            className="object-cover w-full h-full m-2 rounded-md"
                        />
                    )}
                    <div className="absolute top-4 right-4">
                        <Button
                            className="bg-cyan-700 px-6 font-bold text-lg hover:bg-cyan-500 hover:text-white text-white"
                            variant="outline"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Edit />
                        </Button>
                    </div>
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
                                <h2 className="rounded-full text-5xl bg-[#000000bd] w-full h-full text-center justify-center flex items-center text-white">
                                    {user?.firstName?.[ 0 ]}
                                </h2>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        {/* <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {user?.firstName + " " + user?.lastName}
                                </h1>
                                <p className="text-muted-foreground">{user?.email}</p>
                            </div>
                        </div> */}

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

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 disabled:cursor-not-allowed py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-400' : 'bg-cyan-600 text-white'}`}
                >
                    Previous
                </button>
                <span className="text-lg text-gray-300">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 disabled:cursor-not-allowed rounded-lg ${currentPage === totalPages ? 'bg-gray-400' : 'bg-cyan-600 text-white'}`}
                >
                    Next
                </button>
            </div>
        </div>

    );
}
