"use client";

import React, { useState } from "react";
import GameCard from "./GameCard";
import SnakeGame from "@/components/HomePages/CryptoGames/SnakeGame";

const games = [
  {
    id: "snake",
    title: "Crypto Snake",
    image: "/assets/snake-thumb.jpg",
  },
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
    <div className="flex flex-col items-center justify-center bg-[#0f172a] text-white p-6">
      <h2 className="text-2xl mb-6 text-center">🎮 Crypto Games</h2>

      {selectedGame ? (
        <div className="flex flex-col items-center">
          <button
            onClick={() => setSelectedGame(null)}
            className="mb-4 px-4 py-2 bg-red-600 rounded hover:bg-red-500"
          >
            🔙 Back to Games
          </button>
          {renderGame()}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
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
  );
};

export default CryptoGames;
