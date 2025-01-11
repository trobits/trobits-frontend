/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import OtherVideoModal from "@/components/VideoModal/OtherVideoModal";
import VideoModal from "@/components/VideoModal/VideoModal";
import React, { useState } from "react";

const CryptoInfo = () => {
  const [isMOdalOpen, setIsModalOpen] = useState(false);
  const [correntModal, setCorrentModal] = useState("");
  return (
    <>
      <div className=" flex container mx-auto mt-20 text-white items-center justify-center">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setCorrentModal("demoVideo");
          }}
          className="mr-20 font-bold cursor-pointer px-6 py-2 rounded-md bg-cyan-500"
        >
          Demo Video
        </button>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setCorrentModal("howitworks");
          }}
          className="mr-20 font-bold cursor-pointer px-6 py-2 rounded-md bg-cyan-500"
        >
          How Trobits Work
        </button>
      </div>
      {isMOdalOpen &&
        (correntModal === "demoVideo" ? (
          <VideoModal
            isOpen={isMOdalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <OtherVideoModal
            isOpen={isMOdalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setCorrentModal("");
            }}
          />
        ))}
    </>
  );
};

export default CryptoInfo;
