let isSignup = false;

function toggleAuth() {
  isSignup = !isSignup;
  document.getElementById('auth-title').textContent = isSignup ? 'Create Account' : 'Log In';
  document.getElementById('auth-btn').textContent = isSignup ? 'Sign Up' : 'Log In';
  document.getElementById('switch-text').textContent = isSignup 
    ? 'Already have an account? Log In' 
    : "Don't have an account? Sign Up";
}

function handleAuth() {
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  if (!email.includes('@') || !email.includes('.')) {
    alert('Please enter a valid email');
    return;
  }
  if (password.length < 4) {
    alert('Password must be at least 4 characters');
    return;
  }

  let users = JSON.parse(localStorage.getItem('topzyUsers') || '{}');

  if (isSignup) {
    // Sign Up
    if (users[email]) {
      alert('This email is already registered. Please log in.');
      return;
    }
    users[email] = password;
    localStorage.setItem('topzyUsers', JSON.stringify(users));
    localStorage.setItem('topzyCurrent', email);
    alert('Account created successfully!');
    enterApp(email);
  } else {
    // Log In
    if (users[email] && users[email] === password) {
      localStorage.setItem('topzyCurrent', email);
      enterApp(email);
    } else {
      alert('Wrong email or password');
    }
  }
}

function enterApp(email) {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('welcome').textContent = email.split('@')[0];
  renderGames();
}

function logout() {
  localStorage.removeItem('topzyCurrent');
  location.reload();
}

// Auto login if already logged in
const currentUser = localStorage.getItem('topzyCurrent');
if (currentUser) enterApp(currentUser);

// ========== GAMES ==========
const games = [
  {id:'sliding',name:'Sliding Puzzle',icon:'🧩'},
  {id:'memory',name:'Memory Match',icon:'🧠'},
  {id:'sudoku',name:'Sudoku',icon:'🔢'},
  {id:'tictactoe',name:'Tic-Tac-Toe',icon:'❌'},
  {id:'guess',name:'Number Guess',icon:'🎯'},
  {id:'rps',name:'Rock Paper Scissors',icon:'✊'},
  {id:'dice',name:'Dice Roll',icon:'🎲'},
  {id:'coin',name:'Coin Flip',icon:'🪙'},
  {id:'reaction',name:'Reaction Time',icon:'⚡'},
  {id:'color',name:'Color Match',icon:'🎨'},
  {id:'blockblast',name:'Block Blast',icon:'💥'},
  {id:'carrace',name:'Car Race',icon:'🏎️'},
  {id:'shooting',name:'Shooting Game',icon:'🎯'},
  {id:'princess',name:'Princess Makeover',icon:'👸'},
];

function renderGames() {
  document.getElementById('game-select').innerHTML = games.map(g => `
    <div class="game-card" onclick="play('${g.id}')">
      <div class="icon">${g.icon}</div>
      <div class="name">${g.name}</div>
    </div>`).join('');
}

function back() {
  document.getElementById('game-select').style.display = 'grid';
  document.getElementById('game-area').classList.remove('active');
}

function play(id) {
  document.getElementById('game-select').style.display = 'none';
  document.getElementById('game-area').classList.add('active');
  const box = document.getElementById('game-content');
  const loaders = {
    sliding: loadSliding, memory: loadMemory, sudoku: loadSudoku,
    tictactoe: loadTTT, guess: loadGuess, rps: loadRPS,
    dice: loadDice, coin: loadCoin, reaction: loadReaction,
    color: loadColor, blockblast: loadBlockBlast,
    carrace: loadCarRace, shooting: loadShooting, princess: loadPrincess
  };
  if (loaders[id]) loaders[id](box);
}

// Keep all your previous game functions below this line
// (copy them from the last version I gave you)
function loadSliding(c){ /* ... paste previous loadSliding ... */ }
function loadMemory(c){ /* ... paste previous loadMemory ... */ }
// ... continue with all other game functions