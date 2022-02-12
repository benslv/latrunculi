import * as GameState from "./components/GameController";

import { Board } from "./components/Board";

function App() {
  const selectedPiece = GameState.selectedPiece.use();
  const currentTurn = GameState.currentTurn.use();
  return (
    <div className="App">
      <h1>React Checkers</h1>
      <Board />
      <p>Selected piece: {selectedPiece}</p>
      <p>Current turn: {currentTurn}</p>
    </div>
  );
}

export default App;
