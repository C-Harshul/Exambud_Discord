const bestMove = (board) => {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < 9; ++i) {
    if (board[i] == " ") {
      board[i] = "o";
      let score = minimax(board, 0, false);
      board[i] = " ";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
        console.log(bestMove);
      }
    }
  }
  board[bestMove] = "o";
};

const minimax = (board, depth, isMax) => {
  let result = checkWin(board);
  if (result !== 2) {
    return result;
  }

  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; ++i) {
      if (board[i] == " ") {
        board[i] = "o";
        let score = minimax(board, depth + 1, false);
        board[i] = " ";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; ++i) {
      if (board[i] == " ") {
        board[i] = "x";
        let score = minimax(board, depth + 1, true);
        board[i] = " ";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const checkWin = (square) => {
  let val = 2;

  if (square[0] == square[1] && square[1] == square[2] && square[0] == "o")
    val = 1;
  else if (square[3] == square[4] && square[4] == square[5] && square[3] == "o")
    val = 1;
  else if (square[6] == square[7] && square[7] == square[8] && square[6] == "o")
    val = 1;
  else if (square[0] == square[3] && square[3] == square[6] && square[0] == "o")
    val = 1;
  else if (square[1] == square[4] && square[4] == square[7] && square[1] == "o")
    val = 1;
  else if (square[2] == square[5] && square[5] == square[8] && square[2] == "o")
    val = 1;
  else if (square[0] == square[4] && square[4] == square[8] && square[0] == "o")
    val = 1;
  else if (square[2] == square[4] && square[4] == square[6] && square[2] == "o")
    val = 1;
  else if (square[0] == square[1] && square[1] == square[2] && square[0] == "x")
    val = -1;
  else if (square[3] == square[4] && square[4] == square[5] && square[3] == "x")
    val = -1;
  else if (square[6] == square[7] && square[7] == square[8] && square[6] == "x")
    val = -1;
  else if (square[0] == square[3] && square[3] == square[6] && square[0] == "x")
    val = -1;
  else if (square[1] == square[4] && square[4] == square[7] && square[1] == "x")
    val = -1;
  else if (square[2] == square[5] && square[5] == square[8] && square[2] == "x")
    val = -1;
  else if (square[0] == square[4] && square[4] == square[8] && square[0] == "x")
    val = -1;
  else if (square[2] == square[4] && square[4] == square[6] && square[2] == "x")
    val = -1;
  else if (!square.includes(" ")) val = 0;

  return val;
};

module.exports = {
  checkWin: checkWin,
  bestMove: bestMove,
};
