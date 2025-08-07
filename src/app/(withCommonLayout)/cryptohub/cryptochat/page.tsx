"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import TopicsCard from "@/components/Cryptohub/TopicsCard";
import { ITopicInfo } from "@/components/Cryptohub/Types";
import Loading from "@/components/Shared/Loading";
import { useGetAllTopicQuery } from "@/redux/features/api/topicApi";
import { useAppDispatch } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { setPaths } from "@/redux/features/slices/authSlice";
import { NordVPNCard, FanaticsCard, NexoCard, TikTokCard } from "@/components/AffiliateLinks";

const CryptoChatPage = () => {
  const { data, isLoading: allTopicLoading } = useGetAllTopicQuery("");
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  const [searchQuery, setSearchQuery] = useState("");

  // Update paths without reload - FIXED!
  useEffect(() => {
    dispatch(setPaths(pathName));
  }, [pathName, dispatch]);

  const allTopics = data?.data || [];

  // Dummy topics for testing
  const dummyTopics: ITopicInfo[] = [];

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
      <div className="min-h-screen pb-10 w-full mt-8 bg-black">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Discussion Topics
              </h1>
              <p className="text-gray-400">
                Join conversations about cryptocurrency and blockchain
              </p>
            </div>

            {/* Search Bar Only */}
            <div className="max-w-md mx-auto w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Topics + Vertical Affiliate */}
        <div className="w-full flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Topics Grid - Smaller */}
          <div className="flex-1">
            {filteredTopics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredTopics.map((topic: ITopicInfo, index) => (
                      <div
                          key={topic.id}
                          className="opacity-0 animate-fade-in"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'forwards'
                          }}
                      >
                        <div className="scale-95">
                          <TopicsCard topicInfo={topic} />
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    {searchQuery ? "No topics found" : "No topics available"}
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery ? "Try adjusting your search terms" : "Be the first to create a topic!"}
                  </p>
                </div>
            )}
          </div>
          
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
