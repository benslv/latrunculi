import { Button, Center, Container, Grid, List, Modal, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { GameBoard } from "./components/Board";

import { Board } from "./utils/board";
import { Minimax } from "./utils/minimax";

function App() {
  const [board, setBoard] = useState(new Board());
  const [minimax, setMinimax] = useState(new Minimax());
  const [history, setHistory] = useState<string>(localStorage.getItem("gameHistory") ?? "");
  const [aiDepth, setAiDepth] = useState(2);
  const [modalOpened, setModalOpened] = useState(false);

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
      setModalOpened(true);
    } else if (winner === 2) {
      setHistory((prev) => prev + "L");
      setModalOpened(true);
    }
  }, [winner]);

  useEffect(() => {
    localStorage.setItem("gameHistory", history);

    const wins = history.match(/W/g)?.length ?? 0;
    const losses = history.match(/L/g)?.length ?? 0;

    const difficulty = 3 + 2 * wins - losses;

    // Sets AI search depth to between 1 and 6 inclusive.
    setAiDepth(Math.max(Math.min(4, difficulty), 1));
  }, [history]);

  const reset = () => {
    setBoard(new Board());
    setMinimax(new Minimax());
  };

  return (
    <Container fluid>
      <Toaster position="bottom-left" />
      <Grid>
        <Grid.Col sm={12} lg={5}>
          <Button onClick={() => setModalOpened(true)}>Open Modal</Button>
          <Title order={1}>Latrunculi</Title>
          <Text>
            Latrunculi is an ancient Roman board game that has now been brought to the modern world
            with this online version! Play against the AI opponent to hone your skills and maybe
            you'll even get good enough to beat it!{" "}
          </Text>

          <Text># white left: {numWhiteLeft}</Text>
          <Text># black left: {numBlackLeft}</Text>
          <Text>History: {history}</Text>
          <Title order={2}>Rules</Title>
          <List>
            <List.Item>
              The board is oriented with 8 rows of 8 columns, with the player's pawns on the back
              row and the king on the second row just to the right of the center.
            </List.Item>
            <List.Item>White moves first, similar to chess and checkers.</List.Item>
            <List.Item>
              Pawns move like rooks in chess. Kings move similarly, but only 1 square at a time.
            </List.Item>
            <List.Item>
              Pawn captures are made by surrounding an opposing piece on two opposing sides (i.e.,
              in a line) with two of your own pieces; the edge of the board does not count as one of
              your pieces. The main exception is that captures of a pawn on a corner are made by
              surrounding the opposing piece on the two exposed sides.
            </List.Item>
            <List.Item>
              Kings cannot be captured, but they can participate in capturing opposing pawns as
              above.
            </List.Item>
            <List.Item>
              You can move a pawn between two opposing pieces without it being captured.
            </List.Item>
            <List.Item>
              Repeating sequences of moves are not allowed. The same position with the same player
              to move cannot occur more than three times in the game; after the third occurrence,
              that position is illegal.
            </List.Item>
            <List.Item>
              A player wins by:
              <ul>
                <List.Item>
                  Immobilizing the opponent's king, even if the opponent's own pieces are blocking
                  it on some or all sides. This can happen even if the king is not surrounded on all
                  sides if the open sides are illegal moves due to repetition.
                </List.Item>
                <List.Item>Capturing all of the opponent's pawns.</List.Item>
                <List.Item>
                  Having more pieces on the board after 50 moves are made with no capture.
                </List.Item>
              </ul>
            </List.Item>
          </List>
        </Grid.Col>
        <Grid.Col sm={12} lg={7}>
          <Center>
            <GameBoard board={board} />
          </Center>
        </Grid.Col>
        {winner === 0 ? null : <></>}
      </Grid>

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
        <Title order={2}>Player {winner} wins!</Title>
        <Button
          onClick={() => {
            reset();
            setModalOpened(false);
          }}>
          Reset
        </Button>
      </Modal>

      {/* <Rules>
        <Text>
          Based on the rules at{" "}
          <a href="http://www.latrunculi.com" target="_blank" rel="noreferrer">
            http://www.latrunculi.com/
          </a>
        </Text>
        <details>
          <summary>Read the Rules:</summary>
          <ul>
            <List.Item>
              The board is oriented with 8 rows of 8 columns, with the player's pawns on the back
              row and the king on the second row just to the right of the center.
            </List.Item>
            <List.Item>White moves first, similar to chess and checkers.</List.Item>
            <List.Item>
              Pawns move like rooks in chess. Kings move similarly, but only 1 square at a time.
            </List.Item>
            <List.Item>
              Pawn captures are made by surrounding an opposing piece on two opposing sides (i.e.,
              in a line) with two of your own pieces; the edge of the board does not count as one of
              your pieces. The main exception is that captures of a pawn on a corner are made by
              surrounding the opposing piece on the two exposed sides.
            </List.Item>
            <List.Item>
              Kings cannot be captured, but they can participate in capturing opposing pawns as
              above.
            </List.Item>
            <List.Item>You can move a pawn between two opposing pieces without it being captured.</List.Item>
            <List.Item>
              Repeating sequences of moves are not allowed. The same position with the same player
              to move cannot occur more than three times in the game; after the third occurrence,
              that position is illegal.
            </List.Item>
            <List.Item>
              A player wins by:
              <ul>
                <List.Item>
                  Immobilizing the opponent's king, even if the opponent's own pieces are blocking
                  it on some or all sides. This can happen even if the king is not surrounded on all
                  sides if the open sides are illegal moves due to repetition.
                </List.Item>
                <List.Item>Capturing all of the opponent's pawns.</List.Item>
                <List.Item>Having more pieces on the board after 50 moves are made with no capture.</List.Item>
              </ul>
            </List.Item>
          </ul>
        </details>
      </Rules> */}
      {/* <p>Debug Board</p>
      <GameBoard board={minimax.board} /> */}
    </Container>
  );
}

export default App;
