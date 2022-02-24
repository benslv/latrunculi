import * as GameState from "./GameController";

import styled from "styled-components";

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
  const validMoves = GameState.validMoves.use();
  const selectedPiece = GameState.selectedPiece.use();

  const handleSquareClick = (row: number, column: number) => {
    switch (board[row][column]) {
      case currentTurn: {
        GameState.setSelectedPiece([row, column]);
        GameState.resetValidMoves();

        return getValidMoves(row, column);
      }
      case 0: {
        // And the square the clicked on is a valid move for that piece.
        // Check that selected piece equals current player...
        const [y, x] = selectedPiece;

        if (board[y][x] === currentTurn && GameState.isValidMove(row, column)) {
          GameState.makeMove(selectedPiece, [row, column], board[y][x]);
          GameState.resetValidMoves();

          GameState.processCaptures(row, column);

          GameState.toggleTurn();
        }
      }
    }
  };

  const getBlockers = (values: number[], pos: number): [number, number] => {
    // split into two lists either side of pos
    // find max index of bad value in first list
    // find min index of bad value in second list
    // indicates all pieces beyond (and including it) are unreachable

    values = values.map((val) => (val === 0 ? 0 : 1));

    const before = values.slice(0, pos).lastIndexOf(1);
    const after = pos + 1 + values.slice(pos + 1).indexOf(1);

    return [before, after === pos ? 8 : after];
  };

  const getValidMoves = (row: number, column: number): string[] => {
    // moves like a rook in chess
    // any square on same row/column until blocked by opponent piece

    // Get board values for row and column of selected piece.
    const vertical = board.map((row) => row[column]);
    const horizontal = board[row];

    // const opponentValue = currentTurn === 1 ? 2 : 1;

    // Calculate the positions of the closest opponent pieces on both row and column.
    const [vertBefore, vertAfter] = getBlockers(vertical, row);
    const [horizBefore, horizAfter] = getBlockers(horizontal, column);

    // Determine the valid vertical and horizontal squares remaining.
    vertical
      .map((_, i) => {
        if (i > vertBefore && i < vertAfter && i !== row) {
          return i;
        }
      })
      .filter((i) => i !== undefined)
      .forEach((i) => GameState.addValidMove(i as number, column));

    horizontal
      .map((_, i) => {
        if (i > horizBefore && i < horizAfter && i !== column) {
          return i;
        }
      })
      .filter((i) => i !== undefined)
      .forEach((i) => GameState.addValidMove(row, i as number));

    return validMoves;
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
