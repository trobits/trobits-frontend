"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useGetAllPostsByTopicQuery } from "@/redux/features/api/postApi";
import Loading from "@/components/Shared/Loading";
import PostCard from "@/components/Post/PostCard";
import { Post } from "@/components/Cryptohub/TopicDetails";
import { Search } from "lucide-react";
import AuthGuard from "@/components/Auth/AuthGuard";
import TrendingTopic from "@/components/Cards/TrendingTopic";
import VerifiedAccounts from "@/components/Cards/VerifiedAccounts";
import RecommendedAccounts from "@/components/Cards/RecommendedAccounts";

// Debounce function to delay the search execution
function useDebounce(value: string, delay: number) {
  const [ debouncedValue, setDebouncedValue ] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [ value, delay ]);

  return debouncedValue;
}

export default function Component() {
  const { data: postData, isLoading: allPostsDataLoading } = useGetAllPostsByTopicQuery("");
  const allPosts: Post[] = postData?.data.length ? postData.data : [];

  // State for search query and filtered posts
  const [ searchQuery, setSearchQuery ] = useState("");
  const [ filteredPosts, setFilteredPosts ] = useState<Post[]>(allPosts);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    // Filter posts based on the debounced search query
    const filtered = allPosts.filter((post:Post) =>
      post.author.firstName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [ debouncedSearchQuery, allPosts ]);

  if (allPostsDataLoading) {
    return <Loading />;
  }

  return (
    <AuthGuard>
      {/* Post Option */}
      <div className="w-full mb-8 max-w-[75rem] mx-auto p-4 bg-[#00000088] rounded-lg shadow-lg flex flex-col space-y-4">
        <div className="flex items-start space-x-3">
          <textarea
            className="w-full p-3 bg-[#00000060] text-white rounded-lg resize-none outline-none focus:ring focus:ring-blue-300"
            rows={3}
            placeholder="How do you feel about the markets today? Share your ideas here!"
          ></textarea>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer text-blue-500">
            <input type="file" className="hidden" />
            <span>Upload File</span>
          </label>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
            Post
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 p-4 flex-wrap justify-center min-h-screen bg-[#00000027]">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-4">For You</h1>

          {/* Search Box */}
          <div className="relative mb-4">
            <Input
              placeholder="Search posts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 bg-[#00000088] text-white placeholder:text-gray-400 rounded-lg focus:ring-primary/30 border border-gray-600"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Filtered Posts */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
                <p className="text-white">No posts found for &quot;{searchQuery}&quot;</p>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-4">
          <TrendingTopic />
          <VerifiedAccounts />
          <RecommendedAccounts />
        </div>
      </div>
    </AuthGuard>
  );
}
