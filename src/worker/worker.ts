import { Minimax } from "../utils/minimax";

const minimax = new Minimax();

export function run(state: string, depth: number) {
  return minimax.run(state, depth);
}