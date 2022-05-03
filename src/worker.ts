import { Minimax } from "./utils/minimax";

self.onmessage = (event) => {
  const [state, depth] = event.data;

  const minimax = new Minimax();

  const { bestMove } = minimax.run(state, depth);

  self.postMessage(bestMove);
};
