import * as GameState from "./GameController";

import styled from "styled-components";

import { Square } from "./Square";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: max-content;
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
        }
      }
    }
  };

  const getValidMoves = (row: number, column: number): string[] => {
    const dy = [-1, 1];
    const dx = [-1, 1];

    for (const y of dy) {
      for (const x of dx) {
        const posX = column + x;
        const posY = row + y;

        if (
          0 <= posY &&
          posY <= board.length - 1 &&
          0 <= posX &&
          posX <= board[posY].length - 1 &&
          board[posY][posX] === 0
        ) {
          GameState.addValidMove(posY, posX);
        }
      }
    }

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
