import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import styled, { createGlobalStyle } from "styled-components";

import { GameBoard } from "./components/Board";
import { H1 } from "./components/Heading";
import { Text } from "./components/Text";

import { Board } from "./utils/board";
import { Minimax } from "./utils/minimax";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;  
    padding: 0;
  }  
  
  html {
    font-size: 18px;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
               Roboto, Oxygen-Sans, Ubuntu, Cantarell,
               "Helvetica Neue", sans-serif;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 960px;
  margin: 0 auto;
`;

const Rules = styled.div`
  width: 100%;
`;

function App() {
  const [board, setBoard] = useState(new Board());
  const [minimax, setMinimax] = useState(new Minimax());
  const [history, setHistory] = useState<string>(localStorage.getItem("gameHistory") ?? "");
  const [aiDepth, setAiDepth] = useState(3);

  const winner = board.winner.use();
  const numBlackLeft = board.numBlackLeft.use();
  const numWhiteLeft = board.numWhiteLeft.use();
  const currentTurn = board.currentTurn.use();

  useEffect(() => {
    if (currentTurn === 2) {
      const { bestMove } = minimax.run(board.copyState(), aiDepth);

      console.log("Best Move:", bestMove);

      board.makeMove(bestMove);
    }
  }, [currentTurn]);

  useEffect(() => {
    if (winner === 1) {
      setHistory((prev) => prev + "W");
    } else if (winner === 2) {
      setHistory((prev) => prev + "L");
    }
  }, [winner]);

  useEffect(() => {
    localStorage.setItem("gameHistory", history);

    const wins = history.match(/W/g)?.length ?? 0;
    const losses = history.match(/L/g)?.length ?? 0;

    const difficulty = 3 + 2 * wins - losses;

    // Sets AI search depth to between 1 and 6 inclusive.
    setAiDepth(Math.max(Math.min(6, difficulty), 1));
  }, [history]);

  const reset = () => {
    setBoard(new Board());
    setMinimax(new Minimax());
  };

  return (
    <Container>
      <GlobalStyle />
      <Toaster position="bottom-left" />
      <H1>Latrunculi</H1>
      <GameBoard board={board} />
      {winner === 0 ? null : (
        <>
          <H1>We have a winner! Player {winner} wins!</H1>
          <button onClick={reset}>Reset</button>
        </>
      )}
      <Text># white left: {numWhiteLeft}</Text>
      <Text># black left: {numBlackLeft}</Text>
      <Text>History: {history}</Text>
      <Rules>
        <Text>
          Based on the rules at{" "}
          <a href="http://www.latrunculi.com" target="_blank" rel="noreferrer">
            http://www.latrunculi.com/
          </a>
        </Text>
        <details>
          <summary>Read the Rules:</summary>
          <ul>
            <li>
              The board is oriented with 8 rows of 8 columns, with the player's pawns on the back
              row and the king on the second row just to the right of the center.
            </li>
            <li>White moves first, similar to chess and checkers.</li>
            <li>
              Pawns move like rooks in chess. Kings move similarly, but only 1 square at a time.
            </li>
            <li>
              Pawn captures are made by surrounding an opposing piece on two opposing sides (i.e.,
              in a line) with two of your own pieces; the edge of the board does not count as one of
              your pieces. The main exception is that captures of a pawn on a corner are made by
              surrounding the opposing piece on the two exposed sides.
            </li>
            <li>
              Kings cannot be captured, but they can participate in capturing opposing pawns as
              above.
            </li>
            <li>You can move a pawn between two opposing pieces without it being captured.</li>
            <li>
              Repeating sequences of moves are not allowed. The same position with the same player
              to move cannot occur more than three times in the game; after the third occurrence,
              that position is illegal.
            </li>
            <li>
              A player wins by:
              <ul>
                <li>
                  Immobilizing the opponent's king, even if the opponent's own pieces are blocking
                  it on some or all sides. This can happen even if the king is not surrounded on all
                  sides if the open sides are illegal moves due to repetition.
                </li>
                <li>Capturing all of the opponent's pawns.</li>
                <li>Having more pieces on the board after 50 moves are made with no capture.</li>
              </ul>
            </li>
          </ul>
        </details>
      </Rules>
      <p>Debug Board</p>
      <GameBoard board={minimax.board} />
    </Container>
  );
}

export default App;
