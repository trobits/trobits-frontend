"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Flame } from "lucide-react";
import { useGetAllTopicQuery } from "@/redux/features/api/topicApi";
import Loading from "../Shared/Loading";
import Image from "next/image";
import { ITopic } from "../Cryptohub/Types";
import Link from "next/link";

const TrendingTopic = () => {
  const { data: allTopicData, isLoading: allTopicDataLoading } =
    useGetAllTopicQuery("");
  if (allTopicDataLoading) return <Loading />;

  const allTopics: ITopic[] = allTopicData?.data || [];

  return (
    <Card className="bg-transparent border border-gray-700 hover:border-cyan-600/40 transition-colors duration-300 text-white rounded-2xl shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 justify-center">
          <Flame className="text-red-500" fill="red" />
          <h3 className="text-xl font-semibold tracking-wide">
            Trending Topics
          </h3>
        </div>
      </CardHeader>

      <CardContent className="h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-600/60">
        {allTopics.length > 0 ? (
          allTopics.map((topic) => (
            <div
              key={topic.id}
              className="mb-4 p-1 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 border border-gray-700 hover:border-cyan-600/30"
            >
              <div className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-full overflow-hidden">
                    {topic.image ? (
                      <Image
                        height={36}
                        width={36}
                        className="rounded-full object-cover w-9 h-9"
                        alt="topic"
                        src={topic.image}
                      />
                    ) : (
                      <div className="bg-gray-500 h-9 w-9 text-white rounded-full flex items-center justify-center font-bold">
                        {topic?.title?.[0]}
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-white truncate max-w-[120px]">
                    {topic.title}
                  </h4>
                </div>
                <Link
                  href={`/cryptohub/cryptochat/${topic.id}`}
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-2 py-1 rounded-md font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No trending topics found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingTopic;
