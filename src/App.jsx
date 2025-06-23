import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [ballons, setBallons] = useState([
    { id: 1, color: "orange", state: "idle" },
    { id: 2, color: "purple", state: "idle" },
    { id: 3, color: "white", state: "idle" },
    { id: 4, color: "blue", state: "idle" },
    { id: 5, color: "gray", state: "idle" },
    { id: 6, color: "green", state: "idle" },
    { id: 7, color: "pink", state: "idle" },
    { id: 8, color: "black", state: "idle" },
    { id: 9, color: "violet", state: "idle" },
  ]);

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [usedIndexes, setUsedIndexes] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);
  const timeoutRef = useRef({});

  useEffect(() => {
    if (gameOver) return;

    const availableIndexes = ballons
      .map((_, index) => index)
      .filter((i) => !usedIndexes.has(i));

    if (availableIndexes.length === 0 || round >= 10) {
      setGameOver(true);
      return;
    }

    const interval = setTimeout(() => {
      const randomIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

      setUsedIndexes((prev) => new Set(prev).add(randomIndex));

      setBallons((prev) =>
        prev.map((b, i) =>
          i === randomIndex ? { ...b, state: "active", color: "red" } : b
        )
      );

      const vanishTimout = setTimeout(() => {
        setBallons((prev) =>
          prev.map((b, i) =>
            i === randomIndex
              ? { ...b, state: "vanished", color: "transparent" }
              : b
          )
        );
      }, 1000);
      timeoutRef.current[randomIndex] = vanishTimout;
      setRound((prev) => prev + 1);
    }, 2000);

    return () => clearTimeout(interval);
  }, [round, gameOver, usedIndexes, ballons]);

  const handleClick = (index) => {
    if (ballons[index].state === "active" && !gameOver) {
      clearTimeout(timeoutRef.current[index]);
      setScore((prev) => prev + 1);
      setBallons((prev) =>
        prev.map((b, i) =>
          i === index ? { ...b, state: "burst", color: "gold" } : b
        )
      );
    }
  };

  return (
    <>
      {gameOver && <h2>Game Over! Final Score: {score}</h2>}
      <div
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {ballons.map((ballon, i) => (
          <button
            key={ballon.id}
            onClick={() => handleClick(i)}
            style={{
              backgroundColor: ballon.color,
              opacity: ballon.state === "vanished" ? 0.2 : 1,
              border: ballon.state === "burst" ? "3px solid gold" : "none",
              width: "100px",
              height: "100px",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
