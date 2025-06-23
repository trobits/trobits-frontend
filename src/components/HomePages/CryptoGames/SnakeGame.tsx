"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import ShibaIcon from "@/assets/icons/shiba-inu.png";
import snakeHead from "@/assets/snakeHead.png";
import { Award, Play, RotateCcw, Trophy, Zap } from "lucide-react";
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";

const CELL_SIZE = 20;
const WIDTH = 600; // Increased from 400
const HEIGHT = 500; // Increased from 400

type Point = { x: number; y: number };

// Leaderboard state will be fetched from backend

// Helper function for random food position, defined outside the component
// It takes the current snake array as an argument
const calculateRandomFoodPosition = (currentSnake: Point[]): Point => {
  let newFood: Point;
  let collision: boolean;

  do {
    newFood = {
      x: Math.floor(Math.random() * (WIDTH / CELL_SIZE)) * CELL_SIZE,
      y: Math.floor(Math.random() * (HEIGHT / CELL_SIZE)) * CELL_SIZE,
    };
    // Check collision with snake body
    collision = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
  } while (collision);
  return newFood;
};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 300, y: 240 }]); // Centered for new canvas size
  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "snakegame",
    gameName: "Snake Game"
  });
  // Debug: log user and highscore when loaded
  React.useEffect(() => {
    console.log("[SnakeGame] User:", user);
    console.log("[SnakeGame] Loaded highscore:", highscore);
  }, [user, highscore]);
  // Initialize food using a function that gets the initial snake
  const [food, setFood] = useState<Point>(() =>
      calculateRandomFoodPosition([{ x: 300, y: 240 }])
  );
  const [dir, setDir] = useState<Point>({ x: 0, y: 0 }); // Current intended direction
  const [lastDir, setLastDir] = useState<Point>({ x: 0, y: 0 }); // Actual direction after last move
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized callback for generating food, now relies on the external helper
  const getRandomFood = useCallback(() => {
    return calculateRandomFoodPosition(snake);
  }, [snake]); // Dependency on snake to avoid food spawning on current snake

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playing || gameOver) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // Prevent default scroll behavior
      }

      let newDir: Point = { x: dir.x, y: dir.y };

      switch (e.key) {
        case "ArrowUp":
          if (lastDir.y === 0) newDir = { x: 0, y: -CELL_SIZE };
          break;
        case "ArrowDown":
          if (lastDir.y === 0) newDir = { x: 0, y: CELL_SIZE };
          break;
        case "ArrowLeft":
          if (lastDir.x === 0) newDir = { x: -CELL_SIZE, y: 0 };
          break;
        case "ArrowRight":
          if (lastDir.x === 0) newDir = { x: CELL_SIZE, y: 0 };
          break;
      }
      // Only update direction if it's a valid change (not 180 degree turn)
      if (newDir.x !== dir.x || newDir.y !== dir.y) {
        setDir(newDir);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dir, lastDir, playing, gameOver]); // Added lastDir to dependencies

  // Game loop
  useEffect(() => {
    if (!playing || gameOver || (dir.x === 0 && dir.y === 0)) {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      return;
    }

    // Clear previous interval if direction changed, or if starting a new interval
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }

    gameIntervalRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        head.x += dir.x;
        head.y += dir.y;

        // Update lastDir after the move is processed
        setLastDir(dir);

        const hitWall =
            head.x < 0 || head.y < 0 || head.x >= WIDTH || head.y >= HEIGHT;
        const hitSelf = prev.some(
            (segment, index) =>
                index !== 0 && segment.x === head.x && segment.y === head.y // Exclude head itself
        );

        if (hitWall || hitSelf) {
          setGameOver(true);
          setPlaying(false);
          // Submit highscore if this run is higher
          const currentScore = prev.length - 1;
          console.log("[SnakeGame] Game Over! Current Score:", currentScore);
          console.log("[SnakeGame] Previous Highscore:", highscore);
          submitHighscore(currentScore).then(() => {
            console.log("[SnakeGame] submitHighscore called with:", currentScore);
          });
          if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
          }
          return prev;
        }

        const newSnake = [head, ...prev];

        if (head.x === food.x && head.y === food.y) {
          // Food eaten, generate new food
          // Use calculateRandomFoodPosition directly here, passing the current newSnake state
          setFood(calculateRandomFoodPosition(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    }, 110); // Decreased interval for more frequent updates (smoother feel)

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [dir, food, gameOver, playing]); // getRandomFood is no longer a direct dependency here, as we call calculateRandomFoodPosition

  const startGame = () => {
    const initialSnake = [{ x: 300, y: 240 }]; // Centered for new canvas size
    setSnake(initialSnake);
    setFood(calculateRandomFoodPosition(initialSnake)); // Generate food relative to initial snake
    setDir({ x: CELL_SIZE, y: 0 }); // Start moving right automatically
    setLastDir({ x: CELL_SIZE, y: 0 });
    setGameOver(false);
    setPlaying(true);
  };

  const score = snake.length - 1;

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; userId: string }[]>([]);

  // Fetch leaderboard from backend
  const fetchLeaderboard = useCallback(() => {
    fetch("http://localhost:3000/api/v1/games/snakegame/getallscores")
      .then(res => res.json())
      .then(data => {
        const scoresObj = data.scores || {};
        // Convert to array and sort descending
        const arr = Object.values(scoresObj)
          .map((entry: any) => ({
            name: entry.user_id === user?.id
              ? "You"
              : (entry.first_name ? entry.first_name : entry.user_id),
            score: entry.highscore,
            userId: entry.user_id
          }))
          .sort((a, b) => b.score - a.score);
        setLeaderboard(arr);
        console.log("[SnakeGame] Leaderboard fetched (names only):", arr.map(e => ({ name: e.name, score: e.score, userId: e.userId })));
      })
      .catch(err => {
        setLeaderboard([]);
        console.error("[SnakeGame] Failed to fetch leaderboard", err);
      });
  }, [user?.id]);

  // Fetch leaderboard on mount and after game over
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, gameOver]);

  return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8">
          {/* Game Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <span className="text-2xl">🐍</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Crypto Snake
            </h2>
            <p className="text-gray-400 text-lg">
              Collect SHIB coins and grow your snake!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
            {/* Game Area */}
            <div className="flex-1 max-w-4xl">
              {!playing ? (
                  <div
                      className="bg-gray-900/60 border border-gray-700/50 rounded-2xl flex flex-col justify-center items-center text-center p-8 mx-auto"
                      style={{ width: WIDTH, height: HEIGHT }}
                  >
                    <div className="space-y-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto">
                        <span className="text-4xl">🐍</span>
                      </div>

                      <div className="space-y-3">
                        <p className="text-lg text-gray-300">
                          Use <span className="font-bold text-green-400">arrow keys</span>{" "}
                          to control the snake. Eat the{" "}
                          <span className="font-bold text-yellow-400">
                        Shiba Inu coin
                      </span>{" "}
                          to grow!
                        </p>
                      </div>

                      {gameOver && (
                          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-4">
                            <p className="text-red-400 text-xl font-semibold">
                              Game Over! Your Score: {score}
                            </p>
                          </div>
                      )}

                      <button
                          onClick={startGame}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
                      >
                        {gameOver ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {gameOver ? "Play Again" : "Start Game"}
                      </button>
                    </div>
                  </div>
              ) : (
                  <div
                      className="mx-auto border border-gray-700/50 rounded-xl overflow-hidden"
                      style={{
                        width: WIDTH,
                        height: HEIGHT,
                        backgroundColor: "#1e293b",
                        position: "relative",
                        boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
                      }}
                  >
                    {snake.map((segment, idx) => (
                        <div
                            key={idx}
                            style={{
                              width: CELL_SIZE,
                              height: CELL_SIZE,
                              position: "absolute",
                              left: segment.x,
                              top: segment.y,
                              transition: "left 90ms linear, top 90ms linear", // Match new interval speed
                              borderRadius: idx === 0 ? "50%" : "6px", // Head is round, tail is slightly rounded square
                              zIndex: snake.length - idx, // Ensure head is always on top
                            }}
                        >
                          {idx === 0 ? (
                              // Snake Head Image
                              <Image
                                  src={snakeHead} // Ensure this path is correct for your project structure
                                  alt="Snake Head"
                                  layout="fill"
                                  objectFit="contain"
                                  className="drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]" // Optional: add glowing effect to head
                              />
                          ) : (
                              // Snake Tail Segments (greenish gradient to match theme)
                              <div
                                  className="w-full h-full"
                                  style={{
                                    background: `linear-gradient(to bottom right, hsl(${
                                        160 + idx * 2
                                    }, 80%, ${30 + idx * 2}%), hsl(${180 + idx * 2}, 70%, ${
                                        40 + idx * 2
                                    }%))`,
                                    boxShadow: `0 0 3px rgba(34, 197, 94, 0.5)`, // Green glow
                                  }}
                              />
                          )}
                        </div>
                    ))}

                    <Image
                        src={ShibaIcon}
                        alt="coin"
                        width={CELL_SIZE}
                        height={CELL_SIZE}
                        style={{
                          position: "absolute",
                          left: food.x,
                          top: food.y,
                          transition: "left 90ms linear, top 90ms linear", // Match new interval speed
                          pointerEvents: "none",
                          borderRadius: "50%",
                          filter: "drop-shadow(0 0 8px gold)",
                          zIndex: 0,
                        }}
                    />
                  </div>
              )}
            </div>

            {/* Right Panel: Score Board */}
            <div className="w-80 space-y-6">
              {/* Current Score */}
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold text-yellow-300">Current Score</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{score}</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">
                  {playing ? "Playing" : "Ready"}
                </span>
                </div>
                <div className="mt-4 text-base text-purple-300">
                  Highscore: {loading ? "..." : highscore}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                    <p className="text-sm text-gray-400">Top Crypto Snake Players</p>
                  </div>
                </div>

                {/* Scores List */}
                <div className="space-y-3">
                  {leaderboard.length === 0 && (
                    <div className="text-gray-400 text-center">No scores yet.</div>
                  )}
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 border ${
                        entry.name === "You"
                          ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-300 font-bold"
                          : "bg-gray-800/30 border-gray-700/30 text-white hover:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-sm w-6 text-center ${
                            entry.name === "You" ? "text-green-400" : "text-gray-400"
                          }`}
                        >
                          #{index + 1}
                        </span>
                        <p className="text-base truncate">
                          {entry.name === "You" ? "🚀 You" : entry.name}
                        </p>
                      </div>
                      <span
                        className={`font-bold text-xl ${
                          entry.name === "You" ? "text-green-400" : "text-yellow-400"
                        }`}
                      >
                        {entry.score}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500 text-center mt-6 pt-4 border-t border-gray-700/50">
                  Current Score:{" "}
                  <span className="font-bold text-green-400">{score}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SnakeGame;