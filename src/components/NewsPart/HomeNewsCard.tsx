/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DummyBlogImage from "@/assets/dummy-blog.png";
import { Article } from "@/app/(withCommonLayout)/articles/SubPage";

interface NewsCardProps {
  articleData: Article;
}


const NewsCard = ({ articleData }: NewsCardProps) => {
  // State to manage when the card should appear
  const [ isVisible, setIsVisible ] = useState(false);

  // Trigger the animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delays the animation slightly
    return () => clearTimeout(timer);
  }, []);

  // Helper function to sanitize and limit content
  const getSanitizedContent = (htmlContent: string, limit: number) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;
    const textContent = tempElement.textContent || tempElement.innerText || "";
    return textContent.length > limit
      ? `${textContent.slice(0, limit)}...`
      : textContent;
  };

  return (
    <Link href={`/articles/${articleData?.id}`}>
      <div
        className={`w-[335px] md:w-[335px] h-[284px] bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-102 hover:-translate-y-2 hover:shadow-2xl ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 mb-4"
          }`}
      >
        {/* Blog Image Section */}
        <div className="relative h-32 w-full">
          {articleData?.image ? (
            <Image
              src={articleData.image}
              alt={articleData.title || "Blog image"}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          ) : (
            <Image
              src={DummyBlogImage}
              alt={"Blog image"}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          )}
        </div>

        {/* Blog Content Section */}
        <div className="p-4 flex flex-col justify-end ">
          {/* Title */}
          <h3 className=" text-lg font-semibold text-gray-200 mb-2 overflow-hidden ">
            {articleData?.title?.length > 150
              ? `${articleData.title.slice(0, 150)}...`
              : articleData?.title || "Untitled"}
          </h3>
          {/* Content */}
          <div
            className="text-gray-400 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: getSanitizedContent(articleData?.content || "", 150),
            }}
          ></div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
