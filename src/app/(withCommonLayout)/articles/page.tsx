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
// //import { Pagination } from "@/components/ui/pagination";
// import Script from "next/script";

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
// // const AdBanner = ({ adClass }: { adClass: string }) => {
// //   return (
// //     <>
// //       <ins className={adClass} style={{ display: "inline-block", width: "1px", height: "1px" }}></ins>
// //       <Script
// //         id={`ad-banner-script-${adClass}`}
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: `
// //             !function(e,n,c,t,o,r,d){
// //               !function e(n,c,t,o,r,m,d,s,a){
// //                 s=c.getElementsByTagName(t)[0],
// //                 (a=c.createElement(t)).async=!0,
// //                 a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
// //                 a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
// //                 s.parentNode.insertBefore(a,s)
// //               }(window,document,"script","${adClass}",["cdn.bmcdn6.com"], 0, new Date().getTime())
// //             }();
// //           `,
// //         }}
// //       />
// //     </>
// //   );
// // };

// // const ArticlesPage = () => {
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const limit = 12;

// //   const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery({
// //     page: currentPage,
// //     limit: limit,
// //   });

// //   // Handle loading state
// //   if (allBlogsDataLoading) {
// //     return <Loading />;
// //   }

// //   const allBlogs: Article[] = allBlogsData?.data || [];
// //   const totalPages = allBlogsData?.meta?.totalPages || 0;

// //   const handleNextPage = () => {
// //     if (currentPage < totalPages) {
// //       setCurrentPage((prevPage) => prevPage + 1);
// //     }
// //   };

// //   const handlePrevPage = () => {
// //     if (currentPage > 1) {
// //       setCurrentPage((prevPage) => prevPage - 1);
// //     }
// //   };

// //   return (
// //     <div>
// //       {/* Header Section */}
// //       <div className="flex items-center justify-between py-5 px-20 bg-gradient-to-r from-[#574386] to-[#0a1c79] m-10 bg-transparent rounded-lg">
// //         <div className="flex items-center">
// //           <h1 className="text-2xl text-[#33d9b2] font-semibold">Trobits Articles</h1>
// //         </div>
// //         <div className="flex items-center justify-center">
// //           <Image src={globalGlove} alt="Crypto Icon" width={100} height={100} className="rounded-full" />
// //         </div>
// //       </div>

// //       {/* Display Articles */}
// //       <div className="flex flex-wrap justify-center gap-4 px-1 md:px-24">
// //         {allBlogs.map((article, index) => (
// //           <React.Fragment key={article.id}>
// //             <NewsCard articleData={article} />

// //             {/* Insert an Ad every 4 articles */}
// //             {index % 6 === 0 && (
// //               <AdBanner adClass="67b00b6de904d5920e690b84" />
// //             )}
// //             {index % 6 === 1 && (
// //               <AdBanner adClass="67b3b8a41b3a7f15c72fcc94" />
// //             )}
// //              {index % 6 === 2 && (
// //               <AdBanner adClass="67b3b9181b3a7f15c72fce5d" />
// //             )}
// //              {index % 6 === 3 && (
// //               <AdBanner adClass="67b3b9469a62fcbf1eeb65df" />
// //             )}
// //             {index % 6 === 4 && (
// //               <AdBanner adClass="67b3c7949a62fcbf1eeb83a6" />
// //             )}
// //             {index % 6 === 5 && (
// //               <AdBanner adClass="67b3c7d89a62fcbf1eeb842e" />
// //             )}
// //           </React.Fragment>
// //         ))}
// //       </div>


// //       {/* Pagination Controls */}
// //       <div className="flex justify-center items-center gap-4 mt-6">
// //         <button
// //           onClick={handlePrevPage}
// //           disabled={currentPage === 1}
// //           className={`px-4 disabled:cursor-not-allowed py-2 rounded-lg ${
// //             currentPage === 1 ? "bg-gray-400" : "bg-cyan-600 text-white"
// //           }`}
// //         >
// //           Previous
// //         </button>
// //         <span className="text-lg text-gray-300">
// //           Page {currentPage} of {totalPages}
// //         </span>
// //         <button
// //           onClick={handleNextPage}
// //           disabled={currentPage === totalPages}
// //           className={`px-4 py-2 disabled:cursor-not-allowed rounded-lg ${
// //             currentPage === totalPages ? "bg-gray-400" : "bg-cyan-600 text-white"
// //           }`}
// //         >
// //           Next
// //         </button>
// //       </div>

// //       <Footer />
// //     </div>
// //   );
// // };



// // const ArticlesPage = () => {
// //   const [ currentPage, setCurrentPage ] = useState(1);
// //   const limit = 12;

// //   const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery({
// //     page: currentPage,
// //     limit: limit,
// //   });

// //   // Handle loading state
// //   if (allBlogsDataLoading) {
// //     return <Loading />;
// //   }

// //   const allBlogs: Article[] = allBlogsData?.data || [];
// //   const totalPages = allBlogsData?.meta?.totalPages || 0;

// //   // Function to split array into chunks
// //   const chunkArray = (array: Article[], size: number) => {
// //     const result = [];
// //     for (let i = 0; i < array.length; i += size) {
// //       result.push(array.slice(i, i + size));
// //     }
// //     return result;
// //   };


// //     const handleNextPage = () => {
// //       if (currentPage < totalPages) {
// //         setCurrentPage((prevPage) => prevPage + 1);
// //       }
// //     };

// //     const handlePrevPage = () => {
// //       if (currentPage > 1) {
// //         setCurrentPage((prevPage) => prevPage - 1);
// //       }
// //     };

// //   // Split articles into chunks of 4
// //   const articleChunks = chunkArray(allBlogs, 4);

// //   // Ad classes to rotate through
// //   const adClasses = [
// //     "67b00b6de904d5920e690b84",
// //     "67b3b8a41b3a7f15c72fcc94",
// //     "67b3b9181b3a7f15c72fce5d",
// //     "67b3b9469a62fcbf1eeb65df",
// //     "67b3c7949a62fcbf1eeb83a6",
// //     "67b3c7d89a62fcbf1eeb842e",

// //   ];

// //   // Function to get the next 4 ads
// //   const getNextAds = (index: number) => {
// //     const ads = [];
// //     for (let i = 0; i < 4; i++) {
// //       const adIndex = (index * 4 + i) % adClasses.length;
// //       ads.push(<AdBanner key={adIndex} adClass={adClasses[ adIndex ]} />);
// //     }
// //     return ads;
// //   };

// //   return (
// //     <div>
// //       {/* Header Section */}
// //       <div className="flex items-center justify-between py-5 px-20 bg-gradient-to-r from-[#574386] to-[#0a1c79] m-10 bg-transparent rounded-lg">
// //         <div className="flex items-center">
// //           <h1 className="text-2xl text-[#33d9b2] font-semibold">Trobits Articles</h1>
// //         </div>
// //         <div className="flex items-center justify-center">
// //           <Image src={globalGlove} alt="Crypto Icon" width={100} height={100} className="rounded-full" />
// //         </div>
// //       </div>

// //       {/* Display Articles and Ads */}
// //       <div className="flex flex-wrap justify-center gap-4 px-1 md:px-24">
// //         {articleChunks.map((chunk, chunkIndex) => (
// //           <React.Fragment key={chunkIndex}>
// //             {/* Render 4 Articles */}
// //             {chunk.map((article) => (
// //               <NewsCard key={article.id} articleData={article} />
// //             ))}

// //             {/* Render 4 Ads */}
// //             {getNextAds(chunkIndex)}
// //           </React.Fragment>
// //         ))}
// //       </div>

// //       {/* Pagination Controls */}
// //       <div className="flex justify-center items-center gap-4 mt-6">
// //         <button
// //           onClick={handlePrevPage}
// //           disabled={currentPage === 1}
// //           className={`px-4 disabled:cursor-not-allowed py-2 rounded-lg ${currentPage === 1 ? "bg-gray-400" : "bg-cyan-600 text-white"
// //             }`}
// //         >
// //           Previous
// //         </button>
// //         <span className="text-lg text-gray-300">
// //           Page {currentPage} of {totalPages}
// //         </span>
// //         <button
// //           onClick={handleNextPage}
// //           disabled={currentPage === totalPages}
// //           className={`px-4 py-2 disabled:cursor-not-allowed rounded-lg ${currentPage === totalPages ? "bg-gray-400" : "bg-cyan-600 text-white"
// //             }`}
// //         >
// //           Next
// //         </button>
// //       </div>

// //       <Footer />
// //     </div>
// //   );
// // };


// const AdBanner = () => {
//   return (
//     <div className={`w-[300px] md:w-[326px] h-[280px] bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-102 hover:-translate-y-2 hover:shadow-2xl `}>
//       <span className="text-gray-500 text-sm">Sponsored Content</span>
//     </div>
//   );
// };

// const ArticlesPage = () => {
//   const [ currentPage, setCurrentPage ] = useState(1);
//   const limit = 12;

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

//   // Function to split array into chunks
//   const chunkArray = (array: Article[], size: number) => {
//     const result = [];
//     for (let i = 0; i < array.length; i += size) {
//       result.push(array.slice(i, i + size));
//     }
//     return result;
//   };

//   // Split articles into chunks of 4
//   const articleChunks = chunkArray(allBlogs, 4);

//   // Ad classes to rotate through
//   const adClasses = [
//     "67b00b6de904d5920e690b84",
//     "67b3b8a41b3a7f15c72fcc94",
//     "67b3b9181b3a7f15c72fce5d",
//     "67b3b9469a62fcbf1eeb65df",
//     "67b3c7949a62fcbf1eeb83a6",
//     "67b3c7d89a62fcbf1eeb842e",
//   ];

//   // Function to get the next 4 ads
//   // const getNextAds = (index: number) => {
//   //   const ads = [];
//   //   for (let i = 0; i < 4; i++) {
//   //     const adIndex = (index * 4 + i) % adClasses.length; // Cycle through adClasses
//   //     ads.push(<AdBanner key={`${index}-${i}`} 

//   //       // adClass={adClasses[ adIndex ]} 

//   //     />);
//   //   }
//   //   return ads;
//   // };

//   const getNextAds = (chunkIndex: number) => {
//     const ads = [];

//     if (chunkIndex % 2 === 0) {
//       // Even chunkIndex: 3 articles + 1 ad
//       ads.push(<AdBanner key={`ad-${chunkIndex}`} />);
//     } else {
//       // Odd chunkIndex: 1 ad + 3 articles
//       ads.unshift(<AdBanner key={`ad-${chunkIndex}`} />);
//     }

//     return ads;
//   };


//     const handleNextPage = () => {
//       if (currentPage < totalPages) {
//         setCurrentPage((prevPage) => prevPage + 1);
//       }
//     };

//     const handlePrevPage = () => {
//       if (currentPage > 1) {
//         setCurrentPage((prevPage) => prevPage - 1);
//       }
//     };

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

//       {/* Display Articles and Ads */}
//       <div className="flex flex-wrap justify-center gap-4 px-1 md:px-24">
//         {articleChunks.map((chunk, chunkIndex) => (
//           <React.Fragment key={chunkIndex}>
//             {/* Render 4 Articles */}
//             {chunk.map((article) => (
//               <NewsCard key={article.id} articleData={article} />
//             ))}

//             {/* Render 4 Ads */}
//             {getNextAds(chunkIndex)}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-center items-center gap-4 mt-6">
//         <button
//           onClick={handlePrevPage}
//           disabled={currentPage === 1}
//           className={`px-4 disabled:cursor-not-allowed py-2 rounded-lg ${currentPage === 1 ? "bg-gray-400" : "bg-cyan-600 text-white"
//             }`}
//         >
//           Previous
//         </button>
//         <span className="text-lg text-gray-300">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//           className={`px-4 py-2 disabled:cursor-not-allowed rounded-lg ${currentPage === totalPages ? "bg-gray-400" : "bg-cyan-600 text-white"
//             }`}
//         >
//           Next
//         </button>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ArticlesPage;




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
// //import { Pagination } from "@/components/ui/pagination";
// import Script from "next/script";

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
// const AdBanner = () => {
//   return (
//     <div className={`w-[300px] md:w-[326px] h-[280px] bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-102 hover:-translate-y-2 hover:shadow-2xl`}>
//       <span className="text-gray-500 text-sm">Sponsored Content</span>
//     </div>
//   );
// };

// const ArticlesPage = () => {
//   const [ currentPage, setCurrentPage ] = useState(1);
//   const limit = 12;

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

//   // Function to split array into chunks
//   // Note: Changed chunk size from 4 to 3 for the zigzag pattern.
//   const chunkArray = (array: Article[], size: number) => {
//     const result = [];
//     for (let i = 0; i < array.length; i += size) {
//       result.push(array.slice(i, i + size));
//     }
//     return result;
//   };

//   // Split articles into chunks of 3
//   const articleChunks = chunkArray(allBlogs, 3);

//   // Function to get the ad element (kept simple)
//   const getNextAds = (chunkIndex: number) => {
//     return <AdBanner key={`ad-${chunkIndex}`} />;
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

//       {/* Display Articles and Ads in a zigzag pattern */}
//       <div className="flex flex-wrap justify-center gap-4 px-1 md:px-24">
//         {articleChunks.map((chunk, chunkIndex) => (
//           <React.Fragment key={chunkIndex}>
//             {chunkIndex % 2 === 0 ? (
//               <>
//                 {/* Even index: 3 articles then 1 ad */}
//                 {chunk.map((article) => (
//                   <NewsCard key={article.id} articleData={article} />
//                 ))}
//                 {getNextAds(chunkIndex)}
//               </>
//             ) : (
//               <>
//                 {/* Odd index: 1 ad then 3 articles */}
//                 {getNextAds(chunkIndex)}
//                 {chunk.map((article) => (
//                   <NewsCard key={article.id} articleData={article} />
//                 ))}
//               </>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

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



/* eslint-disable @typescript-eslint/no-unused-vars */
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
import Script from "next/script";

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

// Reusable Ad Component
// const AdBanner = () => {
//   return (
//     <div className={`w-[300px] md:w-[326px] h-[280px] bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-102 hover:-translate-y-2 hover:shadow-2xl`}>
//       <span className="text-gray-500 text-sm">Sponsored Content</span>
//     </div>
//   );
// };

const AdBanner = ({ adClass }: { adClass: string }) => {
  React.useEffect(() => {
    // Manually inject the script
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
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [ adClass ]);

  // Ad classes to rotate through

  return (
    <>
      {/* Ad banner */}
      <ins
        className={adClass}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
      ></ins>
    </>
  );
};

const ArticlesPage = () => {
  const [ currentPage, setCurrentPage ] = useState(1);
  const limit = 12;

  const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery({
    page: currentPage,
    limit: limit,
  });

  // Handle loading state
  if (allBlogsDataLoading) {
    return <Loading />;
  }

  const allBlogs: Article[] = allBlogsData?.data || [];
  const totalPages = allBlogsData?.meta?.totalPages || 0;

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
    "67b3b9469a62fcbf1eeb65df",
    "67b3c7949a62fcbf1eeb83a6",
    "67b3c7d89a62fcbf1eeb842e",
  ];


  // Function to get the ad element
  const getNextAds = (chunkIndex: number) => {
    return <AdBanner adClass={adClasses[chunkIndex]} key={`ad-${chunkIndex}`} />;
  };

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
          <h1 className="text-2xl text-[#33d9b2] font-semibold">Trobits Articles</h1>
        </div>
        <div className="flex items-center justify-center">
          <Image src={globalGlove} alt="Crypto Icon" width={100} height={100} className="rounded-full" />
        </div>
      </div>

      {/* Display Articles and Ads in the desired pattern */}
      <div className="container mx-auto mt-10">
        <div className="flex flex-wrap justify-center gap-2 max-w- mx-auto">
          {/* First row: 4 articles */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {firstRowArticles.map((article) => (
              <NewsCard key={article.id} articleData={article} />
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
                      <NewsCard key={article.id} articleData={article} />
                    ))}
                    {getNextAds(chunkIndex)}
                  </div>
                </>
              ) : (
                <>
                  {/* Odd row: 1 ad then 3 articles */}
                  <div className="flex flex-wrap justify-center gap-2 w-full">
                    {getNextAds(chunkIndex)}
                    {chunk.map((article) => (
                      <NewsCard key={article.id} articleData={article} />
                    ))}
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
{/* test */}
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 disabled:cursor-not-allowed py-2 rounded-lg ${currentPage === 1 ? "bg-gray-400" : "bg-cyan-600 text-white"}`}
        >
          Previous
        </button>
        <span className="text-lg text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 disabled:cursor-not-allowed rounded-lg ${currentPage === totalPages ? "bg-gray-400" : "bg-cyan-600 text-white"}`}
        >
          Next
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ArticlesPage;