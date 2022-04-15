import styled from "styled-components";

import { Square } from "./Square";

import type { Board as BoardT } from "../utils/board";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: max-content;
  gap: 5px;

  padding: 1em 0;
`;

export const GameBoard = ({ board }: { board: BoardT }) => {
  const currentTurn = board.currentTurn.use();
  const selectedPiece = board.selectedPiece.use();
  const layout = board.layout.use();

  const handleSquareClick = (row: number, column: number) => {
    if (!selectedPiece) return;

    // And the square the clicked on is a valid move for that piece.
    // Check that selected piece equals current player...
    const [y, x] = selectedPiece;

    const boardVal = layout[y][x] > 2 ? layout[y][x] - 2 : layout[y][x];

    if (boardVal === currentTurn && board.isValidMove(row, column)) {
      board.makeMove({ start: selectedPiece, end: [row, column] });
    }
  };

  return (
    <Wrapper>
      {layout.map((row, j) =>
        row.map((_, i) => (
          <Square
            key={`${j}|${i}`}
            val={layout[j][i]}
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
