A React implement of the archaeological Roman game, Latrunculi.

Rules based on the interpretation at http://www.latrunculi.com/


- [x] The board is oriented with 8 rows of ~~12~~ 8 columns, with the player's pawns on the back row and the king on the second row just to the right of the center.
- [x] White moves first, similar to chess and checkers.
- [x] Pawns move like rooks in chess. Kings move similarly, but only 1 square at a time.
    - [x] Pawn captures are made by surrounding an opposing piece on two opposing sides (i.e., in a line) with two of your own pieces; the edge of the board does not count as one of your pieces. The main exception is that captures of a pawn on a corner are made by surrounding the opposing piece on the two exposed sides.
    - [x] Kings cannot be captured, but they can participate in capturing opposing pawns as above.
    - [x] You can move a pawn between two opposing pieces without it being captured.
    - [ ] Repeating sequences of moves are not allowed. The same position with the same player to move cannot occur more than three times in the game; after the third occurrence, that position is illegal.
    - [ ] A player wins by:
        - [x] Immobilizing the opponent's king, even if the opponent's own pieces are blocking it on some or all sides. This can happen even if the king is not surrounded on all sides if the open sides are illegal moves due to repetition.
        - [x] Capturing all of the opponent's pawns.
        - [ ] Having more pieces on the board after 50 moves are made with no capture.
