/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import OtherVideoModal from "@/components/VideoModal/OtherVideoModal";
import Link from "next/link";
import React, { useState } from "react";

const CryptoInfo = () => {
  const [isMOdalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className=" flex container mx-auto mt-20 text-white items-center justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="mr-20 font-bold cursor-pointer px-6 py-2 rounded-md bg-cyan-500"
        >
          Demo Video
        </button>
        <Link
          href={"/howitworks"}
          className="font-bold cursor-pointer px-6 py-2 rounded-md bg-cyan-500"
        >
          How Trobits Work
        </Link>
      </div>
      {isMOdalOpen && (
        <OtherVideoModal
          isOpen={isMOdalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default CryptoInfo;
