/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "../Shared/Loading";
import { Article } from "@/app/(withCommonLayout)/articles/page";
import React, { useEffect, useRef } from "react";
import HomeNewsCard from "./HomeNewsCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPaths } from "@/redux/features/slices/authSlice"; 
import { usePathname } from "next/navigation";


const AdBanner = ({ adClass }: { adClass: string }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  const injectAdScript = () => {
    if (!adContainerRef.current) return;

    // Remove existing ad script if any
    const existingScript = document.querySelector(`script[data-ad-class="${adClass}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new ad script
    const script = document.createElement("script");
    script.innerHTML = `
      !function(e,n,c,t,o,r,d){
        !function e(n,c,t,o,r,m,d,s,a){
          s=c.getElementsByTagName(t)[0],
          (a=c.createElement(t)).async=!0,
          a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
          a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
          s.parentNode.insertBefore(a,s)
        }(window,document,"script","${adClass}",["cdn.bmcdn6.com"], 0, new Date().getTime())
      }();
    `;
    script.setAttribute("data-ad-class", adClass);
    document.body.appendChild(script);
  };

  useEffect(() => {
    injectAdScript(); // Inject on mount

    // Listen for page visibility changes (when navigating back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        injectAdScript(); // Re-inject ads on page activation
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ adClass ]);

  return (
    <div ref={adContainerRef}>
      <ins
        className={adClass}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
        key={adClass + Date.now()}
      ></ins>
    </div>
  );
};




export default function NewsCompo() {
  const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery([]);
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const dispatch = useAppDispatch();
  const pathName = usePathname();


  if(window){
    if (previousPath !== "/" && currentPath === "/"){
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }

  // Handle loading state
  if (allBlogsDataLoading) {
    return <Loading />;
  }

  const allBlogs: Article[] = allBlogsData?.data || [];

  // Function to split articles into chunks
  const chunkArray = (array: Article[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // First row: 4 articles
  const firstRowArticles = allBlogs.slice(0, 4);

  // Remaining articles: 9 articles (to make the total 13)
  const remainingArticles = allBlogs.slice(4, 12);

  // Split remaining articles into chunks of 3
  const articleChunks = chunkArray(remainingArticles, 3);

  const adClasses = [
    "67b00b6de904d5920e690b84",
    "67b3b8a41b3a7f15c72fcc94",
    "67b3b9181b3a7f15c72fce5d",
    "67b00b6de904d5920e690b84",
    "67b3b8a41b3a7f15c72fcc94",
    "67b3b9181b3a7f15c72fce5d",
  ];


  return (
    <div>
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl text-center mb-6 font-bold text-cyan-600">Trobits Articles</h2>
        
        <div className="flex flex-wrap justify-center gap-2 max-w- mx-auto">
          {allBlogs.slice(0,4).map((article, index) => (
            <div key={article.id} className={"flex flex-wrap justify-center items-center"}>
              <HomeNewsCard articleData={article} />
            </div>
          ))}

          {allBlogs.slice(4).map((article, index) => (
            <div key={article.id} className={"flex flex-wrap justify-center items-center"}>
              <HomeNewsCard articleData={article} />
              {/* Show ad after every 4 articles */}
              {(index + 1) % 3 === 0 && (
                <AdBanner adClass={adClasses[ index - 1 ]} />
                // <div className={"size-80"}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* "See More" Button */}
      <Link href="/articles">
        <div className="text-center mt-20">
          <Button className="mx-auto bg-cyan-700 text-white">See More</Button>
        </div>
      </Link>
    </div>
  );
}


        // <div className="flex flex-wrap justify-center gap-2 max-w- mx-auto">
        //   {/* First row: 4 articles */}
        //   <div className="flex flex-wrap justify-center gap-2 w-full">
        //     {firstRowArticles.map((article) => (
        //       <HomeNewsCard key={article.id} articleData={article} />
        //     ))}
        //   </div>

        //   {/* Subsequent rows: alternate between 3 articles + ad and ad + 3 articles */}
        //   {articleChunks.map((chunk, chunkIndex) => (
        //     <React.Fragment key={chunkIndex}>
        //       {chunkIndex % 2 === 0 ? (
        //         <>
        //           {/* Even row: 3 articles then 1 ad */}
        //           <div className="flex flex-wrap justify-center gap-2 w-full">
        //             {chunk.map((article) => (
        //               <HomeNewsCard key={article.id} articleData={article} />
        //             ))}
        //             <AdBanner adClass={adClasses[ chunkIndex ]} />
        //           </div>
        //         </>
        //       ) : (
        //         <>
        //           {/* Odd row: 1 ad then 3 articles */}
        //           <div className="flex flex-wrap justify-center gap-2 w-full">
        //             <AdBanner adClass={adClasses[ chunkIndex ]} />
        //             {chunk.map((article) => (
        //               <HomeNewsCard key={article.id} articleData={article} />
        //             ))}
        //           </div>
        //         </>
        //       )}
        //     </React.Fragment>
        //   ))}
        // </div>