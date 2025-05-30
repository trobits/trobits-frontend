/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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
      <div className="flex flex-wrap justify-center gap-6 text-white">
        <Button
          variant="default"
          className="px-6 py-2 rounded-md bg-cyan-500 shadow-lg transform transition hover:scale-105 hover:bg-cyan-600"
          onClick={() => openModal("demoVideo")}
        >
          Demo Video
        </Button>

        <Button
          variant="default"
          className="px-6 py-2 rounded-md bg-cyan-500 shadow-lg transform transition hover:scale-105 hover:bg-cyan-600"
          onClick={() => openModal("howitworks")}
        >
          How Trobits Work
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
