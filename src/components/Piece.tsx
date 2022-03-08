import styled from "styled-components";
import {
  currentTurn,
  setSelectedPiece,
  resetValidMoves,
  generateValidMoves,
} from "./GameController";

type PieceProps = {
  val: number;
  currentTurn: number;
  row: number;
  col: number;
  isKing?: boolean;
};

const Wrapper = styled.div<PieceProps>`
  background-color: ${({ val }) => (val % 2 == 1 ? "white" : "#1d1d1d")};
  border-radius: 50%;

  width: 60px;
  height: 60px;

  box-shadow: 0 5px 10px #424242;

  border: ${({ isKing }) => (isKing ? "5px solid #B80C09" : "none")};

  cursor: ${({ currentTurn, val }) => (val === currentTurn ? "pointer" : "not-allowed")};
`;

export const Piece = (props: PieceProps) => {
  const handlePieceClick = () => {
    if (props.val !== currentTurn.get()) return;

    setSelectedPiece([props.row, props.col]);
    resetValidMoves();

    return generateValidMoves(props.row, props.col, props.isKing);
  };

  return (
    <Wrapper {...props} onClick={() => handlePieceClick()}>
      {props.val}
    </Wrapper>
  );
};
