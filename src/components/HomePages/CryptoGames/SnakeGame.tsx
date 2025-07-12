"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
// Import your actual image assets here:
// Make sure these paths are correct for your project structure
import ShibaIcon from "@/assets/icons/shiba-inu.png"; // Existing Shiba Inu icon
import snakeHead from "@/assets/snakeHead.png"; // Existing Snake Head icon

// ONLY keep imports for the coins that will be actively used in the game logic
import LuncIcon from "@/assets/icons/lunc.png"; // Used for LuncCoin
import FlokiIcon from "@/assets/icons/floki.png"; // Used for FlokiCoin

import { Award, Play, RotateCcw, Trophy, Zap } from "lucide-react";
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";

// --- Game Constants ---
const CELL_SIZE = 20; // Size of each cell in pixels
const WIDTH = 600; // Game board width in pixels
const HEIGHT = 500; // Game board height in pixels
const BOARD_COLS = WIDTH / CELL_SIZE; // Number of columns on the board
const BOARD_ROWS = HEIGHT / CELL_SIZE; // Number of rows on the board
const INITIAL_NUM_SHIBA_COINS = 3; // Initial number of Shiba coins on the board
const INITIAL_NUM_LUNC_COINS = 2; // Initial number of Lunc coins on the board
const GAME_TICK_RATE = 100; // Milliseconds per game update (lower is faster)
const MIN_SPAWN_DISTANCE_FROM_SNAKE = 3; // Minimum cell distance from snake head for new items

// Coin Effect Durations (in milliseconds) - Lunc invincibility is removed, so this is just for reference
const LUNC_EFFECT_DURATION = 5000; // Lunc: Invincibility (now removed)

// Coin Spawn Chances (simplified as only specific coins spawn)
const LIMITED_TIME_COIN_DURATION = 5000; // Limited-time coins disappear after this duration
const LIMITED_TIME_COIN_CHANCE = 0.2; // 20% chance for a coin to be limited-time
const BONUS_COIN_CHANCE = 0.1; // 10% chance for a coin to be a bonus coin

// Coin Rotation (removed as only specific coins are used)
const COIN_ROTATION_INTERVAL = 15000; // Rotate available coin types every 15 seconds (now removed)

// --- Type Definitions ---
type Point = { x: number; y: number };
type MovingObject = Point & { dx: number; dy: number }; // Bombs now have a direction (bombs removed)

// Updated CoinType enum to reflect only the active coins
type CoinType =
  | "shiba"
  | "lunc"
  | "floki";

type Coin = Point & {
  type: CoinType;
  spawnTime?: number; // Timestamp when coin was spawned (for limited-time coins)
  isBonus?: boolean; // True if it's a bonus coin
};

// Map coin types to their image assets using the new imports
const COIN_IMAGE_MAP: Record<CoinType, any> = {
  shiba: ShibaIcon,
  lunc: LuncIcon,
  floki: FlokiIcon,
};

// All possible coin types that can be part of the rotation pool (only the main 2 + floki)
const ALL_ROTATABLE_COIN_TYPES: CoinType[] = [
  "shiba",
  "lunc",
  "floki", // Floki is not rotatable, but included for type safety if needed
];

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 300, y: 240 }]);
  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "snakegame",
    gameName: "Snake Game",
  });

  const [coins, setCoins] = useState<Coin[]>([]);
  // Bombs are removed from the game
  const [snakeDirection, setSnakeDirection] = useState<Point>({ x: CELL_SIZE, y: 0 }); // Current intended direction for snake
  const [lastMovedDirection, setLastMovedDirection] = useState<Point>({ x: CELL_SIZE, y: 0 }); // Actual direction after last move
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [flokiKilled, setFlokiKilled] = useState(false); // New state for Floki death message

  // New states for game mechanics (simplified as per new rules)
  const [snakeSpeedMultiplier, setSnakeSpeedMultiplier] = useState<number>(1); // 1 = normal, <1 = slower, >1 = faster (not used for coins anymore)
  const [activePopups, setActivePopups] = useState<{ id: string; message: string; type: CoinType; }[]>([]); // For in-game popups

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Separate timeout refs for each powerup (simplified as per new rules)
  const coinRotationIntervalRef = useRef<NodeJS.Timeout | null>(null); // This will be removed

  // Debug: log user and highscore when loaded
  useEffect(() => {
    console.log("[SnakeGame] User:", user);
    console.log("[SnakeGame] Loaded highscore:", highscore);
  }, [user, highscore]);

  // Helper function to get a random position, avoiding specified occupied points
  const getRandomPosition = useCallback(
    (occupiedPositions: Point[], snakeHeadPos?: Point): Point => {
      let newPos: Point;
      let collision: boolean;
      let attempts = 0;
      const maxAttempts = 100; // Prevent infinite loops

      do {
        newPos = {
          x: Math.floor(Math.random() * BOARD_COLS) * CELL_SIZE,
          y: Math.floor(Math.random() * BOARD_ROWS) * CELL_SIZE,
        };
        collision = occupiedPositions.some(
          (segment) => segment.x === newPos.x && segment.y === newPos.y
        );

        // Ensure new item doesn't spawn too close to snake head if provided
        if (snakeHeadPos) {
          const distanceX = Math.abs(newPos.x - snakeHeadPos.x) / CELL_SIZE;
          const distanceY = Math.abs(newPos.y - snakeHeadPos.y) / CELL_SIZE;
          if (distanceX < MIN_SPAWN_DISTANCE_FROM_SNAKE && distanceY < MIN_SPAWN_DISTANCE_FROM_SNAKE) {
            collision = true; // Too close, try again
          }
        }
        attempts++;
      } while (collision && attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        console.warn("Could not find a suitable random position after many attempts.");
      }
      return newPos;
    },
    []
  );

  // Combined function to get all occupied positions (for new spawns)
  const getAllCurrentOccupiedPositions = useCallback(
    (currentSnake: Point[], currentCoins: Coin[]) => {
      // Exclude the last segment of the snake because it will move next tick, freeing up space.
      const snakeOccupied = playing ? currentSnake.slice(0, currentSnake.length - 1) : currentSnake;
      return [
        ...snakeOccupied,
        ...currentCoins.map((c) => ({ x: c.x, y: c.y })),
      ];
    },
    [playing]
  );

  // Function to spawn a new coin
  const spawnNewCoin = useCallback(
    (
      currentSnake: Point[],
      currentCoins: Coin[],
      specificType: CoinType, // Now requires a specific type
      isBonusOverride?: boolean,
      isTimedOverride?: boolean
    ): Coin => {
      const occupied = getAllCurrentOccupiedPositions(currentSnake, currentCoins);
      const newCoinPos = getRandomPosition(occupied, currentSnake[0]);

      let isTimed = isTimedOverride ?? (Math.random() < LIMITED_TIME_COIN_CHANCE);
      let isBonus = isBonusOverride ?? (Math.random() < BONUS_COIN_CHANCE);

      return {
        ...newCoinPos,
        type: specificType,
        spawnTime: isTimed ? Date.now() : undefined,
        isBonus: isBonus,
      };
    },
    [getAllCurrentOccupiedPositions, getRandomPosition]
  );

  // Function to add a temporary popup message
  const addPopup = useCallback((message: string, type: CoinType) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setActivePopups((prev) => [...prev, { id, message, type }]);

    // Remove popup after 2 seconds
    setTimeout(() => {
      setActivePopups((prev) => prev.filter((popup) => popup.id !== id));
    }, 2000); // Popup visible for 2 seconds
  }, []);

  // Initialize all game elements and states
  const initializeGameElements = useCallback(() => {
    // Reset all game states
    const initialSnake = [{ x: Math.floor(BOARD_COLS / 2) * CELL_SIZE, y: Math.floor(BOARD_ROWS / 2) * CELL_SIZE }];
    setSnake(initialSnake);
    setSnakeDirection({ x: CELL_SIZE, y: 0 }); // Start moving right
    setLastMovedDirection({ x: CELL_SIZE, y: 0 });
    setGameOver(false);
    setPlaying(true);
    setScore(0);
    setFlokiKilled(false); // Reset Floki killed status
    setSnakeSpeedMultiplier(1);
    setActivePopups([]); // Clear popups on game start

    let occupied: Point[] = [...initialSnake];

    // Initialize Shiba coins
    const initialCoins: Coin[] = [];
    for (let i = 0; i < INITIAL_NUM_SHIBA_COINS; i++) {
      const newCoin = spawnNewCoin(initialSnake, initialCoins, "shiba", false, false);
      initialCoins.push(newCoin);
      occupied.push(newCoin);
    }
    // Initialize Lunc coins
    for (let i = 0; i < INITIAL_NUM_LUNC_COINS; i++) {
      const newCoin = spawnNewCoin(initialSnake, initialCoins, "lunc", false, false);
      initialCoins.push(newCoin);
      occupied.push(newCoin);
    }
    setCoins(initialCoins);

    // Bombs are removed, so no initialization for them
  }, [getRandomPosition, spawnNewCoin]);

  // Keyboard input handler for snake direction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playing || gameOver) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // Prevent default scroll behavior
      }

      let newDir: Point = { x: snakeDirection.x, y: snakeDirection.y };

      switch (e.key) {
        case "ArrowUp":
          if (lastMovedDirection.y === 0) newDir = { x: 0, y: -CELL_SIZE };
          break;
        case "ArrowDown":
          if (lastMovedDirection.y === 0) newDir = { x: 0, y: CELL_SIZE };
          break;
        case "ArrowLeft":
          if (lastMovedDirection.x === 0) newDir = { x: -CELL_SIZE, y: 0 };
          break;
        case "ArrowRight":
          if (lastMovedDirection.x === 0) newDir = { x: CELL_SIZE, y: 0 };
          break;
      }

      // Only update snakeDirection if it's a valid change (not 180 degree turn or same direction)
      if (newDir.x !== snakeDirection.x || newDir.y !== snakeDirection.y) {
        setSnakeDirection(newDir);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [snakeDirection, lastMovedDirection, playing, gameOver]);

  // --- Coin Rotation Logic (Removed as per new rules) ---
  useEffect(() => {
    if (coinRotationIntervalRef.current) {
      clearInterval(coinRotationIntervalRef.current);
      coinRotationIntervalRef.current = null;
    }
  }, [playing]);

  // --- Main Game Loop ---
  useEffect(() => {
    if (!playing || gameOver || (snakeDirection.x === 0 && snakeDirection.y === 0)) {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      return;
    }

    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }

    // Adjust tick rate based on snake speed multiplier (not used for coins anymore)
    const actualTickRate = GAME_TICK_RATE / snakeSpeedMultiplier;

    gameIntervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const currentHead = prevSnake[0];
        let newHead = { x: currentHead.x + snakeDirection.x, y: currentHead.y + snakeDirection.y }; // Use let for newHead

        // Update lastMovedDirection only after a tick has passed
        setLastMovedDirection(snakeDirection);

        // --- Coin Timer Management ---
        setCoins((prevCoins) => {
          const now = Date.now();
          return prevCoins.filter(
            (coin) => !coin.spawnTime || now - coin.spawnTime < LIMITED_TIME_COIN_DURATION
          );
        });

        // --- Game Over Conditions (checked after all movements) ---
        const hitWall =
          newHead.x < 0 || newHead.y < 0 || newHead.x >= WIDTH || newHead.y >= HEIGHT;
        const hitSelf = prevSnake.some(
          (segment, index) =>
            index !== 0 && segment.x === newHead.x && segment.y === newHead.y
        );

        if (hitWall || hitSelf) {
          setGameOver(true);
          setPlaying(false);
          console.log("[SnakeGame] Game Over! Final Score:", score);
          submitHighscore(score); // Submit the score
          if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
          }
          return prevSnake; // Return current snake to stop further updates
        }

        let newSnake = [newHead, ...prevSnake];
        let coinEaten = false;
        let growBy = 0; // Default growth is 0, will be set by coin effects

        // Find the eaten coin
        const eatenCoinIndex = coins.findIndex(
          (coin) => newHead.x === coin.x && newHead.y === coin.y
        );

        if (eatenCoinIndex !== -1) {
          coinEaten = true;
          const eatenCoin = coins[eatenCoinIndex];

          // Create a new array of coins, excluding the eaten one
          let updatedCoins = coins.filter((_, idx) => idx !== eatenCoinIndex);

          // Apply coin-specific effects
          switch (eatenCoin.type) {
            case "shiba":
              setScore((prevScore) => prevScore + 2); // Score increases by 2
              growBy = 1; // Tail grows by 1 block
              addPopup("Shiba Collected! +2 Score, +1 Tail", "shiba");
              // Spawn a new Shiba coin into the updatedCoins array
              updatedCoins.push(spawnNewCoin(newSnake, updatedCoins, "shiba"));
              break;
            case "lunc":
              setScore((prevScore) => prevScore - 1); // Score decreases by 1
              addPopup("Lunc Collected! -1 Score, Spawning Floki", "lunc");
              // Spawn two random Floki coins and a new Lunc coin into the updatedCoins array
              updatedCoins.push(spawnNewCoin(newSnake, updatedCoins, "floki"));
              updatedCoins.push(spawnNewCoin(newSnake, updatedCoins, "floki"));
              updatedCoins.push(spawnNewCoin(newSnake, updatedCoins, "lunc"));
              break;
            case "floki":
              // Random Floki effect
              const flokiEffect = Math.floor(Math.random() * 3);
              if (flokiEffect === 0) {
                // Case 1: Score increases by 10 and snake tail shrinks to 0
                setScore((prevScore) => prevScore + 10);
                newSnake = [newHead]; // Shrink tail to 0 (only head remains)
                addPopup("Floki! +10 Score, Tail Reset!", "floki");
              } else if (flokiEffect === 1) {
                // Case 2: Score increases by 5 and tail increases by 5 blocks
                setScore((prevScore) => prevScore + 5);
                growBy = 5; // Grow by 5 segments
                addPopup("Floki! +5 Score, +5 Tail!", "floki");
              } else {
                // Case 3: Snake instantly dies
                setGameOver(true);
                setPlaying(false);
                setFlokiKilled(true); // Set Floki killed status
                addPopup("Floki! Instant Death!", "floki");
                console.log("[SnakeGame] Game Over! Final Score:", score);
                submitHighscore(score); // Submit the score
                if (gameIntervalRef.current) {
                  clearInterval(gameIntervalRef.current);
                  gameIntervalRef.current = null;
                }
                return prevSnake; // Return current snake to stop further updates
              }
              // Spawn a new Shiba or Lunc coin after Floki is eaten into the updatedCoins array
              const nextCoinType: CoinType = Math.random() < 0.5 ? "shiba" : "lunc";
              updatedCoins.push(spawnNewCoin(newSnake, updatedCoins, nextCoinType));
              break;
          }
          // Update the coins state once after all manipulations for this tick
          setCoins(updatedCoins);
        }

        // Apply growth based on growBy value
        if (growBy > 0) {
          for (let i = 0; i < growBy; i++) {
            newSnake.push(prevSnake[prevSnake.length - 1]); // Add a segment at the tail
          }
        } else if (!coinEaten) {
          newSnake.pop(); // Remove tail if no coin eaten
        }

        return newSnake;
      });
    }, actualTickRate); // Use actualTickRate for dynamic speed

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [
    snakeDirection,
    playing,
    gameOver,
    score, // score is needed here for submitHighscore to use the latest value
    submitHighscore,
    getAllCurrentOccupiedPositions,
    getRandomPosition,
    spawnNewCoin,
    snakeSpeedMultiplier,
    lastMovedDirection,
    addPopup
  ]);

  const startGame = () => {
    initializeGameElements(); // Re-initialize all game elements
  };

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
          <h2 className="text-3xl font-bold text-white mb-2">Crypto Snake</h2>
          <p className="text-gray-400 text-lg">
            Collect Shiba and Lunc coins! Beware of Floki!
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Currently spawning:{" "}
            <span className="font-semibold text-purple-300">
              Shiba, Lunc, Floki
            </span>
          </div>
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
                      Use <span className="font-bold text-green-400">arrow keys</span> to control
                      the snake. Eat{" "}
                      <span className="font-bold text-yellow-400">Shiba coins</span> to grow and increase score. Collect{" "}
                      <span className="font-bold text-blue-400">Lunc coins</span> to decrease score and spawn Floki coins!
                    </p>
                    {/* Coin Effects Instructions */}
                    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 mt-4 text-left text-sm text-gray-200 space-y-2 max-w-xl mx-auto">
                      <div className="font-bold text-base text-yellow-300 mb-2 flex items-center gap-2">
                        <span>🪙</span> Coin Effects Guide
                      </div>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2"><Image src={ShibaIcon} alt="Shiba" width={20} height={20}/> <span><b>Shiba</b>: +2 Score, +1 Tail</span></div>
                        <div className="flex items-center gap-2"><Image src={LuncIcon} alt="Lunc" width={20} height={20}/> <span><b>Lunc</b>: -1 Score, Spawns 2 Floki coins</span></div>
                        <div className="flex items-center gap-2"><Image src={FlokiIcon} alt="Floki" width={20} height={20}/> <span><b>Floki (Random Effect)</b>:</span></div>
                        <ul className="list-disc list-inside ml-6 text-gray-300">
                            <li>+10 Score, Tail shrinks to 0</li>
                            <li>+5 Score, +5 Tail</li>
                            <li>Instant Death!</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {gameOver && (
                    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-4">
                      <p className="text-red-400 text-xl font-semibold">
                        {flokiKilled ? "You got killed by the FLOKI coin!" : `Game Over! Your Score: ${score}`}
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
                      transition: `left ${GAME_TICK_RATE / snakeSpeedMultiplier - 10}ms linear, top ${
                        GAME_TICK_RATE / snakeSpeedMultiplier - 10
                      }ms linear`, // Smooth snake movement adjusted by speed
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

                {/* Render Coins */}
                {coins.map((coin, idx) => (
                  <Image
                    key={`coin-${idx}`}
                    src={COIN_IMAGE_MAP[coin.type]}
                    alt={coin.type}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    style={{
                      position: "absolute",
                      left: coin.x,
                      top: coin.y,
                      pointerEvents: "none",
                      borderRadius: "50%",
                      filter: `drop-shadow(0 0 8px ${coin.isBonus ? 'cyan' : 'gold'})`, // Bonus coins glow cyan
                      zIndex: 0,
                      opacity: coin.spawnTime && (Date.now() - coin.spawnTime > LIMITED_TIME_COIN_DURATION - 2000) ? 0.5 : 1, // Flash for timed coins
                      transition: coin.spawnTime ? 'opacity 0.5s ease-in-out' : 'none',
                    }}
                  />
                ))}

                {/* Popups */}
                <div className="absolute top-4 right-4 z-50 flex flex-col items-end space-y-2">
                    {activePopups.map((popup) => (
                        <div
                            key={popup.id}
                            className="bg-gray-800/90 text-white text-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                            style={{
                                borderColor: popup.type === "floki" ? 'red' : 'green',
                                borderWidth: '1px',
                                minWidth: '150px',
                                textAlign: 'center',
                                animation: 'fade-in-out 2s ease-in-out forwards', // Apply animation
                            }}
                        >
                            <Image src={COIN_IMAGE_MAP[popup.type]} alt={popup.type} width={16} height={16} className="rounded-full" />
                            <span>{popup.message}</span>
                        </div>
                    ))}
                </div>

                {/* Custom CSS for Popup Animation */}
                <style jsx>{`
                    @keyframes fade-in-out {
                        0% { opacity: 0; transform: translateY(10px); }
                        10% { opacity: 1; transform: translateY(0); }
                        90% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-10px); }
                    }
                `}</style>
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
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    playing ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className={`text-sm ${playing ? "text-green-400" : "text-red-400"}`}>
                  {playing ? "Playing" : gameOver ? "Game Over" : "Ready"}
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
                Your Current Game Score:{" "}
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
