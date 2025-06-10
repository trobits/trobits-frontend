import React from "react";

interface GameCardProps {
  title: string;
  image: string;
  onPlay: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, image, onPlay }) => (
  <div className="bg-[#1e293b] text-white p-4 rounded-xl shadow-md w-64 text-center">
    <img
      src={image}
      alt={title}
      className="w-full h-40 object-cover rounded-md"
    />
    <h3 className="text-lg mt-2">{title}</h3>
    <button
      onClick={onPlay}
      className="mt-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded w-full"
    >
      Play Now
    </button>
  </div>
);

export default GameCard;
