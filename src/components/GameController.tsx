import { entity } from "simpler-state";

export const currentTurn = entity(1);
export const toggleTurn = () => currentTurn.set((curr) => (curr === 1 ? 2 : 1));

export const selectedPiece = entity([-1, -1]);
export const setSelectedPiece = (row: number, column: number) => selectedPiece.set([row, column]);

export const board = entity([
  [2, null, 2, null, 2, null, 2, null],
  [null, 2, null, 2, null, 2, null, 2],
  [2, null, 2, null, 2, null, 2, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 1, null, 1, null, 1, null, 1],
  [1, null, 1, null, 1, null, 1, null],
  [null, 1, null, 1, null, 1, null, 1],
]);

export const validMoves = entity([""]);
export const addValidMove = (row: number, column: number) => {
  const move = [row, column].join("-");

  validMoves.set((prev) => [...prev, move]);
};
export const resetValidMoves = () => validMoves.set([""]);
