// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.game-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.game).classList.add('active');
  });
});

// ==================== SLIDING PUZZLE ====================
const slidingBoard = document.getElementById('puzzle-board');
const movesEl = document.getElementById('moves');
let tiles = [];
let emptyIndex = 15;
let moves = 0;

function createSlidingPuzzle() {
  tiles = Array.from({ length: 15 }, (_, i) => i + 1);
  tiles.push(null);
  emptyIndex = 15;
  moves = 0;
  movesEl.textContent = 'Moves: 0';
  renderSliding();
}

function renderSliding() {
  slidingBoard.innerHTML = '';
  tiles.forEach((num, i) => {
    const tile = document.createElement('div');
    tile.className = 'tile' + (num === null ? ' empty' : '');
    tile.textContent = num || '';
    if (num !== null) tile.addEventListener('click', () => moveTile(i));
    slidingBoard.appendChild(tile);
  });
}

function moveTile(index) {
  const row = Math.floor(index / 4), col = index % 4;
  const emptyRow = Math.floor(emptyIndex / 4), emptyCol = emptyIndex % 4;
  if ((Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) !== 1) return;
  [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
  emptyIndex = index;
  moves++;
  movesEl.textContent = `Moves: ${moves}`;
  renderSliding();
  if (tiles.slice(0, 15).every((v, i) => v === i + 1) && tiles[15] === null) {
    setTimeout(() => alert(`🎉 Solved in ${moves} moves!`), 100);
  }
}

function shuffleSliding() {
  for (let i = 0; i < 200; i++) {
    const neighbors = [];
    const r = Math.floor(emptyIndex / 4), c = emptyIndex % 4;
    if (r > 0) neighbors.push(emptyIndex - 4);
    if (r < 3) neighbors.push(emptyIndex + 4);
    if (c > 0) neighbors.push(emptyIndex - 1);
    if (c < 3) neighbors.push(emptyIndex + 1);
    const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[rand], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[rand]];
    emptyIndex = rand;
  }
  moves = 0;
  movesEl.textContent = 'Moves: 0';
  renderSliding();
}

document.getElementById('shuffle-sliding').onclick = shuffleSliding;
createSlidingPuzzle();
shuffleSliding();

// ==================== MEMORY ====================
const memoryBoard = document.getElementById('memory-board');
const matchesEl = document.getElementById('matches');
const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
let cards = [], flipped = [], matched = 0, lock = false;

function createMemory() {
  cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  flipped = []; matched = 0; lock = false;
  matchesEl.textContent = 'Matches: 0/8';
  memoryBoard.innerHTML = '';
  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<span style="display:none">${emoji}</span>`;
    card.onclick = () => flipCard(i);
    memoryBoard.appendChild(card);
  });
}

function flipCard(i) {
  if (lock || flipped.includes(i) || memoryBoard.children[i].classList.contains('matched')) return;
  const card = memoryBoard.children[i];
  card.classList.add('flipped');
  card.querySelector('span').style.display = 'block';
  flipped.push(i);
  if (flipped.length === 2) {
    lock = true;
    const [a, b] = flipped;
    if (cards[a] === cards[b]) {
      setTimeout(() => {
        memoryBoard.children[a].classList.add('matched');
        memoryBoard.children[b].classList.add('matched');
        matched++;
        matchesEl.textContent = `Matches: ${matched}/8`;
        flipped = []; lock = false;
        if (matched === 8) setTimeout(() => alert('🎉 All pairs found!'), 300);
      }, 400);
    } else {
      setTimeout(() => {
        [a, b].forEach(idx => {
          memoryBoard.children[idx].classList.remove('flipped');
          memoryBoard.children[idx].querySelector('span').style.display = 'none';
        });
        flipped = []; lock = false;
      }, 800);
    }
  }
}
document.getElementById('reset-memory').onclick = createMemory;
createMemory();

// ==================== SUDOKU ====================
const sudokuBoard = document.getElementById('sudoku-board');
const statusEl = document.getElementById('sudoku-status');
const puzzles = [
  { solution: [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]], given: [[1,0,0,4],[0,4,1,0],[0,1,0,3],[4,0,2,0]] },
  { solution: [[2,1,4,3],[4,3,2,1],[1,2,3,4],[3,4,1,2]], given: [[2,0,0,3],[0,3,0,1],[1,0,3,0],[0,4,0,2]] }
];
let currentPuzzle = null;

function createSudoku() {
  currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  statusEl.textContent = ''; statusEl.className = '';
  sudokuBoard.innerHTML = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.createElement('div');
      cell.className = 'sudoku-cell';
      const val = currentPuzzle.given[r][c];
      if (val) {
        cell.classList.add('fixed');
        cell.textContent = val;
      } else {
        const input = document.createElement('input');
        input.maxLength = 1;
        input.oninput = e => e.target.value = e.target.value.replace(/[^1-4]/g, '');
        cell.appendChild(input);
      }
      sudokuBoard.appendChild(cell);
    }
  }
}

function checkSudoku() {
  const board = Array(4).fill().map(() => Array(4).fill(0));
  let filled = true;
  document.querySelectorAll('.sudoku-cell').forEach((cell, i) => {
    const r = Math.floor(i / 4), c = i % 4;
    if (cell.classList.contains('fixed')) board[r][c] = +cell.textContent;
    else {
      const v = +cell.querySelector('input').value;
      if (!v) filled = false;
      board[r][c] = v;
    }
  });
  if (!filled) { statusEl.textContent = 'Fill all cells'; statusEl.className = 'error'; return; }
  const correct = board.every((row, r) => row.every((v, c) => v === currentPuzzle.solution[r][c]));
  statusEl.textContent = correct ? '🎉 Correct!' : '❌ Try again';
  statusEl.className = correct ? 'success' : 'error';
}
document.getElementById('new-sudoku').onclick = createSudoku;
document.getElementById('check-sudoku').onclick = checkSudoku;
createSudoku();

// ==================== TIC TAC TOE ====================
const tttBoard = document.getElementById('ttt-board');
const tttStatus = document.getElementById('ttt-status');
let tttCells = Array(9).fill('');
let tttCurrent = 'X';
let tttGameOver = false;

function renderTTT() {
  tttBoard.innerHTML = '';
  tttCells.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'ttt-cell';
    cell.textContent = val;
    cell.onclick = () => makeTTTMove(i);
    tttBoard.appendChild(cell);
  });
}

function makeTTTMove(i) {
  if (tttCells[i] || tttGameOver) return;
  tttCells[i] = tttCurrent;
  renderTTT();
  if (checkTTTWin()) {
    tttStatus.textContent = `${tttCurrent} wins!`;
    tttGameOver = true;
  } else if (tttCells.every(c => c)) {
    tttStatus.textContent = "It's a draw!";
    tttGameOver = true;
  } else {
    tttCurrent = tttCurrent === 'X' ? 'O' : 'X';
    tttStatus.textContent = `Your turn (${tttCurrent})`;
  }
}

function checkTTTWin() {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(w => w.every(i => tttCells[i] === tttCurrent));
}

function resetTTT() {
  tttCells = Array(9).fill('');
  tttCurrent = 'X';
  tttGameOver = false;
  tttStatus.textContent = 'Your turn (X)';
  renderTTT();
}
document.getElementById('reset-ttt').onclick = resetTTT;
resetTTT();

// ==================== NUMBER GUESS ====================
let secretNumber = Math.floor(Math.random() * 100) + 1;
const guessInput = document.getElementById('guess-input');
const guessMessage = document.getElementById('guess-message');

document.getElementById('guess-btn').onclick = () => {
  const guess = +guessInput.value;
  if (!guess || guess < 1 || guess > 100) {
    guessMessage.textContent = 'Enter a number between 1 and 100';
    return;
  }
  if (guess === secretNumber) {
    guessMessage.textContent = '🎉 Correct! You got it!';
    guessMessage.style.color = '#22c55e';
  } else if (guess < secretNumber) {
    guessMessage.textContent = 'Too low! Try higher.';
    guessMessage.style.color = '#a0a0b0';
  } else {
    guessMessage.textContent = 'Too high! Try lower.';
    guessMessage.style.color = '#a0a0b0';
  }
  guessInput.value = '';
};

document.getElementById('reset-guess').onclick = () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  guessMessage.textContent = 'New number generated!';
  guessMessage.style.color = '';
  guessInput.value = '';
};