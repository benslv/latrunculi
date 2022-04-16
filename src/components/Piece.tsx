import styled from "styled-components";
import type { Board } from "../utils/board";

type PieceProps = {
  val: number;
  currentTurn: number;
  row: number;
  col: number;
  isKing?: boolean;
  board: Board;
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
  const { val, row, col, board } = props;

  const currentTurn = board.currentTurn.use();
  const winner = board.winner.use();
  const selectedPiece = board.selectedPiece.use();

  const handlePieceClick = () => {
    if (val !== currentTurn || winner !== 0) return;

    if (selectedPiece[0] === row && selectedPiece[1] === col) {
      board.setSelectedPiece([-1, -1]);
      board.resetValidMoves();

      return;
    }

    board.setSelectedPiece([row, col]);
    board.resetValidMoves();

    const [validVertical, validHorizontal] = board.getValidMoves(row, col);

    for (const row of validVertical) {
      board.addValidMove(row, col);
    }

    for (const col of validHorizontal) {
      board.addValidMove(row, col);
    }
  };

  return <Wrapper {...props} onClick={() => handlePieceClick()} />;
};
