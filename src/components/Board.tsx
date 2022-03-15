import styled from "styled-components";

import * as GameState from "./GameController";
import { Square } from "./Square";

import type { Board as BoardT } from "../utils/board";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: max-content;
  gap: 5px;

  padding: 1em 0;
`;

export const GameBoard = ({ board }: { board: BoardT }) => {
  const currentTurn = board.currentTurn;
  const selectedPiece = board.selectedPiece;

  const handleSquareClick = (row: number, column: number) => {
    if (!selectedPiece) return;

    // And the square the clicked on is a valid move for that piece.
    // Check that selected piece equals current player...
    const [y, x] = selectedPiece;

    const boardVal = board.layout[y][x] > 2 ? board.layout[y][x] - 2 : board.layout[y][x];

    if (boardVal === currentTurn && GameState.isValidMove(row, column)) {
      board.makeMove(selectedPiece, [row, column], board.layout[y][x]);
      board.resetValidMoves();

      board.processCaptures(row, column);

      board.toggleTurn();
    }
  };

  return (
    <Wrapper>
      {board.layout.map((row, j) =>
        row.map((_, i) => (
          <Square
            key={`${j}|${i}`}
            val={board.layout[j][i]}
            row={j}
            column={i}
            handleSquareClick={handleSquareClick}
            board={board}
          />
        )),
      )}
    </Wrapper>
  );
};
