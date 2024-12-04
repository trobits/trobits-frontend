"use client";
import NewsCard from "@/components/NewsPart/NewsCard";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import globalGlove from "../../../assets/pngGlobe.png";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "@/components/Shared/Loading";
import { IComment } from "@/components/Post/PostCommentCard";
import Footer from "@/app/shared/Footer/Footer";

export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  likeCount: number;
  likers: string[];
  comments: IComment[];
}

const ArticlesPage = () => {
  const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery([]);
  const [ visibleArticlesCount, setVisibleArticlesCount ] = useState(12); // Initial articles count to display

  if (allBlogsDataLoading) {
    return <Loading />;
  }

  const allBlogs: Article[] = allBlogsData?.data || [];

  // Function to handle "Show More" button click
  const handleShowMore = () => {
    setVisibleArticlesCount((prevCount) => prevCount + 12);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between py-5 px-20 bg-gradient-to-r from-[#574386] to-[#0a1c79] m-10 bg-transparent rounded-lg">
        <div className="flex items-center">
          <h1 className="text-2xl text-[#33d9b2] font-semibold">Trobits Article</h1>
        </div>
        <div className="flex items-center justify-center">
          <Image
            src={globalGlove}
            alt="Crypto Icon"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Articles Section */}
      <div className="flex flex-wrap justify-center gap-4 px-1 md:px-24">
        {allBlogs.slice(0, visibleArticlesCount).map((article, index) => (
          <NewsCard key={index + 1} articleData={article} />
        ))}
      </div>

      {/* Show More Button */}
      {visibleArticlesCount < allBlogs.length && (
        <div className="text-center my-6">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Show More
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ArticlesPage;
