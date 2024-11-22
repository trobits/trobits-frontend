// pages/index.js
import Link from "next/link";
import { Button } from "../ui/button";
import NewsCard from "./NewsCard";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "../Shared/Loading";
import { Article } from "@/app/(withCommonLayout)/articles/page";

// export const articlesData = [
//   {
//     id: 1,
//     title:
//       "SHIB: From Meme to Mainstream – The Evolution of a Crypto Phenomenon",
//     author: "Greenlysphere",
//     description:
//       "The token Shiba Inu (SHIB) has risen from being just an internet meme...",
//     image:
//       "https://bravenewcoin.com/wp-content/uploads/2024/08/IMG-20240820-WA0013.jpg",
//   },
//   {
//     id: 2,
//     title: "Impact of Burning SHIB and LUNC on Their Value",
//     author: "Greenlysphere",
//     description:
//       "The process of cryptocurrency burning involves permanently removing...",
//     image:
//       "https://bravenewcoin.com/wp-content/uploads/2024/08/IMG-20240820-WA0013.jpg",
//   },
//   {
//     id: 3,
//     title: "How to Choose the Right Exchange for Buying Crypto",
//     author: "Maxwell",
//     description:
//       "Entering the world of cryptocurrencies often feels like going...",
//     image:
//       "https://bravenewcoin.com/wp-content/uploads/2024/08/IMG-20240820-WA0013.jpg",
//   },
//   {
//     id: 4,
//     title: "How to Choose the Right Exchange for Buying Crypto",
//     author: "Maxwell",
//     description:
//       "Entering the world of cryptocurrencies often feels like going...",
//     image:
//       "https://bravenewcoin.com/wp-content/uploads/2024/08/IMG-20240820-WA0013.jpg",
//   },
//   {
//     id: 5,
//     title: "How to Choose the Right Exchange for Buying Crypto",
//     author: "Maxwell",
//     description:
//       "Entering the world of cryptocurrencies often feels like going...",
//     image:
//       "https://bravenewcoin.com/wp-content/uploads/2024/08/IMG-20240820-WA0013.jpg",
//   },
//   {
//     id: 6,
//     title: "How to Choose the Right Exchange for Buying Crypto",
//     author: "Maxwell",
//     description:
//       "Entering the world of cryptocurrencies often feels like going...",
//     image:
//       "https://bravenewcoin.com/wp-content/uploads/2024/08/IMG-20240820-WA0013.jpg",
//   },
//   {
//     id: 7,
//     title: "How to Choose the Right Exchange for Buying Crypto",
//     author: "Maxwell",
//     description:
//       "Entering the world of cryptocurrencies often feels like going...",
//     image:
//       "https://bravenewcoin.com/wp-content/uploads/2024/08/IMG-20240820-WA0013.jpg",
//   },
//   {
//     id: 8,
//     title: "How to Choose the Right Exchange for Buying Crypto",
//     author: "Maxwell",
//     description:
//       "Entering the world of cryptocurrencies often feels like going...",
//     image:
//       "https://bravenewcoin.com/wp-content/uploads/2024/08/IMG-20240820-WA0013.jpg",
//   },
// ];

export default function NewsCompo() {
  const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery([]);
  if (allBlogsDataLoading) {
    return <Loading />
  }

  const allBlogs: Article[] = allBlogsData?.data;

  console.log(allBlogs)
  return (
    <div>
      <div className="container mx-auto mt-10">
        <h2 className=" text-2xl text-center mb-6 font-bold text-cyan-600">Crypto News</h2>

        <div className="flex flex-wrap justify-center gap-2 max-w- mx-auto">
          {allBlogs?.slice(0, 8).map((article, index) => (
            <NewsCard key={index + 1} articleData={article} />
          ))}
        </div>
      </div>
      <Link href="/articles">
        <div className="text-center mt-20">
          <Button className="mx-auto bg-cyan-700  text-white">See More</Button>
        </div>
      </Link>
    </div>
  );
}
