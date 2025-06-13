/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Image from "next/image";
import ShibImage from "/src/assets/shib-topic.png";
import LuncImage from "/src/assets/lunc-topic.png";
import { useGetAllArchiveQuery } from "@/redux/features/api/archiveApi";
import Loading from "@/components/Shared/Loading";
import Link from "next/link";
import { Archive, ArrowRight, Flame } from "lucide-react";

const ArchivePage: React.FC = () => {
  const { data: allArchiveData, isLoading: allArchiveDataLoading } =
    useGetAllArchiveQuery("");
    
  if (allArchiveDataLoading) {
    return <Loading />;
  }
  
  const allArchive =
    allArchiveData?.data?.length > 0 ? allArchiveData?.data : [];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Archive className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Historical Data
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Burn Archives
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore comprehensive burn data and historical records for SHIB and LUNC tokens
          </p>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent w-64" />
          </div>
        </div>

        {/* Archive Cards */}
        <div className="max-w-4xl mx-auto">
          {allArchive?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allArchive.map((archive: { id: string; name: string }) => (
                <div
                  key={archive?.id}
                  className="group bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden 
                           transform transition-all duration-500 hover:scale-105 hover:-translate-y-2
                           hover:bg-gray-900/80 hover:border-gray-700/80 hover:shadow-2xl hover:shadow-black/40"
                >
                  {/* Image Section */}
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={archive?.name === "LUNC" ? LuncImage : ShibImage}
                      alt={archive?.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1
                                   opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center gap-2">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-white font-medium">Archive</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Title and Description */}
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                          {archive?.name} Archive
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {archive?.name === "LUNC" 
                            ? "Comprehensive Terra Luna Classic burn data and historical records"
                            : "Complete Shiba Inu burn statistics and transaction history"
                          }
                        </p>
                      </div>

                      {/* Stats Preview */}
                      <div className="flex items-center gap-4 py-3 px-4 bg-black/30 border border-gray-800/30 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                            <Flame className="w-4 h-4 text-red-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Total Burns</p>
                            <p className="text-sm font-semibold text-white">View Archive</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/dashboard/archive/${
                          archive?.name === "LUNC" ? "lunc" : "shiba"
                        }`}
                        className="group/btn w-full bg-white text-black font-semibold py-4 px-6 rounded-2xl 
                                 hover:bg-gray-100 transition-all duration-300 hover:scale-105
                                 flex items-center justify-center gap-3 shadow-lg"
                      >
                        <span>Explore Archive</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="space-y-4">
                <Archive className="w-16 h-16 text-gray-600 mx-auto" />
                <h3 className="text-2xl font-semibold text-gray-400">No Archives Available</h3>
                <p className="text-gray-500">Check back later for archive data</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-16">
          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              Archive data is updated regularly to provide comprehensive historical insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;