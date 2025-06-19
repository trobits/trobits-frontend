import React, { useState, useEffect, useRef } from "react";

// Ball and paddle speed
const BALL_SPEED = 3;
const PADDLE_SPEED = 12; // Increased the speed for faster paddle movement

// Create a random coin generator function
const generateCoins = () => {
  const rand = Math.random();
  return rand > 0.7; // 30% chance for a brick to have a coin
};

const BrickBreaker: React.FC = () => {
  const [bricks, setBricks] = useState<number[][]>([]);
  const [ball, setBall] = useState({
    x: 150,
    y: 290, // Adjusted the starting position of the ball
    dx: BALL_SPEED,
    dy: BALL_SPEED,
  });
  const [paddle, setPaddle] = useState({ x: 100, width: 100 });
  const [coins, setCoins] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false); // Added gameOver state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMovingLeft = useRef(false);
  const isMovingRight = useRef(false);

  // Initialize game with bricks
  useEffect(() => {
    const initialBricks = generateInitialBricks();
    setBricks(initialBricks);
  }, []);

  // Function to fill the brick rows completely
  const generateInitialBricks = () => {
    const initialBricks = [];
    for (let row = 0; row < 5; row++) {
      const brickRow: number[] = [];
      for (let col = 0; col < 7; col++) {
        brickRow.push(generateCoins() ? 1 : 2); // 1 means a coin, 2 means a regular brick (not 0)
      }
      initialBricks.push(brickRow);
    }
    return initialBricks;
  };

  // Function to draw the game
  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    // Draw paddle
    ctx.beginPath();
    ctx.rect(paddle.x, ctx.canvas.height - 30, paddle.width, 10);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    // Draw bricks
    bricks.forEach((row, i) => {
      row.forEach((brick, j) => {
        if (brick > 0) {
          ctx.beginPath();
          ctx.rect(j * 60 + 35, i * 20 + 30, 50, 15);
          ctx.fillStyle = brick === 1 ? "#ff0" : "#0095DD"; // Yellow for coin brick, blue for regular
          ctx.fill();
          ctx.closePath();
        }
      });
    });
  };

  // Function to update ball position and handle interactions
  const updateBall = () => {
    setBall((prevBall) => {
      let newBall = { ...prevBall };

      // Check for collision with walls
      if (
        newBall.x + newBall.dx > canvasRef.current!.width - 10 ||
        newBall.x + newBall.dx < 10
      ) {
        newBall.dx = -newBall.dx;
      }

      if (newBall.y + newBall.dy < 10) {
        newBall.dy = -newBall.dy;
      } else if (newBall.y + newBall.dy > canvasRef.current!.height - 30) {
        // Ball hits the paddle
        if (newBall.x > paddle.x && newBall.x < paddle.x + paddle.width) {
          newBall.dy = -newBall.dy;
        } else {
          // Ball falls, trigger Game Over
          setGameOver(true); // Set game over
          newBall = { x: 150, y: 290, dx: BALL_SPEED, dy: BALL_SPEED }; // Reset ball position
        }
      }

      // Move ball
      newBall.x += newBall.dx;
      newBall.y += newBall.dy;

      return newBall;
    });
  };

  // Handle user input for moving the paddle with mouse
  const movePaddleWithMouse = (e: MouseEvent) => {
    const mouseX = e.clientX - canvasRef.current!.getBoundingClientRect().left;
    setPaddle((prevPaddle) => ({
      ...prevPaddle,
      x: mouseX - prevPaddle.width / 2,
    }));
  };

  // Move the paddle based on key input (Arrow Keys)
  const movePaddleWithKeys = () => {
    setPaddle((prevPaddle) => {
      const canvasWidth = canvasRef.current!.width;
      let newX = prevPaddle.x;

      // Move left if left arrow is pressed
      if (isMovingLeft.current) {
        newX = Math.max(newX - PADDLE_SPEED, 0); // Prevent going beyond the left boundary
      }
      // Move right if right arrow is pressed
      if (isMovingRight.current) {
        newX = Math.min(newX + PADDLE_SPEED, canvasWidth - prevPaddle.width); // Prevent going beyond the right boundary
      }

      return {
        ...prevPaddle,
        x: newX,
      };
    });
  };

  // Collision detection for breaking bricks
  const checkBrickCollisions = () => {
    setBall((prevBall) => {
      let newBall = { ...prevBall };
      const newBricks = bricks.map((row) => [...row]); // Create a new array to modify

      let bottomRowCleared = false; // Flag to check if the bottom row is cleared

      // Check collision with bricks
      for (let i = 0; i < newBricks.length; i++) {
        for (let j = 0; j < newBricks[i].length; j++) {
          if (newBricks[i][j] > 0) {
            // Calculate brick position and dimensions
            const brickX = j * 60 + 35;
            const brickY = i * 20 + 30;
            const brickWidth = 50;
            const brickHeight = 15;

            // Check for collision with the current brick
            if (
              newBall.x > brickX &&
              newBall.x < brickX + brickWidth &&
              newBall.y > brickY &&
              newBall.y < brickY + brickHeight
            ) {
              newBall.dy = -newBall.dy; // Reverse ball's vertical direction
              if (newBricks[i][j] === 1) {
                setCoins((prevCoins) => prevCoins + 1); // Collect coin
              }
              newBricks[i][j] = 0; // Break the brick

              // Check if the bottom row (last row) was cleared
              if (i === newBricks.length - 1) {
                bottomRowCleared = true;
              }
              break; // Only break one brick per ball collision
            }
          }
        }
        if (newBall.dy !== prevBall.dy) break; // If ball direction changed, a brick was hit, exit outer loop
      }

      // If the bottom row was cleared, move all rows down and add a new row at the top
      if (
        bottomRowCleared &&
        newBricks[newBricks.length - 1].every((brick) => brick === 0)
      ) {
        // Shift all existing rows down
        for (let i = newBricks.length - 1; i > 0; i--) {
          newBricks[i] = newBricks[i - 1];
        }
        // Add a new row at the top
        newBricks[0] = generateNewRow();
      }

      setBricks(newBricks);
      return newBall;
    });
  };

  // Generate a new row of bricks (random coins, always filled)
  const generateNewRow = () => {
    const row: number[] = [];
    for (let col = 0; col < 7; col++) {
      row.push(generateCoins() ? 1 : 2); // 1 for coin, 2 for regular brick
    }
    return row;
  };

  // Game loop
  const gameLoop = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    draw(ctx);
    updateBall();
    checkBrickCollisions();
    movePaddleWithKeys(); // Add paddle movement based on keys
  };

  // Start the game loop on each frame
  useEffect(() => {
    const interval = setInterval(gameLoop, 10);
    return () => clearInterval(interval);
  }, [bricks, ball]);

  // Event listener for mouse movement and keyboard arrow keys
  useEffect(() => {
    canvasRef.current!.addEventListener("mousemove", movePaddleWithMouse);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      canvasRef.current!.removeEventListener("mousemove", movePaddleWithMouse);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle keydown event to set continuous movement
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      isMovingLeft.current = true;
    } else if (e.key === "ArrowRight") {
      isMovingRight.current = true;
    }
  };

  // Handle keyup event to stop movement when key is released
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      isMovingLeft.current = false;
    } else if (e.key === "ArrowRight") {
      isMovingRight.current = false;
    }
  };

  // Handle restarting the game
  const restartGame = () => {
    setGameOver(false); // Reset the game over state
    setBall({ x: 150, y: 290, dx: BALL_SPEED, dy: BALL_SPEED }); // Reset ball position
    setPaddle({ x: 100, width: 100 }); // Reset paddle position
    setCoins(0); // Reset coins
    setBricks(generateInitialBricks()); // Reset bricks
  };

  return (
    <div className="game-container" style={{ textAlign: "center" }}>
      {gameOver ? (
        <div className="game-over-screen">
          <h2>Game Over!</h2>
          <button onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <>
          <h1>BrickBreaker - Coins Collected: {coins}</h1>
          <canvas
            ref={canvasRef}
            width="480"
            height="320"
            style={{
              border: "1px solid #0095DD",
              backgroundColor: "#eee",
              display: "block",
              margin: "0 auto",
            }}
          />
        </>
      )}
    </div>
  );
};

export default BrickBreaker;
