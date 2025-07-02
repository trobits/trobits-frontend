"use client";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useAllUserQuery } from "@/redux/features/api/authApi";
import Link from "next/link";

export default function UserSearch() {
  const { data, isLoading } = useAllUserQuery();
  const [search, setSearch] = useState("");

  const users = data?.data || [];

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return [];
    return users.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

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
          <li key={user.id}>
            <Link
              href={`/cryptohub/userProfile/${user.id}`}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-cyan-900/30 transition-colors"
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
          </li>
        ))}
      </ul>
    </div>
  );
}
