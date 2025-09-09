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

  // Reset view
  playAgainDiv.style.display = "none";
  boardContainer.style.display = "grid";
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
    endGame();
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a Tie 🤝";
    endGame();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (mode === "ai" && currentPlayer === "O" && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  const available = board
    .map((val, i) => (val === "" ? i : null))
    .filter(val => val !== null);

  const randomIndex = available[Math.floor(Math.random() * available.length)];
  board[randomIndex] = "O";
  createBoard();

  if (checkWinner("O")) {
    statusText.textContent = "AI Wins 🤖";
    highlightWinner("O");
    endGame();
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a Tie 🤝";
    endGame();
    return;
  }

  currentPlayer = "X";
}

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

function endGame() {
  gameOver = true;
  playAgainDiv.style.display = "flex";
}

function restartGame() {
  gameOver = false;
  statusText.textContent = "";
  restartBoard();
  playAgainDiv.style.display = "none";
}

function switchMode() {
  boardContainer.style.display = "none";
  playAgainDiv.style.display = "none";
  statusText.textContent = "";
}
