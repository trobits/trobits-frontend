"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ShibaIcon from "@/assets/icons/shiba-inu.png";

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 400;

type Point = { x: number; y: number };

const getRandomFood = (): Point => ({
  x: Math.floor(Math.random() * (WIDTH / CELL_SIZE)) * CELL_SIZE,
  y: Math.floor(Math.random() * (HEIGHT / CELL_SIZE)) * CELL_SIZE,
});

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 200, y: 200 }]);
  const [food, setFood] = useState<Point>(getRandomFood);
  const [dir, setDir] = useState<Point>({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playing || gameOver) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
          if (dir.y === 0) setDir({ x: 0, y: -CELL_SIZE });
          break;
        case "ArrowDown":
          if (dir.y === 0) setDir({ x: 0, y: CELL_SIZE });
          break;
        case "ArrowLeft":
          if (dir.x === 0) setDir({ x: -CELL_SIZE, y: 0 });
          break;
        case "ArrowRight":
          if (dir.x === 0) setDir({ x: CELL_SIZE, y: 0 });
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dir, playing, gameOver]);

  useEffect(() => {
    if (!playing || gameOver || (dir.x === 0 && dir.y === 0)) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        head.x += dir.x;
        head.y += dir.y;

        const hitWall =
          head.x < 0 || head.y < 0 || head.x >= WIDTH || head.y >= HEIGHT;
        const hitSelf = prev.some(
          (segment) => segment.x === head.x && segment.y === head.y
        );

        if (hitWall || hitSelf) {
          setGameOver(true);
          setPlaying(false);
          return prev;
        }

        const newSnake = [head, ...prev];

        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [dir, food, gameOver, playing]);

  const startGame = () => {
    setSnake([{ x: 200, y: 200 }]);
    setFood(getRandomFood());
    setDir({ x: 0, y: 0 });
    setGameOver(false);
    setPlaying(true);
  };

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#0f172a",
        color: "white",
        borderRadius: "10px",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 className="text-xl mb-2">🐍 Crypto Snake</h2>

      {!playing && (
        <div className="mb-4">
          <p>Use arrow keys to control the snake. Eat the coin to grow!</p>
          {gameOver && <p className="text-red-400 mt-2">Game Over!</p>}
          <button
            onClick={startGame}
            className="mt-4 px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-500 justify-center"
          >
            {gameOver ? "Play Again" : "Play"}
          </button>
        </div>
      )}

      {playing && (
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: "#1e293b",
            position: "relative",
            border: "3px solid #38bdf8",
            borderRadius: "10px",
            marginTop: "1rem",
            overflow: "hidden",
          }}
        >
          {/* Snake */}
          {snake.map((segment, idx) => (
            <div
              key={idx}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                position: "absolute",
                left: segment.x,
                top: segment.y,
                transition: "left 100ms linear, top 100ms linear",
                backgroundColor:
                  idx === 0 ? "#facc15" : `hsl(${120 + idx * 5}, 70%, 45%)`,
                borderRadius: idx === 0 ? "50%" : "8px",
                boxShadow: idx === 0 ? "0 0 6px #facc15" : "none",
              }}
            />
          ))}

          {/* Food */}
          <Image
            src={ShibaIcon}
            alt="coin"
            width={CELL_SIZE}
            height={CELL_SIZE}
            style={{
              position: "absolute",
              left: food.x,
              top: food.y,
              transition: "left 100ms linear, top 100ms linear",
              pointerEvents: "none",
              borderRadius: "50%",
              filter: "drop-shadow(0 0 5px gold)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
