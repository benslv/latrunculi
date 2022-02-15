import { entity } from "simpler-state";

export const currentTurn = entity(1);
export const toggleTurn = () => currentTurn.set((curr) => (curr === 1 ? 2 : 1));

export const selectedPiece = entity([-1, -1]);
export const setSelectedPiece = ([row, column]: [number, number]) =>
  selectedPiece.set([row, column]);

export const board = entity([
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
]);

export const makeMove = (start: number[], end: number[], val: number) => {
  const [y1, x1] = start;
  const [y2, x2] = end;

  board.set((prev) => {
    prev[y2][x2] = val;
    prev[y1][x1] = 0;

    return prev;
  });
};

export const validMoves = entity([""]);
export const addValidMove = (row: number, column: number) => {
  const move = [row, column].join("|");

  validMoves.set((prev) => [...prev, move]);
};
export const resetValidMoves = () => validMoves.set([""]);

export const isValidMove = (row: number, column: number) =>
  validMoves.get().includes([row, column].join("|"));
