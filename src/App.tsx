import { useState, createContext } from "react";

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
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);

  const handlePieceSelect = (row: number, column: number) => {
    if (board[row][column] === currentTurn) {
      setSelectedPiece([row, column]);

      setCurrentTurn((prev) => (prev === 1 ? 2 : 1));

      getValidMoves(row, column);
    }
  };

  const getValidMoves = (row: number, column: number): Set<string> => {
    const dy = [-1, 1];
    const dx = [-1, 1];

    const validMoves: Set<string> = new Set();

    for (const y of dy) {
      for (const x of dx) {
        const posX = column + x;
        const posY = row + y;

        if (
          0 <= posY &&
          posY <= board.length - 1 &&
          0 <= posX &&
          posX <= board[posY].length - 1 &&
          board[posY][posX] === null
        ) {
          validMoves.add([posY, posX].join("-"));
        }
      }
    }

    console.log(validMoves);

    return validMoves;
  };

  return (
    <div className="App">
      <h1>React Checkers</h1>
      <Board board={board} handlePieceSelect={handlePieceSelect} currentTurn={currentTurn} />
      <p>Selected piece: {selectedPiece}</p>
      <p>Current Turn: {currentTurn}</p>
    </div>
  );
}

export default App;
