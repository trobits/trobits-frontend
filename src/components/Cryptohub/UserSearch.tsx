"use client";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useAllUserQuery } from "@/redux/features/api/authApi";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useToggleFollowMutation } from "@/redux/features/api/authApi";
import { Button } from "@/components/ui/button";

export default function UserSearch() {
  const currentUser = useAppSelector((state) => state.auth.user);
  if (!currentUser) return null;
  const { data, isLoading } = useAllUserQuery();
  const [search, setSearch] = useState("");
  const [toggleFollow, { isLoading: followLoading }] = useToggleFollowMutation();
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  const users = data?.data || [];

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return [];
    return users.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  const handleFollow = async (targetId: string) => {
    if (!currentUser?.id || followLoading) return;
    try {
      await toggleFollow({ followerId: currentUser.id, followedId: targetId }).unwrap();
      setFollowedIds((prev) => [...prev, targetId]);
    } catch (e) {
      // Optionally handle error
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-6">
      <Input
        placeholder="Search users by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 bg-slate-900 text-white border-cyan-500"
      />
      {isLoading && <div className="text-slate-400 text-sm">Loading users...</div>}
      {!isLoading && search && filteredUsers.length === 0 && (
        <div className="text-slate-400 text-sm">No users found.</div>
      )}
      <ul className="max-h-60 overflow-y-auto divide-y divide-slate-700">
        {filteredUsers.map((user) => (
          <li key={user.id} className="flex items-center gap-2 py-2 px-2">
            <Link
              href={`/cryptohub/userProfile/${user.id}`}
              className="flex items-center gap-3 flex-1 rounded-lg hover:bg-cyan-900/30 transition-colors"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-cyan-500"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-white font-medium">
                {user.firstName} {user.lastName}
              </span>
            </Link>
            {currentUser && currentUser.id !== user.id && (
              <Button
                size="sm"
                className="ml-2 px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white rounded"
                disabled={followLoading || followedIds.includes(user.id)}
                onClick={() => handleFollow(user.id)}
              >
                {followedIds.includes(user.id) ? "Followed" : "Follow"}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
