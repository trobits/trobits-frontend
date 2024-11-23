// import React, { FC } from 'react'
// interface IPageProps {
//   params: {
//     id: string;
//   }
// }

// const LearnItemsDetailsPage: FC<IPageProps> = ({ params: { id } }) => {
//   return (
//     <div>

//     </div>
//   )
// }

// export default LearnItemsDetailsPage

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoBookSharp } from "react-icons/io5";
import Link from "next/link";
import { cryptoTypesAndCryptoBasics } from "../page";

interface ParamsType {
  id: string;
}

interface ParamsParams {
  params: ParamsType;
}

const LearnDetailsPage = ({ params }: ParamsParams) => {


  
  const currentItemId = Number(params.id)
  const currentItem = cryptoTypesAndCryptoBasics.find((item) => item.id === currentItemId)
  return (
    <div className="bg-transparent mt-20">
      <h1 className=" font-bold text-white flex items-center gap-2 text-xl ">
        <IoBookSharp className=" text-cyan-500 size-9 ml-6" />
        <Link className="hover:text-cyan-600" href={"/learn"}> Learns</Link> /-<div className="text-cyan-500 transition-all"> {currentItem?.type}</div></h1>
      {" "}
      {/* Set background to transparent */}
      <Card className="max-w-4xl mx-auto bg-transparent border-none text-white">
        {" "}
        {/* Ensure Card has no background */}
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl text-center font-bold">
            {currentItem?.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={(currentItem?.image as string)}
              alt="Hand holding a bitcoin against roses"
              className="object-cover hover:scale-105 transition-all duration-300"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-white leading-relaxed text-2xl font-semibold">
              {currentItem?.cryptoQuestion}
            </p>
            <p className="text-white leading-relaxed">
              {currentItem?.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnDetailsPage;
