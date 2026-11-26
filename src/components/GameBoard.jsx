
import Row from "./Row";

function GameBoard({ pastGuesses, currentGuess }) {
  return (
    <div className="game-board">
      {Array.from({ length: 6 }).map((_, index) => {
        const previousGuess = pastGuesses[index];

        const isCurrentRow = index === pastGuesses.length;

        return (
          <Row
            key={index}
            guess={
              previousGuess
                ? previousGuess.word
                : isCurrentRow
                ? currentGuess
                : ""
            }
            result={previousGuess?.result || []}
          />
        );
      })}
    </div>
  );
}

export default GameBoard;
