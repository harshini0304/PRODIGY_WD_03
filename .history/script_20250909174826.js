const board = Array(9).fill('');
const human = 'X';
const ai = 'O';
let gameOver = false;

const boardContainer = document.getElementById('board');
const statusText = document.getElementById('status');

// Winning combinations
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Create board UI
function createBoard() {
  boardContainer.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (val) {
      cell.textContent = val;
      cell.classList.add('taken');
    }
    cell.addEventListener('click', () => playerMove(i));
    boardContainer.appendChild(cell);
  });
}

// Check winner
function checkWinner(b, player) {
  return winCombos.some(combo => combo.every(i => b[i] === player));
}

function emptyCells(b) {
  return b.map((v, i) => v === '' ? i : null).filter(v => v !== null);
}

// Minimax with Alpha-Beta
function minimax(b, depth, isMax, alpha, beta) {
  if (checkWinner(b, ai)) return 10 - depth;
  if (checkWinner(b, human)) return depth - 10;
  if (emptyCells(b).length === 0) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i of emptyCells(b)) {
      b[i] = ai;
      let val = minimax(b, depth + 1, false, alpha, beta);
      b[i] = '';
      best = Math.max(best, val);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i of emptyCells(b)) {
      b[i] = human;
      let val = minimax(b, depth + 1, true, alpha, beta);
      b[i] = '';
      best = Math.min(best, val);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function bestMove() {
  let bestVal = -Infinity;
  let move;
  for (let i of emptyCells(board)) {
    board[i] = ai;
    let val = minimax(board, 0, false, -Infinity, Infinity);
    board[i] = '';
    if (val > bestVal) {
      bestVal = val;
      move = i;
    }
  }
  return move;
}

function playerMove(index) {
  if (board[index] === '' && !gameOver) {
    board[index] = human;
    if (checkWinner(board, human)) {
      statusText.textContent = "You Win 🎉";
      gameOver = true;
    } else if (emptyCells(board).length === 0) {
      statusText.textContent = "It's a Tie 😐";
      gameOver = true;
    } else {
      let aiIndex = bestMove();
      board[aiIndex] = ai;
      if (checkWinner(board, ai)) {
        statusText.textContent = "AI Wins 🤖";
        gameOver = true;
      } else if (emptyCells(board).length === 0) {
        statusText.textContent = "It's a Tie 😐";
        gameOver = true;
      }
    }
    createBoard();
  }
}

function restartGame() {
  for (let i = 0; i < 9; i++) board[i] = '';
  gameOver = false;
  statusText.textContent = '';
  createBoard();
}

createBoard();
