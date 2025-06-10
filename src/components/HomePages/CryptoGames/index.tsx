// components/HomePages/CryptoGames/index.tsx
"use client";

import React, { useState } from "react";
import GameCard from "./GameCard";
import SnakeGame from "@/components/HomePages/CryptoGames/SnakeGame";
import SnakeThumb from "@/assets/snake-thumb.png";

const games = [
  {
    id: "snake",
    title: "Crypto Snake",
    image: SnakeThumb,
  },
  // you can add more games here, e.g.:
  // {
  //   id: "flappy",
  //   title: "Flappy Coin",
  //   image: FlappyThumb,
  // },
];

const CryptoGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case "snake":
        return <SnakeGame />;
      default:
        return null;
    }
  };

  return (
    <section className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-20 mt-20">
      <div className="w-[calc(100%-20px)] mx-auto bg-gradient-to-br from-[#0c1220] to-[#0a1a3a] border border-cyan-600/30 shadow-[0_0_20px_#00ffff22] rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            🎮 Crypto Games
          </h2>
        </div>

        {selectedGame ? (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:scale-105 transition-transform"
            >
              🔙 Back to Games
            </button>
            {renderGame()}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {games.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                image={game.image}
                onPlay={() => setSelectedGame(game.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CryptoGames;
