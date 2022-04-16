import toast from "react-hot-toast";
import { entity, Entity } from "simpler-state";
import rfdc from "rfdc";

export type Move = {
  start: number[];
  end: number[];
};

export class Board {
  numMoves: Entity<number>;
  currentTurn: Entity<number>;
  numWhiteLeft: Entity<number>;
  numBlackLeft: Entity<number>;
  whiteKingAlive: Entity<boolean>;
  blackKingAlive: Entity<boolean>;
  winner: Entity<number>;
  selectedPiece: Entity<number[]>;
  layout: Entity<number[][]>;
  validMoves: Entity<string[]>;
  boardStateTracker: Entity<Map<string, number>>;
  boardWidth: number;
  boardHeight: number;

  constructor() {
    this.numMoves = entity(0);

    this.currentTurn = entity(1);

    this.numWhiteLeft = entity(8);
    this.numBlackLeft = entity(8);

    this.whiteKingAlive = entity(true) as Entity<boolean>;
    this.blackKingAlive = entity(true) as Entity<boolean>;

    this.winner = entity(0);

    this.selectedPiece = entity([-1, -1]);

    this.layout = entity([
      [2, 2, 2, 2, 2, 2, 2, 2],
      [0, 0, 0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ]);

    this.boardWidth = this.layout.get()[0].length;
    this.boardHeight = this.layout.get().length;

    this.validMoves = entity([""]);

    this.boardStateTracker = entity(new Map());
  }

  copyState(): string {
    return JSON.stringify({
      currentTurn: this.currentTurn.get(),
      numWhiteLeft: this.numWhiteLeft.get(),
      numBlackLeft: this.numBlackLeft.get(),
      whiteKingAlive: this.whiteKingAlive.get(),
      blackKingAlive: this.blackKingAlive.get(),
      winner: this.winner.get(),
      selectedPiece: this.selectedPiece.get(),
      layout: this.layout.get(),
      boardStateTracker: JSON.stringify(Array.from(this.boardStateTracker.get().entries())),
    });
  }

  loadState(state: string) {
    const {
      currentTurn,
      numWhiteLeft,
      numBlackLeft,
      whiteKingAlive,
      blackKingAlive,
      winner,
      selectedPiece,
      layout,
      boardStateTracker,
    } = JSON.parse(state);

    this.currentTurn.set(currentTurn);
    this.numWhiteLeft.set(numWhiteLeft);
    this.numBlackLeft.set(numBlackLeft);
    this.whiteKingAlive.set(whiteKingAlive);
    this.blackKingAlive.set(blackKingAlive);
    this.winner.set(winner);
    this.selectedPiece.set(selectedPiece);
    this.layout.set(layout);
    this.boardStateTracker.set(new Map(JSON.parse(boardStateTracker)));
  }

  setSelectedPiece([row, column]: number[]) {
    this.selectedPiece.set([row, column]);
  }

  toggleTurn() {
    this.currentTurn.set((prev) => (prev === 1 ? 2 : 1));
  }

  getBoardValue(row: number, column: number): [number, boolean] {
    if (
      row < 0 ||
      row > this.layout.get().length - 1 ||
      column < 0 ||
      column > this.layout.get()[0].length - 1
    ) {
      return [-1, false];
    }

    const isKing = this.layout.get()[row][column] > 2;

    return [isKing ? this.layout.get()[row][column] - 2 : this.layout.get()[row][column], isKing];
  }

  makeMove({ start, end }: Move) {
    const [y1, x1] = start;
    const [y2, x2] = end;

    const newBoard = this.layout.get();
    const val = newBoard[y1][x1];

    newBoard[y2][x2] = val;
    newBoard[y1][x1] = 0;

    this.layout.set(newBoard);

    this.boardStateTracker.set((prev) => {
      const boardState = newBoard.flat().join("");

      prev.set(boardState, (prev.get(boardState) ?? 0) + 1);

      return prev;
    });

    this.resetValidMoves();
    this.processCaptures(y2, x2);

    if (this.getAllValidMoves(this.currentTurn.get() === 1 ? 2 : 1).length === 0) {
      return this.winner.set(this.currentTurn.get());
    }

    this.toggleTurn();
  }

  simulateMove({ start, end }: Move) {
    const [y1, x1] = start;
    const [y2, x2] = end;

    const board = rfdc()(this.layout.get());
    const val = board[y1][x1];

    board[y2][x2] = val;
    board[y1][x1] = 0;

    return board;
  }

  doCapture(row: number, column: number, isKing = false) {
    const [capturedPiece] = this.getBoardValue(row, column);

    this.layout.set((prev) => {
      prev[row][column] = 0;
      return prev;
    });

    if (isKing) {
      switch (capturedPiece) {
        case 1: {
          this.winner.set(2);
          return;
          // return toast("Oh no, your king was captured!", { icon: "😭" });
        }
        case 2: {
          this.winner.set(1);
          return;
          // return toast("Congratulations, you captured their king!", { icon: "⚔" });
        }
      }
    }

    if (capturedPiece === 1) {
      this.numWhiteLeft.set((prev) => prev - 1);
      // console.log("Black captures white!");

      // toast("Your opponent captured one of your pawns!", { icon: "💀" });
    } else {
      this.numBlackLeft.set((prev) => prev - 1);
      // console.log("White captures black!");

      // toast("You captured one of your opponent's pawns!", { icon: "🔥" });
    }

    if (this.numBlackLeft.get() === 0) {
      // console.log("White wins!");
      this.winner.set(1);
    } else if (this.numWhiteLeft.get() === 0) {
      // console.log("Black wins!");
      this.winner.set(2);
    }
  }

  addValidMove(row: number, column: number) {
    const move = [row, column].join("|");

    this.validMoves.set((prev) => [...prev, move]);
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

  getAllValidMoves(forPlayer = 0) {
    const moves: Move[] = [];

    for (let row = 0; row < this.layout.get().length; row++) {
      for (let col = 0; col < this.layout.get()[row].length; col++) {
        // Prevent searching moves for unwanted players.
        if (forPlayer !== 0 && this.getBoardValue(row, col)[0] !== forPlayer) {
          continue;
        }

        const [vertical, horizontal] = this.getValidMoves(row, col);

        moves.push(...vertical.map((val) => ({ start: [row, col], end: [val, col] })));
        moves.push(...horizontal.map((val) => ({ start: [row, col], end: [row, val] })));
      }
    }

    return moves;
  }

  getValidMoves(row: number, column: number) {
    const val = this.layout.get()[row][column];

    if (val === 0) return [[], []];

    const isKing = val > 2;

    const vertical = this.layout.get().map((row) => row[column]);
    const horizontal = this.layout.get()[row];

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
      .filter((i) => i > vertBefore && i < vertAfter && i !== row)
      .filter((i) => {
        const simulatedState = this.simulateMove({ start: [row, column], end: [i, column] })
          .flat()
          .join("");

        return (this.boardStateTracker.get().get(simulatedState) ?? 0) < 3;
      });

    const horizontalMoves = horizontal
      .map((_, i) => i)
      .filter((i) => {
        if (isKing) {
          return i >= column - 1 && i <= column + 1;
        }
        return true;
      })
      .filter((i) => i > horizBefore && i < horizAfter && i !== column)
      .filter((i) => {
        const simulatedState = this.simulateMove({ start: [row, column], end: [row, i] })
          .flat()
          .join("");

        return (this.boardStateTracker.get().get(simulatedState) ?? 0) < 3;
      });

    return [verticalMoves, horizontalMoves];
  }

  resetValidMoves() {
    this.validMoves.set([""]);
  }

  isValidMove(row: number, column: number) {
    return this.validMoves.get().includes([row, column].join("|"));
  }

  processCaptures(row: number, column: number) {
    const adjacentSquares = [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ];

    const opponentVal = this.currentTurn.get() === 1 ? 2 : 1;

    for (const [y, x] of adjacentSquares) {
      const [val, isKing] = this.getBoardValue(y, x);

      if (val !== opponentVal) continue;

      if (isKing && (this.isSurroundedOnAllSides(y, x) || this.isCornered(y, x))) {
        this.doCapture(y, x, true);
      } else if (!isKing && (this.isSurroundedOnOppositeSides(y, x) || this.isCornered(y, x))) {
        this.doCapture(y, x);
      }
    }
  }

  isSurroundedOnOppositeSides(row: number, column: number) {
    const opponentVal = this.currentTurn.get();

    const [above, below, left, right] = this.getAdjacentSquares(row, column);

    return (
      [above, below].every((val) => val === opponentVal) ||
      [left, right].every((val) => val === opponentVal)
    );
  }

  isSurroundedOnAllSides(row: number, column: number) {
    const opponentVal = this.currentTurn.get();

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

    const opponentVal = this.currentTurn.get();

    switch (true) {
      case row === 0 && column === 0: {
        return below === opponentVal && right === opponentVal;
      }
      case row === 0 && column === this.boardWidth - 1: {
        return below === opponentVal && left === opponentVal;
      }
      case row === this.boardHeight - 1 && column === 0: {
        return above === opponentVal && right === opponentVal;
      }
      case row === this.boardHeight - 1 && column === this.boardWidth - 1: {
        return above === opponentVal && left === opponentVal;
      }
    }
  }
}
