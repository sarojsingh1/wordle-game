
import Tile from "./Tile";

function Row({ guess = "", result = [] }) {
  const letters = guess.split("");

  return (
    <div className="word-row">
      {Array.from({ length: 5 }).map((_, index) => (
        <Tile
          key={index}
          letter={letters[index] || ""}
          status={result[index] || ""}
        />
      ))}
    </div>
  );
}

export default Row;
