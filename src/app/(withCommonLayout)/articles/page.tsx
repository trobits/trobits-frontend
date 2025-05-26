
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import NewsCard from "@/components/NewsPart/NewsCard";
// import Image from "next/image";
// import * as React from "react";
// import { useState } from "react";
// import globalGlove from "../../../assets/pngGlobe.png";
// import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
// import Loading from "@/components/Shared/Loading";
// import { IComment } from "@/components/Post/PostCommentCard";
// import Footer from "@/app/shared/Footer/Footer";
// import Script from "next/script";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { usePathname } from "next/navigation";
// import { setPaths } from "@/redux/features/slices/authSlice";


// export interface Article {
//   id: string;
//   title: string;
//   content: string;
//   authorId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   image?: string;
//   likeCount: number;
//   likers: string[];
//   comments: IComment[];
// }

// // Reusable Ad Component
// // const AdBanner = () => {
// //   return (
// //     <div className={`w-[300px] md:w-[326px] h-[280px] bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-102 hover:-translate-y-2 hover:shadow-2xl`}>
// //       <span className="text-gray-500 text-sm">Sponsored Content</span>
// //     </div>
// //   );
// // };

// const AdBanner = ({ adClass }: { adClass: string }) => {
//   const adContainerRef = React.useRef<HTMLDivElement>(null);

//   const injectAdScript = () => {
//     if (!adContainerRef.current) return;

//     // Remove existing ad script if any
//     const existingScript = document.querySelector(`script[data-ad-class="${adClass}"]`);
//     if (existingScript) {
//       existingScript.remove();
//     }

//     // Create and inject new ad script
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
//     script.setAttribute("data-ad-class", adClass);
//     document.body.appendChild(script);
//   };

//   React.useEffect(() => {
//     console.log(`Injecting ad: ${adClass}`);
//     injectAdScript(); // Inject on mount

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         injectAdScript(); // Re-inject ads on page activation
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [ adClass ]);

//   return (
//     <div ref={adContainerRef}>
//       <ins
//         className={adClass}
//         style={{ display: "inline-block", width: "1px", height: "1px" }}
//       ></ins>
//     </div>
//   );
// };

// const ArticlesPage = () => {
//   const [ currentPage, setCurrentPage ] = useState(1);
//   const limit = 12;
//   const previousPath = useAppSelector((state) => state.auth.previousPath);
//   const currentPath = useAppSelector((state) => state.auth.currentPath);
//   const dispatch = useAppDispatch();
//   const pathName = usePathname();

//   if (window) {
//     if (previousPath !== "/articles" && currentPath === "/articles") {
//       dispatch(setPaths(pathName));
//       window.location.reload();
//     }
//   }

//   const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery({
//     page: currentPage,
//     limit: limit,
//   });

//   // Handle loading state
//   if (allBlogsDataLoading) {
//     return <Loading />;
//   }

//   const allBlogs: Article[] = allBlogsData?.data || [];
//   const totalPages = allBlogsData?.meta?.totalPages || 0;

//   // Function to split articles into chunks
//   const chunkArray = (array: Article[], size: number) => {
//     const result = [];
//     for (let i = 0; i < array.length; i += size) {
//       result.push(array.slice(i, i + size));
//     }
//     return result;
//   };

//   // First row: 4 articles
//   const firstRowArticles = allBlogs.slice(0, 4);

//   // Remaining articles: 9 articles (to make the total 13)
//   const remainingArticles = allBlogs.slice(4, 12);

//   // Split remaining articles into chunks of 3
//   const articleChunks = chunkArray(remainingArticles, 3);

//   const adClasses = [
//     // "67b00b6de904d5920e690b84",
//     // "67b3b8a41b3a7f15c72fcc94",
//     // "67b3b9181b3a7f15c72fce5d",
//     "67b3b9469a62fcbf1eeb65df",
//     "67b3c7949a62fcbf1eeb83a6",
//     "67b3c7d89a62fcbf1eeb842e",
//   ];


//   // Function to get the ad element
//   const getNextAds = (chunkIndex: number) => {
//     return <AdBanner adClass={adClasses[ chunkIndex ]} key={`ad-${chunkIndex}`} />;
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   return (
//     <div>
//       {/* Header Section */}
//       <div className="flex items-center justify-between py-5 px-20 bg-gradient-to-r from-[#574386] to-[#0a1c79] m-10 bg-transparent rounded-lg">
//         <div className="flex items-center">
//           <h1 className="text-2xl text-[#33d9b2] font-semibold">Trobits Articles</h1>
//         </div>
//         <div className="flex items-center justify-center">
//           <Image src={globalGlove} alt="Crypto Icon" width={100} height={100} className="rounded-full" />
//         </div>
//       </div>

//       {/* Display Articles and Ads in the desired pattern */}
//       <div className="container mx-auto mt-10">
//         <div className="flex flex-wrap justify-center gap-2 mx-auto">
//           {/* First row: 4 articles */}

//           {/* Subsequent rows: alternate between 3 articles + ad and ad + 3 articles */}
//           {allBlogs.slice(0, 4).map((article) => (
//             <div key={article.id} className="flex flex-wrap justify-center items-center">
//               <NewsCard articleData={article} />
//             </div>
//           ))}

//           {allBlogs.slice(4).map((article, index) => (
//             <div key={article.id} className="flex flex-wrap justify-center items-center">
//               <NewsCard articleData={article} />
//               {/* Show an ad after every 2 articles */}
//               {(index + 1) % 3 === 0 && index < adClasses.length && (
//                 <AdBanner key={adClasses[ index ]} adClass={adClasses[ index++ ]} />
//               )}
//             </div>
//           ))}

//         </div>
//       </div>
//       {/* test */}
//       {/* Pagination Controls */}
//       <div className="flex justify-center items-center gap-4 mt-6">
//         <button
//           onClick={handlePrevPage}
//           disabled={currentPage === 1}
//           className={`px-4 disabled:cursor-not-allowed py-2 rounded-lg ${currentPage === 1 ? "bg-gray-400" : "bg-cyan-600 text-white"}`}
//         >
//           Previous
//         </button>
//         <span className="text-lg text-gray-300">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//           className={`px-4 py-2 disabled:cursor-not-allowed rounded-lg ${currentPage === totalPages ? "bg-gray-400" : "bg-cyan-600 text-white"}`}
//         >
//           Next
//         </button>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ArticlesPage;















"use client"
import React from 'react'
import SubPage from './SubPage'
import Footer from '@/app/shared/Footer/Footer'

const ArticlesPage = () => {
  return (
    <div>
      <SubPage />
      <Footer/>
    </div>
  )
}

export default ArticlesPage
