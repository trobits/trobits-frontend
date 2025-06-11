"use client";

import React, { useState } from "react";
import GameCard from "./GameCard";
import SnakeGame from "@/components/HomePages/CryptoGames/SnakeGame";
import FlappyBird from "@/components/HomePages/CryptoGames/flappyBird"; // Import the new game component
import SnakeThumb from "@/assets/snake-thumb.png";
import FlappyThumb from "@/assets/bitcoin.png"; // Placeholder for Flappy Bird thumbnail

const games = [
  {
    id: "snake",
    title: "Crypto Snake",
    image: SnakeThumb,
  },
  {
    id: "flappy",
    title: "Flappy Coin",
    image: FlappyThumb, // You'll need to create this image
  },
];

const CryptoGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case "snake":
        return <SnakeGame />;
      case "flappy": // Add the new case for Flappy Bird
        return <FlappyBird />;
      default:
        return null;
    }
  };

  return (
    <section className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-20 mt-20">
      <div className="w-[calc(100%-20px)] mx-auto bg-gradient-to-br from-[#0c1220] to-[#0a1a3a] border border-cyan-600/30 shadow-[0_0_20px_#00ffff22] rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            🎮 Crypto Games
          </h2>
          <p className="mt-2 text-lg text-gray-400 font-medium">
            Explore fun ways to engage with crypto!
          </p>
        </div>

        {selectedGame ? (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-cyan-400 font-semibold hover:scale-105 transition-transform border border-cyan-600/50"
            >
              <span className="mr-2">🔙</span> Back to Games
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
