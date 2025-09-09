const boardContainer = document.getElementById("board");
const statusText = document.getElementById("status");
const playAgainDiv = document.getElementById("playAgain");
const modeDiv = document.getElementById("mode");

let board = Array(9).fill("");
let currentPlayer = "X";
let mode = "";
let gameOver = false;

function startGame(selectedMode) {
  mode = selectedMode;
  currentPlayer = "X";
  gameOver = false;
  statusText.textContent = "";

  // Hide mode selection after first choice
  modeDiv.style.display = "none";

  // Show board and bottom buttons
  boardContainer.style.display = "grid";
  playAgainDiv.style.display = "flex";

  restartBoard();
}

function restartBoard() {
  board = Array(9).fill("");
  createBoard();
}

function createBoard() {
  boardContainer.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    if (cell !== "") {
      div.textContent = cell;
      div.classList.add("taken");
    }
    div.addEventListener("click", () => handleMove(index));
    boardContainer.appendChild(div);
  });
}

function handleMove(index) {
  if (gameOver || board[index] !== "") return;

  board[index] = currentPlayer;
  createBoard();

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `${currentPlayer} Wins 🎉`;
    highlightWinner(currentPlayer);
    gameOver = true;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a Tie 🤝";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (mode === "ai" && currentPlayer === "O" && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

/* -------------------------
   AI WITH MINIMAX ALGORITHM
   ------------------------- */
function aiMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = "O";
  createBoard();

  if (checkWinner("O")) {
    statusText.textContent = "AI Wins 🤖";
    highlightWinner("O");
    gameOver = true;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a Tie 🤝";
    gameOver = true;
    return;
  }

  currentPlayer = "X";
}

function minimax(newBoard, depth, isMaximizing, alpha, beta) {
  if (checkWinner("O")) return 10 - depth;   // AI win
  if (checkWinner("X")) return depth - 10;   // Human win
  if (newBoard.every(cell => cell !== "")) return 0; // Tie

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false, alpha, beta);
        newBoard[i] = "";
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // pruning
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true, alpha, beta);
        newBoard[i] = "";
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // pruning
      }
    }
    return bestScore;
  }
}

/* -------------------------
   HELPER FUNCTIONS
   ------------------------- */
function checkWinner(player) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

function highlightWinner(player) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  combos.forEach(combo => {
    if (combo.every(index => board[index] === player)) {
      combo.forEach(index => {
        boardContainer.children[index].classList.add("winner");
      });
    }
  });
}

function restartGame() {
  gameOver = false;
  statusText.textContent = "";
  restartBoard();
}

function switchMode() {
  boardContainer.style.display = "none";
  playAgainDiv.style.display = "none";
  statusText.textContent = "";
  modeDiv.style.display = "block"; // show mode selection again
}
