import styled from "styled-components";

import { Square } from "./Square";

type BoardProps = {
  board: (number | null)[][];
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: max-content;
`;

export const Board = ({ board }: BoardProps) => {
  console.log(board);

  return (
    <Wrapper>
      {board.map((row, j) =>
        row.map((_, i) => (
          <Square key={i} color={(i + j) % 2 == 0 ? "light" : "dark"} val={board[j][i]} />
        )),
      )}
    </Wrapper>
  );
};
