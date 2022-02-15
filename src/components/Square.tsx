import styled from "styled-components";
import { Piece } from "./Piece";

import * as GameState from "./GameController";

type CellProps = {
  color: "light" | "dark";
  isMoveCandidate: boolean;
};

type SquareProps = {
  val: number | null;
  row: number;
  column: number;
  handleSquareClick: (row: number, column: number) => void;
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

  cursor: ${({ isMoveCandidate }) => (isMoveCandidate ? "pointer" : "default")};

  background-color: ${({ isMoveCandidate, color }) =>
    isMoveCandidate ? "#e0a802" : colours[color]};
`;

export const Square = ({ val, row, column, handleSquareClick }: SquareProps) => {
  const currentTurn = GameState.currentTurn.use();

  const isMoveCandidate = GameState.isValidMove(row, column);

  return (
    <Cell
      color={(row + column) % 2 == 0 ? "light" : "dark"}
      isMoveCandidate={isMoveCandidate}
      onClick={() => handleSquareClick(row, column)}>
      {val ? <Piece val={val} currentTurn={currentTurn} /> : null}
    </Cell>
  );
};
