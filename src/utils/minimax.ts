import rfdc from "rfdc";

import { Board } from "./board";
import type { Move } from "./board";

export class Minimax {
  board: Board;

  constructor() {
    this.board = new Board();
  }

  run(state: string) {
    this.board.loadState(state);

    return this.getMove([], 1, state);
  }

  getMove(path: Move[], depth: number, state: string): { score: number; bestMove: Move } {
    this.board.loadState(state);

    for (const move of path) {
      this.board.makeMove(move);
    }

    if (depth === 0) {
      return { score: this.heuristic(), bestMove: path[0] };
    }

    const value: { score: number; bestMove: Move } = {
      score: 0,
      bestMove: { start: [0, 0], end: [0, 0] },
    };

    if (this.board.currentTurn.get() === 1) {
      value.score = Infinity;

      const allValidMoves = this.board.getAllValidMoves(1);

      // console.log(allValidMoves.length);

      for (const move of allValidMoves) {
        const child = rfdc()(path);

        child.push(move);

        const childValue = this.getMove(child, depth - 1, state);

        if (value.bestMove == { start: [0, 0], end: [0, 0] }) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }

        // Randomly decide to switch current move if new one is the same value.
        if (childValue.score < value.score) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }
      }
    } else {
      value.score = -Infinity;

      const allValidMoves = this.board.getAllValidMoves(2);

      console.log("# valid moves for black:", allValidMoves.length);

      for (const move of allValidMoves) {
        const child = rfdc()(path);

        child.push(move);

        const childValue = this.getMove(child, depth - 1, state);

        if (value.bestMove == { start: [0, 0], end: [0, 0] }) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }

        // Randomly decide to switch current move if new one is the same value.
        if (childValue.score > value.score) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }
      }
    }

    this.board.loadState(state);
    return value;
  }

  heuristic() {
    // return Math.PI * Math.atan(this.board.numWhiteLeft.get() - this.board.numBlackLeft.get());
    return this.board.numBlackLeft.get() - this.board.numWhiteLeft.get();
  }
}
