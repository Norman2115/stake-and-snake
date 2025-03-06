"use client";

import { useEffect, useRef, useState } from "react";

interface GameCanvasProps {
  gameStarted: boolean;
  onGameOver?: (score: number) => void;
  timeLeft: number;
}

export default function GameCanvas({ gameStarted, onGameOver, timeLeft }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResetTrigger, setGameResetTrigger] = useState(0);
  const [time, setTime] = useState(timeLeft);
  const [noRender, setNoRender] = useState(false);

  // useEffect(() => {
  //   if (gameStarted && time > 0) {
  //     const timer = setTimeout(() => setTime(time - 1), 1000);
  //     console.log("time", time);
  //     return () => clearTimeout(timer);
  //   } else if (time === 0) {
  //     setNoRender(true);
  //     setGameOver(true);
  //     // if (onGameOver) onGameOver(score);
  //   }
  // }, [gameStarted, time]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setGameResetTrigger(prev => prev + 1); // Change the trigger to restart the game
  };

  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Game variables
    const gridSize = 20;
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);

    const snake = {
      body: [
        { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
        { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2) },
        { x: Math.floor(cols / 2) - 2, y: Math.floor(rows / 2) },
      ],
      direction: "right" as "up" | "down" | "left" | "right",
      nextDirection: "right" as "up" | "down" | "left" | "right",
      color: "#55efc4",
      score: 0,
    };

    let food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
      value: Math.floor(Math.random() * 3) + 1,
    };

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Prevent default behavior for arrow keys to avoid page scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        e.preventDefault();
      }

      // Set next direction based on key press
      // Prevent 180-degree turns
      if (key === "ArrowUp" && snake.direction !== "down") {
        snake.nextDirection = "up";
      } else if (key === "ArrowDown" && snake.direction !== "up") {
        snake.nextDirection = "down";
      } else if (key === "ArrowLeft" && snake.direction !== "right") {
        snake.nextDirection = "left";
      } else if (key === "ArrowRight" && snake.direction !== "left") {
        snake.nextDirection = "right";
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Check for collisions
    const checkCollision = (head: { x: number; y: number }) => {
      // Check wall collision
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        return true;
      }

      // Check self collision (skip the last segment as it will be removed)
      for (let i = 1; i < snake.body.length - 1; i++) {
        if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
          return true;
        }
      }

      return false;
    };

    // Game loop
    const gameLoop = () => {
      if (!ctx || gameOver) return;

      // Update snake direction
      snake.direction = snake.nextDirection;

      // Calculate new head position
      const head = { ...snake.body[0] };
      if (snake.direction === "right") head.x += 1;
      else if (snake.direction === "left") head.x -= 1;
      else if (snake.direction === "up") head.y -= 1;
      else if (snake.direction === "down") head.y += 1;

      // Check for collision
      if (checkCollision(head)) {
        setGameOver(true);
        if (onGameOver) onGameOver(snake.score);
        return;
      }

      // Check for food collision
      let ate = false;
      if (head.x === food.x && head.y === food.y) {
        // Increase score based on food value
        const foodValue = food.value;
        snake.score += foodValue;
        setScore(snake.score);

        // Generate new food
        food = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
          value: Math.floor(Math.random() * 3) + 1,
        };
        ate = true;
      }

      // Update snake body
      snake.body.unshift(head);
      if (!ate) snake.body.pop();

      // Clear canvas
      ctx.fillStyle = "#1e1e2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "#2d3748";
      ctx.lineWidth = 0.5;

      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Draw food
      const foodColors = ["#e74c3c", "#f39c12", "#9b59b6"];
      ctx.fillStyle = foodColors[food.value - 1];
      ctx.beginPath();
      ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw snake
      snake.body.forEach((segment, index) => {
        ctx.fillStyle = snake.color;
        if (index === 0) {
          // Head
          ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);

          // Eyes
          ctx.fillStyle = "#000";
          const eyeSize = gridSize / 5;
          if (snake.direction === "right") {
            ctx.fillRect(
              segment.x * gridSize + gridSize - eyeSize * 2,
              segment.y * gridSize + eyeSize,
              eyeSize,
              eyeSize,
            );
            ctx.fillRect(
              segment.x * gridSize + gridSize - eyeSize * 2,
              segment.y * gridSize + gridSize - eyeSize * 2,
              eyeSize,
              eyeSize,
            );
          } else if (snake.direction === "left") {
            ctx.fillRect(segment.x * gridSize + eyeSize, segment.y * gridSize + eyeSize, eyeSize, eyeSize);
            ctx.fillRect(
              segment.x * gridSize + eyeSize,
              segment.y * gridSize + gridSize - eyeSize * 2,
              eyeSize,
              eyeSize,
            );
          } else if (snake.direction === "up") {
            ctx.fillRect(segment.x * gridSize + eyeSize, segment.y * gridSize + eyeSize, eyeSize, eyeSize);
            ctx.fillRect(
              segment.x * gridSize + gridSize - eyeSize * 2,
              segment.y * gridSize + eyeSize,
              eyeSize,
              eyeSize,
            );
          } else if (snake.direction === "down") {
            ctx.fillRect(
              segment.x * gridSize + eyeSize,
              segment.y * gridSize + gridSize - eyeSize * 2,
              eyeSize,
              eyeSize,
            );
            ctx.fillRect(
              segment.x * gridSize + gridSize - eyeSize * 2,
              segment.y * gridSize + gridSize - eyeSize * 2,
              eyeSize,
              eyeSize,
            );
          }
        } else {
          // Body segments
          ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        }
      });

      // Draw score
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${snake.score}`, 10, 30);
    };

    const gameInterval = setInterval(gameLoop, 150);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gameOver, gameResetTrigger]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full rounded-lg" style={{ display: "block" }} />
      {gameOver && !noRender && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="rounded-lg bg-gray-800/50 p-6 text-center max-w-xs w-full">
            <h2 className="mb-2 text-2xl font-bold text-red-500">Game Over!</h2>
            <p className="mb-4 text-lg">Your score: {score}</p>
            <div className="flex justify-center gap-2 w-full">
              <button
                onClick={resetGame}
                className="rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 w-full"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
