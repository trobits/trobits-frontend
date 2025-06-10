"use client";

import React, { useEffect, useState, useRef } from "react";

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 400;

type Point = { x: number; y: number };

const getRandomFood = (): Point => ({
  x: Math.floor(Math.random() * (WIDTH / CELL_SIZE)) * CELL_SIZE,
  y: Math.floor(Math.random() * (HEIGHT / CELL_SIZE)) * CELL_SIZE,
});

const CryptoGames: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 200, y: 200 }]);
  const [food, setFood] = useState<Point>(getRandomFood);
  const [dir, setDir] = useState<Point>({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playing || gameOver) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // 👈 This prevents the page from scrolling
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

        // Collision detection
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
    }, 150);

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
        maxWidth: "450px",
      }}
    >
      <h2 className="text-xl mb-2">🐍 Crypto Snake</h2>

      {!playing && (
        <div className="mb-4">
          <p>Use arrow keys to control the snake. Eat the 🪙 to grow!</p>
          {gameOver && <p className="text-red-400 mt-2">Game Over!</p>}
          <button
            onClick={startGame}
            className="mt-4 px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-500"
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
            border: "2px solid #38bdf8",
            marginTop: "1rem",
          }}
        >
          {/* Snake */}
          {snake.map((segment, idx) => (
            <div
              key={idx}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: idx === 0 ? "#facc15" : "#22c55e",
                position: "absolute",
                left: segment.x,
                top: segment.y,
                borderRadius: "3px",
              }}
            />
          ))}

          {/* Food */}
          <div
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: "#f43f5e",
              position: "absolute",
              left: food.x,
              top: food.y,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              color: "white",
            }}
          >
            🪙
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoGames;
