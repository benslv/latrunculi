/* eslint-disable indent */
import toast from "react-hot-toast";
import { entity } from "simpler-state";

export const currentTurn = entity(1);
export const toggleTurn = () => currentTurn.set((curr) => (curr === 1 ? 2 : 1));

export const selectedPiece = entity([0, 0]);
export const setSelectedPiece = ([row, column]: [number, number]) =>
  selectedPiece.set([row, column]);

export const board = entity([
  [2, 2, 2, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 4, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
]);

export const getBoardValue = (row: number, column: number) => {
  const boardState = board.get();

  if (row < 0 || row > boardState.length - 1 || column < 0 || column > boardState[0].length - 1) {
    return 0;
  }

  return boardState[row][column] > 2 ? boardState[row][column] - 2 : boardState[row][column];
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

const getBlockers = (values: number[], pos: number): [number, number] => {
  // split into two lists either side of pos
  // find max index of bad value in first list
  // find min index of bad value in second list
  // indicates all pieces beyond (and including it) are unreachable

  values = values.map((val) => (val === 0 ? 0 : 1));

  const before = values.slice(0, pos).lastIndexOf(1);
  const after = pos + 1 + values.slice(pos + 1).indexOf(1);

  return [before, after === pos ? 8 : after];
};

export const generateValidMoves = (row: number, column: number, isKing = true): void => {
  // moves like a rook in chess
  // any square on same row/column until blocked by opponent piece

  // Get board values for row and column of selected piece.
  const vertical = board.get().map((row) => row[column]);
  const horizontal = board.get()[row];

  // Calculate the positions of the closest opponent pieces on both row and column.
  const [vertBefore, vertAfter] = getBlockers(vertical, row);
  const [horizBefore, horizAfter] = getBlockers(horizontal, column);

  // Determine the valid vertical and horizontal squares remaining.
  vertical
    .map((_, i) => i)
    .filter((i) => {
      if (isKing) {
        return i >= row - 1 && i <= row + 1;
      }
      return true;
    })
    .filter((i) => i > vertBefore && i < vertAfter && i !== row)
    .forEach((i) => addValidMove(i, column));

  horizontal
    .map((_, i) => i)
    .filter((i) => {
      if (isKing) {
        return i >= column - 1 && i <= column + 1;
      }
      return true;
    })
    .filter((i) => i > horizBefore && i < horizAfter && i !== column)
    .forEach((i) => addValidMove(row, i as number));
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
