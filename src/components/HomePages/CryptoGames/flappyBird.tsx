"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Award } from "lucide-react";
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";
import BitcoinCoin from "@/assets/bird.png";
import SmallCoin from "@/assets/pipe_bottom.png"; // Coin image

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 40;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -9;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 3;
const COIN_SIZE = 25;

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

  React.useEffect(() => {
    console.log("[FlappyBird] User:", user);
    console.log("[FlappyBird] Loaded highscore:", highscore);
  }, [user, highscore]);

  const [leaderboard, setLeaderboard] = useState<
    { name: string; score: number; userId: string }[]
  >([]);

  const fetchLeaderboard = React.useCallback(() => {
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
        console.log(
          "[FlappyBird] Leaderboard fetched (names only):",
          arr.map((e) => ({ name: e.name, score: e.score, userId: e.userId }))
        );
      })
      .catch((err) => {
        setLeaderboard([]);
        console.error("[FlappyBird] Failed to fetch leaderboard", err);
      });
  }, [user?.id]);

  React.useEffect(() => {
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

  const generateCollectibleCoin = useCallback(
    (obstacleX: number, obstacleHeight: number): CollectibleCoin => {
      const coinY = obstacleHeight + PIPE_GAP / 2 - COIN_SIZE / 2;
      const coinX = obstacleX + PIPE_WIDTH / 2 - COIN_SIZE / 2;
      return {
        x: coinX,
        y: coinY,
        id: Math.random().toString(),
        collected: false,
      };
    },
    []
  );

  const startGame = useCallback(() => {
    setBirdY(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
    setVelocity(0);
    setObstacles([generateNewObstacle()]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setLoopStarted(false);
    setCollectibles([]);
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
        // Added ceiling collision
        setGameOver(true);
        console.log("[FlappyBird] Game Over! Current Score:", score);
        console.log("[FlappyBird] Previous Highscore:", highscore);
        submitHighscore(score).then(() => {
          console.log("[FlappyBird] submitHighscore called with:", score);
        });
        return;
      }

      setBirdY(localBirdY);
      setVelocity(localVelocity);

      setObstacles((prevObstacles) => {
        let updated: Obstacle[] = prevObstacles
          .map((obs) => {
            const newX = obs.x - PIPE_SPEED;
            const birdX = GAME_WIDTH / 2 - BIRD_SIZE / 2;
            const justPassed = !obs.passed && newX + PIPE_WIDTH < birdX;

            if (justPassed) {
              setScore((s) => s + 2);
            }

            return { ...obs, x: newX, passed: obs.passed || justPassed };
          })
          .filter((obs) => obs.x + PIPE_WIDTH > 0);

        const lastObstacle = updated[updated.length - 1];
        if (!lastObstacle || lastObstacle.x < GAME_WIDTH - 250) {
          const newObs = generateNewObstacle();
          updated.push(newObs);
          setCollectibles((prev) => [
            ...prev,
            generateCollectibleCoin(newObs.x, newObs.height),
          ]);
        }

        const birdRect = {
          left: GAME_WIDTH / 2 - BIRD_SIZE / 2,
          right: GAME_WIDTH / 2 + BIRD_SIZE / 2,
          top: localBirdY,
          bottom: localBirdY + BIRD_SIZE,
        };

        for (let obs of updated) {
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
            console.log("[FlappyBird] Game Over! Current Score:", score);
            console.log("[FlappyBird] Previous Highscore:", highscore);
            submitHighscore(score).then(() => {
              console.log("[FlappyBird] submitHighscore called with:", score);
            });
            return prevObstacles;
          }
        }

        return updated;
      });

      setCollectibles((prevCoins) => {
        return prevCoins
          .map((coin) => {
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
              return { ...coin, collected: true };
            }

            return coin;
          })
          .filter((c) => !c.collected && c.x > -COIN_SIZE);
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
    submitHighscore, // Added submitHighscore to dependencies
    score, // Added score to dependencies
    highscore, // Added highscore to dependencies
    loopStarted, // Added loopStarted to dependencies
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div
        className="flex flex-col items-center p-6 bg-slate-900 text-white rounded-lg shadow-2xl border border-yellow-700"
        style={{ maxWidth: "fit-content" }}
      >
        <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-wide">
          🪙 Flappy Coin
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 mt-4 justify-center items-center lg:items-start">
          {/* Left Panel: Game Area or Instructions */}
          <div>
            {!gameStarted || gameOver ? (
              <div
                className="w-[400px] h-[600px] bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col justify-center items-center rounded-xl border-4 border-blue-900 text-center px-6 shadow-inset-lg"
                style={{
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
                  backgroundImage:
                    "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%), radial-gradient(circle at bottom left, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)",
                }}
              >
                <p className="text-lg mb-4 text-white font-medium drop-shadow-md">
                  Press <span className="font-bold text-yellow-300">Space</span>{" "}
                  to flap!
                </p>
                {gameOver && (
                  <p className="text-red-400 text-2xl font-extrabold mt-4 animate-pulse">
                    Game Over! Your Score: {score}
                  </p>
                )}
                <button
                  onClick={startGame}
                  className="mt-8 px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {gameOver ? "Play Again" : "Start Game"}
                </button>
              </div>
            ) : (
              <div
                className="relative rounded-lg overflow-hidden border-4 border-blue-900 bg-gradient-to-b from-blue-600 to-blue-800"
                ref={gameAreaRef}
                tabIndex={0}
                onClick={flap}
                style={{
                  width: GAME_WIDTH,
                  height: GAME_HEIGHT,
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
                  backgroundImage:
                    "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%), radial-gradient(circle at bottom left, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)",
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
                    transition: "transform 0.05s ease-out", // Smooth bird movement
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
                        backgroundColor: "#3b82f6", // Stronger blue
                        borderRadius: "8px",
                        border: "3px solid #1e40af", // Darker blue outline
                        boxShadow: "3px 3px 8px rgba(0,0,0,0.4)", // Pipe shadow
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
                          backgroundColor: "#1e40af", // Darker blue for cap
                          borderRadius: "5px",
                          border: "2px solid #000",
                          boxShadow: "inset 0 -3px 5px rgba(0,0,0,0.3)",
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
                        backgroundColor: "#3b82f6",
                        borderRadius: "8px",
                        border: "3px solid #1e40af",
                        boxShadow: "3px 3px 8px rgba(0,0,0,0.4)",
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
                          backgroundColor: "#1e40af", // Darker blue for cap
                          borderRadius: "5px",
                          border: "2px solid #000",
                          boxShadow: "inset 0 3px 5px rgba(0,0,0,0.3)",
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
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl font-extrabold text-yellow-300 text-shadow-lg z-10">
                  {score}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Leaderboard */}
          <div className="w-64 p-6 bg-slate-800/40 border border-yellow-700/50 rounded-2xl shadow-md hover:bg-slate-800/60 hover:border-yellow-600/50 transition-all duration-300">
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
                      className={`font-mono text-sm w-6 text-center ${
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