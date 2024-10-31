import NewsCard from "@/components/NewsPart/NewsCard";
import Image from "next/image";
import * as React from "react";
import globalGlove from "../../../assets/pngGlobe.png";
import { articlesData } from "@/components/Constant/articleData.constant";

const ArticlesPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between py-5 px-20  bg-gradient-to-r from-[#574386] to-[#0a1c79] m-10 bg-transparent rounded-lg">
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
      <div className="flex flex-wrap justify-center gap-2 px-[180px]">
        {articlesData.map((article, index) => (
          <NewsCard key={index + 1} articleData={article} />
        ))}
      </div>
    </div>
  );
};
export default ArticlesPage;
