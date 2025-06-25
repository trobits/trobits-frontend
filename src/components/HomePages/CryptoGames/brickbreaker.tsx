"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Trophy, Zap, Home } from "lucide-react";
import powerUpImageSrc from "./../../../assets/icons/shiba-inu.png"; // Assuming the path
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";

const BALL_SPEED = 4; // Increased ball speed
const PADDLE_SPEED = 15; // Increased paddle speed
const CANVAS_WIDTH = 680;
const CANVAS_HEIGHT = 520;

enum PowerUpType {
  SCORE = "score",
}

interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType;
  dy: number;
}

const generateBrickContent = () => {
  const rand = Math.random();
  if (rand < 0.3) return 3; // Increased Power-up brick spawn rate
  else if (rand < 0.4) return 1; // Coin brick
  return 2; // Regular brick
};

const BrickBreaker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef({ x: 240, y: 490, dx: BALL_SPEED, dy: BALL_SPEED });
  const paddleRef = useRef({ x: 190, width: 100 });
  const powerUpsRef = useRef<PowerUp[]>([]);
  const bricksRef = useRef<number[][]>([]);

  const [powerUpImage, setPowerUpImage] = useState<HTMLImageElement | null>(
    null
  );

  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLoopStarted, setGameLoopStarted] = useState(false);
  const isMovingLeft = useRef(false);
  const isMovingRight = useRef(false);

  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "brickbreaker",
    gameName: "Brick Breaker",
  });

  // Debug: log user and highscore when loaded
  React.useEffect(() => {
    console.log("[BrickBreaker] User:", user);
    console.log("[BrickBreaker] Loaded highscore:", highscore);
  }, [user, highscore]);

  const generateInitialBricks = () => {
    const initialBricks = [];
    for (let row = 0; row < 7; row++) {
      const brickRow = [];
      for (let col = 0; col < 10; col++) brickRow.push(generateBrickContent());
      initialBricks.push(brickRow);
    }
    bricksRef.current = initialBricks;
  };

  const generateRandomBrickRow = () => {
    const newRow = [];
    for (let col = 0; col < 7; col++) {
      newRow.push(generateBrickContent());
    }
    return newRow;
  };

  useEffect(() => {
    generateInitialBricks();

    const img = new Image();
    img.src = powerUpImageSrc.src;
    img.onload = () => {
      setPowerUpImage(img);
    };
    img.onerror = () => {
      console.error("Failed to load power-up image:", powerUpImageSrc.src);
    };
  }, []);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const ball = ballRef.current;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#00FFFF"; // Cyan ball
    ctx.fill();
    ctx.closePath();

    const paddle = paddleRef.current;
    ctx.beginPath();
    ctx.rect(paddle.x, CANVAS_HEIGHT - 30, paddle.width, 10);
    ctx.fillStyle = "#8B00FF"; // Neon purple paddle
    ctx.shadowColor = "#8B00FF";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();

    const drawRoundedRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    bricksRef.current.forEach((row, i) => {
      row.forEach((brick, j) => {
        if (brick > 0) {
          const bx = j * 60 + 35;
          const by = i * 20 + 30;

          const radius = 4;

          // Brick color selection
          let fillColor = "#1E90FF"; // Regular
          if (brick === 1) fillColor = "#1E90FF"; // Coin
          else if (brick === 3) fillColor = "#87CEFA"; // Power-up (light blue)

          // Outline / neon glow
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#8B00FF"; // Neon purple
          ctx.shadowColor = "#8B00FF";
          ctx.shadowBlur = 15;

          drawRoundedRect(ctx, bx, by, 50, 15, radius);
          ctx.stroke();

          // Reset shadow and draw fill
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
          ctx.fillStyle = fillColor;
          drawRoundedRect(ctx, bx, by, 50, 15, radius);
          ctx.fill();
        }
      });
    });

    // Draw power-ups
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    if (powerUpImage) {
      powerUpsRef.current.forEach((powerUp) => {
        ctx.drawImage(powerUpImage, powerUp.x, powerUp.y, 20, 20);
      });
    }
  };

  const updateGame = () => {
    const ball = ballRef.current;
    const paddle = paddleRef.current;
    const bricks = bricksRef.current;

    if (ball.x + ball.dx > CANVAS_WIDTH - 10 || ball.x + ball.dx < 10)
      ball.dx = -ball.dx;
    if (ball.y + ball.dy < 10) ball.dy = -ball.dy;
    else if (ball.y + ball.dy > CANVAS_HEIGHT - 30) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
        // Score removed from hitting paddle
      } else {
        setGameOver(true);
        setGameLoopStarted(false); // Stop the game loop
        submitHighscore(score).then(() => {
          console.log("[BrickBreaker] submitHighscore called with:", score);
        });
        return;
      }
    }

    if (isMovingLeft.current) paddle.x = Math.max(paddle.x - PADDLE_SPEED, 0);
    if (isMovingRight.current)
      paddle.x = Math.min(paddle.x + PADDLE_SPEED, CANVAS_WIDTH - paddle.width);

    let rowCleared = false;
    outer: for (let i = 0; i < bricks.length; i++) {
      for (let j = 0; j < bricks[i].length; j++) {
        const brick = bricks[i][j];
        if (brick > 0) {
          const bx = j * 60 + 35;
          const by = i * 20 + 30;
          if (
            ball.x + 10 > bx &&
            ball.x - 10 < bx + 50 &&
            ball.y + 10 > by &&
            ball.y - 10 < by + 15
          ) {
            ball.dy = -ball.dy;
            // Score removed from breaking a brick
            if (brick === 1) {
              setCoins((c) => c + 1);
              // Score removed from coin brick
            } else if (brick === 3) {
              powerUpsRef.current.push({
                x: bx + 25 - 10,
                y: by,
                type: PowerUpType.SCORE,
                dy: 2,
              });
            }

            bricks[i][j] = 0;
            if (bricks[i].every((b) => b === 0)) {
              rowCleared = true;
            }
            break outer;
          }
        }
      }
    }

    if (rowCleared) {
      bricksRef.current.pop();
      bricksRef.current.unshift(generateRandomBrickRow());
    }

    powerUpsRef.current = powerUpsRef.current
      .map((p) => ({ ...p, y: p.y + p.dy }))
      .filter((p) => {
        if (p.y > CANVAS_HEIGHT) return false;
        if (
          p.y + 20 > CANVAS_HEIGHT - 30 &&
          p.y < CANVAS_HEIGHT - 20 &&
          p.x < paddle.x + paddle.width &&
          p.x + 20 > paddle.x
        ) {
          if (p.type === PowerUpType.SCORE) setScore((s) => s + 200); // Score only increases here
          return false;
        }
        return true;
      });

    ball.x += ball.dx;
    ball.y += ball.dy;
  };

  useEffect(() => {
    let frameId: number;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      if (!gameOver && gameStarted && gameLoopStarted) updateGame();
      draw(ctx);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameStarted, gameLoopStarted, gameOver, powerUpImage, score]); // Added score to dependencies

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameStarted && !gameLoopStarted && !gameOver)
      setGameLoopStarted(true);
    if (e.key === "ArrowLeft") isMovingLeft.current = true;
    if (e.key === "ArrowRight") isMovingRight.current = true;
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") isMovingLeft.current = false;
    if (e.key === "ArrowRight") isMovingRight.current = false;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<
    { name: string; score: number; userId: string }[]
  >([]);

  // Fetch leaderboard from backend
  const fetchLeaderboard = useCallback(() => {
    fetch("http://localhost:3000/api/v1/games/brickbreaker/getallscores")
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
          "[BrickBreaker] Leaderboard fetched (names only):",
          arr.map((e) => ({ name: e.name, score: e.score, userId: e.userId }))
        );
      })
      .catch((err) => {
        setLeaderboard([]);
        console.error("[BrickBreaker] Failed to fetch leaderboard", err);
      });
  }, [user?.id]);

  // Fetch leaderboard on mount and after game over
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, gameOver]);

  return (
    <div className="w-full max-w-7xl mx-auto font-sans p-4">
      <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8">
        {!gameStarted ? (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center">
              <span className="text-4xl">🧱</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Brick Breaker</h2>
            <p className="text-gray-400">Break bricks, collect coins!</p>
            <ul className="text-gray-300 space-y-1">
              <li>
                🎮 Use <span className="text-cyan-400">Arrow Keys</span> or{" "}
                <span className="text-cyan-400">Mouse</span> to move paddle
              </li>
            </ul>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-lg"
            >
              <Play className="inline w-4 h-4 mr-2" /> Start Game
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
            <div className="flex flex-col gap-4 items-center">
              <div
                className="border border-gray-700/50 rounded-xl overflow-hidden"
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, backgroundColor: "#1e293b" }}
              >
                <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
              </div>

              {gameOver && (
                <div className="text-center mt-4 space-y-3">
                  <p className="text-red-400 text-xl font-semibold">Game Over!</p>
                  <p className="text-lg text-gray-300">
                    Score:{" "}
                    <span className="text-cyan-400 font-bold">{score}</span>
                  </p>
                  <button
                    onClick={() => {
                      setGameOver(false);
                      setCoins(0);
                      setScore(0);
                      setGameLoopStarted(false);
                      generateInitialBricks();
                      ballRef.current = { x: 240, y: 290, dx: BALL_SPEED, dy: BALL_SPEED };
                      paddleRef.current = { x: 190, width: 100 };
                      powerUpsRef.current = [];
                      setTimeout(() => setGameLoopStarted(true), 300);
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-xl text-lg"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" /> Try Again
                  </button>
                </div>
              )}
            </div>

            <div className="w-80 space-y-6">
              {/* Current Score */}
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold text-yellow-300">
                    Current Score
                  </span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{score}</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">
                    {gameLoopStarted && !gameOver ? "Playing" : "Ready"}
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
                    <p className="text-sm text-gray-400">Top Brick Breakers</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {leaderboard.length === 0 && (
                    <div className="text-gray-400 text-center">No scores yet.</div>
                  )}
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        entry.name === "You"
                          ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-300 font-bold"
                          : "bg-gray-800/30 border-gray-700/30 text-white hover:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-sm w-6 text-center ${
                            entry.name === "You" ? "text-blue-400" : "text-gray-400"
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
                          entry.name === "You" ? "text-blue-400" : "text-yellow-400"
                        }`}
                      >
                        {entry.score}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center mt-6 pt-4 border-t border-gray-700/50">
                  Current Score:{" "}
                  <span className="font-bold text-cyan-400">{score}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrickBreaker;