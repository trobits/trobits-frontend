/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Image from "next/image";
// import ShibImage from "/public/shib-topic.png";
import ShibImage from "/src/assets/shib-topic.png";
import LuncImage from "/src/assets/lunc-topic.png";
import { useGetAllArchiveQuery } from "@/redux/features/api/archiveApi";
import Loading from "@/components/Shared/Loading";
import Link from "next/link";

const ArchivePage: React.FC = () => {
  const { data: allArchiveData, isLoading: allArchiveDataLoading } =
    useGetAllArchiveQuery("");
  if (allArchiveDataLoading) {
    return <Loading />;
  }
  const allArchive =
    allArchiveData?.data?.length > 0 ? allArchiveData?.data : [];


  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-md">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-cyan-500">
          Burn Archives
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center items-center">
          {allArchive?.length > 0 &&
            allArchive?.map((archive: { id: string; name: string }) => (
              <div
                key={archive?.id}
                className="bg-white max-w-[30rem] shadow-lg rounded-xl overflow-hidden 
                         transform transition-all duration-300 hover:scale-105 
                         hover:shadow-2xl w-full aspect-square flex flex-col"
              >
                <div className="relative w-full h-3/4">
                  <Image
                    src={archive?.name === "LUNC" ? LuncImage : ShibImage}
                    alt={archive?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {archive?.name}
                  </h2>
                  <Link
                    href={`/dashboard/archive/${
                      archive?.name === "LUNC" ? "lunc" : "shiba"
                    }`}
                    className="w-full px-4 text-center font-bold text-lg bg-blue-600 text-white py-2 rounded-lg 
                             hover:bg-blue-700 transition-colors duration-300 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;
