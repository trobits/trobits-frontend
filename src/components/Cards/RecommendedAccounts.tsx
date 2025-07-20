"use client";
import React, { useState, useEffect } from "react";
import { Users, Search, UserPlus } from "lucide-react";
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
  const { data: allUsersData, isLoading: allUsersDataLoading } = useGetAllRecommendedUsersQuery("");
  const [toggleFollow, { isLoading: toggleFollowLoading }] = useToggleFollowMutation();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [localUsers, setLocalUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

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
    setLoadingUserId(followedId); // Set loading for specific user

    try {
      const response = await toggleFollow({ followerId, followedId });
      if (response?.error) {
        toast.error("Failed to follow user! Try again.");
        return;
      }

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

      toast.success(
          filteredUsers.find(u => u.id === followedId)?.followers?.includes(followerId)
              ? "Unfollowed successfully!"
              : "Following successfully!"
      );
    } catch (error) {
      toast.error("Something went wrong! Try again.");
    } finally {
      setLoadingUserId(null); // Clear loading state
    }
  };

  if (allUsersDataLoading) return <Loading />;

  return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Recommended</h3>
            <p className="text-xs text-slate-400">Users you might like</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredUsers?.length > 0 ? (
              filteredUsers
                  .filter(user => user?.id !== currentUser?.id)
                  .slice(0, 5)
                  .map((user) => (
                      <div
                          key={user?.id}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/40 transition-all duration-200 border border-transparent hover:border-slate-600/30 group"
                      >
                        {/* Profile Image */}
                        <Link href={`/cryptohub/userProfile/${user?.id}`} className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-600 ring-2 ring-transparent group-hover:ring-cyan-400/50 transition-all duration-200">
                            {user?.profileImage ? (
                                <Image
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                    src={user?.profileImage}
                                    alt="profile"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                  {user?.firstName[0].toUpperCase()}
                                </div>
                            )}
                          </div>
                        </Link>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                              href={`/cryptohub/userProfile/${user?.id}`}
                              className="block hover:text-cyan-400 transition-colors duration-200"
                          >
                            <p className="font-semibold text-white text-sm truncate">
                              {user.firstName} {user?.lastName || ""}
                            </p>
                          </Link>
                          <p className="text-xs text-slate-400 truncate">
                            @{user.firstName.toLowerCase()}{user?.lastName?.toLowerCase() || ""}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {user.followers?.length || 0} followers
                          </p>
                        </div>

                        {/* Follow Button */}
                        <Button
                            disabled={loadingUserId === user.id}
                            onClick={() => handleFollow(user.id)}
                            size="sm"
                            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 min-w-[70px] ${
                                user?.followers?.includes(currentUser?.id)
                                    ? "bg-slate-600 hover:bg-slate-500 text-white"
                                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                            }`}
                        >
                          {loadingUserId === user.id ? (
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                          ) : user?.followers?.includes(currentUser?.id) ? (
                              "Following"
                          ) : (
                              "Follow"
                          )}
                        </Button>
                      </div>
                  ))
          ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm">
                  {searchTerm ? "No users found" : "No recommended users"}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {searchTerm ? "Try a different search term" : "Check back later for suggestions"}
                </p>
              </div>
          )}
        </div>

        {/* View All Link */}
        {filteredUsers.filter(user => user?.id !== currentUser?.id).length > 5 && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <button className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium py-2 transition-colors duration-200">
                View All Recommendations
              </button>
            </div>
        )}
      </div>
  );
};

export default RecommendedAccounts;