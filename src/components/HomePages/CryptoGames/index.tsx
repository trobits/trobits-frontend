"use client";

import React, { useState, useEffect } from "react";
import { Gamepad2, ArrowLeft, Play, Trophy } from "lucide-react";
import SnakeGame from "@/components/HomePages/CryptoGames/SnakeGame";
import BrickBreaker from "@/components/HomePages/CryptoGames/brickbreaker";
import CoinHunter from "@/components/HomePages/CryptoGames/CoinHunter";
import SpaceShooter from "@/components/HomePages/CryptoGames/SpaceShooter";
import FlappyBird from "@/components/HomePages/CryptoGames/flappyBird";
import SnakeThumb from "@/assets/snake-thumb.png";
import flappythumb from "@/assets/flappythumb.png"
import brickbreakerthumb from "@/assets/brickbreakerthumb.png";
import spaceshooterthumb from "@/assets/spaceshooterthumb.png";
import coinhunterthumb from "@/assets/coinhunterthumb.png";
import { BackgroundGradient } from "@/components/ui/backgroundGradient";
import { useNavbarVisibility } from "@/provider/navbarVisibility";
import Image from "next/image";

interface Game {
  id: string;
  title: string;
  subtitle: string;
  image: any;
  difficulty: string;
  players: string;
  gradient: string;
  borderGradient: string;
  textColor: string;
}

const games: Game[] = [
  {
    id: "snake",
    title: "Crypto Snake",
    subtitle: "Classic Snake with Crypto Rewards",
    image: SnakeThumb,
    difficulty: "Easy",
    players: "12.5K",
    gradient: "from-green-500/20 to-emerald-500/20",
    borderGradient: "from-green-500 to-emerald-500",
    textColor: "text-green-400",
  },
  {
    id: "flappy",
    title: "Flappy Coin",
    subtitle: "Navigate Through Market Volatility",
    image: flappythumb,
    difficulty: "Hard",
    players: "8.2K",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderGradient: "from-blue-500 to-cyan-500",
    textColor: "text-blue-400",
  },
  {
    id: "brickbreaker",
    title: "Crypto BrickBreaker",
    subtitle: "Smash Bricks, Collect Coins!",
    image: brickbreakerthumb,
    difficulty: "Medium",
    players: "5.7K",
    gradient: "from-orange-500/20 to-yellow-500/20",
    borderGradient: "from-orange-500 to-yellow-500",
    textColor: "text-orange-400",
  },
  {
    id: "coinhunter",
    title: "Coin Hunter 3D",
    subtitle: "Tap Fast, Avoid Bombs!",
    image: coinhunterthumb,
    difficulty: "Medium",
    players: "9.4K",
    gradient: "from-purple-500/20 to-pink-500/20",
    borderGradient: "from-purple-500 to-pink-500",
    textColor: "text-purple-400",
  },
  {
    id: "spaceshooter",
    title: "Crypto Blaster",
    subtitle: "Shoot Asteroids in the Digital Void",
    image: spaceshooterthumb,
    difficulty: "Hard",
    players: "7.9K",
    gradient: "from-red-500/20 to-rose-500/20",
    borderGradient: "from-red-500 to-rose-500",
    textColor: "text-red-400",
  },
];

interface EnhancedGameCardProps {
  game: Game;
  onPlay: () => void;
}

const EnhancedGameCard: React.FC<EnhancedGameCardProps> = ({
  game,
  onPlay,
}) => {
  return (
    <div className="group relative overflow-hidden">
      <div className="rounded-2xl bg-black p-1">
        <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-900/60 transition-all duration-300 group-hover:scale-105">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto bg-gradient-to-br ${game.gradient} border border-gray-700/50 overflow-hidden`}
          >
            <Image src={game.image} alt={game.title} />
          </div>
          <div className="text-center mb-4">
            <h3 className="text-white font-bold text-lg mb-1">{game.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{game.subtitle}</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-400">
                  {game.players} Players
                </span>
              </div>
              <div className="w-px h-3 bg-gray-700" />
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-gray-400">{game.difficulty}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onPlay}
            className={`w-full bg-gradient-to-r ${game.borderGradient} hover:shadow-lg hover:shadow-current/25 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2`}
          >
            <Play className="w-4 h-4" />
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

const CryptoGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { setIsVisible } = useNavbarVisibility();

  useEffect(() => {
    setIsVisible(!selectedGame); // Hide navbar if a game is selected
  }, [selectedGame]);

  useEffect(() => {
    return () => setIsVisible(true); // Reset visibility when component unmounts
  }, []);

  const renderGame = (): React.ReactNode => {
    switch (selectedGame) {
      case "snake":
        return <SnakeGame />;
      case "flappy":
        return <FlappyBird />;
      case "brickbreaker":
        return <BrickBreaker />;
      case "coinhunter":
        return <CoinHunter />;
      case "spaceshooter":
        return <SpaceShooter />;
      default:
        return null;
    }
  };

  const selectedGameData = games.find((game) => game.id === selectedGame);

  return (
    <section className="w-full max-w-screen mx-auto mt-28 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-7xl mx-auto px-6">
          <BackgroundGradient className="rounded-3xl bg-black">
            <div className="p-8">
              {selectedGame ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedGame(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Games
                    </button>
                    {selectedGameData && (
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${selectedGameData.gradient} overflow-hidden`}
                        >
                          <Image
                            src={selectedGameData.image}
                            alt={selectedGameData.title}
                            className="w-6 h-6 object-cover rounded"
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm">
                            {selectedGameData.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-400">
                              Playing
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
                    {renderGame()}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <Gamepad2 className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Crypto Games
                    </h2>
                    <p className="text-gray-400 text-lg">
                      Play games, earn rewards, and have fun with crypto!
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {games.map((game) => (
                      <EnhancedGameCard
                        key={game.id}
                        game={game}
                        onPlay={() => setSelectedGame(game.id)}
                      />
                    ))}
                  </div>
                  {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        44.7K
                      </div>
                      <div className="text-sm text-green-400">
                        Total Players
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        302K
                      </div>
                      <div className="text-sm text-blue-400">Games Played</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        5.1M
                      </div>
                      <div className="text-sm text-purple-400">
                        Rewards Earned
                      </div>
                    </div>
                  </div> */}
                </div>
              )}
            </div>
          </BackgroundGradient>
        </div>
      </div>
    </section>
  );
};

export default CryptoGames;
