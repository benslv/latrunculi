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

  const handlePieceSelect = (row: number, column: number) => {
    if (board[row][column] === currentTurn) {
      GameState.setSelectedPiece(row, column);

      GameState.toggleTurn();

      GameState.resetValidMoves();  
      getValidMoves(row, column);
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
          board[posY][posX] === null
        ) {
          GameState.addValidMove(posY, posX);
        }
      }
    }

    console.log(validMoves);

    return validMoves;
  };

  return (
    <Wrapper>
      {board.map((row, j) =>
        row.map((_, i) => (
          <Square
            key={i}
            val={board[j][i]}
            row={j}
            column={i}
            handlePieceSelect={handlePieceSelect}
          />
        )),
      )}
    </Wrapper>
  );
};
