import React from "react";
import Image, { StaticImageData } from "next/image";

interface GameCardProps {
  title: string;
  image: string | StaticImageData;
  onPlay: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, image, onPlay }) => (
  <div className="bg-gradient-to-br from-[#1a2238] to-[#0f172a] text-white border border-cyan-600/20 p-5 rounded-2xl shadow-[0_0_10px_#00ffff33] w-72 text-center hover:scale-105 transition-transform">
    <Image
      src={image}
      alt={title}
      className="w-full h-44 object-cover rounded-xl border border-cyan-400/20"
    />
    <h3 className="text-lg font-semibold mt-3 mb-2 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
      {title}
    </h3>
    <button
      onClick={onPlay}
      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:scale-105 transition-transform"
    >
      ▶️ Play Now
    </button>
  </div>
);

export default GameCard;
