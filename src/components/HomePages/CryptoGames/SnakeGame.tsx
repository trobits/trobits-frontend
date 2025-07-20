"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import ShibaIcon from "@/assets/icons/shiba-inu.png";
import snakeHead from "@/assets/snakeHead.png";
import LuncIcon from "@/assets/icons/lunc.png";
import FlokiIcon from "@/assets/icons/floki.png";
import { Award, Play, RotateCcw, Trophy, Zap } from "lucide-react";
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";

const CELL_SIZE = 20;
const WIDTH = 600;
const HEIGHT = 500;
const BOARD_COLS = WIDTH / CELL_SIZE;
const BOARD_ROWS = HEIGHT / CELL_SIZE;
const INITIAL_NUM_SHIBA_COINS = 3;
const INITIAL_NUM_LUNC_COINS = 2;
const GAME_TICK_RATE = 100;
const MIN_SPAWN_DISTANCE_FROM_SNAKE = 3;
const LIMITED_TIME_COIN_DURATION = 5000;
const LIMITED_TIME_COIN_CHANCE = 0.2;
const BONUS_COIN_CHANCE = 0.1;
const HEADER_MESSAGE_DURATION = 2000; // 2 seconds for header message

type Point = { x: number; y: number };
type CoinType = "shiba" | "lunc" | "floki";
type Coin = Point & {
  type: CoinType;
  spawnTime?: number;
  isBonus?: boolean;
};
const COIN_IMAGE_MAP: Record<CoinType, any> = {
  shiba: ShibaIcon,
  lunc: LuncIcon,
  floki: FlokiIcon,
};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 300, y: 240 }]);
  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "snakegame",
    gameName: "Snake Game",
  });
  const [coins, setCoins] = useState<Coin[]>([]);
  const [snakeDirection, setSnakeDirection] = useState<Point>({ x: CELL_SIZE, y: 0 });
  const [lastMovedDirection, setLastMovedDirection] = useState<Point>({ x: CELL_SIZE, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [flokiKilled, setFlokiKilled] = useState(false);
  const [snakeSpeedMultiplier, setSnakeSpeedMultiplier] = useState<number>(1);
  const [headerMessage, setHeaderMessage] = useState<{ message: string; type: CoinType | null } | null>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const coinRotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const headerMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomPosition = useCallback((occupiedPositions: Point[], snakeHeadPos?: Point): Point => {
    let newPos: Point;
    let collision: boolean;
    let attempts = 0;
    const maxAttempts = 100;
    do {
      newPos = {
        x: Math.floor(Math.random() * BOARD_COLS) * CELL_SIZE,
        y: Math.floor(Math.random() * BOARD_ROWS) * CELL_SIZE,
      };
      collision = occupiedPositions.some(
        (segment) => segment.x === newPos.x && segment.y === newPos.y
      );
      if (snakeHeadPos) {
        const distanceX = Math.abs(newPos.x - snakeHeadPos.x) / CELL_SIZE;
        const distanceY = Math.abs(newPos.y - snakeHeadPos.y) / CELL_SIZE;
        if (distanceX < MIN_SPAWN_DISTANCE_FROM_SNAKE && distanceY < MIN_SPAWN_DISTANCE_FROM_SNAKE) {
          collision = true;
        }
      }
      attempts++;
    } while (collision && attempts < maxAttempts);
    return newPos;
  }, []);

  const getAllCurrentOccupiedPositions = useCallback((currentSnake: Point[], currentCoins: Coin[]) => {
    const snakeOccupied = playing ? currentSnake.slice(0, currentSnake.length - 1) : currentSnake;
    return [
      ...snakeOccupied,
      ...currentCoins.map((c) => ({ x: c.x, y: c.y })),
    ];
  }, [playing]);

  const spawnNewCoin = useCallback((currentSnake: Point[], currentCoins: Coin[], specificType: CoinType, isBonusOverride?: boolean, isTimedOverride?: boolean): Coin => {
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
  }, [getAllCurrentOccupiedPositions, getRandomPosition]);

  const updateHeaderMessage = useCallback((message: string, type: CoinType | null) => {
    if (headerMessageTimeoutRef.current) {
        clearTimeout(headerMessageTimeoutRef.current);
    }
    setHeaderMessage({ message, type });
    headerMessageTimeoutRef.current = setTimeout(() => {
        setHeaderMessage(null);
    }, HEADER_MESSAGE_DURATION);
  }, []);

  const initializeGameElements = useCallback(() => {
    const initialSnake = [{ x: Math.floor(BOARD_COLS / 2) * CELL_SIZE, y: Math.floor(BOARD_ROWS / 2) * CELL_SIZE }];
    setSnake(initialSnake);
    setSnakeDirection({ x: CELL_SIZE, y: 0 });
    setLastMovedDirection({ x: CELL_SIZE, y: 0 });
    setGameOver(false);
    setPlaying(true);
    setScore(0);
    setFlokiKilled(false);
    setSnakeSpeedMultiplier(1);
    setHeaderMessage(null); // Clear any old messages
    let occupied: Point[] = [...initialSnake];
    const initialCoins: Coin[] = [];
    for (let i = 0; i < INITIAL_NUM_SHIBA_COINS; i++) {
      const newCoin = spawnNewCoin(initialSnake, initialCoins, "shiba", false, false);
      initialCoins.push(newCoin);
      occupied.push(newCoin);
    }
    for (let i = 0; i < INITIAL_NUM_LUNC_COINS; i++) {
      const newCoin = spawnNewCoin(initialSnake, initialCoins, "lunc", false, false);
      initialCoins.push(newCoin);
      occupied.push(newCoin);
    }
    setCoins(initialCoins);
  }, [getRandomPosition, spawnNewCoin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playing || gameOver) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
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
      if (newDir.x !== snakeDirection.x || newDir.y !== snakeDirection.y) {
        setSnakeDirection(newDir);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [snakeDirection, lastMovedDirection, playing, gameOver]);

  useEffect(() => {
    if (coinRotationIntervalRef.current) {
      clearInterval(coinRotationIntervalRef.current);
      coinRotationIntervalRef.current = null;
    }
  }, [playing]);

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
    const actualTickRate = GAME_TICK_RATE / snakeSpeedMultiplier;
    gameIntervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        let localCoins = coins;
        let localScore = score;
        let localGameOver = gameOver;
        let localPlaying = playing;
        let localFlokiKilled = flokiKilled;
        let newSnake = [...prevSnake];
        const currentHead = prevSnake[0];
        let newHead = { x: currentHead.x + snakeDirection.x, y: currentHead.y + snakeDirection.y };
        setLastMovedDirection(snakeDirection);
        const now = Date.now();
        localCoins = localCoins.filter(
          (coin) => !coin.spawnTime || now - coin.spawnTime < LIMITED_TIME_COIN_DURATION
        );
        const hitWall = newHead.x < 0 || newHead.y < 0 || newHead.x >= WIDTH || newHead.y >= HEIGHT;
        const hitSelf = prevSnake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y);
        if (hitWall || hitSelf) {
          localGameOver = true;
          localPlaying = false;
          submitHighscore(localScore);
          if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
          }
          setGameOver(true);
          setPlaying(false);
          return prevSnake;
        }
        newSnake = [newHead, ...prevSnake];
        let coinEaten = false;
        let growBy = 0;
        const eatenCoinIndex = localCoins.findIndex((coin) => newHead.x === coin.x && newHead.y === coin.y);
        if (eatenCoinIndex !== -1) {
          coinEaten = true;
          const eatenCoin = localCoins[eatenCoinIndex];
          localCoins = localCoins.filter((_, idx) => idx !== eatenCoinIndex);
          switch (eatenCoin.type) {
            case "shiba":
              localScore += 2;
              growBy = 1;
              updateHeaderMessage("Shiba Collected! +2 Score, +1 Tail", "shiba");
              localCoins = [...localCoins, spawnNewCoin(newSnake, localCoins, "shiba")];
              break;
            case "lunc":
              localScore -= 1;
              updateHeaderMessage("Lunc Collected! -1 Score, Spawning Floki", "lunc");
              localCoins = [
                ...localCoins,
                spawnNewCoin(newSnake, localCoins, "floki"),
                spawnNewCoin(newSnake, localCoins, "floki"),
                spawnNewCoin(newSnake, localCoins, "lunc"),
              ];
              break;
            case "floki":
              const flokiEffect = Math.floor(Math.random() * 3);
              if (flokiEffect === 0) {
                localScore += 10;
                newSnake = [newHead]; // Reset tail
                updateHeaderMessage("Floki! +10 Score, Tail Reset!", "floki");
              } else if (flokiEffect === 1) {
                localScore += 5;
                growBy = 5;
                updateHeaderMessage("Floki! +5 Score, +5 Tail!", "floki");
              } else {
                localGameOver = true;
                localPlaying = false;
                localFlokiKilled = true;
                updateHeaderMessage("Floki! Instant Death!", "floki");
                submitHighscore(localScore);
                if (gameIntervalRef.current) {
                  clearInterval(gameIntervalRef.current);
                  gameIntervalRef.current = null;
                }
                setGameOver(true);
                setPlaying(false);
                setFlokiKilled(true);
                setCoins(localCoins);
                setScore(localScore);
                return prevSnake;
              }
              const nextCoinType: CoinType = Math.random() < 0.5 ? "shiba" : "lunc";
              localCoins = [...localCoins, spawnNewCoin(newSnake, localCoins, nextCoinType)];
              break;
          }
        }
        if (growBy > 0) {
          for (let i = 0; i < growBy; i++) {
            newSnake.push(prevSnake[prevSnake.length - 1]);
          }
        } else if (!coinEaten) {
          newSnake.pop();
        }
        setCoins(localCoins);
        setScore(localScore);
        setGameOver(localGameOver);
        setPlaying(localPlaying);
        setFlokiKilled(localFlokiKilled);
        return newSnake;
      });
    }, actualTickRate);
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [
    snakeDirection,
    playing,
    gameOver,
    score,
    submitHighscore,
    getAllCurrentOccupiedPositions,
    getRandomPosition,
    spawnNewCoin,
    snakeSpeedMultiplier,
    lastMovedDirection,
    coins,
    flokiKilled,
    updateHeaderMessage
  ]);

  const startGame = () => {
    initializeGameElements();
  };

  const [leaderboard, setLeaderboard] = useState<
    { name: string; score: number; userId: string }[]
  >([]);
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
      })
      .catch((err) => {
        setLeaderboard([]);
      });
  }, [user?.id]);
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
            {headerMessage ? (
                <span className={`font-semibold ${headerMessage.type === "floki" ? "text-red-400" : "text-yellow-300"} flex items-center justify-center gap-2 transition-opacity duration-500`}>
                    {headerMessage.type && <Image src={COIN_IMAGE_MAP[headerMessage.type]} alt={headerMessage.type} width={16} height={16} className="rounded-full" />}
                    {headerMessage.message}
                </span>
            ) : (
                <>
                Currently spawning: {" "}
                <span className="font-semibold text-purple-300">
                    Shiba, Lunc, Floki
                </span>
                </>
            )}
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
                    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 mt-4 text-left text-sm text-gray-200 space-y-2 max-w-xl mx-auto">
                      <div className="font-bold text-base text-yellow-300 mb-2 flex items-center gap-2">
                        <span>💡</span> Coin Effects Guide
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
                      }ms linear`,
                      borderRadius: idx === 0 ? "50%" : "6px",
                      zIndex: snake.length - idx,
                    }}
                  >
                    {idx === 0 ? (
                      <Image
                        src={snakeHead}
                        alt="Snake Head"
                        layout="fill"
                        objectFit="contain"
                        className="drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]"
                      />
                    ) : (
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
                      filter: `drop-shadow(0 0 8px ${coin.isBonus ? 'cyan' : 'gold'})`,
                      zIndex: 0,
                      opacity: coin.spawnTime && (Date.now() - coin.spawnTime > LIMITED_TIME_COIN_DURATION - 2000) ? 0.5 : 1,
                      transition: coin.spawnTime ? 'opacity 0.5s ease-in-out' : 'none',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="w-80 space-y-6">
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
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                  <p className="text-sm text-gray-400">Top Crypto Snake Players</p>
                </div>
              </div>
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
                        {entry.name === "You" ? "😎 You" : entry.name}
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
                Your Current Game Score: {" "}
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