"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import TopicsCard from "@/components/Cryptohub/TopicsCard";
import { ITopicInfo } from "@/components/Cryptohub/Types";
import Loading from "@/components/Shared/Loading";
import { useGetAllTopicQuery } from "@/redux/features/api/topicApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { setPaths } from "@/redux/features/slices/authSlice";

const CryptoChatPage = () => {
  const { data, isLoading: allTopicLoading } = useGetAllTopicQuery("");
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  const [searchQuery, setSearchQuery] = useState("");

  if (typeof window !== "undefined") {
    if (
        previousPath !== "/cryptohub/cryptochat" &&
        currentPath === "/cryptohub/cryptochat"
    ) {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }

  const allTopics = data?.data || [];

  // Dummy topics for testing
  const dummyTopics: ITopicInfo[] = [
   
  ];

  const allRenderedTopics = [...allTopics, ...dummyTopics];

  // Filter topics based on search
  const filteredTopics = allRenderedTopics.filter(topic =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (allTopicLoading) {
    return <Loading />;
  }

  return (
      <div className="min-h-screen pb-10 w-full mt-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Discussion Topics
              </h1>
              <p className="text-slate-400">
                Join conversations about cryptocurrency and blockchain
              </p>
            </div>

            {/* Search Bar Only */}
            <div className="max-w-md mx-auto w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="w-full">
          {filteredTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {filteredTopics.map((topic: ITopicInfo, index) => (
                    <div
                        key={topic.id}
                        className="opacity-0 animate-fade-in"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'forwards'
                        }}
                    >
                      <TopicsCard topicInfo={topic} />
                    </div>
                ))}
              </div>
          ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  {searchQuery ? "No topics found" : "No topics available"}
                </h3>
                <p className="text-slate-500">
                  {searchQuery ? "Try adjusting your search terms" : "Be the first to create a topic!"}
                </p>
              </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
  );
};

export default CryptoChatPage;