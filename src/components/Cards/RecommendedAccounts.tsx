
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import {  useRecommendedUserQuery, useToggleFollowMutation } from "@/redux/features/api/authApi";
import Loading from "../Shared/Loading";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";

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
    role: "ADMIN" | "USER";
    refreshToken?: string;
}

const RecommendedAccounts = () => {
    const { data: allUsersData, isLoading: allUsersDataLoading } = useRecommendedUserQuery("");
    const [ toggleFollow, { isLoading: toggleFollowLoading } ] = useToggleFollowMutation();
    const currentUser = useAppSelector((state) => state.auth.user);

    const [ localUsers, setLocalUsers ] = useState<IUser[]>([]);
    const [ isButtonDisabled, setIsButtonDisabled ] = useState(false); // New state to manage button disabling

    // Initialize local users state with data when fetched
    useEffect(() => {
        if (allUsersData?.data) {
            setLocalUsers(allUsersData.data);
        }
    }, [ allUsersData ]);

    if (allUsersDataLoading) {
        return <Loading />;
    }

    const handleFollow = async (followedId: string) => {
        if (!currentUser) {
            alert("Please login first!");
            return;
        }
        const followerId = currentUser?.id;

        // Temporarily disable the button for 1 second after click
        setIsButtonDisabled(true);

        try {
            const response = await toggleFollow({
                followerId,
                followedId,
            });
            console.log(response);

            if (response?.error) {
                toast.error("Failed to follow user! Try again.");
                return;
            }

            // Optimistically update the UI
            setLocalUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === followedId
                        ? {
                            ...user,
                            followers: user.followers?.includes(followerId)
                                ? user.followers.filter((id) => id !== followerId)
                                : [ ...(user.followers || []), followerId ],
                        }
                        : user
                )
            );

            // Re-enable the button after 1 second
            setTimeout(() => {
                setIsButtonDisabled(false);
            }, 1000); // Re-enable after 1 second

        } catch (error) {
            console.log(error);
            setIsButtonDisabled(false); // Re-enable button in case of error
        }
    };

    return (
        <div>
            <Card className="border bg-transparent border-cyan-400 text-white">
                <CardHeader>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BadgeCheck className="h-5 w-5 fill-blue-400 text-white" />
                        Verified Accounts
                    </h2>
                </CardHeader>
                <CardContent className="space-y-3 h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-500">
                    {localUsers?.map((user: IUser) => {
                        if (user.id === currentUser.id) return null; // Skip showing the current user
                        return (
                            <div key={user?.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        {user?.profileImage ? (
                                            <Image
                                                width={300}
                                                height={300}
                                                className="rounded-full h-7 w-7"
                                                src={user?.profileImage}
                                                alt="profile image"
                                            />
                                        ) : (
                                            <AvatarFallback className=" bg-gray-500 h-7 w-7 text-white rounded-full flex items-center justify-center text-center">
                                                {user?.firstName[ 0 ].toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span>{user?.firstName + " " + user?.lastName}</span>
                                </div>
                                <Button
                                    disabled={toggleFollowLoading || isButtonDisabled} // Disable button while loading or for 1 second
                                    onClick={() => handleFollow(user.id)}
                                    size="sm"
                                    variant="outline"
                                    className={`${user.followers?.includes(currentUser.id) ? "bg-indigo-600 hover:bg-purple-800" : "bg-cyan-600 hover:bg-cyan-800"} disabled:cursor-not-allowed  hover:text-white text-white`}
                                >
                                    {user.followers?.includes(currentUser.id) ? "Unfollow" : "Follow"}
                                </Button>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};

export default RecommendedAccounts;
