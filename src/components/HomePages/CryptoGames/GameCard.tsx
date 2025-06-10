import React from "react";
import Image, { StaticImageData } from "next/image";

interface GameCardProps {
  title: string;
  image: string | StaticImageData;
  onPlay: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, image, onPlay }) => (
  <div className="group relative bg-gradient-to-br from-[#1a2238] to-[#0f172a] text-white border border-cyan-600/20 p-4 rounded-2xl shadow-[0_0_10px_#00ffff33] w-72 text-center overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_#00ffff55]">
    {/* Title on top */}
    <h3 className="text-xl font-bold mt-2 mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
      {title}
    </h3>

    {/* Image container with hover effects */}
    <div className="relative w-full h-48 rounded-xl overflow-hidden cursor-pointer">
      <Image
        src={image}
        alt={title}
        layout="fill" // Ensures the image fills the container
        objectFit="cover" // Covers the area without distortion
        className="transform transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
      />
      {/* Overlay and Play button */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button
          onClick={onPlay}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:from-cyan-400 hover:to-blue-400"
        >
          ▶️ Play Now
        </button>
      </div>
    </div>
  </div>
);

export default GameCard;
