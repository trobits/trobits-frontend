"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { BadgeCheck, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import {
  useGetAllRecommendedUsersQuery,
  useToggleFollowMutation,
} from "@/redux/features/api/authApi";
import Loading from "../Shared/Loading";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import Link from "next/link";

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
  const { data: allUsersData, isLoading: allUsersDataLoading } =
    useGetAllRecommendedUsersQuery("");
  const [toggleFollow, { isLoading: toggleFollowLoading }] =
    useToggleFollowMutation();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [localUsers, setLocalUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (allUsersData?.data) {
      setLocalUsers(allUsersData.data);
      setFilteredUsers(allUsersData.data);
    }
  }, [allUsersData]);

  const debouncedSearch = debounce((term: string) => {
    const lower = term.toLowerCase();
    const filtered = localUsers.filter((user) =>
      `${user.firstName} ${user.lastName || ""}`.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    debouncedSearch(val);
  };

  const handleFollow = async (followedId: string) => {
    if (!currentUser) return toast.error("Please login first!");
    const followerId = currentUser?.id;

    setIsButtonDisabled(true);
    try {
      const response = await toggleFollow({ followerId, followedId });
      if (response?.error)
        return toast.error("Failed to follow user! Try again.");

      const updateUsers = (users: IUser[]) =>
        users.map((user) =>
          user.id === followedId
            ? {
                ...user,
                followers: user.followers?.includes(followerId)
                  ? user.followers.filter((id) => id !== followerId)
                  : [...(user.followers || []), followerId],
              }
            : user
        );

      setLocalUsers((prev) => updateUsers(prev));
      setFilteredUsers((prev) => updateUsers(prev));
      setTimeout(() => setIsButtonDisabled(false), 1000);
    } catch (error) {
      setIsButtonDisabled(false);
    }
  };

  if (allUsersDataLoading) return <Loading />;

  return (
    <Card className="bg-transparent border border-gray-700 hover:border-cyan-600/40 transition-colors duration-300 text-white rounded-2xl shadow-lg">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 fill-blue-400 text-white" />
            <h2 className="text-lg font-semibold tracking-wide">
              Recommended Accounts
            </h2>
          </div>
        </div>

        <div className="flex items-center bg-black border-2 border-gray-400 px-2 py-1 rounded-md mt-2">
          <Search className="h-5 w-5 text-white" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search user ..."
            className="bg-transparent outline-none text-white placeholder-gray-400 ml-2 w-full"
          />
        </div>
      </CardHeader>

      <CardContent className="h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-600/60">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => {
            if (user?.id === currentUser?.id) return null;
            return (
              <div
                key={user?.id}
                className="mb-4 p-1 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 border border-gray-700 hover:border-cyan-600/30"
              >
                <div className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="size-9 rounded-full overflow-hidden">
                      {user?.profileImage ? (
                        <Link href={`/cryptohub/userProfile/${user?.id}`}>
                          <Image
                            width={36}
                            height={36}
                            className="rounded-full object-cover w-9 h-9"
                            src={user?.profileImage}
                            alt="profile"
                          />
                        </Link>
                      ) : (
                        <Link href={`/cryptohub/userProfile/${user?.id}`}>
                          <div className="bg-gray-500 h-9 w-9 text-white rounded-full flex items-center justify-center font-bold">
                            {user?.firstName[0].toUpperCase()}
                          </div>
                        </Link>
                      )}
                    </div>
                    <Link
                      href={`/cryptohub/userProfile/${user?.id}`}
                      className="hover:text-cyan-500 transition-all text-sm font-medium truncate max-w-[120px]"
                    >
                      {user.firstName + " " + (user?.lastName || "")}
                    </Link>
                  </div>
                  <Button
                    disabled={toggleFollowLoading || isButtonDisabled}
                    onClick={() => handleFollow(user.id)}
                    size="sm"
                    className={`${
                      user?.followers?.includes(currentUser?.id)
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                    } text-white font-medium rounded-md px-2 py-0 transition-all duration-200 hover:scale-105 shadow-lg`}
                  >
                    {user?.followers?.includes(currentUser?.id)
                      ? "Unfollow"
                      : "Follow"}
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">
            No recommended users found.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedAccounts;
