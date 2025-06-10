"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import ShibaIcon from "@/assets/icons/shiba-inu.png";
import snakeHead from "@/assets/snakeHead.png";
import { Award } from "lucide-react"; // Import the Award icon for the scoreboard header

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 400;

type Point = { x: number; y: number };

// Dummy high scores for demonstration
const HIGH_SCORES = [
  { name: "Afaq", score: 37 },
  { name: "Legend", score: 24 },
  { name: "ProGamer", score: 18 },
  { name: "NoobMaster", score: 12 },
];

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
  const [snake, setSnake] = useState<Point[]>([{ x: 200, y: 200 }]);
  // Initialize food using a function that gets the initial snake
  const [food, setFood] = useState<Point>(() =>
    calculateRandomFoodPosition([{ x: 200, y: 200 }])
  );
  const [dir, setDir] = useState<Point>({ x: 0, y: 0 }); // Current intended direction
  const [lastDir, setLastDir] = useState<Point>({ x: 0, y: 0 }); // Actual direction after last move
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized callback for generating food, now relies on the external helper
  const getRandomFood = useCallback(() => {
    // This now simply calls the external helper with the current snake state
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
    }, 120); // Slightly increased interval for smoother visuals if needed

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [dir, food, gameOver, playing]); // getRandomFood is no longer a direct dependency here, as we call calculateRandomFoodPosition

  const startGame = () => {
    const initialSnake = [{ x: 200, y: 200 }];
    setSnake(initialSnake);
    setFood(calculateRandomFoodPosition(initialSnake)); // Generate food relative to initial snake
    setDir({ x: CELL_SIZE, y: 0 }); // Start moving right automatically
    setLastDir({ x: CELL_SIZE, y: 0 });
    setGameOver(false);
    setPlaying(true);
  };

  const score = snake.length - 1;

  // Combine high scores with the current player's score and sort them
  const allScores = [...HIGH_SCORES, { name: "You", score: score }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Display top 5 scores

  return (
    <div
      className="flex flex-col items-center p-6 bg-slate-900 text-white rounded-lg shadow-2xl border border-cyan-800"
      style={{
        maxWidth: "fit-content", // Adjust max-width to fit content
      }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        🐍 Crypto Snake
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 mt-4 justify-center items-center lg:items-start">
        {/* Left Panel: Game or Instructions */}
        <div>
          {!playing ? (
            <div className="w-[400px] h-[400px] bg-slate-800 flex flex-col justify-center items-center rounded-xl border-2 border-cyan-700 text-center px-6 shadow-lg">
              <p className="text-lg mb-4 text-slate-300">
                Use <span className="font-bold text-cyan-400">arrow keys</span>{" "}
                to control the snake. Eat the{" "}
                <span className="font-bold text-yellow-400">
                  Shiba Inu coin
                </span>{" "}
                to grow!
              </p>
              {gameOver && (
                <p className="text-red-400 text-xl font-semibold mt-2 animate-bounce">
                  Game Over! Your Score: {score}
                </p>
              )}
              <button
                onClick={startGame}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                {gameOver ? "Play Again" : "Start Game"}
              </button>
            </div>
          ) : (
            <div
              style={{
                width: WIDTH,
                height: HEIGHT,
                backgroundColor: "#1e293b",
                position: "relative",
                border: "3px solid #38bdf8",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 15px rgba(56, 189, 248, 0.5)",
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
                    transition: "left 120ms linear, top 120ms linear", // Match interval speed
                    borderRadius: idx === 0 ? "50%" : "6px", // Head is round, tail is slightly rounded square
                    zIndex: snake.length - idx, // Ensure head is always on top
                  }}
                >
                  {idx === 0 ? (
                    // Snake Head Image
                    <Image
                      src={snakeHead} // Placeholder, replace with your actual path
                      alt="Snake Head"
                      layout="fill"
                      objectFit="contain"
                      className="drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]" // Optional: add glowing effect to head
                    />
                  ) : (
                    // Snake Tail Segments (bluish gradient)
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(to bottom right, hsl(${
                          200 + idx * 2
                        }, 80%, ${30 + idx * 2}%), hsl(${220 + idx * 2}, 70%, ${
                          40 + idx * 2
                        }%))`,
                        boxShadow: `0 0 3px rgba(0, 180, 255, 0.5)`, // Subtle glow
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
                  transition: "left 120ms linear, top 120ms linear", // Match interval speed
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
        <div className="w-64 p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-md hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Leaderboard</h3>
              <p className="text-sm text-slate-400">Top Crypto Snake Players</p>
            </div>
          </div>

          {/* Scores List */}
          <div className="space-y-3">
            {allScores.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 border border-transparent ${
                  entry.name === "You"
                    ? "bg-cyan-900/50 border-cyan-700/50 text-cyan-300 font-bold scale-105"
                    : "hover:bg-slate-700/40 hover:border-slate-600/30 text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-sm w-6 text-center ${
                      entry.name === "You" ? "text-cyan-400" : "text-slate-400"
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
                    entry.name === "You" ? "text-cyan-400" : "text-yellow-400"
                  }`}
                >
                  {entry.score}
                </span>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-500 text-center mt-6 pt-4 border-t border-slate-700/50">
            Current Score:{" "}
            <span className="font-bold text-cyan-400">{score}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
