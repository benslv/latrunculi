import styled from "styled-components";

import { Square } from "./Square";

type BoardProps = {
  board: (number | null)[][];
  handlePieceSelect: (row: number, column: number) => void;
  currentTurn: 1 | 2;
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: max-content;
`;

export const Board = ({ board, handlePieceSelect, currentTurn }: BoardProps) => {
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
            currentTurn={currentTurn}
          />
        )),
      )}
    </Wrapper>
  );
};
