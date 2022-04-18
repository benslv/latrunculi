import styled from "styled-components";
import { Piece } from "./Piece";

import type { Board as Board } from "../utils/board";

type CellProps = {
  color: "light" | "dark";
  isMoveCandidate: boolean;
};

type SquareProps = {
  val: number | null;
  row: number;
  column: number;
  handleSquareClick: (row: number, column: number) => void;
  board: Board;
};

const colours = {
  light: "#eeeed2",
  dark: "#769656",
};

const Cell = styled.div<CellProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 80px;
  height: 80px;

  border-radius: 5px;

  cursor: ${({ isMoveCandidate }) => (isMoveCandidate ? "pointer" : "default")};

  background-color: ${({ isMoveCandidate, color }) =>
    isMoveCandidate ? "#e0a802" : colours[color]};
`;

export const Square = ({ val, row, column, handleSquareClick, board }: SquareProps) => {
  const isMoveCandidate = board.isValidMove(row, column);

  return (
    <Cell
      color={(row + column) % 2 == 0 ? "light" : "dark"}
      isMoveCandidate={isMoveCandidate}
      onClick={() => handleSquareClick(row, column)}>
      {val ? (
        <Piece
          val={val > 2 ? val - 2 : val}
          row={row}
          col={column}
          board={board}
          isKing={val > 2}
        />
      ) : null}
    </Cell>
  );
};
