/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import NewsCard from "@/components/NewsPart/NewsCard";
import Image from "next/image";
import * as React from "react";
import { useState, useEffect } from "react";
import globalGlove from "../../../assets/pngGlobe.png";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "@/components/Shared/Loading";
import { IComment } from "@/components/Post/PostCommentCard";
import Footer from "@/app/shared/Footer/Footer";
import { Pagination } from "@/components/ui/pagination";


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
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const { data: allBlogsData, isLoading: allBlogsDataLoading } =
    useGetAllBlogsQuery({
      page: currentPage,
      limit: limit,
    });

  // Handle loading state
  if (allBlogsDataLoading) {
    return <Loading />;
  }

  const allBlogs: Article[] = allBlogsData?.data || [];
  const totalPages = allBlogsData?.meta?.totalPages || 0;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between py-5 px-20 bg-gradient-to-r from-[#574386] to-[#0a1c79] m-10 bg-transparent rounded-lg">
        <div className="flex items-center">
          <h1 className="text-2xl text-[#33d9b2] font-semibold">
            Trobits Article
          </h1>
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

      {/* Display Articles */}
      <div className="flex flex-wrap justify-center gap-4 px-1 md:px-24">
        {allBlogs.map((article) => (
          <NewsCard key={article.id} articleData={article} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 disabled:cursor-not-allowed py-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-400" : "bg-cyan-600 text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-lg text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 disabled:cursor-not-allowed rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-400"
              : "bg-cyan-600 text-white"
          }`}
        >
          Next
        </button>
      </div>

      <Footer />
    </div>
  );
};
function AdBanner() {
  return (
    <>
      {/* Top Ad banner  */}
     {/* Another New Ad Banner */}
     <ins className="67b00b6de904d5920e690b84" style={{ display: "inline-block", width: "1px", height: "1px" }}></ins>
      <Script
        id="newly-added-ad-banner-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,n,c,t,o,r,d){
              !function e(n,c,t,o,r,m,d,s,a){
                s=c.getElementsByTagName(t)[0],
                (a=c.createElement(t)).async=!0,
                a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
                a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
                s.parentNode.insertBefore(a,s)
              }(window,document,"script","67b00b6de904d5920e690b84",["cdn.bmcdn6.com"], 0, new Date().getTime())
            }();
          `,
        }}
      />
       </>
  );
}
export default ArticlesPage;
