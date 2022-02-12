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
  handlePieceSelect: (row: number, column: number) => void;
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

  background-color: ${({ isMoveCandidate, color }) =>
    isMoveCandidate ? "#e0a802" : colours[color]};
`;

export const Square = ({ val, row, column, handlePieceSelect }: SquareProps) => {
  const currentTurn = GameState.currentTurn.use();
  const validMoves = GameState.validMoves.use();

  const isMoveCandidate = validMoves.includes([row, column].join("-"));

  return (
    <Cell
      color={(row + column) % 2 == 0 ? "light" : "dark"}
      isMoveCandidate={isMoveCandidate}
      onClick={() => handlePieceSelect(row, column)}>
      {val ? <Piece val={val} currentTurn={currentTurn} /> : null}
    </Cell>
  );
};
