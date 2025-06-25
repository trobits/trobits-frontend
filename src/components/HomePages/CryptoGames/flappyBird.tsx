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

// Leaderboard state will be fetched from backend

const FlappyBird: React.FC = () => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [collectibles, setCollectibles] = useState<CollectibleCoin[]>([]);

  // Highscore and leaderboard logic
  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "flappybird",
    gameName: "Flappy Bird"
  });
  // Debug: log user and highscore when loaded
  React.useEffect(() => {
    console.log("[FlappyBird] User:", user);
    console.log("[FlappyBird] Loaded highscore:", highscore);
  }, [user, highscore]);
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; userId: string }[]>([]);
  // Fetch leaderboard from backend
  const fetchLeaderboard = React.useCallback(() => {
    fetch("http://localhost:3000/api/v1/games/flappybird/getallscores")
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
        console.log("[FlappyBird] Leaderboard fetched (names only):", arr.map(e => ({ name: e.name, score: e.score, userId: e.userId })));
      })
      .catch(err => {
        setLeaderboard([]);
        console.error("[FlappyBird] Failed to fetch leaderboard", err);
      });
  }, [user?.id]);
  // Fetch leaderboard on mount and after game over
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
    }, 1000); // 3 seconds
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

      if (localBirdY + BIRD_SIZE >= GAME_HEIGHT) {
        setGameOver(true);
        // Submit highscore if this run is higher
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
          // Submit highscore if this run is higher
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
  ]);

  // Leaderboard is now dynamic

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
    <div
      className="flex flex-col items-center p-6 bg-slate-900 text-white rounded-lg shadow-2xl border border-yellow-700"
      style={{ maxWidth: "fit-content" }}
    >
      {/* ...your entire existing Flappy Bird content stays inside here... */}
      <div
      className="flex flex-col items-center p-6 bg-slate-900 text-white rounded-lg shadow-2xl border border-yellow-700"
      style={{ maxWidth: "fit-content" }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
        🪙 Flappy Coin
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 mt-4 justify-center items-center lg:items-start">
        {/* Left Panel: Game Area or Instructions */}
        <div>
          {!gameStarted || gameOver ? (
            <div className="w-[400px] h-[600px] bg-slate-800 flex flex-col justify-center items-center rounded-xl border-2 border-yellow-700 text-center px-6 shadow-lg">
              <p className="text-lg mb-4 text-slate-300">
                Press <span className="font-bold text-yellow-400">Space</span>{" "}
                to flap!
              </p>
              {gameOver && (
                <p className="text-red-400 text-xl font-semibold mt-2 animate-bounce">
                  Game Over! Your Score: {score}
                </p>
              )}
              <button
                onClick={startGame}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold rounded-lg shadow-md hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
              >
                {gameOver ? "Play Again" : "Start Game"}
              </button>
            </div>
          ) : (
            <div
              className="relative rounded-lg overflow-hidden border-2 border-yellow-600"
              ref={gameAreaRef}
              tabIndex={0}
              onClick={flap}
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
              {/* Bird */}
              <div
                style={{
                  position: "absolute",
                  left: GAME_WIDTH / 2 - BIRD_SIZE / 2,
                  top: birdY,
                  width: BIRD_SIZE,
                  height: BIRD_SIZE,
                }}
              >
                <Image
                  src={BitcoinCoin}
                  alt="Bird"
                  layout="fill"
                  objectFit="contain"
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
                      backgroundColor: "#60a5fa", // light blue
                      borderRadius: "8px",
                      border: "2px solid #3b82f6", // blue outline
                    }}
                  />
                  {/* Bottom Wall */}
                  <div
                    style={{
                      position: "absolute",
                      left: obs.x,
                      top: obs.height + PIPE_GAP,
                      width: PIPE_WIDTH,
                      height: GAME_HEIGHT - obs.height - PIPE_GAP,
                      backgroundColor: "#60a5fa",
                      borderRadius: "8px",
                      border: "2px solid #3b82f6",
                    }}
                  />
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

              {/* Score Display */}
              <div className="absolute top-2 left-2 text-2xl font-bold text-yellow-300">
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
              <div className="text-gray-400 text-center">No scores yet.</div>
            )}
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 border border-transparent ${
                  entry.name === "You"
                    ? "bg-yellow-900/50 border-yellow-700/50 text-yellow-300 font-bold scale-105"
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
  </div>
  );
};

export default FlappyBird;
