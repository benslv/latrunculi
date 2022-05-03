import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  List,
  LoadingOverlay,
  Modal,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

import { GameBoard } from "./components/Board";

import { Board } from "./utils/board";

const startingDiffculty = 2;

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

function App() {
  const [board, setBoard] = useState(new Board());
  const [history, setHistory] = useState<string>(localStorage.getItem("gameHistory") ?? "");
  const [aiDepth, setAiDepth] = useState(startingDiffculty);
  const [modalOpened, setModalOpened] = useState(false);
  const [thinking, setThinking] = useState(false);

  const winner = board.winner.use();
  const winMessage = board.winMessage;
  const currentTurn = board.currentTurn.use();
  const numMoves = board.numMoves;
  const numMovesNoCapture = board.numMovesNoCapture;

  useEffect(() => {
    if (currentTurn === 2) {
      setThinking(true);
      worker.postMessage([board.copyState(), aiDepth]);

      worker.addEventListener("message", function handleMove(e) {
        const bestMove = e.data;
        board.makeMove(bestMove);

        setThinking(false);

        worker.removeEventListener("message", handleMove);
      });
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

    const calcDiffculty = Math.floor(startingDiffculty + wins - losses);

    const minDifficulty = 1;
    const maxDifficulty = 4;

    const newDifficulty = Math.max(Math.min(maxDifficulty, calcDiffculty), minDifficulty);

    console.log("Search depth:", newDifficulty);

    // Sets AI search depth to between 1 and 6 inclusive.
    setAiDepth(newDifficulty);
  }, [history]);

  const reset = () => {
    setBoard(new Board());
  };

  return (
    <Container fluid>
      <Grid>
        <Grid.Col sm={12} lg={5}>
          <Title order={1}>Latrunculi</Title>
          <Text>
            Latrunculi is an ancient Roman board game that has now been brought to the modern world
            with this online version! Play against the AI opponent to hone your skills and maybe
            you'll even get good enough to beat it!{" "}
          </Text>
          <Space h={"sm"} />
          <Text>
            <b>Note:</b> I'd recommend playing this game on a desktop device for the best
            experience. It'll work fine on touchscreen devices too, but anything smaller than an
            iPad will probably be a little difficult to navigate.
          </Text>
          <Space h={"sm"} />
          <Text>
            <b>Another note:</b> It's likely that this'll run a bit slowly on a lot of people's
            devices when the computer is figuring out its next move (especially if you start winning
            a lot!). Unfortunately, despite the optimisations I've put in place, the algorithm being
            used is still pretty slow simply due to the sheer number of possible moves that can be
            made each turn. Don't worry if the application seems to freeze after you've made your
            move. It'll eventually come back to life 😄
          </Text>
          <Space h={"sm"} />
          <Text>
            Have a read of the rules below to familiarise yourself with the game, then hop right in!
          </Text>
          <Title order={3}>Getting Started</Title>
          <List>
            <List.Item>You play as White, and get to move first.</List.Item>
            <List.Item>Click on a piece to see its available moves (the orange squares).</List.Item>
            <List.Item>Click on an orange square to move your piece there.</List.Item>
            <List.Item>
              The piece surrounded by a red circle is your king. Take care of it!
            </List.Item>
          </List>
          <Space h={"sm"} />
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
              Pawn captures are made by surrounding an opposing piece on two opposing sides (i.e. in
              a line) with two of your own pieces; the edge of the board does not count as one of
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
              <List>
                <List.Item>
                  Immobilizing the opponent's king, even if the opponent's own pieces are blocking
                  it on some or all sides. This can happen even if the king is not surrounded on all
                  sides if the open sides are illegal moves due to repetition.
                </List.Item>
                <List.Item>Capturing all of the opponent's pawns.</List.Item>
                <List.Item>
                  Having more pieces on the board after 50 moves are made with no capture.
                </List.Item>
              </List>
            </List.Item>
          </List>
          <Space h="md" />
          <Title order={3}>Known Issues</Title>
          <List>
            <List.Item>
              Sometimes the AI will decide to "skip" a turn and not make any move. No idea why it
              happens, and the solution has evaded me for far too long. Just take it as a free extra
              turn, I suppose!
            </List.Item>
          </List>
        </Grid.Col>
        <Grid.Col sm={12} lg={7}>
          <Center>
            <Stack>
              <Box sx={{ position: "relative" }}>
                <LoadingOverlay visible={thinking} />
                <GameBoard board={board} />
              </Box>
              <Text>Moves so far: {numMoves}</Text>
              <Text>Moves without capture: {numMovesNoCapture}</Text>
              <Text>Current turn: {currentTurn}</Text>
            </Stack>
          </Center>
        </Grid.Col>
      </Grid>

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
        <Title order={2}>{winner === 1 ? "You win!" : "You lose..."}</Title>
        <Space h="sm" />
        <Text>{winMessage}</Text>
        <Space h="xs" />
        <Text>Number of moves made: {numMoves}</Text>
        <Space h="sm" />
        <Button
          onClick={() => {
            reset();
            setModalOpened(false);
          }}>
          Play Again!
        </Button>
      </Modal>
    </Container>
  );
}

export default App;
