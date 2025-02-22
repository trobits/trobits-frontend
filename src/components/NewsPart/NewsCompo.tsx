// // pages/index.js
// import Link from "next/link";
// import { Button } from "../ui/button";
// import NewsCard from "./NewsCard";
// import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
// import Loading from "../Shared/Loading";
// import { Article } from "@/app/(withCommonLayout)/articles/page";
// import Script from "next/script";




// function AdBannerA() {
//   return (
//     <>
//       {/* Ad banner */}
//       <ins
//         className="67b00b6de904d5920e690b84"
//         style={{ display: "inline-block", width: "1px", height: "1px" }}
//       ></ins>
//       <Script
//         id="ad-banner-script"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: `
//             !function(e,n,c,t,o,r,d){
//               !function e(n,c,t,o,r,m,d,s,a){
//                 s=c.getElementsByTagName(t)[0],
//                 (a=c.createElement(t)).async=!0,
//                 a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
//                 a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
//                 s.parentNode.insertBefore(a,s)
//               }(window,document,"script","67b00b6de904d5920e690b84",["cdn.bmcdn6.com"], 0, new Date().getTime())
//             }();
//           `,
//         }}
//       />
//     </>
//   );
// }
// export default function NewsCompo() {
//   const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery([]);
//   if (allBlogsDataLoading) {
//     return <Loading />
//   }

//   const allBlogs: Article[] = allBlogsData?.data;

//   return (
//     <div>
//       <div className="container mx-auto mt-10">
//         <h2 className=" text-2xl text-center mb-6 font-bold text-cyan-600">Trobits Articles</h2>

//         <div className="flex flex-wrap justify-center gap-2 max-w- mx-auto">
//           {allBlogs?.slice(0, 8).map((article, index) => (

//             <div key={article.id}>
//               <NewsCard articleData={article} />
//               {/* Insert 4 ads every 4 NewsCards */}
//               {(index + 1) % 4 === 0 && (
//                 <>
//                   <AdBannerA />
//                   <AdBannerA />
//                   <AdBannerA />
//                   <AdBannerA />
//                 </>
//               )}

//             </div>
            
//           ))}
//         </div>
//       </div>
//       <Link href="/articles">
//         <div className="text-center mt-20">
//           <Button className="mx-auto bg-cyan-700  text-white">See More</Button>
//         </div>
//       </Link>
//     </div>
//   );
// }














// pages/index.js
import Link from "next/link";
import { Button } from "../ui/button";
import NewsCard from "./NewsCard";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "../Shared/Loading";
import { Article } from "@/app/(withCommonLayout)/articles/page";
import Script from "next/script";
import React from "react";

// AdBanner Component
const AdBanner = ({ adClass }: { adClass: string }) => {
  return (
    <>
      {/* Ad banner */}
      <ins
        className={adClass}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
      ></ins>
      <Script
        id={`ad-banner-script-${adClass}`}
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
              }(window,document,"script","${adClass}",["cdn.bmcdn6.com"], 0, new Date().getTime())
            }();
          `,
        }}
      />
    </>
  );
};

// NewsCompo Component
export default function NewsCompo() {
  const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery([]);

  // Handle loading state
  if (allBlogsDataLoading) {
    return <Loading />;
  }

  const allBlogs: Article[] = allBlogsData?.data || [];

  // Ad classes to rotate through
  const adClasses = [
    "67b00b6de904d5920e690b84",
    "67b3b8a41b3a7f15c72fcc94",
    "67b3b9181b3a7f15c72fce5d",
    "67b3b9469a62fcbf1eeb65df",
    "67b3c7949a62fcbf1eeb83a6",
    "67b3c7d89a62fcbf1eeb842e",
  ];

  // Function to get the next 4 ads
  const getNextAds = (index: number) => {
    const ads = [];
    for (let i = 0; i < 4; i++) {
      const adIndex = (index * 4 + i) % adClasses.length; // Cycle through adClasses
      ads.push(<AdBanner key={`${index}-${i}`} adClass={adClasses[ adIndex ]} />);
    }
    return ads;
  };

  // Function to split articles into chunks of 4
  const chunkArray = (array: Article[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // Split articles into chunks of 4
  const articleChunks = chunkArray(allBlogs.slice(0, 8), 4);

  return (
    <div>
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl text-center mb-6 font-bold text-cyan-600">Trobits Articles</h2>

        <div className="flex flex-wrap justify-center gap-2 max-w- mx-auto">
          {articleChunks.map((chunk, chunkIndex) => (
            <React.Fragment key={chunkIndex}>
              {/* Render 4 Articles */}
              {chunk.map((article) => (
                <NewsCard key={article.id} articleData={article} />
              ))}

              {/* Render 4 Ads */}
              {getNextAds(chunkIndex)}
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