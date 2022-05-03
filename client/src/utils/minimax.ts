import isEqual from "lodash.isequal";

import { Board } from "./board";
import type { Move } from "./board";

export class Minimax {
  board: Board;

  constructor() {
    this.board = new Board();
  }

  run(state: string, depth = 3) {
    this.board.loadState(state);

    return this.getMove([], depth, state, -Infinity, Infinity);
  }

  getMove(
    path: Move[],
    depth: number,
    state: string,
    alpha: number,
    beta: number,
  ): { score: number; bestMove: Move } {
    this.board.loadState(state);

    for (const move of path) {
      this.board.makeMove(move);
    }

    if (depth === 0 || this.isEndState()) {
      return { score: this.heuristic(), bestMove: path[0] };
    }

    const value: { score: number; bestMove: Move } = {
      score: 0,
      bestMove: { start: [0, 0], end: [0, 0] },
    };

    if (this.board.currentTurn.get() === 1) {
      value.score = Infinity;

      const allValidMoves = this.board.getAllValidMoves(1);

      for (const move of allValidMoves) {
        const child = [...path, move];

        const childValue = this.getMove(child, depth - 1, state, alpha, beta);

        if (isEqual(value.bestMove, { start: [0, 0], end: [0, 0] })) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }

        if (childValue.score < value.score) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }

        // Randomly select between different moves of the same value.
        if (childValue.score === value.score && Math.random() < 0.1) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }

        if (value.score >= beta) {
          break;
        }

        alpha = Math.max(alpha, value.score);
      }
    } else {
      value.score = -Infinity;

      const allValidMoves = this.board.getAllValidMoves(2);

      for (const move of allValidMoves) {
        const child = [...path, move];

        const childValue = this.getMove(child, depth - 1, state, alpha, beta);

        if (isEqual(value.bestMove, { start: [0, 0], end: [0, 0] })) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }

        if (childValue.score > value.score) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }

        // Randomly select between different moves of the same value.
        if (childValue.score === value.score && Math.random() < 0.1) {
          value.score = childValue.score;
          value.bestMove = childValue.bestMove;
        }

        if (value.score <= alpha) {
          break;
        }

        beta = Math.min(beta, value.score);
      }
    }

    this.board.loadState(state);
    return value;
  }

  heuristic() {
    if (this.board.numWhiteLeft === 0) return Infinity;
    if (this.board.numBlackLeft === 0) return -Infinity;

    if (this.board.whiteKingAlive === false) return Infinity;
    if (this.board.blackKingAlive === false) return -Infinity;

    // return Math.PI * Math.atan(this.board.numWhiteLeft.get() - this.board.numBlackLeft.get());
    return 10 * this.board.numBlackLeft - this.board.numWhiteLeft;
  }

  isEndState() {
    return (
      this.board.numWhiteLeft === 0 ||
      this.board.numBlackLeft === 0 ||
      this.board.whiteKingAlive === false ||
      this.board.blackKingAlive === false
    );
  }
}
