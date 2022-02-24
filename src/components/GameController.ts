import toast from "react-hot-toast";
import { entity } from "simpler-state";

export const currentTurn = entity(1);
export const toggleTurn = () => currentTurn.set((curr) => (curr === 1 ? 2 : 1));

export const selectedPiece = entity([-1, -1]);
export const setSelectedPiece = ([row, column]: [number, number]) =>
  selectedPiece.set([row, column]);

export const board = entity([
  [2, 2, 2, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
]);

export const getBoardValue = (row: number, column: number) => {
  const boardState = board.get();

  if (row < 0 || row > boardState.length - 1 || column < 0 || column > boardState[0].length - 1) {
    return 0;
  }

  return boardState[row][column];
};

export const makeMove = (start: number[], end: number[], val: number) => {
  const [y1, x1] = start;
  const [y2, x2] = end;

  board.set((prev) => {
    prev[y2][x2] = val;
    prev[y1][x1] = 0;

    return prev;
  });
};

export const doCapture = (row: number, column: number) => {
  const capturedPiece = getBoardValue(row, column);

  board.set((prev) => {
    prev[row][column] = 0;
    return prev;
  });

  if (capturedPiece === 1) {
    toast("Your opponent captured your piece!", { icon: "💀" });
  } else {
    toast("You captured your opponent's piece!", { icon: "🔥" });
  }
};

export const validMoves = entity([""]);
export const addValidMove = (row: number, column: number) => {
  const move = [row, column].join("|");

  validMoves.set((prev) => [...prev, move]);
};
export const resetValidMoves = () => validMoves.set([""]);

export const isValidMove = (row: number, column: number) =>
  validMoves.get().includes([row, column].join("|"));

export const processCaptures = (row: number, column: number) => {
  const adjacentSquares = [
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ];

  const opponentVal = currentTurn.get() === 1 ? 2 : 1;

  for (const [y, x] of adjacentSquares) {
    if (getBoardValue(y, x) === opponentVal && isSurrounded(y, x)) {
      doCapture(y, x);
    }
  }
};

export const isSurrounded = (row: number, column: number) => {
  const opponentVal = currentTurn.get();

  return (
    (getBoardValue(row - 1, column) === opponentVal &&
      getBoardValue(row + 1, column) === opponentVal) ||
    (getBoardValue(row, column - 1) === opponentVal &&
      getBoardValue(row, column + 1) === opponentVal)
  );
};
