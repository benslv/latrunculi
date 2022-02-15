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

  const handleSquareClick = (row: number, column: number) => {
    switch (board[row][column]) {
      case currentTurn: {
        setSelectedPiece([row, column]);
        setValidMoves([]);

        return getValidMoves(row, column);
      }
      case 0: {
        // And the square the clicked on is a valid move for that piece.
        // Check that selected piece equals current player...
        const [y, x] = selectedPiece;

        console.log(`Move ${x} ${y} to ${column} ${row}`);

        if (board[y][x] === currentTurn && isValidMove(row, column)) {
          return makeMove(selectedPiece, [row, column], board[y][x]);
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
