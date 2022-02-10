import styled from "styled-components";
import { Piece } from "./Piece";

type CellProps = {
  color: "light" | "dark";
};

type SquareProps = CellProps & { val: number | null };

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

export const Square = ({ color, val }: SquareProps) => {
  return <Cell color={color}>{val ? <Piece val={val} /> : null}</Cell>;
};
