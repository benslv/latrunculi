import { useEffect } from "react";
import styled from "styled-components";

import * as GameState from "./GameController";
import { Square } from "./Square";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: max-content;
  gap: 5px;

  padding: 1em 0;
`;

export const Board = () => {
  const board = GameState.board.use();
  const currentTurn = GameState.currentTurn.use();
  const selectedPiece = GameState.selectedPiece.use();

  const handleSquareClick = (row: number, column: number) => {
    if (!selectedPiece) return;

    // And the square the clicked on is a valid move for that piece.
    // Check that selected piece equals current player...
    const [y, x] = selectedPiece;

    if (board[y][x] === currentTurn && GameState.isValidMove(row, column)) {
      GameState.makeMove(selectedPiece, [row, column], board[y][x]);
      GameState.resetValidMoves();

      GameState.processCaptures(row, column);

      GameState.toggleTurn();
    }
  };

  return (
    <Wrapper>
      {board.map((row, j) =>
        row.map((_, i) => (
          <Square
            key={`${j}|${i}`}
            val={board[j][i]}
            row={j}
            column={i}
            handleSquareClick={handleSquareClick}
          />
        )),
      )}
    </Wrapper>
  );
};
