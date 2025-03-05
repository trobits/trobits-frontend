// /* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// const AdBanner = () => {
//   return (
//     <div className={`w-[300px] md:w-[326px] h-[280px] bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-102 hover:-translate-y-2 hover:shadow-2xl `}>
//       <span className="text-gray-500 text-sm">Sponsored Content</span>
//     </div>
//   );
// };


// const AdBanner = ({ adClass }: { adClass: string }) => {
//   useEffect(() => {
//     // Manually inject the script
//     const script = document.createElement("script");
//     script.innerHTML = `
//       !function(e,n,c,t,o,r,d){
//         !function e(n,c,t,o,r,m,d,s,a){
//           s=c.getElementsByTagName(t)[0],
//           (a=c.createElement(t)).async=!0,
//           a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
//           a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
//           s.parentNode.insertBefore(a,s)
//         }(window,document,"script","${adClass}",["cdn.bmcdn6.com"], 0, new Date().getTime())
//       }();
//     `;
//     document.body.appendChild(script);

//     // Cleanup function to remove the script when the component unmounts
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [ adClass ]);

//   // Ad classes to rotate through

//   return (
//     <>
//       {/* Ad banner */}
//       <ins
//         className={adClass}
//         style={{ display: "inline-block", width: "1px", height: "1px" }}
//       ></ins>
//     </>
//   );
// };


import Link from "next/link";
import { Button } from "../ui/button";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "../Shared/Loading";
import { Article } from "@/app/(withCommonLayout)/articles/page";
import React, { useEffect, useRef } from "react";
import HomeNewsCard from "./HomeNewsCard";


const AdBanner = ({ adClass }: { adClass: string }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to inject the ad script
    const injectAdScript = () => {
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
      script.setAttribute("data-ad-class", adClass); // Add a unique identifier to the script
      document.body.appendChild(script);
    };

    // Inject the ad script
    injectAdScript();

    // Use a MutationObserver to monitor changes to the ad container
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log("Ad container modified:", mutation);
        }
      }
    });

    if (adContainerRef.current) {
      observer.observe(adContainerRef.current, { childList: true, subtree: true });
    }

    // Cleanup function
    return () => {
      // Disconnect the observer
      observer.disconnect();

      // Remove the ad script
      const script = document.querySelector(`script[data-ad-class="${adClass}"]`);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [ adClass ]);

  return (
    <>
      {/* Ad banner */}
      <div ref={adContainerRef}>
        <ins
          className={adClass}
          style={{ display: "inline-block", width: "1px", height: "1px" }}
          key={adClass + Date.now()} // Force re-render by using a unique key
        ></ins>
      </div>
    </>
  );
};



export default function NewsCompo() {
  const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery([]);

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
    // "67b3b9469a62fcbf1eeb65df",
    // "67b3c7949a62fcbf1eeb83a6",
    // "67b3c7d89a62fcbf1eeb842e",
  ];


  return (
    <div>
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl text-center mb-6 font-bold text-cyan-600">Trobits Articles</h2>
        <div className="flex flex-wrap justify-center gap-2 max-w- mx-auto">
          {/* First row: 4 articles */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {firstRowArticles.map((article) => (
              <HomeNewsCard key={article.id} articleData={article} />
            ))}
          </div>

          {/* Subsequent rows: alternate between 3 articles + ad and ad + 3 articles */}
          {articleChunks.map((chunk, chunkIndex) => (
            <React.Fragment key={chunkIndex}>
              {chunkIndex % 2 === 0 ? (
                <>
                  {/* Even row: 3 articles then 1 ad */}
                  <div className="flex flex-wrap justify-center gap-2 w-full">
                    {chunk.map((article) => (
                      <HomeNewsCard key={article.id} articleData={article} />
                    ))}
                    <AdBanner adClass={adClasses[ chunkIndex ]} />
                  </div>
                </>
              ) : (
                <>
                  {/* Odd row: 1 ad then 3 articles */}
                  <div className="flex flex-wrap justify-center gap-2 w-full">
                    <AdBanner adClass={adClasses[ chunkIndex ]} />
                    {chunk.map((article) => (
                      <HomeNewsCard key={article.id} articleData={article} />
                    ))}
                  </div>
                </>
              )}
            </React.Fragment>
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