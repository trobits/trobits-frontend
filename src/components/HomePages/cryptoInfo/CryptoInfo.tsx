/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { LayoutGrid } from "lucide-react"; // Optional icon
import React, { useState } from "react";
import OtherVideoModal from "@/components/VideoModal/OtherVideoModal";
import VideoModal from "@/components/VideoModal/VideoModal";
import { GrowMeWidget } from "../Slider/Slider";
import { Button } from "@/components/ui/button";

const CryptoInfo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<
    "demoVideo" | "howitworks" | ""
  >("");

  const openModal = (type: "demoVideo" | "howitworks") => {
    setCurrentModal(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModal("");
  };

  return (
    <section className="container mx-auto mt-20 px-4">
      <div className="flex flex-wrap justify-center gap-8 text-white">
        <Button
          onClick={() => openModal("demoVideo")}
          className="
      group bg-white text-black px-8 py-7 rounded-2xl font-semibold text-base
      transition-all duration-300 hover:scale-105
      hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white
      hover:shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]
      flex items-center gap-2
    "
        >
          <LayoutGrid className="w-4 h-4 group-hover:text-white text-black transition-colors duration-0" />
          <span className="transition-colors duration-0">Demo Video</span>
        </Button>

        <Button
          onClick={() => openModal("howitworks")}
          className="
      group bg-white text-black px-9 py-7 rounded-2xl font-semibold text-base
      transition-all duration-300 hover:scale-105
      hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white
      hover:shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]
      flex items-center gap-2
    "
        >
          <LayoutGrid className="w-4 h-4 group-hover:text-white text-black transition-colors duration-0" />
          <span className="transition-colors duration-0">How Trobits Work</span>
        </Button>
      </div>

      {/* Modals */}
      {isModalOpen && currentModal === "demoVideo" && (
        <VideoModal isOpen={isModalOpen} onClose={closeModal} />
      )}
      {isModalOpen && currentModal === "howitworks" && (
        <OtherVideoModal isOpen={isModalOpen} onClose={closeModal} />
      )}

      {/* Widget */}
      <div className="mt-12">
        <GrowMeWidget />
      </div>
    </section>
  );
};

export default CryptoInfo;
