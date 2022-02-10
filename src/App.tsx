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
  const [selectedPiece, setSelectedPiece] = useState(null);

  return (
    <div className="App">
      <h1>React Checkers</h1>
      <Board board={board} />
    </div>
  );
}

export default App;
