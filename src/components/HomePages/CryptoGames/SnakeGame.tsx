"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import ShibaIcon from "@/assets/icons/shiba-inu.png";
import snakeHead from "@/assets/snakeHead.png";
import { Award, Play, RotateCcw, Trophy, Zap } from "lucide-react";
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";

const CELL_SIZE = 20;
const WIDTH = 600;
const HEIGHT = 500;
const NUM_COINS = 6; // Number of coins on the board at any time
const NUM_BOMBS = 3; // Number of bombs on the board at any time
const GAME_TICK_RATE = 100; // Milliseconds per game update (lower is faster and smoother)
const BOMB_MOVE_CHANCE = 0.1; // Probability (0-1) that a bomb moves on a given tick

type Point = { x: number; y: number };
type MovingObject = Point & { direction: Point }; // Only for bombs now

// Helper function to get a random position, avoiding specified occupied points
const getRandomPosition = (
  occupiedPositions: Point[],
): Point => {
  let newPos: Point;
  let collision: boolean;

  do {
    newPos = {
      x: Math.floor(Math.random() * (WIDTH / CELL_SIZE)) * CELL_SIZE,
      y: Math.floor(Math.random() * (HEIGHT / CELL_SIZE)) * CELL_SIZE,
    };
    // Check collision with any occupied position
    collision = occupiedPositions.some(
        (segment) => segment.x === newPos.x && segment.y === newPos.y
    );
  } while (collision);
  return newPos;
};

// Helper function for random direction (used only by bombs now if they need it, though they will mostly teleport now)
const getRandomDirection = (): Point => {
  const directions = [
    { x: CELL_SIZE, y: 0 },
    { x: -CELL_SIZE, y: 0 },
    { x: 0, y: CELL_SIZE },
    { x: 0, y: -CELL_SIZE },
  ];
  return directions[Math.floor(Math.random() * directions.length)];
};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 300, y: 240 }]);
  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "snakegame",
    gameName: "Snake Game",
  });

  const [coins, setCoins] = useState<Point[]>([]); // Coins are now just Point, no direction
  const [bombs, setBombs] = useState<MovingObject[]>([]);
  const [dir, setDir] = useState<Point>({ x: 0, y: 0 }); // Current intended direction
  const [lastDir, setLastDir] = useState<Point>({ x: 0, y: 0 }); // Actual direction after last move
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Debug: log user and highscore when loaded
  useEffect(() => {
    console.log("[SnakeGame] User:", user);
    console.log("[SnakeGame] Loaded highscore:", highscore);
  }, [user, highscore]);

  // Combined function to get all occupied positions (for new spawns)
  const getAllCurrentOccupiedPositions = useCallback(
    (currentSnake: Point[], currentCoins: Point[], currentBombs: MovingObject[]) => {
      return [...currentSnake, ...currentCoins, ...currentBombs];
    },
    []
  );

  // Initialize all game elements (snake, coins, bombs)
  const initializeGameElements = useCallback(() => {
    const initialSnake = [{ x: 300, y: 240 }];
    let occupied = [...initialSnake];

    // Initialize coins (static)
    const initialCoins: Point[] = [];
    for (let i = 0; i < NUM_COINS; i++) {
      const newCoin = getRandomPosition(occupied);
      initialCoins.push(newCoin);
      occupied.push(newCoin);
    }
    setCoins(initialCoins);

    // Initialize bombs
    const initialBombs: MovingObject[] = [];
    for (let i = 0; i < NUM_BOMBS; i++) {
      const newBomb = getRandomPosition(occupied);
      initialBombs.push({ ...newBomb, direction: getRandomDirection() });
      occupied.push(newBomb);
    }
    setBombs(initialBombs);

    setSnake(initialSnake);
    setDir({ x: CELL_SIZE, y: 0 }); // Start moving right automatically
    setLastDir({ x: CELL_SIZE, y: 0 });
    setGameOver(false);
    setPlaying(true);
  }, []);

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
  }, [dir, lastDir, playing, gameOver]);

  // --- Main Game Loop (updates snake, coins, and bombs) ---
  useEffect(() => {
    if (!playing || gameOver || (dir.x === 0 && dir.y === 0)) {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      return;
    }

    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }

    gameIntervalRef.current = setInterval(() => {
      // Calculate new snake head position
      const currentHead = snake[0];
      const newHead = { ...currentHead };
      newHead.x += dir.x;
      newHead.y += dir.y;

      setLastDir(dir); // Update lastDir based on the actual move

      // Update Bomb positions (completely random teleport)
      const nextBombs: MovingObject[] = bombs.map((bomb) => {
        if (Math.random() < BOMB_MOVE_CHANCE) {
          // To generate a new random position, we need to know all currently occupied cells
          // including the snake's potential new position, and existing coins/other bombs.
          // This prevents bombs from spawning on top of other game elements.
          const allOccupied = getAllCurrentOccupiedPositions(snake, coins, bombs.filter(b => b !== bomb)); // Exclude current bomb for its own new spawn check
          return { ...getRandomPosition(allOccupied), direction: getRandomDirection() }; // Direction is technically not used for movement now, but kept for type consistency
        }
        return bomb; // Bomb does not move
      });
      setBombs(nextBombs); // Update bombs state immediately

      // Check for Game Over Conditions (after bombs have moved)
      const hitWall =
        newHead.x < 0 || newHead.y < 0 || newHead.x >= WIDTH || newHead.y >= HEIGHT;
      const hitSelf = snake.some(
        (segment, index) =>
          index !== 0 && segment.x === newHead.x && segment.y === newHead.y
      );
      
      const hitBomb = nextBombs.some( // Check against the *next* bomb positions
        (bomb) => bomb.x === newHead.x && bomb.y === newHead.y
      );

      if (hitWall || hitSelf || hitBomb) {
        setGameOver(true);
        setPlaying(false);
        const currentScore = snake.length - 1;
        console.log("[SnakeGame] Game Over! Current Score:", currentScore);
        submitHighscore(currentScore).then(() => {
          console.log("[SnakeGame] submitHighscore called with:", currentScore);
        });
        if (gameIntervalRef.current) {
          clearInterval(gameIntervalRef.current);
          gameIntervalRef.current = null;
        }
        return; // Stop game loop immediately
      }

      let newSnake = [newHead, ...snake];
      let coinEaten = false;

      const eatenCoinIndex = coins.findIndex( // Check against the *current* coin positions
        (coin) => newHead.x === coin.x && newHead.y === coin.y
      );

      if (eatenCoinIndex !== -1) {
        coinEaten = true;
        // Coin eaten, remove it and add a new one (static spawn)
        const updatedCoins = [...coins];
        updatedCoins.splice(eatenCoinIndex, 1); // Remove eaten coin

        // Generate new coin - ensure it doesn't spawn on current snake, *other* coins, or bombs
        // Use the new snake and bomb positions for generating the new coin
        const allOccupiedAfterMove = getAllCurrentOccupiedPositions(newSnake, updatedCoins, nextBombs);
        updatedCoins.push(getRandomPosition(allOccupiedAfterMove)); // New coin is just a Point
        setCoins(updatedCoins); // Update coins state
      }

      if (!coinEaten) {
        newSnake.pop(); // Remove tail if no coin eaten
      }

      setSnake(newSnake); // Update snake state
      
    }, GAME_TICK_RATE);

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [dir, playing, gameOver, snake, coins, bombs, highscore, submitHighscore, getAllCurrentOccupiedPositions]); // Dependencies include snake, coins, bombs

  const startGame = () => {
    initializeGameElements(); // Re-initialize all game elements
  };

  const score = snake.length - 1;

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<
    { name: string; score: number; userId: string }[]
  >([]);

  // Fetch leaderboard from backend
  const fetchLeaderboard = useCallback(() => {
    fetch("http://localhost:3000/api/v1/games/snakegame/getallscores")
      .then((res) => res.json())
      .then((data) => {
        const scoresObj = data.scores || {};
        // Convert to array and sort descending
        const arr = Object.values(scoresObj)
          .map((entry: any) => ({
            name:
              entry.user_id === user?.id
                ? "You"
                : entry.first_name
                ? entry.first_name
                : entry.user_id,
            score: entry.highscore,
            userId: entry.user_id,
          }))
          .sort((a, b) => b.score - a.score);
        setLeaderboard(arr);
        console.log(
          "[SnakeGame] Leaderboard fetched (names only):",
          arr.map((e) => ({ name: e.name, score: e.score, userId: e.userId }))
        );
      })
      .catch((err) => {
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
            Collect SHIB coins and grow your snake! Dodge the bombs, they TELEPORT!
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
                      to grow! Avoid the <span className="font-bold text-red-400">bombs!</span>
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
                      transition: `left ${GAME_TICK_RATE - 10}ms linear, top ${GAME_TICK_RATE - 10}ms linear`,
                      borderRadius: idx === 0 ? "50%" : "6px",
                      zIndex: snake.length - idx,
                    }}
                  >
                    {idx === 0 ? (
                      // Snake Head Image
                      <Image
                        src={snakeHead}
                        alt="Snake Head"
                        layout="fill"
                        objectFit="contain"
                        className="drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]"
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
                          boxShadow: `0 0 3px rgba(34, 197, 94, 0.5)`,
                        }}
                      />
                    )}
                  </div>
                ))}

                {/* Render Coins (Static) */}
                {coins.map((coin, idx) => (
                  <Image
                    key={`coin-${idx}`}
                    src={ShibaIcon}
                    alt="coin"
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    style={{
                      position: "absolute",
                      left: coin.x,
                      top: coin.y,
                      pointerEvents: "none",
                      borderRadius: "50%",
                      filter: "drop-shadow(0 0 8px gold)",
                      zIndex: 0,
                    }}
                  />
                ))}

                {/* Render Bombs */}
                {bombs.map((bomb, idx) => (
                  <div
                    key={`bomb-${idx}`}
                    className="flex items-center justify-center"
                    style={{
                      position: "absolute",
                      left: bomb.x,
                      top: bomb.y,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      transition: `left ${GAME_TICK_RATE - 10}ms linear, top ${GAME_TICK_RATE - 10}ms linear`, // Still transition for movement
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 0, 0, 0.6)",
                      boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.7)",
                      zIndex: 1,
                    }}
                  >
                    <span className="text-white text-lg font-bold">X</span>
                  </div>
                ))}
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