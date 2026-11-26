
function GameModal({ status, solutionWord, onRestart }) {
  if (status === "playing") {
    return null;
  }

  const won = status === "won";

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{won ? "Congratulations!" : "Game Over!"}</h2>

        <p>
          {won
            ? "You guessed the correct word!"
            : "Better luck next time!"}
        </p>

        {!won && (
          <p>
            The correct word was: <strong>{solutionWord}</strong>
          </p>
        )}

        <button onClick={onRestart} className="restart-button">
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameModal;
