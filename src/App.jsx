
import { useState, useEffect, useCallback } from "react";

import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import GameModal from "./components/GameModal";

import "./App.css";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const WORDS = [
  "APPLE",
  "GRAPE",
  "BRAIN",
  "MUSIC",
  "PLANT",
  "STONE",
  "LIGHT",
  "SMILE",
  "DREAM",
  "NIGHT"
];

function evaluateGuess(guess, solution) {
  const result = Array(WORD_LENGTH).fill("absent");
  const remaining = solution.split("");

  // First pass: find correct letters in correct positions.
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === solution[i]) {
      result[i] = "correct";
      remaining[i] = null;
    }
  }

  // Second pass: find correct letters in wrong positions.
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;

    const foundIndex = remaining.indexOf(guess[i]);

    if (foundIndex !== -1) {
      result[i] = "present";
      remaining[foundIndex] = null;
    }
  }

  return result;
}

function App() {
  const [solutionWord, setSolutionWord] = useState("APPLE");
  const [currentGuess, setCurrentGuess] = useState("");
  const [pastGuesses, setPastGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [keyStatuses, setKeyStatuses] = useState({});

  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== "playing") return;

    if (key === "BACKSPACE") {
      setCurrentGuess((previous) => previous.slice(0, -1));
      return;
    }

    if (key === "ENTER") {
      if (currentGuess.length !== WORD_LENGTH) return;

      const result = evaluateGuess(currentGuess, solutionWord);

      const newGuess = {
        word: currentGuess,
        result: result
      };

      setPastGuesses((previous) => [...previous, newGuess]);

      setKeyStatuses((previous) => {
        const updated = { ...previous };

        currentGuess.split("").forEach((letter, index) => {
          const status = result[index];
          const oldStatus = updated[letter];

          const priority = {
            absent: 1,
            present: 2,
            correct: 3
          };

          if (
            !oldStatus ||
            priority[status] > priority[oldStatus]
          ) {
            updated[letter] = status;
          }
        });

        return updated;
      });

      if (currentGuess === solutionWord) {
        setGameStatus("won");
      } else if (pastGuesses.length + 1 === MAX_ATTEMPTS) {
        setGameStatus("lost");
      }

      setCurrentGuess("");
      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((previous) => previous + key);
    }
  }, [gameStatus, currentGuess, solutionWord, pastGuesses.length]);

  // Support physical keyboard input.
  useEffect(() => {
    function handlePhysicalKeyboard(event) {
      const key = event.key.toUpperCase();

      if (key === "BACKSPACE") {
        event.preventDefault();
        handleKeyPress("BACKSPACE");
      } else if (key === "ENTER") {
        handleKeyPress("ENTER");
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    }

    window.addEventListener("keydown", handlePhysicalKeyboard);

    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyboard);
    };
  }, [handleKeyPress]);

  // Start a new game.
  function restartGame() {
    const availableWords = WORDS.filter(
      (word) => word !== solutionWord
    );

    const randomWord =
      availableWords[Math.floor(Math.random() * availableWords.length)];

    setSolutionWord(randomWord);
    setCurrentGuess("");
    setPastGuesses([]);
    setGameStatus("playing");
    setKeyStatuses({});
  }

  return (
    <div className="app">
      <header className="header">
        <h1>WORDLE</h1>
        <p>Guess the hidden five-letter word.</p>
      </header>

      <main className="game-container">
        <GameBoard
          pastGuesses={pastGuesses}
          currentGuess={currentGuess}
        />

        <Keyboard
          onKeyPress={handleKeyPress}
          keyStatuses={keyStatuses}
        />
      </main>

      <GameModal
        status={gameStatus}
        solutionWord={solutionWord}
        onRestart={restartGame}
      />

      <footer className="footer">
        <p>Six attempts. Five letters. One word.</p>
      </footer>
    </div>
  );
}

export default App;
