"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
// Import your actual image assets here:
// Make sure these paths are correct for your project structure
import ShibaIcon from "@/assets/icons/shiba-inu.png"; // Existing Shiba Inu icon
import snakeHead from "@/assets/snakeHead.png"; // Existing Snake Head icon

// ONLY keep imports for the coins that will be actively used in the game logic
// Based on your provided imports:
import PepeIcon from "@/assets/icons/pepe.png"; // Used for PepeCoin
import LuncIcon from "@/assets/icons/lunc.png"; // Used for LuncCoin
import BonkIcon from "@/assets/icons/bonk.png"; // Based on your import, BonkIcon points to pepe.png
import FlokiIcon from "@/assets/icons/floki.png"; // Used for FlokiCoin

// Placeholder for fake Shiba coins (you might want distinct images for these)
import FakeShibaShrinkIcon from "@/assets/flappythumb.png"; // Replace with a distinct icon for shrinking fake shiba
import FakeShibaReverseIcon from "@/assets/snake-thumb.png"; // Replace with a distinct icon for reverse fake shiba

import { Award, Play, RotateCcw, Trophy, Zap } from "lucide-react";
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";

// --- Game Constants ---
const CELL_SIZE = 20; // Size of each cell in pixels
const WIDTH = 600; // Game board width in pixels
const HEIGHT = 500; // Game board height in pixels
const BOARD_COLS = WIDTH / CELL_SIZE; // Number of columns on the board
const BOARD_ROWS = HEIGHT / CELL_SIZE; // Number of rows on the board
const INITIAL_NUM_COINS = 5; // Initial number of coins on the board
const INITIAL_NUM_BOMBS = 3; // Initial number of bombs on the board
const GAME_TICK_RATE = 100; // Milliseconds per game update (lower is faster)
const BOMB_SPEED_MULTIPLIER = 0.8; // Bombs move slightly slower than snake
const MIN_SPAWN_DISTANCE_FROM_SNAKE = 3; // Minimum cell distance from snake head for new items

// Coin Effect Durations (in milliseconds)
const PEPE_EFFECT_DURATION = 3000; // Pepe: Slow down snake
const FAKE_SHIBA_EFFECT_DURATION = 3000; // Fake Shiba: Reverse controls/shrink
const LUNC_EFFECT_DURATION = 5000; // Lunc: Invincibility

// Coin Spawn Chances
const LIMITED_TIME_COIN_DURATION = 5000; // Limited-time coins disappear after this duration
const LIMITED_TIME_COIN_CHANCE = 0.2; // 20% chance for a coin to be limited-time
const BONUS_COIN_CHANCE = 0.1; // 10% chance for a coin to be a bonus coin

// Coin Rotation
const COIN_ROTATION_INTERVAL = 15000; // Rotate available coin types every 15 seconds

// --- Type Definitions ---
type Point = { x: number; y: number };
type MovingObject = Point & { dx: number; dy: number }; // Bombs now have a direction

// Updated CoinType enum to reflect only the active coins
type CoinType =
  | "shiba"
  | "pepe" // Will get slow down effect
  | "lunc" // Keep invincibility
  | "bonk" // Keep grow by 2
  | "floki" // Will get clear bombs effect
  | "fakeShibaShrink"
  | "fakeShibaReverse";

type Coin = Point & {
  type: CoinType;
  spawnTime?: number; // Timestamp when coin was spawned (for limited-time coins)
  isBonus?: boolean; // True if it's a bonus coin
};

// Map coin types to their image assets using the new imports
const COIN_IMAGE_MAP: Record<CoinType, any> = {
  shiba: ShibaIcon,
  pepe: PepeIcon,
  lunc: LuncIcon,
  bonk: BonkIcon, // This will use the pepe.png image as per your import
  floki: FlokiIcon,
  fakeShibaShrink: FakeShibaShrinkIcon,
  fakeShibaReverse: FakeShibaReverseIcon,
};

// All possible coin types that can be part of the rotation pool (only the main 5)
const ALL_ROTATABLE_COIN_TYPES: CoinType[] = [
  "shiba",
  "pepe",
  "lunc",
  "bonk",
  "floki",
];

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 300, y: 240 }]);
  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "snakegame",
    gameName: "Snake Game",
  });

  const [coins, setCoins] = useState<Coin[]>([]);
  const [bombs, setBombs] = useState<MovingObject[]>([]);
  const [snakeDirection, setSnakeDirection] = useState<Point>({ x: CELL_SIZE, y: 0 }); // Current intended direction for snake
  const [lastMovedDirection, setLastMovedDirection] = useState<Point>({ x: CELL_SIZE, y: 0 }); // Actual direction after last move
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);

  // New states for game mechanics
  const [snakeSpeedMultiplier, setSnakeSpeedMultiplier] = useState<number>(1); // 1 = normal, <1 = slower, >1 = faster
  const [reverseControls, setReverseControls] = useState<boolean>(false);
  const [invincible, setInvincible] = useState<boolean>(false);
  const [activeCoinTypes, setActiveCoinTypes] = useState<CoinType[]>([]); // Coins currently allowed to spawn
  const [activePopups, setActivePopups] = useState<{ id: string; message: string; type: CoinType; }[]>([]); // For in-game popups

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Separate timeout refs for each powerup
  const invincibleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const slowTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reverseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const coinRotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Helper function to get a random non-zero direction for bombs
  const getRandomBombDirection = useCallback((): Point => {
    const directions = [
      { x: CELL_SIZE, y: 0 },
      { x: -CELL_SIZE, y: 0 },
      { x: 0, y: CELL_SIZE },
      { x: 0, y: -CELL_SIZE },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }, []);

  // Combined function to get all occupied positions (for new spawns)
  const getAllCurrentOccupiedPositions = useCallback(
    (currentSnake: Point[], currentCoins: Coin[], currentBombs: MovingObject[]) => {
      // Exclude the last segment of the snake because it will move next tick, freeing up space.
      const snakeOccupied = playing ? currentSnake.slice(0, currentSnake.length - 1) : currentSnake;
      return [
        ...snakeOccupied,
        ...currentCoins.map((c) => ({ x: c.x, y: c.y })),
        ...currentBombs.map((b) => ({ x: b.x, y: b.y })),
      ];
    },
    [playing]
  );

  // Function to spawn a new coin
  const spawnNewCoin = useCallback(
    (
      currentSnake: Point[],
      currentCoins: Coin[],
      currentBombs: MovingObject[],
      specificType?: CoinType,
      isBonusOverride?: boolean,
      isTimedOverride?: boolean
    ): Coin => {
      const occupied = getAllCurrentOccupiedPositions(currentSnake, currentCoins, currentBombs);
      const newCoinPos = getRandomPosition(occupied, currentSnake[0]);

      let typeToSpawn: CoinType;
      if (specificType) {
        typeToSpawn = specificType;
      } else {
        // Randomly pick from active coin types
        typeToSpawn = activeCoinTypes[Math.floor(Math.random() * activeCoinTypes.length)];
      }

      let isTimed = isTimedOverride ?? (Math.random() < LIMITED_TIME_COIN_CHANCE);
      let isBonus = isBonusOverride ?? (Math.random() < BONUS_COIN_CHANCE);

      return {
        ...newCoinPos,
        type: typeToSpawn,
        spawnTime: isTimed ? Date.now() : undefined,
        isBonus: isBonus,
      };
    },
    [getAllCurrentOccupiedPositions, getRandomPosition, activeCoinTypes]
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
    setSnakeSpeedMultiplier(1);
    setReverseControls(false);
    setInvincible(false);
    setActivePopups([]); // Clear popups on game start

    // Clear any pending effect timeouts
    if (invincibleTimeoutRef.current) {
      clearTimeout(invincibleTimeoutRef.current);
      invincibleTimeoutRef.current = null;
    }
    if (slowTimeoutRef.current) {
      clearTimeout(slowTimeoutRef.current);
      slowTimeoutRef.current = null;
    }
    if (reverseTimeoutRef.current) {
      clearTimeout(reverseTimeoutRef.current);
      reverseTimeoutRef.current = null;
    }

    // Initialize active coin types for the first rotation
    const initialActiveCoins = ALL_ROTATABLE_COIN_TYPES.slice(0, 3); // Start with a few types
    setActiveCoinTypes(initialActiveCoins);

    let occupied: Point[] = [...initialSnake];

    // Initialize coins
    const initialCoins: Coin[] = [];
    for (let i = 0; i < INITIAL_NUM_COINS; i++) {
      const newCoin = spawnNewCoin(initialSnake, initialCoins, [], undefined, false, false); // Ensure initial coins are not timed/bonus
      initialCoins.push(newCoin);
      occupied.push(newCoin);
    }
    setCoins(initialCoins);

    // Initialize bombs with random directions
    const initialBombs: MovingObject[] = [];
    for (let i = 0; i < INITIAL_NUM_BOMBS; i++) {
      const newBombPos = getRandomPosition(occupied, initialSnake[0]);
      initialBombs.push({ ...newBombPos, ...getRandomBombDirection() });
      occupied.push(newBombPos);
    }
    setBombs(initialBombs);
  }, [getRandomPosition, getRandomBombDirection, spawnNewCoin]);

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

      // Apply reverse controls logic
      if (reverseControls) {
        if (newDir.x === CELL_SIZE) newDir = { x: -CELL_SIZE, y: 0 }; // Right -> Left
        else if (newDir.x === -CELL_SIZE) newDir = { x: CELL_SIZE, y: 0 }; // Left -> Right
        else if (newDir.y === CELL_SIZE) newDir = { x: 0, y: -CELL_SIZE }; // Down -> Up
        else if (newDir.y === -CELL_SIZE) newDir = { x: 0, y: CELL_SIZE }; // Up -> Down
      }

      // Only update snakeDirection if it's a valid change (not 180 degree turn or same direction)
      if (newDir.x !== snakeDirection.x || newDir.y !== snakeDirection.y) {
        setSnakeDirection(newDir);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [snakeDirection, lastMovedDirection, playing, gameOver, reverseControls]);

  // --- Coin Rotation Logic ---
  useEffect(() => {
    if (!playing) {
      if (coinRotationIntervalRef.current) {
        clearInterval(coinRotationIntervalRef.current);
        coinRotationIntervalRef.current = null;
      }
      return;
    }

    if (coinRotationIntervalRef.current) {
      clearInterval(coinRotationIntervalRef.current);
    }

    coinRotationIntervalRef.current = setInterval(() => {
      setActiveCoinTypes((prevTypes) => {
        // Simple rotation: move first element to end
        const newTypes = [...prevTypes];
        const nextCoinType = ALL_ROTATABLE_COIN_TYPES[
          (ALL_ROTATABLE_COIN_TYPES.indexOf(newTypes[newTypes.length - 1]) + 1) % ALL_ROTATABLE_COIN_TYPES.length
        ];
        newTypes.shift(); // Remove the oldest type
        newTypes.push(nextCoinType); // Add the next type
        return newTypes;
      });
    }, COIN_ROTATION_INTERVAL);

    return () => {
      if (coinRotationIntervalRef.current) {
        clearInterval(coinRotationIntervalRef.current);
      }
    };
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

    // Adjust tick rate based on snake speed multiplier
    const actualTickRate = GAME_TICK_RATE / snakeSpeedMultiplier;

    gameIntervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const currentHead = prevSnake[0];
        let newHead = { x: currentHead.x + snakeDirection.x, y: currentHead.y + snakeDirection.y }; // Use let for newHead

        // --- Wall Wrap Logic (if invincible) ---
        if (invincible) {
            if (newHead.x < 0) newHead.x = WIDTH - CELL_SIZE;
            else if (newHead.x >= WIDTH) newHead.x = 0;
            if (newHead.y < 0) newHead.y = HEIGHT - CELL_SIZE;
            else if (newHead.y >= HEIGHT) newHead.y = 0;
        }

        // Update lastMovedDirection only after a tick has passed
        setLastMovedDirection(snakeDirection);

        // --- Bomb Movement ---
        setBombs((prevBombs) => {
          return prevBombs.map((bomb) => {
            let nextBombX = bomb.x + bomb.dx * BOMB_SPEED_MULTIPLIER;
            let nextBombY = bomb.y + bomb.dy * BOMB_SPEED_MULTIPLIER;
            let newDx = bomb.dx;
            let newDy = bomb.dy;

            // Collision with walls for bombs (bounce)
            if (nextBombX < 0 || nextBombX + CELL_SIZE > WIDTH) {
              newDx *= -1; // Reverse X direction
              nextBombX = Math.max(0, Math.min(WIDTH - CELL_SIZE, nextBombX)); // Clamp to bounds
            }
            if (nextBombY < 0 || nextBombY + CELL_SIZE > HEIGHT) {
              newDy *= -1; // Reverse Y direction
              nextBombY = Math.max(0, Math.min(HEIGHT - CELL_SIZE, nextBombY)); // Clamp to bounds
            }

            return { x: nextBombX, y: nextBombY, dx: newDx, dy: newDy };
          });
        });

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

        // Check for collision with bombs (using the *updated* bomb positions)
        const currentBombs = bombs; // Use the state updated by the previous setBombs call in this tick
        const hitBomb = currentBombs.some(
          (bomb) =>
            newHead.x < bomb.x + CELL_SIZE &&
            newHead.x + CELL_SIZE > bomb.x &&
            newHead.y < bomb.y + CELL_SIZE &&
            newHead.y + CELL_SIZE > bomb.y
        );

        if ((hitWall || hitSelf || hitBomb) && !invincible) {
          setGameOver(true);
          setPlaying(false);
          console.log("[SnakeGame] Game Over! Final Score:", score);
          submitHighscore(score); // Submit the score
          if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
          }
          // Clear any pending effect timeouts on game over
          if (invincibleTimeoutRef.current) {
            clearTimeout(invincibleTimeoutRef.current);
            invincibleTimeoutRef.current = null;
          }
          if (slowTimeoutRef.current) {
            clearTimeout(slowTimeoutRef.current);
            slowTimeoutRef.current = null;
          }
          if (reverseTimeoutRef.current) {
            clearTimeout(reverseTimeoutRef.current);
            reverseTimeoutRef.current = null;
          }
          return prevSnake; // Return current snake to stop further updates
        }

        let newSnake = [newHead, ...prevSnake];
        let coinEaten = false;
        let growBy = 1; // Default growth
        let eatenCoin: Coin | undefined = undefined; // Initialize eatenCoin

        const eatenCoinIndex = coins.findIndex(
          (coin) => newHead.x === coin.x && newHead.y === coin.y
        );

        if (eatenCoinIndex !== -1) {
          coinEaten = true;
          eatenCoin = coins[eatenCoinIndex];
          let scoreIncrease = 1;

          // Apply coin-specific effects
          switch (eatenCoin.type) {
            case "shiba":
              // Spawns two fake shiba coins
              setCoins((prev) => [
                ...prev.filter((_, idx) => idx !== eatenCoinIndex), // Remove original shiba
                spawnNewCoin(newSnake, prev.filter((_, idx) => idx !== eatenCoinIndex), currentBombs, "fakeShibaShrink"),
                spawnNewCoin(newSnake, prev.filter((_, idx) => idx !== eatenCoinIndex), currentBombs, "fakeShibaReverse"),
              ]);
              addPopup("Fake Shiba Coins Spawned!", "shiba");
              break;
            case "pepe": // New functionality: Slow down snake
              setSnakeSpeedMultiplier(0.5); // Slow down
              if (slowTimeoutRef.current) clearTimeout(slowTimeoutRef.current);
              slowTimeoutRef.current = setTimeout(() => setSnakeSpeedMultiplier(1), 5000);
              addPopup("Snake Slowed Down!", "pepe");
              break;
            case "lunc":
              setInvincible(true);
              if (invincibleTimeoutRef.current) clearTimeout(invincibleTimeoutRef.current);
              invincibleTimeoutRef.current = setTimeout(() => setInvincible(false), 5000);
              addPopup("Invincibility Activated!", "lunc");
              break;
            case "bonk":
              growBy = 2; // Grow by 2 segments
              addPopup("Snake Grew Faster!", "bonk");
              break;
            case "floki": // New functionality: Clear all bombs
              setBombs([]); // Clear all bombs
              addPopup("Bombs Cleared!", "floki");
              break;
            case "fakeShibaShrink":
              newSnake = newSnake.slice(0, Math.max(1, newSnake.length - 2)); // Shrink by 2, minimum length 1
              addPopup("Snake Shrunk!", "fakeShibaShrink");
              break;
            case "fakeShibaReverse":
              setReverseControls(true);
              if (reverseTimeoutRef.current) clearTimeout(reverseTimeoutRef.current);
              reverseTimeoutRef.current = setTimeout(() => setReverseControls(false), 5000);
              addPopup("Controls Reversed!", "fakeShibaReverse");
              break;
          }

          if (eatenCoin.isBonus) {
            scoreIncrease *= 2; // Double score for bonus coins
          }
          setScore((prevScore) => prevScore + scoreIncrease);

          // If it's not a Shiba or Floki coin (which handle their own coin spawning)
          // or a fake shiba coin (which don't spawn new coins)
          if (eatenCoin.type !== "shiba" && eatenCoin.type !== "floki" &&
              eatenCoin.type !== "fakeShibaShrink" && eatenCoin.type !== "fakeShibaReverse") {
            setCoins((prevCoins) => {
              const updatedCoins = prevCoins.filter((_, idx) => idx !== eatenCoinIndex); // Remove eaten coin
              // Spawn a new random coin
              updatedCoins.push(spawnNewCoin(newSnake, updatedCoins, currentBombs));
              return updatedCoins;
            });
          }
        }

        // Apply growth based on growBy value
        // Only apply growth if a coin was eaten and it wasn't a "fakeShibaShrink" or "solana" (which is removed)
        if (coinEaten && eatenCoin?.type !== "fakeShibaShrink") {
            for (let i = 0; i < growBy - 1; i++) {
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
      if (invincibleTimeoutRef.current) {
        clearTimeout(invincibleTimeoutRef.current);
      }
      if (slowTimeoutRef.current) {
        clearTimeout(slowTimeoutRef.current);
      }
      if (reverseTimeoutRef.current) {
        clearTimeout(reverseTimeoutRef.current);
      }
    };
  }, [
    snakeDirection,
    playing,
    gameOver,
    coins,
    bombs,
    score, // Include score in dependencies to ensure latest score is used for submission
    submitHighscore,
    getAllCurrentOccupiedPositions,
    getRandomPosition,
    spawnNewCoin,
    snakeSpeedMultiplier,
    invincible,
    reverseControls,
    lastMovedDirection,
    addPopup // Add addPopup to dependencies
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
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/games/snakegame/getallscores`)
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
            Collect various crypto coins for unique effects! Dodge the moving bombs!
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Currently spawning:{" "}
            <span className="font-semibold text-purple-300">
              {activeCoinTypes.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join(", ")}
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
                      the snake. Eat various{" "}
                      <span className="font-bold text-yellow-400">crypto coins</span> to grow and
                      trigger unique effects! Avoid the{" "}
                      <span className="font-bold text-red-400">moving bombs!</span>
                    </p>
                    {/* Coin Effects Instructions */}
                    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 mt-4 text-left text-sm text-gray-200 space-y-2 max-w-xl mx-auto">
                      <div className="font-bold text-base text-yellow-300 mb-2 flex items-center gap-2">
                        <span>🪙</span> Coin Effects Guide
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2"><Image src={PepeIcon} alt="Pepe" width={20} height={20}/> <span><b>Pepe</b>: Slow down snake (3s)</span></div>
                        <div className="flex items-center gap-2"><Image src={ShibaIcon} alt="Shiba" width={20} height={20}/> <span><b>Shiba</b>: Spawns 2 fake shiba coins</span></div>
                        <div className="flex items-center gap-2"><Image src={FlokiIcon} alt="Floki" width={20} height={20}/> <span><b>Floki</b>: Clears all bombs</span></div>
                        <div className="flex items-center gap-2"><Image src={BonkIcon} alt="Bonk" width={20} height={20}/> <span><b>Bonk</b>: Grow by 2 segments</span></div>
                        <div className="flex items-center gap-2"><Image src={LuncIcon} alt="Lunc" width={20} height={20}/> <span><b>Lunc</b>: Invincibility (5s)</span></div>
                        <div className="flex items-center gap-2"><Image src={FakeShibaShrinkIcon} alt="Fake Shiba Shrink" width={20} height={20}/> <span><b>Fake Shiba (Shrink)</b>: Shrinks snake by 2</span></div>
                        <div className="flex items-center gap-2"><Image src={FakeShibaReverseIcon} alt="Fake Shiba Reverse" width={20} height={20}/> <span><b>Fake Shiba (Reverse)</b>: Reverses controls (3s)</span></div>
                      </div>
                    </div>
                    {invincible && (
                      <p className="text-lunc-400 text-lg font-semibold">
                        Invincible!
                      </p>
                    )}
                    {reverseControls && (
                      <p className="text-red-400 text-lg font-semibold">
                        Controls Reversed!
                      </p>
                    )}
                    {snakeSpeedMultiplier !== 1 && (
                      <p className="text-yellow-400 text-lg font-semibold">
                        Speed {snakeSpeedMultiplier > 1 ? "Increased" : "Decreased"}!
                      </p>
                    )}
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

                {/* Render Bombs (now with movement transition) */}
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
                      transition: `left ${GAME_TICK_RATE}ms linear, top ${GAME_TICK_RATE}ms linear`, // Bombs transition
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 0, 0, 0.6)",
                      boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.7)",
                      zIndex: 1,
                    }}
                  >
                    <span className="text-white text-lg font-bold">X</span>
                  </div>
                ))}

                {/* Popups */}
                <div className="absolute top-4 right-4 z-50 flex flex-col items-end space-y-2">
                    {activePopups.map((popup) => (
                        <div
                            key={popup.id}
                            className="bg-gray-800/90 text-white text-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                            style={{
                                borderColor: popup.type === "fakeShibaShrink" || popup.type === "fakeShibaReverse" ? 'red' : 'green',
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
              {/* Active Effects Display */}
              <div className="mt-4 text-sm text-gray-400 space-y-1">
                {invincible && <p className="text-lunc-400 font-semibold">🛡️ Invincible!</p>}
                {reverseControls && <p className="text-red-400 font-semibold">🔄 Controls Reversed!</p>}
                {snakeSpeedMultiplier !== 1 && (
                  <p className="text-yellow-400 font-semibold">
                    ⚡ Speed {snakeSpeedMultiplier > 1 ? "Increased" : "Decreased"}!
                  </p>
                )}
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
