import styled from "styled-components";

type PieceProps = {
  val: number;
  currentTurn: number;
};

export const Piece = styled.div<PieceProps>`
  background-color: ${({ val }) => (val === 1 ? "white" : "#1d1d1d")};
  border-radius: 50%;

  width: 60px;
  height: 60px;

  box-shadow: 0 5px 10px #424242;

  cursor: ${({ currentTurn, val }) => (currentTurn === val ? "pointer" : "not-allowed")};
`;
