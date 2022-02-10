import { useState } from "react";

import { Board } from "./components/Board";

const layout = [
  [2, null, 2, null, 2, null, 2, null],
  [null, 2, null, 2, null, 2, null, 2],
  [2, null, 2, null, 2, null, 2, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 1, null, 1, null, 1, null, 1],
  [1, null, 1, null, 1, null, 1, null],
  [null, 1, null, 1, null, 1, null, 1],
];

function App() {
  const [board, setBoard] = useState(layout);
  const [selectedPiece, setSelectedPiece] = useState<number[] | null>(null);

  const handlePieceSelect = (row: number, column: number) => {
    if (board[row][column] !== null) {
      setSelectedPiece([row, column]);
    }
  };

  return (
    <div className="App">
      <h1>React Checkers</h1>
      <Board board={board} handlePieceSelect={handlePieceSelect} />
      <p>Selected piece: {selectedPiece}</p>
    </div>
  );
}

export default App;
