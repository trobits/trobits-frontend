/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "../Shared/Loading";
import { Article } from "@/app/(withCommonLayout)/articles/SubPage";
import React from "react";
import HomeNewsCard from "./HomeNewsCard";

export default function RecommendedArticles() {
    const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery({
        page: localStorage.getItem('currentPage') || 1,
        limit: 8,
    });

    // Handle loading state
    if (allBlogsDataLoading) {
        return <Loading />;
    }

    const allBlogs: Article[] = allBlogsData?.data || [];

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl flex justify-center items-center container mb-6 font-bold text-white py-4 bg-cyan-600 rounded">Recommended Articles</h2>

            <div className="flex flex-wrap justify-center gap-1 mx-auto">
                {allBlogs?.map((article) => (
                    <div key={article.id} className="flex flex-wrap justify-center items-center">
                        <HomeNewsCard articleData={article} />
                    </div>
                ))}
            </div>

            {/* "See All Articles" Button */}
            <div className="text-center my-10">
                <Link href="/articles">
                    <Button className="mx-auto bg-cyan-700 text-white text-lg font-bold">See All Articles</Button>
                </Link>
            </div>
        </div>
    );
}