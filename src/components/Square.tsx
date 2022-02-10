import styled from "styled-components";
import { Piece } from "./Piece";

type CellProps = {
  color: "light" | "dark";
};

type SquareProps = {
  val: number | null;
  row: number;
  column: number;
  handlePieceSelect: (row: number, column: number) => void;
  currentTurn: 1 | 2;
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

  background-color: ${({ color }) => colours[color]};
`;

export const Square = ({ val, row, column, handlePieceSelect, currentTurn }: SquareProps) => {
  return (
    <Cell
      color={(row + column) % 2 == 0 ? "light" : "dark"}
      onClick={() => handlePieceSelect(row, column)}>
      {val ? <Piece val={val} currentTurn={currentTurn} /> : null}
    </Cell>
  );
};
