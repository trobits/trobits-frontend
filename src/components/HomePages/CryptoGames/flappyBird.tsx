"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Award } from "lucide-react";
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";
import BitcoinCoin from "@/assets/bird.png";
import SmallCoin from "@/assets/icons/lunc.png"; // Coin image

// Increased Canvas WIDTH for a horizontally rectangular game
const GAME_WIDTH = 700;
const GAME_HEIGHT = 600; // Height remains the same
const BIRD_SIZE = 40;
const GRAVITY = 0.5; // Slightly increased gravity for faster feel
const JUMP_STRENGTH = -9; // Slightly adjusted jump strength
const PIPE_WIDTH = 65; // Slightly adjusted pipe width
const PIPE_GAP = 210; // Slightly reduced gap for a bit more challenge with speed
const PIPE_SPEED = 4; // Increased pipe speed for a faster game
const COIN_SIZE = 20; // Slightly adjusted coin size

type Obstacle = { x: number; height: number; id: string; passed?: boolean };
type CollectibleCoin = { x: number; y: number; id: string; collected: boolean };

const FlappyBird: React.FC = () => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [collectibles, setCollectibles] = useState<CollectibleCoin[]>([]);

  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "flappybird",
    gameName: "Flappy Bird",
  });

  const [leaderboard, setLeaderboard] = useState<
    { name: string; score: number; userId: string }[]
  >([]);

  const fetchLeaderboard = useCallback(() => {
    fetch("http://localhost:3000/api/v1/games/flappybird/getallscores")
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
      })
      .catch((err) => {
        setLeaderboard([]);
        console.error("[FlappyBird] Failed to fetch leaderboard", err);
      });
  }, [user?.id]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, gameOver]);

  const gameFrameRef = useRef<number | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const [loopStarted, setLoopStarted] = useState(false);

  const generateNewObstacle = useCallback((): Obstacle => {
    const minHeight = 80;
    const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight;
    const topPipeHeight =
      Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    return {
      x: GAME_WIDTH,
      height: topPipeHeight,
      id: Math.random().toString(),
      passed: false,
    };
  }, []);

  // --- New / Modified Coin Generation Functionality ---
  const generateCollectibleCoin = useCallback(
    (obstacleHeight: number): CollectibleCoin => {
      // Minimum distance from the top/bottom game boundaries
      const topBoundaryOffset = 50;
      const bottomBoundaryOffset = 50;

      // Calculate the available vertical range for the coin within the game boundaries
      const gameSafeMinY = topBoundaryOffset;
      const gameSafeMaxY = GAME_HEIGHT - COIN_SIZE - bottomBoundaryOffset;

      // Calculate the open vertical space within the current pipe gap
      const pipeGapTop = obstacleHeight;
      const pipeGapBottom = obstacleHeight + PIPE_GAP;

      // Determine the actual usable vertical range for the coin
      const coinMinY = Math.max(pipeGapTop + COIN_SIZE / 2, gameSafeMinY); // Ensure coin is below top pipe and within game bounds
      const coinMaxY = Math.min(
        pipeGapBottom - COIN_SIZE * 1.5,
        gameSafeMaxY
      ); // Ensure coin is above bottom pipe and within game bounds

      let coinY;
      if (coinMinY >= coinMaxY) {
        // Fallback: If the calculated range is invalid (e.g., gap too small for coin + offsets),
        // place it roughly in the center of the available game area, respecting boundaries.
        coinY =
          Math.floor(Math.random() * (gameSafeMaxY - gameSafeMinY + 1)) +
          gameSafeMinY;
      } else {
        // Randomly choose a Y position within the valid range
        coinY =
          Math.floor(Math.random() * (coinMaxY - coinMinY + 1)) + coinMinY;
      }

      // Coin will spawn horizontally aligned with the pipe, appearing just before or at its start
      const coinX = GAME_WIDTH + PIPE_WIDTH / 2 - COIN_SIZE / 2; // Spawns where the pipe would be, or slightly before. Adjust as needed.

      return {
        x: coinX,
        y: coinY,
        id: Math.random().toString(),
        collected: false,
      };
    },
    []
  );
  // --- End New / Modified Coin Functionality ---

  const startGame = useCallback(() => {
    setBirdY(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
    setVelocity(0);
    setObstacles([generateNewObstacle()]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setLoopStarted(false);
    setCollectibles([]); // Ensure collectibles are reset
    gameAreaRef.current?.focus();

    setTimeout(() => {
      setLoopStarted(true);
    }, 1000);
  }, [generateNewObstacle]);

  const flap = useCallback(() => {
    if (gameStarted && loopStarted && !gameOver) {
      setVelocity(JUMP_STRENGTH);
    }
  }, [gameStarted, loopStarted, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [flap]);

  useEffect(() => {
    if (!gameStarted || gameOver || !loopStarted) {
      if (gameFrameRef.current) cancelAnimationFrame(gameFrameRef.current);
      return;
    }

    let localBirdY = birdY;
    let localVelocity = velocity;

    const gameLoop = () => {
      localVelocity += GRAVITY;
      localBirdY += localVelocity;

      if (localBirdY + BIRD_SIZE >= GAME_HEIGHT || localBirdY < 0) {
        setGameOver(true);
        submitHighscore(score);
        return;
      }

      setBirdY(localBirdY);
      setVelocity(localVelocity);

      setObstacles((prevObstacles) => {
        const updatedObstacles: Obstacle[] = [];
        // Determine if a coin should be generated. Only if no coin currently exists.
        // And give it a 60% chance to appear for a new pipe
        const shouldGenerateCoin =
          collectibles.length === 0 && Math.random() < 0.6;

        for (let i = 0; i < prevObstacles.length; i++) {
          const obs = prevObstacles[i];
          const newX = obs.x - PIPE_SPEED;
          const birdX = GAME_WIDTH / 2 - BIRD_SIZE / 2;

          if (newX + PIPE_WIDTH > 0) {
            const justPassed = !obs.passed && newX + PIPE_WIDTH < birdX;
            if (justPassed) {
              setScore((s) => s + 2);
            }
            updatedObstacles.push({
              ...obs,
              x: newX,
              passed: obs.passed || justPassed,
            });
          }
        }

        const lastObstacle = updatedObstacles[updatedObstacles.length - 1];
        if (!lastObstacle || lastObstacle.x < GAME_WIDTH - 280) {
          const newObs = generateNewObstacle();
          updatedObstacles.push(newObs);

          // Generate a single collectible coin randomly with a new pipe, if conditions met
          if (shouldGenerateCoin) {
            // Pass the new obstacle's height for coin vertical placement calculation
            setCollectibles([generateCollectibleCoin(newObs.height)]);
          }
        }

        const birdRect = {
          left: GAME_WIDTH / 2 - BIRD_SIZE / 2,
          right: GAME_WIDTH / 2 + BIRD_SIZE / 2,
          top: localBirdY,
          bottom: localBirdY + BIRD_SIZE,
        };

        for (let obs of updatedObstacles) {
          const pipeLeft = obs.x;
          const pipeRight = obs.x + PIPE_WIDTH;
          const pipeTop = obs.height;
          const pipeBottom = obs.height + PIPE_GAP;

          const collideTop =
            birdRect.right > pipeLeft &&
            birdRect.left < pipeRight &&
            birdRect.top < pipeTop;

          const collideBottom =
            birdRect.right > pipeLeft &&
            birdRect.left < pipeRight &&
            birdRect.bottom > pipeBottom;

          if (collideTop || collideBottom) {
            setGameOver(true);
            submitHighscore(score);
            return prevObstacles;
          }
        }

        return updatedObstacles;
      });

      setCollectibles((prevCoins) => {
        const updatedCoins: CollectibleCoin[] = [];
        for (let i = 0; i < prevCoins.length; i++) {
          const coin = prevCoins[i];
          const birdRect = {
            left: GAME_WIDTH / 2 - BIRD_SIZE / 2,
            right: GAME_WIDTH / 2 + BIRD_SIZE / 2,
            top: localBirdY,
            bottom: localBirdY + BIRD_SIZE,
          };
          const coinRect = {
            left: coin.x,
            right: coin.x + COIN_SIZE,
            top: coin.y,
            bottom: coin.y + COIN_SIZE,
          };

          const overlapX =
            birdRect.left < coinRect.right && birdRect.right > coinRect.left;
          const overlapY =
            birdRect.top < coinRect.bottom && birdRect.bottom > coinRect.top;

          if (!coin.collected && overlapX && overlapY) {
            setScore((s) => s + 5);
            // Coin is collected, it will not be added to updatedCoins, effectively removing it
          } else if (!coin.collected && coin.x > -COIN_SIZE) {
            // Only keep uncollected coins that are still on screen
            updatedCoins.push({ ...coin, x: coin.x - PIPE_SPEED });
          }
        }
        return updatedCoins;
      });

      gameFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameFrameRef.current) cancelAnimationFrame(gameFrameRef.current);
    };
  }, [
    gameStarted,
    gameOver,
    birdY,
    velocity,
    generateNewObstacle,
    generateCollectibleCoin,
    submitHighscore,
    score,
    loopStarted,
    collectibles.length,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="flex flex-col items-center p-6 bg-slate-900 text-white rounded-xl shadow-2xl border border-yellow-700/70"
        style={{ maxWidth: "fit-content" }}
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-wide text-center">
          🪙 Flappy Coin
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 mt-4 justify-center items-center lg:items-start">
          {/* Left Panel: Game Area or Instructions */}
          <div>
            {!gameStarted || gameOver ? (
              <div
                className="flex flex-col justify-center items-center rounded-xl border-4 border-blue-900 text-center px-6 shadow-inset-lg transition-all duration-300 ease-in-out"
                style={{
                  width: GAME_WIDTH,
                  height: GAME_HEIGHT,
                  boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)",
                  backgroundImage:
                    "radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%), radial-gradient(circle at bottom left, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%), linear-gradient(to bottom, #3b82f6, #1e40af)", // Better gradient for background
                }}
              >
                <p className="text-xl sm:text-2xl mb-4 text-white font-medium drop-shadow-md px-4">
                  Press <span className="font-bold text-yellow-300">Space</span>{" "}
                  to flap! Collect coins for bonus points!
                </p>
                {gameOver && (
                  <div className="mt-6">
                    <p className="text-red-400 text-3xl sm:text-4xl font-extrabold animate-pulse mb-2">
                      Game Over!
                    </p>
                    <p className="text-white text-2xl sm:text-3xl font-bold">
                      Your Score:{" "}
                      <span className="text-yellow-300">{score}</span>
                    </p>
                  </div>
                )}
                <button
                  onClick={startGame}
                  className="mt-10 px-12 py-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold text-xl rounded-full shadow-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95 ring-4 ring-yellow-300/50"
                >
                  {gameOver ? "Play Again" : "Start Game"}
                </button>
              </div>
            ) : (
              <div
                className="relative rounded-xl overflow-hidden border-4 border-blue-900 transition-all duration-300 ease-in-out"
                ref={gameAreaRef}
                tabIndex={0}
                onClick={flap}
                style={{
                  width: GAME_WIDTH,
                  height: GAME_HEIGHT,
                  boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)",
                  backgroundImage:
                    "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                  cursor: "pointer",
                }}
              >
                {/* Bird */}
                <div
                  style={{
                    position: "absolute",
                    left: GAME_WIDTH / 2 - BIRD_SIZE / 2,
                    top: birdY,
                    width: BIRD_SIZE,
                    height: BIRD_SIZE,
                    transition: "transform 0.08s ease-out", // Smooth bird movement
                    transform: `rotate(${velocity * 1.5}deg)`, // Bird rotation based on velocity
                  }}
                >
                  <Image
                    src={BitcoinCoin}
                    alt="Bird"
                    layout="fill"
                    objectFit="contain"
                    className="drop-shadow-lg" // Add a subtle shadow to the bird
                  />
                </div>

                {/* Pipes */}
                {obstacles.map((obs) => (
                  <React.Fragment key={obs.id}>
                    {/* Top Wall */}
                    <div
                      style={{
                        position: "absolute",
                        left: obs.x,
                        top: 0,
                        width: PIPE_WIDTH,
                        height: obs.height,
                        background: "linear-gradient(180deg, #fbbf24 0%, #b45309 100%)", // Gold gradient
                        borderRadius: "8px",
                        border: "3px solid #eab308", // Yellow border (yellow-500)
                        boxShadow: "3px 3px 10px rgba(234,179,8,0.25)", // Yellow shadow
                      }}
                    >
                      {/* Pipe Top Cap */}
                      <div
                        style={{
                          position: "absolute",
                          top: obs.height - 15, // Cap height
                          left: -5, // Extend slightly beyond pipe width
                          width: PIPE_WIDTH + 10, // Cap width
                          height: 20, // Cap height
                          background: "linear-gradient(180deg, #fbbf24 0%, #b45309 100%)", // Gold gradient for cap
                          borderRadius: "5px",
                          border: "2px solid #eab308",
                          boxShadow: "inset 0 -3px 5px rgba(234,179,8,0.18)",
                        }}
                      />
                    </div>
                    {/* Bottom Wall */}
                    <div
                      style={{
                        position: "absolute",
                        left: obs.x,
                        top: obs.height + PIPE_GAP,
                        width: PIPE_WIDTH,
                        height: GAME_HEIGHT - obs.height - PIPE_GAP,
                        background: "linear-gradient(180deg, #fbbf24 0%, #b45309 100%)",
                        borderRadius: "8px",
                        border: "3px solid #eab308",
                        boxShadow: "3px 3px 10px rgba(234,179,8,0.25)",
                      }}
                    >
                      {/* Pipe Bottom Cap */}
                      <div
                        style={{
                          position: "absolute",
                          top: -5, // Cap height (relative to pipe top)
                          left: -5, // Extend slightly beyond pipe width
                          width: PIPE_WIDTH + 10, // Cap width
                          height: 20, // Cap height
                          background: "linear-gradient(180deg, #fbbf24 0%, #b45309 100%)",
                          borderRadius: "5px",
                          border: "2px solid #eab308",
                          boxShadow: "inset 0 3px 5px rgba(234,179,8,0.18)",
                        }}
                      />
                    </div>
                  </React.Fragment>
                ))}

                {/* Coins */}
                {collectibles.map((coin) => (
                  <div
                    key={coin.id}
                    style={{
                      position: "absolute",
                      left: coin.x,
                      top: coin.y,
                      width: COIN_SIZE,
                      height: COIN_SIZE,
                      animation: "coinBounce 0.8s infinite alternate", // Added bounce animation
                      filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))", // Coin shadow
                    }}
                  >
                    <Image
                      src={SmallCoin}
                      alt="Coin"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                ))}
                {/* Global Keyframe Styles for coinBounce */}
                <style jsx>{`
                  @keyframes coinBounce {
                    0% {
                      transform: translateY(0);
                    }
                    100% {
                      transform: translateY(-5px);
                    }
                  }
                `}</style>

                {/* Score Display */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl font-extrabold text-yellow-300 text-shadow-xl z-10 drop-shadow-lg">
                  {score}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Leaderboard */}
          <div className="w-72 p-6 bg-slate-800/40 border border-yellow-700/50 rounded-2xl shadow-md hover:bg-slate-800/60 hover:border-yellow-600/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                <p className="text-sm text-slate-400">Top Flappy Coin Players</p>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboard.length === 0 && (
                <div className="text-gray-400 text-center py-4">
                  No scores yet. Be the first!
                </div>
              )}
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 border border-transparent ${
                    entry.name === "You"
                      ? "bg-yellow-900/50 border-yellow-700/50 text-yellow-300 font-bold scale-105 shadow-md"
                      : "hover:bg-slate-700/40 hover:border-slate-600/30 text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-base w-8 text-center ${
                        entry.name === "You"
                          ? "text-yellow-400"
                          : "text-slate-400"
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
                      entry.name === "You" ? "text-yellow-400" : "text-orange-400"
                    }`}
                  >
                    {entry.score}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-500 text-center mt-6 pt-4 border-t border-slate-700/50">
              Current Score:{" "}
              <span className="font-bold text-yellow-400">{score}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;