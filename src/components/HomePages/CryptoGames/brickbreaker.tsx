import React, { useState, useEffect, useRef } from "react";

// Ball and paddle speed
const BALL_SPEED = 3;
const PADDLE_SPEED = 12; // Increased the speed for faster paddle movement

// Power-up types
enum PowerUpType {
  SCORE = "score",
}

interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType;
  dy: number; // Vertical speed of the power-up
}

// Create a random coin and power-up generator function
const generateBrickContent = () => {
  const rand = Math.random();
  if (rand < 0.1) {
    return 3; // 10% chance for a power-up brick
  } else if (rand < 0.4) {
    return 1; // 30% chance for a coin brick
  }
  return 2; // 60% chance for a regular brick
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
  const [score, setScore] = useState<number>(0); // Added score state
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]); // Added power-ups state
  const [gameOver, setGameOver] = useState(false); // Added gameOver state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMovingLeft = useRef(false);
  const isMovingRight = useRef(false);
  const [gameStarted, setGameStarted] = useState(false); 

  const [gameLoopStarted, setGameLoopStarted] = useState(false);


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
        brickRow.push(generateBrickContent()); // 1: coin, 2: regular, 3: power-up
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
          if (brick === 1) {
            ctx.fillStyle = "#ff0"; // Yellow for coin brick
          } else if (brick === 3) {
            ctx.fillStyle = "#f0f"; // Magenta for power-up brick
          } else {
            ctx.fillStyle = "#0095DD"; // Blue for regular brick
          }
          ctx.fill();
          ctx.closePath();
        }
      });
    });

    // Draw power-ups
    powerUps.forEach((powerUp) => {
      ctx.beginPath();
      ctx.rect(powerUp.x, powerUp.y, 20, 20); // Power-up size
      ctx.fillStyle = "lime"; // Green for power-ups
      ctx.fill();
      ctx.closePath();
    });

    // Draw score
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`Score: ${score}`, ctx.canvas.width - 100, 20); // Display score
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

  // Update power-up positions and check for paddle collision
  const updatePowerUps = () => {
    setPowerUps((prevPowerUps) => {
      const newPowerUps = prevPowerUps
        .map((powerUp) => ({
          ...powerUp,
          y: powerUp.y + powerUp.dy,
        }))
        .filter((powerUp) => {
          // Remove power-ups that go off-screen
          if (powerUp.y > canvasRef.current!.height) {
            return false;
          }

          // Check for collision with paddle
          if (
            powerUp.y + 20 > canvasRef.current!.height - 30 && // Power-up bottom overlaps paddle top
            powerUp.y < canvasRef.current!.height - 20 && // Power-up top overlaps paddle bottom
            powerUp.x < paddle.x + paddle.width && // Power-up left is within paddle width
            powerUp.x + 20 > paddle.x // Power-up right is within paddle width
          ) {
            // Power-up caught!
            if (powerUp.type === PowerUpType.SCORE) {
              setScore((prevScore) => prevScore + 50); // Increase score
            }
            return false; // Remove power-up
          }
          return true; // Keep power-up
        });
      return newPowerUps;
    });
  };

  // Collision detection for breaking bricks
 const checkBrickCollisions = () => {
    setBall((prevBall) => {
      let newBall = { ...prevBall };
      const newBricks = bricks.map((row) => [...row]);
      let rowCleared = false;

      for (let i = 0; i < newBricks.length; i++) {
        for (let j = 0; j < newBricks[i].length; j++) {
          if (newBricks[i][j] > 0) {
            const brickX = j * 60 + 35;
            const brickY = i * 20 + 30;
            const brickWidth = 50;
            const brickHeight = 15;

            if (
              newBall.x > brickX &&
              newBall.x < brickX + brickWidth &&
              newBall.y > brickY &&
              newBall.y < brickY + brickHeight
            ) {
              newBall.dy = -newBall.dy;

              if (newBricks[i][j] === 1) {
                setCoins((prevCoins) => prevCoins + 1);
              } else if (newBricks[i][j] === 3) {
                setPowerUps((prevPowerUps) => [
                  ...prevPowerUps,
                  { x: brickX + brickWidth / 2 - 10, y: brickY, type: PowerUpType.SCORE, dy: 2 },
                ]);
              }
              newBricks[i][j] = 0;
              break;
            }
          }
        }
        if (newBall.dy !== prevBall.dy) break;
      }

      // Check for any cleared row
      for (let i = 0; i < newBricks.length; i++) {
        if (newBricks[i].every((brick) => brick === 0)) {
          rowCleared = true;
          for (let k = i; k > 0; k--) {
            newBricks[k] = newBricks[k - 1];
          }
          newBricks[0] = generateNewRow();
        }
      }

      setBricks(newBricks);
      return newBall;
    });
  };

  // Generate a new row of bricks (random coins, always filled)
  const generateNewRow = () => {
    const row: number[] = [];
    for (let col = 0; col < 7; col++) {
      row.push(generateBrickContent()); // 1: coin, 2: regular, 3: power-up
    }
    return row;
  };

  // Game loop
const gameLoop = () => {
  if (gameOver) return;

  const ctx = canvasRef.current!.getContext("2d")!;
  draw(ctx);

  if (gameLoopStarted) {
    updateBall();
    checkBrickCollisions();
    movePaddleWithKeys();
    updatePowerUps();
  }
};



  // Start the game loop on each frame
useEffect(() => {
  if (!gameStarted || !gameLoopStarted || gameOver) return;

  const interval = setInterval(gameLoop, 10);
  return () => clearInterval(interval);
}, [bricks, ball, paddle, powerUps, gameOver, gameStarted, gameLoopStarted]);

useEffect(() => {
  if (!gameStarted || gameLoopStarted || gameOver) return;

  const ctx = canvasRef.current?.getContext("2d");
  if (!ctx) return;

  draw(ctx); // Draw static game screen once

  const idleInterval = setInterval(() => {
    draw(ctx);
  }, 30); // Repeatedly draw bricks, paddle, ball position

  return () => clearInterval(idleInterval);
}, [gameStarted, gameLoopStarted, gameOver]);

// Added powerUps and gameOver to dependencies

  // Event listener for mouse movement and keyboard arrow keys
  useEffect(() => {
  if (!gameStarted) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  canvas.addEventListener("mousemove", movePaddleWithMouse);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
    canvas.removeEventListener("mousemove", movePaddleWithMouse);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}, [gameStarted]);


  // Handle keydown event to set continuous movement
const handleKeyDown = (e: KeyboardEvent) => {
  if (!gameLoopStarted) {
    setGameLoopStarted(true); // Start the loop on first key press
  }

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
    setScore(0); // Reset score
    setPowerUps([]); // Clear any lingering power-ups
    setBricks(generateInitialBricks()); // Reset bricks
    setGameLoopStarted(false); // Reset loop trigger

  };

  return (
  <div className="game-container" style={{ textAlign: "center" }}>
    {!gameStarted ? (
      <div className="home-screen text-white">
        <h1>Welcome to BrickBreaker</h1>
        <p>🟦 Break bricks to score points</p>
        <p>🟨 Yellow bricks = coins</p>
        <p>🟪 Magenta bricks = drop power-ups</p>
        <p>🎮 Use Arrow Keys or Mouse to move the paddle</p>
        <button onClick={() => setGameStarted(true)}>Start Game</button>
        <br />
        
      </div>
    ) : gameOver ? (
      <div className="game-over-screen text-white">
        <h2>Game Over!</h2>         
        <p>Coins Collected: {score/200}</p>
        <p>Final Score: {score}</p>
        <button onClick={restartGame}>Play Again</button>
        <br />
        <button onClick={() => {setGameStarted(false);  setGameLoopStarted(false);}}>Back to Home</button>
      </div>
    ) : (
      <>
        <h1>BrickBreaker - Coins: {coins}</h1>
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