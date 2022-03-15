import toast from "react-hot-toast";

export class Board {
  currentTurn: 1 | 2;
  numWhiteLeft: number;
  numBlackLeft: number;
  whiteKingAlive: boolean;
  blackKingAlive: boolean;
  winner: 0 | 1 | 2;
  selectedPiece: [number, number];
  layout: number[][];
  validMoves: string[];

  constructor() {
    this.currentTurn = 1;

    this.numWhiteLeft = 8;
    this.numBlackLeft = 8;

    this.whiteKingAlive = true;
    this.blackKingAlive = true;

    this.winner = 0;

    this.selectedPiece = [0, 0];

    this.layout = [
      [2, 2, 2, 2, 2, 2, 2, 2],
      [0, 0, 0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.validMoves = [];
  }

  setSelectedPiece([row, column]: [number, number]) {
    this.selectedPiece = [row, column];
  }

  toggleTurn() {
    this.currentTurn = this.currentTurn === 1 ? 2 : 1;
  }

  getBoardValue(row: number, column: number): [number, boolean] {
    if (
      row < 0 ||
      row > this.layout.length - 1 ||
      column < 0 ||
      column > this.layout[0].length - 1
    ) {
      return [0, false];
    }

    const isKing = this.layout[row][column] > 2;

    return [isKing ? this.layout[row][column] - 2 : this.layout[row][column], isKing];
  }

  makeMove([y1, x1]: [number, number], [y2, x2]: [number, number], val: number) {
    this.layout[y2][x2] = val;
    this.layout[y1][x1] = 0;
  }

  doCapture(row: number, column: number, isKing = false) {
    const [capturedPiece] = this.getBoardValue(row, column);

    this.layout[row][column] = 0;

    if (isKing) {
      switch (capturedPiece) {
        case 1: {
          this.winner = 2;

          return toast("Oh no, your king was captured!", { icon: "😭" });
        }
        case 2: {
          this.winner = 1;

          return toast("Congratulations, you captured their king!", { icon: "⚔" });
        }
      }
    }

    if (capturedPiece === 1) {
      this.numWhiteLeft -= 1;

      toast("Your opponent captured one of your pawns!", { icon: "💀" });
    } else {
      this.numBlackLeft -= 1;

      toast("You captured one of your opponent's pawns!", { icon: "🔥" });
    }

    if (this.numBlackLeft === 0) {
      this.winner = 1;
    } else if (this.numWhiteLeft === 0) {
      this.winner = 2;
    }
  }

  addValidMove(row: number, column: number) {
    const move = [row, column].join("|");

    this.validMoves.push(move);
  }

  getBlockers(values: number[], pos: number) {
    // split into two lists either side of pos
    // find max index of bad value in first list
    // find min index of bad value in second list
    // indicates all pieces beyond (and including it) are unreachable

    values = values.map((val) => (val === 0 ? 0 : 1));

    const before = values.slice(0, pos).lastIndexOf(1);
    const after = pos + 1 + values.slice(pos + 1).indexOf(1);

    return [before, after === pos ? 8 : after];
  }

  getValidMoves(row: number, column: number, isKing = false) {
    const vertical = this.layout.map((row) => row[column]);
    const horizontal = this.layout[row];

    // Calculate the positions of the closest opponent pieces on both row and column.
    const [vertBefore, vertAfter] = this.getBlockers(vertical, row);
    const [horizBefore, horizAfter] = this.getBlockers(horizontal, column);

    // Determine the valid vertical and horizontal squares remaining.
    const verticalMoves = vertical
      .map((_, i) => i)
      .filter((i) => {
        if (isKing) {
          return i >= row - 1 && i <= row + 1;
        }
        return true;
      })
      .filter((i) => i > vertBefore && i < vertAfter && i !== row);

    const horizontalMoves = horizontal
      .map((_, i) => i)
      .filter((i) => {
        if (isKing) {
          return i >= column - 1 && i <= column + 1;
        }
        return true;
      })
      .filter((i) => i > horizBefore && i < horizAfter && i !== column);

    return [verticalMoves, horizontalMoves];
  }

  resetValidMoves() {
    this.validMoves = [];
  }

  isValidMove(row: number, column: number) {
    return this.validMoves.includes([row, column].join("|"));
  }

  processCaptures(row: number, column: number) {
    const adjacentSquares = [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ];

    const opponentVal = this.currentTurn === 1 ? 2 : 1;

    for (const [y, x] of adjacentSquares) {
      const [val, isKing] = this.getBoardValue(y, x);

      if (val !== opponentVal) continue;

      if (isKing && this.isSurroundedOnAllSides(y, x)) {
        this.doCapture(y, x, true);
      } else if (this.isSurroundedOnOppositeSides(y, x) || this.isCornered(y, x)) {
        this.doCapture(y, x);
      }
    }
  }

  isSurroundedOnOppositeSides(row: number, column: number) {
    const opponentVal = this.currentTurn;

    const [above, below, left, right] = this.getAdjacentSquares(row, column);

    return (
      [above, below].every((val) => val === opponentVal) ||
      [left, right].every((val) => val === opponentVal)
    );
  }

  isSurroundedOnAllSides(row: number, column: number) {
    const opponentVal = this.currentTurn;

    return this.getAdjacentSquares(row, column).every((val) => val === opponentVal);
  }

  getAdjacentSquares(row: number, column: number) {
    const [above] = this.getBoardValue(row - 1, column);
    const [below] = this.getBoardValue(row + 1, column);
    const [left] = this.getBoardValue(row, column - 1);
    const [right] = this.getBoardValue(row, column + 1);

    return [above, below, left, right];
  }

  isCornered(row: number, column: number) {
    const [above, below, left, right] = this.getAdjacentSquares(row, column);

    const opponentVal = this.currentTurn;

    switch (true) {
      case row === 0 && column === 0: {
        return below === opponentVal && right === opponentVal;
      }
      case row === 0 && column === 7: {
        return below === opponentVal && left === opponentVal;
      }
      case row === 7 && column === 0: {
        return above === opponentVal && right === opponentVal;
      }
      case row === 7 && column === 7: {
        return above === opponentVal && left === opponentVal;
      }
    }
  }
}
